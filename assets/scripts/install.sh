#!/bin/bash

# TokenMaster AI Optimizer - Skrypt Instalacji Produkcyjnej
# Automatyczna instalacja i konfiguracja systemu

set -e

# Kolory
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Wersja
VERSION="2.1.0"

# Funkcje pomocnicze
log() {
    echo -e "${GREEN}[INSTALL] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Banner
show_banner() {
    clear
    echo -e "${BLUE}"
    echo "████████╗ ██████╗ ██╗  ██╗███████╗███╗   ██╗"
    echo "╚══██╔══╝██╔═══██╗██║ ██╔╝██╔════╝████╗  ██║"
    echo "   ██║   ██║   ██║█████╔╝ █████╗  ██╔██╗ ██║"
    echo "   ██║   ██║   ██║██╔═██╗ ██╔══╝  ██║╚██╗██║"
    echo "   ██║   ╚██████╔╝██║  ██╗███████╗██║ ╚████║"
    echo "   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝"
    echo ""
    echo "███╗   ███╗ █████╗ ███████╗████████╗███████╗██████╗ "
    echo "████╗ ████║██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗"
    echo "██╔████╔██║███████║███████╗   ██║   █████╗  ██████╔╝"
    echo "██║╚██╔╝██║██╔══██║╚════██║   ██║   ██╔══╝  ██╔══██╗"
    echo "██║ ╚═╝ ██║██║  ██║███████║   ██║   ███████╗██║  ██║"
    echo "╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝"
    echo -e "${NC}"
    echo -e "${GREEN}Zaawansowany System Optymalizacji Zapytań AI${NC}"
    echo -e "${YELLOW}Wersja Produkcyjna $VERSION${NC}"
    echo ""
}

# Sprawdzenie systemu operacyjnego
check_os() {
    log "Sprawdzanie systemu operacyjnego..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get >/dev/null 2>&1; then
            OS="ubuntu"
            INSTALL_CMD="apt-get"
        elif command -v yum >/dev/null 2>&1; then
            OS="centos"
            INSTALL_CMD="yum"
        elif command -v dnf >/dev/null 2>&1; then
            OS="fedora"
            INSTALL_CMD="dnf"
        else
            error "Nieobsługiwany system Linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        OS="macos"
        if ! command -v brew >/dev/null 2>&1; then
            error "Homebrew jest wymagany na macOS. Zainstaluj: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        fi
        INSTALL_CMD="brew"
    else
        error "Nieobsługiwany system operacyjny: $OSTYPE"
    fi
    
    log "✅ System: $OS"
}

# Instalacja wymaganych pakietów
install_dependencies() {
    log "Instalacja zależności systemowych..."
    
    case $OS in
        "ubuntu")
            sudo apt-get update
            sudo apt-get install -y \
                curl \
                wget \
                git \
                docker.io \
                docker-compose \
                nodejs \
                npm \
                python3 \
                python3-pip \
                nginx \
                certbot \
                ufw
            ;;
        "centos"|"fedora")
            sudo $INSTALL_CMD update -y
            sudo $INSTALL_CMD install -y \
                curl \
                wget \
                git \
                docker \
                docker-compose \
                nodejs \
                npm \
                python3 \
                python3-pip \
                nginx \
                certbot \
                firewalld
            ;;
        "macos")
            brew install \
                docker \
                docker-compose \
                node \
                python@3.11 \
                nginx \
                git
            ;;
    esac
    
    log "✅ Zależności zainstalowane"
}

# Konfiguracja Docker
setup_docker() {
    log "Konfiguracja Docker..."
    
    if [[ "$OS" != "macos" ]]; then
        # Dodaj użytkownika do grupy docker
        sudo usermod -aG docker $USER
        
        # Uruchom Docker
        sudo systemctl enable docker
        sudo systemctl start docker
        
        # Sprawdź czy Docker działa
        if ! sudo docker run hello-world >/dev/null 2>&1; then
            error "Docker nie działa poprawnie"
        fi
    fi
    
    log "✅ Docker skonfigurowany"
}

# Tworzenie struktury katalogów
create_directories() {
    log "Tworzenie struktury katalogów..."
    
    # Główny katalog aplikacji
    APP_DIR="/opt/tokenmaster"
    sudo mkdir -p "$APP_DIR"
    sudo chown $USER:$USER "$APP_DIR"
    
    # Katalogi robocze
    mkdir -p "$APP_DIR"/{logs,cache,backup,config,ssl,monitoring}
    mkdir -p "$APP_DIR"/logs/{app,nginx,postgres,redis}
    mkdir -p "$APP_DIR"/config/{nginx,postgres,redis,prometheus,grafana}
    
    # Uprawnienia
    chmod 755 "$APP_DIR"
    chmod 750 "$APP_DIR"/{logs,cache,backup}
    chmod 700 "$APP_DIR"/{config,ssl}
    
    log "✅ Struktura katalogów utworzona: $APP_DIR"
}

