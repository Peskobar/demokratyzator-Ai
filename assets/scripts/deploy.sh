#!/bin/bash

# TokenMaster AI Optimizer - Production Deployment Script
# Automatyczny deployment na serwer produkcyjny

set -euo pipefail

# Kolory dla output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Konfiguracja
APP_NAME="tokenmaster-ai-optimizer"
VERSION="2.1.0"
DOCKER_REGISTRY="registry.tokenmaster.ai"
BACKUP_DIR="/backup/tokenmaster"
LOG_FILE="/var/log/tokenmaster-deploy.log"

# Funkcje pomocnicze
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}" | tee -a "$LOG_FILE"
}

# Sprawdzenie uprawnień
check_permissions() {
    if [[ $EUID -eq 0 ]]; then
        error "Nie uruchamiaj tego skryptu jako root!"
    fi
    
    if ! groups | grep -q docker; then
        error "Użytkownik musi być w grupie docker"
    fi
}

# Sprawdzenie wymagań systemowych
check_requirements() {
    log "Sprawdzanie wymagań systemowych..."
    
    # Docker
    if ! command -v docker &> /dev/null; then
        error "Docker nie jest zainstalowany"
    fi
    
    # Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose nie jest zainstalowany"
    fi
    
    # Git
    if ! command -v git &> /dev/null; then
        error "Git nie jest zainstalowany"
    fi
    
    # Przestrzeń dyskowa (minimum 5GB)
    available_space=$(df /var/lib/docker --output=avail --block-size=1G | tail -n 1)
    if [[ $available_space -lt 5 ]]; then
        error "Za mało miejsca na dysku (wymagane minimum 5GB)"
    fi
    
    log "✅ Wszystkie wymagania spełnione"
}

# Backup przed deploymentem
create_backup() {
    log "Tworzenie backupu przed deploymentem..."
    
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_path="$BACKUP_DIR/pre-deploy_$timestamp"
    
    mkdir -p "$backup_path"
    
    # Backup konfiguracji
    if [[ -f ".env" ]]; then
        cp .env "$backup_path/"
    fi
    
    # Backup bazy danych
    if docker ps | grep -q "tokenmaster-postgres"; then
        docker exec tokenmaster-postgres pg_dump -U tokenmaster tokenmaster_db > "$backup_path/database.sql"
    fi
    
    # Backup volumes
    docker run --rm -v tokenmaster-ai-optimizer_postgres-data:/source -v "$backup_path":/backup alpine tar czf /backup/postgres-data.tar.gz -C /source .
    docker run --rm -v tokenmaster-ai-optimizer_redis-data:/source -v "$backup_path":/backup alpine tar czf /backup/redis-data.tar.gz -C /source .
    
    log "✅ Backup utworzony: $backup_path"
}

# Aktualizacja kodu źródłowego
update_source() {
    log "Aktualizacja kodu źródłowego..."
    
    # Sprawdź czy jesteśmy w repozytorium Git
    if [[ ! -d ".git" ]]; then
        error "Nie znajdujesz się w repozytorium Git"
    fi
    
    # Zapisz lokalne zmiany
    git stash push -m "Auto-stash przed deploymentem $(date)"
    
    # Pobierz najnowsze zmiany
    git fetch origin
    git checkout main
    git pull origin main
    
    log "✅ Kod źródłowy zaktualizowany"
}

# Walidacja konfiguracji
validate_config() {
    log "Walidacja konfiguracji..."
    
    if [[ ! -f ".env" ]]; then
        error "Brak pliku .env - skopiuj z env-example i skonfiguruj"
    fi
    
    # Sprawdź czy wszystkie wymagane zmienne są ustawione
    required_vars=(
        "DB_PASSWORD"
        "REDIS_PASSWORD"
        "GEMINI_API_KEY_1"
        "GEMINI_API_KEY_2"
        "GEMINI_API_KEY_3"
        "GEMINI_API_KEY_4"
        "PERPLEXITY_API_KEY"
    )
    
    source .env
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]] || [[ "${!var}" == *"TUTAJ_WKLEJ"* ]] || [[ "${!var}" == *"USTAW_SILNE_HASLO"* ]]; then
            error "Zmienna $var nie jest skonfigurowana w pliku .env"
        fi
    done
    
    log "✅ Konfiguracja jest poprawna"
}

# Build i push obrazów Docker
build_images() {
    log "Budowanie obrazów Docker..."
    
    # Build głównego obrazu
    docker build -t "$DOCKER_REGISTRY/$APP_NAME:$VERSION" .
    docker build -t "$DOCKER_REGISTRY/$APP_NAME:latest" .
    
    # Push do registry (jeśli skonfigurowany)
    if [[ -n "${DOCKER_REGISTRY:-}" ]]; then
        docker push "$DOCKER_REGISTRY/$APP_NAME:$VERSION"
        docker push "$DOCKER_REGISTRY/$APP_NAME:latest"
    fi
    
    log "✅ Obrazy Docker zbudowane"
}

# Deploy aplikacji
deploy_application() {
    log "Wdrażanie aplikacji..."
    
    # Zatrzymaj starą wersję (graceful shutdown)
    if docker-compose ps | grep -q "Up"; then
        info "Zatrzymywanie starej wersji..."
        docker-compose down --timeout 30
    fi
    
    # Usuń nieużywane obrazy
    docker image prune -f
    
    # Uruchom nową wersję
    docker-compose up -d --build
    
    log "✅ Aplikacja wdrożona"
}

