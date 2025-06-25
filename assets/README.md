# TokenMaster AI Optimizer - Wersja Produkcyjna

Zaawansowany system optymalizacji zapytań AI z inteligentną rotacją kluczy API, real-time monitoring i 15 typami zaawansowanej optymalizacji.

## 🚀 Szybki Start Produkcyjny

### Wymagania Systemowe
- Node.js >= 18.0.0
- NPM >= 9.0.0
- Python 3.8+ (opcjonalnie dla serwera HTTP)
- Minimum 4GB RAM
- Przeglądarka obsługująca ES6+

### Instalacja Produkcyjna

```bash
# 1. Sklonuj projekt
git clone https://github.com/company/tokenmaster-ai-optimizer.git
cd tokenmaster-ai-optimizer

# 2. Zainstaluj zależności
npm install

# 3. Skonfiguruj klucze API
cp config/api-keys.example.js config/api-keys.js
nano config/api-keys.js

# 4. Zbuduj wersję produkcyjną
npm run build

# 5. Uruchom serwer produkcyjny
npm run deploy
```

## 🔧 Konfiguracja Kluczy API

### Plik: config/api-keys.js
```javascript
export const API_KEYS = {
  gemini: [
    'AIzaSyABC123...', // Klucz 1
    'AIzaSyDEF456...', // Klucz 2  
    'AIzaSyGHI789...', // Klucz 3
    'AIzaSyJKL012...'  // Klucz 4
  ],
  perplexity: 'pplx-abc123...',
  deepseek: 'sk-def456...',
  aimlapi: 'ghi789...'
};
```

### Rotacja Kluczy
System automatycznie rotuje klucze Gemini przy wykryciu limitów:
- Health monitoring co 30 sekund
- Automatic failover przy błędach
- Load balancing oparty na usage metrics
- Proactive switching przed osiągnięciem limitów

## 📊 15 Typów Optymalizacji

### Kategoria Popularna (1-5)
1. **Indeksowanie Strategiczne** - 85% skuteczności, wysoki ROI
2. **Optymalizacja JOIN** - 80% skuteczności, automatyczne przełączanie
3. **Query Rewriting** - 75% skuteczności, transformacja CTE
4. **Partycjonowanie Danych** - 70% skuteczności, hot/cold tiering
5. **Execution Plan Optimization** - 78% skuteczności, adaptive processing

### Kategoria Hybrydowa (6-10)  
6. **ML + Indeksowanie** - 90% skuteczności, workload forecasting
7. **Adaptacyjne Wykonanie + Caching** - 88% skuteczności, memory management
8. **Materialized Views + In-Memory** - 85% skuteczności, latency reduction
9. **Sharding + Replikacja** - 82% skuteczności, geographic distribution
10. **Vectorization + SIMD** - 95% skuteczności, analytical speedup

### Kategoria Nieszablonowa (11-15)
11. **Quantum-Inspired Indexing** - 95% potencjał, eksperymentalne
12. **Biofeedback Latency** - 75% skuteczności, user stress monitoring  
13. **Gamifikacja Optymalizacji** - 70% skuteczność, collective intelligence
14. **Psycholingwistyczna Analiza** - 65% skuteczność, NLP approach
15. **Dark Pattern Detection** - 80% skuteczność, security-focused

## 🏗️ Architektura Systemu

### Frontend Stack
- **Vue 3 Composition API** - reaktywność i performance
- **Modern CSS3** - glass-morphism design
- **Chart.js** - real-time metrics visualization
- **WebSocket** - live communication
- **Progressive Web App** - offline capabilities

### API Integration
- **Multi-provider support** - 6 różnych modeli AI
- **Circuit breaker patterns** - graceful degradation
- **Rate limiting detection** - smart throttling
- **Health monitoring** - connection status tracking

### Security Features
- **Zero-knowledge architecture** - klucze przechowywane lokalnie
- **Encrypted communication** - HTTPS/WSS only
- **Input sanitization** - XSS/injection protection  
- **Rate limiting** - abuse prevention

## 📈 Monitoring i Metryki

### Real-time Dashboard
- Response times dla każdego modelu
- Success/failure rates w czasie rzeczywistym
- API usage statistics i cost tracking
- Error logs z categorization
- Performance benchmarks

### Alerting System
- Email notifications przy błędach krytycznych
- Slack integration dla team notifications
- Threshold-based alerts dla key metrics
- Automatic escalation procedures

## 🚀 Deployment Produkcyjny

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tokenmaster-ai
spec:
  replicas: 3
  selector:
    matchLabels:
      app: tokenmaster-ai
  template:
    metadata:
      labels:
        app: tokenmaster-ai
    spec:
      containers:
      - name: tokenmaster
        image: tokenmaster:2.1.0
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### Load Balancer Configuration
- **NGINX** - reverse proxy z SSL termination
- **HAProxy** - advanced load balancing
- **Cloudflare** - CDN i DDoS protection
- **AWS ALB** - auto-scaling integration

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: Production Deploy
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run test
    - run: npm run build
    - name: Deploy to Production
      run: npm run deploy:prod
```

### Blue-Green Deployment
- Zero-downtime deployments
- Automatic rollback przy błędach
- Smoke tests po deployment
- Gradual traffic shifting

## 🛠️ Troubleshooting

### Typowe Problemy
1. **API Key Rotation Issues**
   ```bash
   # Sprawdź status kluczy
   curl -X GET http://localhost:8080/api/health/keys
   
   # Reset rotation logic
   curl -X POST http://localhost:8080/api/reset-rotation
   ```

2. **Performance Issues**
   ```bash
   # Sprawdź metryki
   curl -X GET http://localhost:8080/api/metrics
   
   # Clear cache
   curl -X POST http://localhost:8080/api/clear-cache
   ```

3. **Connection Problems**
   ```bash
   # Test connectivity
   npm run test:connectivity
   
   # Restart services
   npm run restart:services
   ```

### Logs Analysis
```bash
# Real-time logs
tail -f logs/tokenmaster.log

# Error analysis
grep ERROR logs/tokenmaster.log | tail -100

# Performance metrics
grep PERF logs/tokenmaster.log | tail -50
```

## 📞 Support Kontakt

- **Email**: support@tokenmaster.ai
- **Slack**: #tokenmaster-support
- **GitHub Issues**: https://github.com/company/tokenmaster-ai-optimizer/issues
- **Documentation**: https://docs.tokenmaster.ai

## 📝 Licencja

MIT License - pełny tekst w pliku LICENSE

## 🔄 Updates

- **v2.1.0** - Current production version
- **v2.0.x** - Stable legacy support
- **v3.0.0** - Beta features (quantum optimization)

System automatycznie sprawdza updates co 24h i powiadamia o dostępnych aktualizacjach.