# Pobieranie plików aplikacji
download_application() {
    log "Pobieranie plików aplikacji..."
    
    cd "$APP_DIR"
    
    # Pobierz z repozytorium (lub skopiuj z lokalnego źródła)
    if [[ -n "${GITHUB_REPO:-}" ]]; then
        git clone "$GITHUB_REPO" .
    else
        # Skopiuj pliki z bieżącego katalogu
        cp -r /path/to/tokenmaster/* .
    fi
    
    # Sprawdź czy wszystkie pliki są na miejscu
    required_files=(
        "package.json"
        "docker-compose.yml"
        "Dockerfile"
        "env-example"
        "deploy.sh"
        "README.md"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            error "Brak wymaganego pliku: $file"
        fi
    done
    
    log "✅ Pliki aplikacji pobrane"
}

# Konfiguracja SSL
setup_ssl() {
    log "Konfiguracja SSL..."
    
    read -p "Wprowadź domenę (np. tokenmaster.example.com): " DOMAIN
    
    if [[ -z "$DOMAIN" ]]; then
        warning "Pominięto konfigurację SSL - używaj HTTPS w produkcji!"
        return
    fi
    
    # Generuj certyfikat Let's Encrypt
    if command -v certbot >/dev/null 2>&1; then
        sudo certbot certonly --standalone -d "$DOMAIN" --email admin@"$DOMAIN" --agree-tos --non-interactive
        
        # Skopiuj certyfikaty
        sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$APP_DIR/ssl/tokenmaster.crt"
        sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$APP_DIR/ssl/tokenmaster.key"
        sudo chown $USER:$USER "$APP_DIR/ssl/"*
        
        log "✅ SSL skonfigurowany dla domeny: $DOMAIN"
    else
        warning "Certbot niedostępny - skonfiguruj SSL ręcznie"
    fi
}

# Konfiguracja zmiennych środowiskowych
setup_environment() {
    log "Konfiguracja zmiennych środowiskowych..."
    
    # Skopiuj przykładowy plik
    cp env-example .env
    
    echo ""
    echo -e "${YELLOW}KONFIGURACJA KLUCZY API${NC}"
    echo "Wprowadź swoje klucze API (Enter = pomiń):"
    echo ""
    
    # Klucze Gemini
    for i in {1..4}; do
        read -p "Klucz Gemini $i: " gemini_key
        if [[ -n "$gemini_key" ]]; then
            sed -i "s/TUTAJ_WKLEJ_KLUCZ_GEMINI_$i/$gemini_key/" .env
        fi
    done
    
    # Pozostałe klucze
    read -p "Klucz Perplexity: " perplexity_key
    if [[ -n "$perplexity_key" ]]; then
        sed -i "s/TUTAJ_WKLEJ_KLUCZ_PERPLEXITY/$perplexity_key/" .env
    fi
    
    read -p "Klucz DeepSeek: " deepseek_key
    if [[ -n "$deepseek_key" ]]; then
        sed -i "s/TUTAJ_WKLEJ_KLUCZ_DEEPSEEK/$deepseek_key/" .env
    fi
    
    read -p "Klucz AIMLAPI: " aimlapi_key
    if [[ -n "$aimlapi_key" ]]; then
        sed -i "s/TUTAJ_WKLEJ_KLUCZ_AIMLAPI/$aimlapi_key/" .env
    fi
    
    # Generuj hasła
    db_password=$(openssl rand -base64 32)
    redis_password=$(openssl rand -base64 32)
    jwt_secret=$(openssl rand -base64 64)
    session_secret=$(openssl rand -base64 32)
    grafana_password=$(openssl rand -base64 16)
    
    # Aktualizuj .env
    sed -i "s/USTAW_SILNE_HASLO_BAZY_DANYCH/$db_password/" .env
    sed -i "s/USTAW_SILNE_HASLO_REDIS/$redis_password/" .env
    sed -i "s/WYGENERUJ_LOSOWY_64_ZNAKOWY_KLUCZ_JWT/$jwt_secret/" .env
    sed -i "s/WYGENERUJ_LOSOWY_32_ZNAKOWY_KLUCZ_SESJI/$session_secret/" .env
    sed -i "s/USTAW_SILNE_HASLO_GRAFANA/$grafana_password/" .env
    
    # Ustaw uprawnienia
    chmod 600 .env
    
    log "✅ Zmienne środowiskowe skonfigurowane"
    info "Hasło Grafana: $grafana_password"
}

# Firewall configuration
setup_firewall() {
    log "Konfiguracja firewall..."
    
    case $OS in
        "ubuntu")
            sudo ufw --force enable
            sudo ufw allow 22/tcp    # SSH
            sudo ufw allow 80/tcp    # HTTP
            sudo ufw allow 443/tcp   # HTTPS
            sudo ufw allow 8080/tcp  # TokenMaster
            sudo ufw allow 3000/tcp  # Grafana
            sudo ufw allow 9090/tcp  # Prometheus
            ;;
        "centos"|"fedora")
            sudo systemctl enable firewalld
            sudo systemctl start firewalld
            sudo firewall-cmd --permanent --add-port=22/tcp
            sudo firewall-cmd --permanent --add-port=80/tcp
            sudo firewall-cmd --permanent --add-port=443/tcp
            sudo firewall-cmd --permanent --add-port=8080/tcp
            sudo firewall-cmd --permanent --add-port=3000/tcp
            sudo firewall-cmd --permanent --add-port=9090/tcp
            sudo firewall-cmd --reload
            ;;
    esac
    
    log "✅ Firewall skonfigurowany"
}

# Deployment aplikacji
deploy_application() {
    log "Wdrażanie aplikacji..."
    
    # Nadaj uprawnienia wykonywania
    chmod +x deploy.sh
    
    # Uruchom deployment
    ./deploy.sh deploy
    
    log "✅ Aplikacja wdrożona"
}

# Test końcowy
final_test() {
    log "Test końcowy systemu..."
    
    sleep 10
    
    # Test HTTP
    if curl -f -s http://localhost:8080/health >/dev/null 2>&1; then
        log "✅ HTTP OK"
    else
        error "HTTP test failed"
    fi
    
    # Test kontenerów
    if [[ $(docker-compose ps --services --filter status=running | wc -l) -gt 0 ]]; then
        log "✅ Kontenery działają"
    else
        error "Kontenery nie działają"
    fi
    
    log "✅ Wszystkie testy przeszły pomyślnie"
}

# Podsumowanie instalacji
show_summary() {
    echo ""
    echo -e "${GREEN}🎉 INSTALACJA ZAKOŃCZONA POMYŚLNIE! 🎉${NC}"
    echo ""
    echo -e "${BLUE}📊 INFORMACJE O SYSTEMIE:${NC}"
    echo "   • Lokalizacja: $APP_DIR"
    echo "   • URL aplikacji: http://localhost:8080"
    echo "   • Grafana: http://localhost:3000"
    echo "   • Prometheus: http://localhost:9090"
    echo ""
    echo -e "${BLUE}🔧 PODSTAWOWE KOMENDY:${NC}"
    echo "   • Status: cd $APP_DIR && ./deploy.sh status"
    echo "   • Logi: cd $APP_DIR && ./deploy.sh logs"
    echo "   • Restart: cd $APP_DIR && ./deploy.sh deploy"
    echo "   • Rollback: cd $APP_DIR && ./deploy.sh rollback"
    echo ""
    echo -e "${BLUE}📚 DOKUMENTACJA:${NC}"
    echo "   • README: $APP_DIR/README.md"
    echo "   • Konfiguracja: $APP_DIR/.env"
    echo "   • Logi: $APP_DIR/logs/"
    echo ""
    echo -e "${YELLOW}⚠️  NASTĘPNE KROKI:${NC}"
    echo "   1. Skonfiguruj domenę w pliku .env"
    echo "   2. Ustaw certyfikaty SSL dla produkcji"
    echo "   3. Skonfiguruj backup strategy"
    echo "   4. Sprawdź monitoring w Grafana"
    echo ""
    echo -e "${GREEN}TokenMaster AI Optimizer gotowy do użycia!${NC}"
}

# Główna funkcja instalacji
main() {
    show_banner
    
    info "Rozpoczynanie instalacji TokenMaster AI Optimizer..."
    
    check_os
    install_dependencies
    setup_docker
    create_directories
    download_application
    setup_ssl
    setup_environment
    setup_firewall
    deploy_application
    final_test
    show_summary
    
    log "🚀 Instalacja zakończona!"
}

# Sprawdź czy skrypt jest uruchamiany jako root
if [[ $EUID -eq 0 ]]; then
    error "Nie uruchamiaj tego skryptu jako root!"
fi

# Uruchom instalację
main "$@"