# Health check po deploymencie
health_check() {
    log "Sprawdzanie stanu aplikacji..."
    
    max_attempts=30
    attempt=0
    
    while [[ $attempt -lt $max_attempts ]]; do
        if curl -f -s http://localhost:8080/health > /dev/null 2>&1; then
            log "✅ Aplikacja działa poprawnie"
            return 0
        fi
        
        ((attempt++))
        info "Próba $attempt/$max_attempts - oczekiwanie na uruchomienie aplikacji..."
        sleep 10
    done
    
    error "Aplikacja nie odpowiada po $max_attempts próbach"
}

# Sprawdzenie logów
check_logs() {
    log "Sprawdzanie logów aplikacji..."
    
    # Pokaż ostatnie logi
    docker-compose logs --tail=50 tokenmaster-app
    
    # Sprawdź czy są błędy krytyczne
    if docker-compose logs tokenmaster-app | grep -i "error\|fatal\|exception" | tail -10; then
        warning "Znaleziono błędy w logach - sprawdź szczegóły"
    fi
}

# Deployment metrics
deployment_metrics() {
    log "Zbieranie metryk deploymentu..."
    
    # Czas deploymentu
    deployment_time=$(($(date +%s) - start_time))
    
    # Status kontenerów
    running_containers=$(docker-compose ps --services --filter status=running | wc -l)
    total_containers=$(docker-compose ps --services | wc -l)
    
    # Wykorzystanie zasobów
    memory_usage=$(docker stats --no-stream --format "table {{.MemUsage}}" | tail -n +2 | head -1)
    cpu_usage=$(docker stats --no-stream --format "table {{.CPUPerc}}" | tail -n +2 | head -1)
    
    log "📊 Metryki deploymentu:"
    log "   Czas deploymentu: ${deployment_time}s"
    log "   Kontenery: $running_containers/$total_containers uruchomionych"
    log "   Pamięć: $memory_usage"
    log "   CPU: $cpu_usage"
}

# Rollback w przypadku błędu
rollback() {
    error "🔄 Initiating rollback due to deployment failure..."
    
    # Zatrzymaj bieżącą wersję
    docker-compose down --timeout 30
    
    # Przywróć backup
    latest_backup=$(ls -1t "$BACKUP_DIR"/pre-deploy_* | head -1)
    if [[ -n "$latest_backup" ]]; then
        log "Przywracanie backupu: $latest_backup"
        
        # Przywróć konfigurację
        if [[ -f "$latest_backup/.env" ]]; then
            cp "$latest_backup/.env" .
        fi
        
        # Przywróć dane
        if [[ -f "$latest_backup/postgres-data.tar.gz" ]]; then
            docker run --rm -v tokenmaster-ai-optimizer_postgres-data:/target -v "$latest_backup":/backup alpine tar xzf /backup/postgres-data.tar.gz -C /target
        fi
        
        if [[ -f "$latest_backup/redis-data.tar.gz" ]]; then
            docker run --rm -v tokenmaster-ai-optimizer_redis-data:/target -v "$latest_backup":/backup alpine tar xzf /backup/redis-data.tar.gz -C /target
        fi
        
        # Uruchom poprzednią wersję
        docker-compose up -d
        
        log "✅ Rollback completed"
    else
        error "Nie znaleziono backupu do przywrócenia"
    fi
}

# Notyfikacje
send_notification() {
    local status=$1
    local message=$2
    
    # Slack notification
    if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚀 TokenMaster Deployment $status: $message\"}" \
            "$SLACK_WEBHOOK_URL" > /dev/null 2>&1 || true
    fi
    
    # Email notification  
    if [[ -n "${SMTP_HOST:-}" ]]; then
        echo "$message" | mail -s "TokenMaster Deployment $status" "admin@tokenmaster.ai" || true
    fi
}

# Główna funkcja deploymentu
main() {
    start_time=$(date +%s)
    
    log "🚀 Rozpoczynanie deploymentu TokenMaster AI Optimizer v$VERSION"
    
    # Trap dla rollback w przypadku błędu
    trap rollback ERR
    
    check_permissions
    check_requirements
    create_backup
    update_source
    validate_config
    build_images
    deploy_application
    health_check
    check_logs
    deployment_metrics
    
    # Usuń trap po successful deployment
    trap - ERR
    
    log "🎉 Deployment zakończony pomyślnie!"
    send_notification "SUCCESS" "Deployment v$VERSION completed successfully in ${deployment_time}s"
}

# Parsowanie argumentów
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "rollback")
        rollback
        ;;
    "health")
        health_check
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "status")
        docker-compose ps
        docker-compose logs --tail=20
        ;;
    *)
        echo "Użycie: $0 {deploy|rollback|health|logs|status}"
        echo ""
        echo "Komendy:"
        echo "  deploy   - Pełny deployment aplikacji (domyślnie)"
        echo "  rollback - Przywrócenie poprzedniej wersji"
        echo "  health   - Sprawdzenie stanu aplikacji"
        echo "  logs     - Podgląd logów w czasie rzeczywistym"
        echo "  status   - Status kontenerów i ostatnie logi"
        exit 1
        ;;
esac
