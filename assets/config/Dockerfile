# TokenMaster AI Optimizer - Production Dockerfile
# Multi-stage build dla optimized production image

# Stage 1: Build environment
FROM node:18-alpine AS builder

# Metadane
LABEL maintainer="TokenMaster Team <support@tokenmaster.ai>"
LABEL version="2.1.0"
LABEL description="Zaawansowany System Optymalizacji Zapytań AI"

# Instalacja build dependencies
RUN apk add --no-cache git python3 make g++

# Ustawienie working directory
WORKDIR /app

# Kopiowanie package files
COPY package*.json ./

# Instalacja dependencies z cache optimization
RUN npm ci --only=production --silent --no-audit

# Kopiowanie source code
COPY . .

# Build production assets
RUN npm run build

# Stage 2: Production environment  
FROM nginx:alpine AS production

# Instalacja runtime dependencies
RUN apk add --no-cache \
    curl \
    jq \
    nodejs \
    npm

# Tworzenie non-root user
RUN addgroup -g 1001 tokenmaster && \
    adduser -D -s /bin/sh -u 1001 -G tokenmaster tokenmaster

# Kopiowanie built assets z builder stage
COPY --from=builder --chown=tokenmaster:tokenmaster /app/dist /usr/share/nginx/html
COPY --from=builder --chown=tokenmaster:tokenmaster /app/config /usr/share/nginx/html/config

# Custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY ssl/ /etc/nginx/ssl/

# Health check script
COPY healthcheck.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/healthcheck.sh

# Switching to non-root user
USER tokenmaster

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV API_TIMEOUT=30000
ENV RATE_LIMIT_WINDOW=3600
ENV CACHE_TTL=300

# Exposed port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD /usr/local/bin/healthcheck.sh

# Volume dla persistent data
VOLUME ["/usr/share/nginx/html/logs", "/usr/share/nginx/html/cache"]

# Start command
CMD ["nginx", "-g", "daemon off;"]
