// Przykład konfiguracji kluczy API - skopiuj do api-keys.js i uzupełnij rzeczywiste klucze

export const API_KEYS = {
  // Klucze Gemini - 4 aktywne klucze z automatyczną rotacją
  gemini: [
    'TUTAJ_WKLEJ_KLUCZ_GEMINI_1', // Klucz główny
    'TUTAJ_WKLEJ_KLUCZ_GEMINI_2', // Backup 1
    'TUTAJ_WKLEJ_KLUCZ_GEMINI_3', // Backup 2  
    'TUTAJ_WKLEJ_KLUCZ_GEMINI_4'  // Backup 3
  ],
  
  // Pozostałe klucze API
  perplexity: 'TUTAJ_WKLEJ_KLUCZ_PERPLEXITY',
  deepseek: 'TUTAJ_WKLEJ_KLUCZ_DEEPSEEK',
  aimlapi: 'TUTAJ_WKLEJ_KLUCZ_AIMLAPI',
  
  // Konfiguracja rotacji
  rotation: {
    enabled: true,
    healthCheckInterval: 30000, // 30 sekund
    maxRetries: 3,
    timeoutMs: 10000,
    rateLimitThreshold: 0.9 // 90% limitu
  },
  
  // Endpointy API
  endpoints: {
    perplexity: 'https://api.perplexity.ai/chat/completions',
    gemini: 'https://generativelanguage.googleapis.com/v1beta/models/',
    deepseek: 'https://api.deepseek.com/v1/chat/completions',
    aimlapi: 'https://api.aimlapi.com/chat/completions'
  },
  
  // Limity rate limiting
  rateLimits: {
    perplexity: { requests: 1000, window: 3600 }, // 1000/hour
    gemini: { requests: 10000, window: 3600 },    // 10000/hour
    deepseek: { requests: 5000, window: 3600 },   // 5000/hour
    aimlapi: { requests: 2000, window: 3600 }     // 2000/hour
  }
};

// Funkcja walidacji kluczy
export function validateApiKeys() {
  const errors = [];
  
  if (!API_KEYS.gemini || API_KEYS.gemini.length < 4) {
    errors.push('Brak 4 kluczy Gemini - system wymaga minimum 4 aktywnych kluczy');
  }
  
  API_KEYS.gemini.forEach((key, index) => {
    if (!key || key.includes('TUTAJ_WKLEJ')) {
      errors.push(`Klucz Gemini ${index + 1} nie został skonfigurowany`);
    }
  });
  
  if (!API_KEYS.perplexity || API_KEYS.perplexity.includes('TUTAJ_WKLEJ')) {
    errors.push('Klucz Perplexity nie został skonfigurowany');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Eksport konfiguracji produkcyjnej
export const PRODUCTION_CONFIG = {
  maxConcurrentRequests: 10,
  requestTimeout: 30000,
  retryAttempts: 3,
  cacheEnabled: true,
  cacheTTL: 300000, // 5 minut
  loggingLevel: 'info',
  metricsEnabled: true,
  healthCheckEnabled: true
};
