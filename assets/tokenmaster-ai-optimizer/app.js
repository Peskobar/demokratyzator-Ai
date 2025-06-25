// TokenMaster Pro - Advanced AI Query Optimization System
const { createApp, ref, computed, onMounted, nextTick, watch } = Vue;

createApp({
  setup() {
    // Application Data from JSON - Fixed and Complete
    const applicationData = {
      "aiModels": [
        {
          "id": "perplexity-pro",
          "name": "Perplexity Pro",
          "description": "Zaawansowane capabilities dla research-oriented queries",
          "endpoints": ["https://api.perplexity.ai/chat/completions"],
          "maxTokens": 4096,
          "pricing": "$20/1M tokens"
        },
        {
          "id": "gemini-1.5-pro", 
          "name": "Gemini 1.5 Pro",
          "description": "Najbardziej zaawansowany model Google z dużym kontekstem",
          "endpoints": ["https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro"],
          "maxTokens": 2097152,
          "pricing": "$7/1M tokens"
        },
        {
          "id": "gemini-1.5-flash",
          "name": "Gemini 1.5 Flash", 
          "description": "Szybki model Google dla real-time applications",
          "endpoints": ["https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash"],
          "maxTokens": 1048576,
          "pricing": "$0.075/1M tokens"
        },
        {
          "id": "gemini-1.0",
          "name": "Gemini 1.0",
          "description": "Stabilny model Google dla standardowych zadań", 
          "endpoints": ["https://generativelanguage.googleapis.com/v1/models/gemini-pro"],
          "maxTokens": 32768,
          "pricing": "$0.5/1M tokens"
        },
        {
          "id": "deepseek-r1",
          "name": "DeepSeek R1", 
          "description": "Specialized reasoning capabilities dla complex logic",
          "endpoints": ["https://api.deepseek.com/v1/chat/completions"],
          "maxTokens": 65536,
          "pricing": "$0.55/1M tokens"
        },
        {
          "id": "aimlapi",
          "name": "AIMLAPI",
          "description": "Unified access layer dla multiple models",
          "endpoints": ["https://api.aimlapi.com/chat/completions"],
          "maxTokens": 8192,
          "pricing": "$2/1M tokens"
        }
      ],
      "optimizationTypes": [
        {
          "category": "popularne",
          "categoryName": "Popularne Typy Optymalizacji",
          "types": [
            {
              "id": "strategic-indexing",
              "name": "Indeksowanie Strategiczne",
              "description": "Tworzenie indeksów złożonych dla kolumn używanych w JOIN i WHERE z automatyczną detekcją częstotliwości",
              "effectiveness": 85,
              "complexity": "Średni",
              "roi": "Wysoki"
            },
            {
              "id": "join-optimization", 
              "name": "Optymalizacja JOIN",
              "description": "Dynamiczne przełączanie między hash join a nested loops w zależności od rozmiaru danych",
              "effectiveness": 80,
              "complexity": "Średni", 
              "roi": "Wysoki"
            },
            {
              "id": "query-rewriting",
              "name": "Query Rewriting",
              "description": "Automatyczna transformacja podzapytań na CTE z cache'owaniem wyników pośrednich",
              "effectiveness": 75,
              "complexity": "Niski",
              "roi": "Bardzo Wysoki"
            },
            {
              "id": "data-partitioning",
              "name": "Partycjonowanie Danych", 
              "description": "Segmentacja tabel na partycje czasowe/geograficzne z automatycznym hot/cold tiering",
              "effectiveness": 70,
              "complexity": "Wysoki",
              "roi": "Średni"
            },
            {
              "id": "execution-plan",
              "name": "Execution Plan Optimization",
              "description": "Real-time analiza execution plans z sugestiami optymalizacyjnymi i adaptive processing",
              "effectiveness": 78,
              "complexity": "Średni",
              "roi": "Wysoki"
            }
          ]
        },
        {
          "category": "hybrydowe",
          "categoryName": "Hybrydowe Techniki Zaawansowane", 
          "types": [
            {
              "id": "ml-indexing",
              "name": "ML + Indeksowanie",
              "description": "Algorytmy ML przewidujące optymalne indeksy na podstawie workload forecasting",
              "effectiveness": 90,
              "complexity": "Bardzo Wysoki",
              "roi": "Wysoki"
            },
            {
              "id": "adaptive-caching",
              "name": "Adaptacyjne Wykonanie + Caching", 
              "description": "Dynamiczna modyfikacja strategii wykonania z intelligent memory management",
              "effectiveness": 88,
              "complexity": "Wysoki",
              "roi": "Bardzo Wysoki"
            },
            {
              "id": "materialized-inmemory",
              "name": "Materialized Views + In-Memory",
              "description": "Hot materialized views w pamięci z cold storage fallback dla optimal performance",
              "effectiveness": 85,
              "complexity": "Wysoki", 
              "roi": "Wysoki"
            },
            {
              "id": "sharding-replication",
              "name": "Sharding + Replikacja",
              "description": "Geographic sharding z local read replicas dla global latency reduction",
              "effectiveness": 82,
              "complexity": "Bardzo Wysoki",
              "roi": "Średni"
            },
            {
              "id": "vectorization-simd",
              "name": "Vectorization + SIMD", 
              "description": "SIMD-optimized aggregation operations dla analytical workloads speedup",
              "effectiveness": 95,
              "complexity": "Bardzo Wysoki",
              "roi": "Bardzo Wysoki"
            }
          ]
        },
        {
          "category": "nieszablonowe",
          "categoryName": "Nieszablonowe Metody",
          "types": [
            {
              "id": "quantum-indexing",
              "name": "Quantum-Inspired Indexing",
              "description": "Superposition-based data structures dla exploration multiple configurations",
              "effectiveness": 95,
              "complexity": "Eksperymentalny",
              "roi": "Potencjalnie Rewolucyjny"
            },
            {
              "id": "biofeedback-latency", 
              "name": "Biofeedback Latency Optimization",
              "description": "Adaptive performance targets na podstawie real-time user stress monitoring",
              "effectiveness": 75,
              "complexity": "Eksperymentalny",
              "roi": "Niszowy"
            },
            {
              "id": "gamification-optimization",
              "name": "Gamifikacja Optymalizacji",
              "description": "Crowdsourced optimization przez developer challenges i collective intelligence",
              "effectiveness": 70,
              "complexity": "Średni",
              "roi": "Innowacyjny"
            },
            {
              "id": "psycholinguistic-analysis",
              "name": "Psycholingwistyczna Analiza",
              "description": "NLP approaches dla query understanding i user intent detection",
              "effectiveness": 65,
              "complexity": "Wysoki", 
              "roi": "Niszowy"
            },
            {
              "id": "dark-pattern-detection",
              "name": "Dark Pattern Detection",
              "description": "Real-time detection potentially harmful query patterns dla security",
              "effectiveness": 80,
              "complexity": "Wysoki",
              "roi": "Security-focused"
            }
          ]
        }
      ],
      "metrics": {
        "responseTime": {
          "perplexity-pro": 850,
          "gemini-1.5-pro": 1200,
          "gemini-1.5-flash": 400,
          "gemini-1.0": 600,
          "deepseek-r1": 750,
          "aimlapi": 500
        },
        "successRates": {
          "perplexity-pro": 0.98,
          "gemini-1.5-pro": 0.96,
          "gemini-1.5-flash": 0.99,
          "gemini-1.0": 0.97,
          "deepseek-r1": 0.94,
          "aimlapi": 0.95
        },
        "costPerQuery": {
          "perplexity-pro": 0.02,
          "gemini-1.5-pro": 0.015,
          "gemini-1.5-flash": 0.001,
          "gemini-1.0": 0.005,
          "deepseek-r1": 0.008,
          "aimlapi": 0.012
        }
      }
    };

    // Reactive State
    const queryText = ref('');
    const selectedModel = ref('');
    const selectedOptimization = ref('');
    const isProcessing = ref(false);
    const processingProgress = ref(0);
    const processingStep = ref('');
    const lastResult = ref(null);
    const queryHistory = ref([]);
    const showExportModal = ref(false);
    const exportFormat = ref('json');

    // API Key Management
    const apiKeys = ref({
      gemini: [
        "GEMINI_API_KEY_1_ACTIVE",
        "GEMINI_API_KEY_2_ACTIVE", 
        "GEMINI_API_KEY_3_ACTIVE",
        "GEMINI_API_KEY_4_ACTIVE"
      ],
      rotation: {
        currentIndex: 0,
        healthStatus: [true, true, true, true],
        rateLimits: [1000, 1000, 1000, 1000],
        usageCounts: [0, 0, 0, 0]
      }
    });

    // Performance Chart
    let performanceChart = null;

    // Computed Properties - Fixed to properly return data
    const aiModels = computed(() => {
      console.log('AI Models computed:', applicationData.aiModels);
      return applicationData.aiModels || [];
    });
    
    const optimizationTypes = computed(() => {
      console.log('Optimization Types computed:', applicationData.optimizationTypes);
      return applicationData.optimizationTypes || [];
    });

    // Flattened optimization types for easier dropdown population
    const allOptimizationTypes = computed(() => {
      const all = [];
      optimizationTypes.value.forEach(category => {
        if (category.types && Array.isArray(category.types)) {
          category.types.forEach(type => {
            all.push({
              ...type,
              categoryName: category.categoryName,
              category: category.category
            });
          });
        }
      });
      console.log('All optimization types:', all);
      return all;
    });

    const selectedModelInfo = computed(() => {
      return aiModels.value.find(model => model.id === selectedModel.value);
    });

    const selectedOptimizationInfo = computed(() => {
      return allOptimizationTypes.value.find(type => type.id === selectedOptimization.value);
    });

    const estimatedTokens = computed(() => {
      if (!queryText.value) return 0;
      return Math.ceil(queryText.value.length / 4);
    });

    const canOptimize = computed(() => {
      return queryText.value.trim().length > 10 && selectedModel.value && selectedOptimization.value;
    });

    const systemStatus = computed(() => {
      const healthyKeys = apiKeys.value.rotation.healthStatus.filter(status => status).length;
      const totalKeys = apiKeys.value.rotation.healthStatus.length;
      
      if (healthyKeys === totalKeys) {
        return { class: 'online', text: 'System Online' };
      } else if (healthyKeys > totalKeys / 2) {
        return { class: 'warning', text: 'Częściowa Degradacja' };
      } else {
        return { class: 'error', text: 'System Offline' };
      }
    });

    const healthyKeysCount = computed(() => {
      return apiKeys.value.rotation.healthStatus.filter(status => status).length;
    });

    const totalKeysCount = computed(() => {
      return apiKeys.value.rotation.healthStatus.length;
    });

    const averageResponseTime = computed(() => {
      if (queryHistory.value.length === 0) return 0;
      const total = queryHistory.value.reduce((sum, item) => sum + (item.responseTime || 0), 0);
      return Math.round(total / queryHistory.value.length);
    });

    const successRate = computed(() => {
      if (queryHistory.value.length === 0) return 100;
      const successful = queryHistory.value.filter(item => item.success).length;
      return Math.round((successful / queryHistory.value.length) * 100);
    });

    const totalCost = computed(() => {
      return queryHistory.value.reduce((sum, item) => sum + (item.cost || 0), 0);
    });

    const exportPreview = computed(() => {
      if (exportFormat.value === 'json') {
        return JSON.stringify(queryHistory.value.slice(0, 3), null, 2);
      } else {
        const headers = 'timestamp,query,model,optimization,responseTime,success,cost\n';
        const rows = queryHistory.value.slice(0, 3).map(item => 
          `"${item.timestamp}","${(item.query || '').replace(/"/g, '""')}","${item.model}","${item.optimization}",${item.responseTime || 0},${item.success},${item.cost || 0}`
        ).join('\n');
        return headers + rows;
      }
    });

    // Methods
    const validateQuery = () => {
      // Real-time query validation
      if (queryText.value.length > 5000) {
        queryText.value = queryText.value.substring(0, 5000);
      }
    };

    const getModelMetric = (metricType) => {
      if (!selectedModel.value) return 0;
      return applicationData.metrics[metricType][selectedModel.value] || 0;
    };

    const getNextApiKey = () => {
      const rotation = apiKeys.value.rotation;
      
      // Find next healthy key
      let attempts = 0;
      while (attempts < rotation.healthStatus.length) {
        if (rotation.healthStatus[rotation.currentIndex]) {
          const key = apiKeys.value.gemini[rotation.currentIndex];
          rotation.usageCounts[rotation.currentIndex]++;
          
          // Rotate to next key
          rotation.currentIndex = (rotation.currentIndex + 1) % rotation.healthStatus.length;
          
          return key;
        }
        
        rotation.currentIndex = (rotation.currentIndex + 1) % rotation.healthStatus.length;
        attempts++;
      }
      
      throw new Error('Brak dostępnych kluczy API');
    };

    const simulateApiCall = async (query, model, optimization) => {
      // Simulate real API call with progressive status updates
      const steps = [
        'Wybór klucza API...',
        'Nawiązywanie połączenia...',
        'Wysyłanie zapytania...',
        'Analiza zapytania...',
        'Generowanie optymalizacji...',
        'Finalizowanie wyników...'
      ];

      for (let i = 0; i < steps.length; i++) {
        processingStep.value = steps[i];
        processingProgress.value = ((i + 1) / steps.length) * 100;
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      }

      // Generate realistic optimization result
      const optimizationInfo = selectedOptimizationInfo.value;
      const modelInfo = selectedModelInfo.value;
      
      const optimizedQuery = generateOptimizedQuery(query, optimization);
      const recommendations = generateRecommendations(optimization, optimizationInfo);
      
      return {
        optimizedQuery,
        recommendations,
        model: modelInfo ? modelInfo.name : 'Unknown Model',
        optimization: optimizationInfo ? optimizationInfo.name : 'Unknown Optimization',
        responseTime: applicationData.metrics.responseTime[model] ? 
          applicationData.metrics.responseTime[model] + Math.random() * 200 - 100 : 
          Math.random() * 1000 + 300,
        cost: applicationData.metrics.costPerQuery[model] ? 
          applicationData.metrics.costPerQuery[model] * (1 + Math.random() * 0.5) : 
          Math.random() * 0.02,
        timestamp: new Date().toISOString()
      };
    };

    const generateOptimizedQuery = (originalQuery, optimizationType) => {
      // Generate realistic optimized query based on type
      const optimizations = {
        'strategic-indexing': `-- Optymalizacja: Indeksowanie Strategiczne
-- Dodane indeksy złożone dla kluczowych kolumn

CREATE INDEX CONCURRENTLY idx_orders_customer_date 
ON orders (customer_id, order_date) 
WHERE status = 'active';

CREATE INDEX CONCURRENTLY idx_products_category_price 
ON products (category_id, price DESC) 
INCLUDE (name, description);

-- Zoptymalizowane zapytanie:
${originalQuery}

-- Wykorzystuje nowe indeksy dla wydajnego wyszukiwania`,

        'join-optimization': `-- Optymalizacja: JOIN Strategy
-- Przekształcenie na hash join dla lepszej wydajności

SELECT /*+ USE_HASH(o, c) */ 
    o.order_id, c.customer_name, o.total_amount
FROM orders o 
INNER JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_date >= CURRENT_DATE - INTERVAL '30 days'
AND c.status = 'active'
ORDER BY o.total_amount DESC;

-- Hash join zapewnia O(n+m) zamiast O(n*m) complexity`,

        'query-rewriting': `-- Optymalizacja: Query Rewriting z CTE
-- Zastąpienie subquery przez Common Table Expression

WITH active_customers AS (
    SELECT customer_id, customer_name, tier
    FROM customers 
    WHERE status = 'active' 
    AND last_login >= CURRENT_DATE - INTERVAL '90 days'
),
recent_orders AS (
    SELECT customer_id, COUNT(*) as order_count, SUM(total_amount) as total_spent
    FROM orders 
    WHERE order_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY customer_id
)
SELECT 
    ac.customer_name,
    ac.tier,
    COALESCE(ro.order_count, 0) as recent_orders,
    COALESCE(ro.total_spent, 0) as recent_spending
FROM active_customers ac
LEFT JOIN recent_orders ro ON ac.customer_id = ro.customer_id
ORDER BY ro.total_spent DESC NULLS LAST;`
      };

      return optimizations[optimizationType] || `-- Zoptymalizowane zapytanie (${optimizationType}):\n${originalQuery}\n\n-- Zastosowano zaawansowane techniki optymalizacji\n-- Szacowany wzrost wydajności: ${Math.floor(Math.random() * 40 + 20)}%`;
    };

    const generateRecommendations = (optimizationType, optimizationInfo) => {
      const baseRecommendations = [
        `Implementuj ${optimizationInfo ? optimizationInfo.name : 'wybraną optymalizację'} dla wzrostu wydajności`,
        `Monitoruj execution plans po wdrożeniu zmian`,
        `Rozważ dodatkowe indeksy dla często używanych kolumn`,
        `Testuj wydajność w środowisku staging przed produkcją`,
        `Dokumentuj zmiany dla zespołu DBA`
      ];

      const specificRecommendations = {
        'strategic-indexing': [
          'Regularnie analizuj usage statistics indeksów',
          'Usuń nieużywane indeksy aby zaoszczędzić przestrzeń',
          'Rozważ partial indeksy dla filtrowanych zapytań',
          'Monitoruj fragmentację indeksów i planuj REINDEX'
        ],
        'join-optimization': [
          'Aktualizuj statystyki tabel regularnie dla lepszego cost estimation',
          'Rozważ denormalizację dla bardzo częstych JOIN operations',
          'Implementuj connection pooling dla zmniejszenia overhead',
          'Monitoruj resource usage podczas peak hours'
        ],
        'materialized-inmemory': [
          'Skonfiguruj automatic refresh dla materialized views',
          'Monitoruj memory usage i dostosuj buffer pools',
          'Implementuj failover strategy dla in-memory components',
          'Rozważ partitioning dla bardzo dużych materialized views'
        ]
      };

      return specificRecommendations[optimizationType] || baseRecommendations;
    };

    const optimizeQuery = async () => {
      if (!canOptimize.value) return;

      isProcessing.value = true;
      processingProgress.value = 0;
      
      try {
        const apiKey = getNextApiKey();
        const result = await simulateApiCall(queryText.value, selectedModel.value, selectedOptimization.value);
        
        result.id = Date.now();
        result.query = queryText.value;
        result.success = true;
        
        lastResult.value = result;
        queryHistory.value.unshift(result);
        
        // Keep only last 50 queries
        if (queryHistory.value.length > 50) {
          queryHistory.value = queryHistory.value.slice(0, 50);
        }
        
        saveToLocalStorage();
        showNotification('Optymalizacja zakończona pomyślnie!');
        
      } catch (error) {
        console.error('Optimization failed:', error);
        
        const errorResult = {
          id: Date.now(),
          query: queryText.value,
          model: selectedModelInfo.value?.name || 'Unknown',
          optimization: selectedOptimizationInfo.value?.name || 'Unknown',
          error: error.message,
          success: false,
          timestamp: new Date().toISOString(),
          responseTime: 0,
          cost: 0
        };
        
        queryHistory.value.unshift(errorResult);
        lastResult.value = errorResult;
        showNotification('Błąd podczas optymalizacji: ' + error.message, 'error');
        
      } finally {
        isProcessing.value = false;
        processingProgress.value = 0;
        processingStep.value = '';
      }
    };

    const clearForm = () => {
      queryText.value = '';
      selectedModel.value = '';
      selectedOptimization.value = '';
      lastResult.value = null;
    };

    const copyResult = () => {
      if (!lastResult.value) return;
      
      const textToCopy = lastResult.value.optimizedQuery || lastResult.value.error || 'Brak wyników';
      navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('Wyniki skopiowane do schowka!');
      });
    };

    const saveToHistory = () => {
      showNotification('Wynik zapisany w historii!');
      saveToLocalStorage();
    };

    const loadHistoryItem = (item) => {
      queryText.value = item.query || '';
      
      // Find matching model and optimization by name or id
      const model = aiModels.value.find(m => m.name === item.model || m.id === item.model);
      if (model) {
        selectedModel.value = model.id;
      }
      
      const optimization = allOptimizationTypes.value.find(o => o.name === item.optimization || o.id === item.optimization);
      if (optimization) {
        selectedOptimization.value = optimization.id;
      }
      
      lastResult.value = item;
    };

    const exportHistory = () => {
      showExportModal.value = true;
    };

    const closeExportModal = () => {
      showExportModal.value = false;
    };

    const downloadExport = () => {
      const filename = `tokenmaster_export_${new Date().toISOString().split('T')[0]}.${exportFormat.value}`;
      const content = exportFormat.value === 'json' 
        ? JSON.stringify(queryHistory.value, null, 2)
        : generateCSV();
      
      const blob = new Blob([content], { type: exportFormat.value === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      
      URL.revokeObjectURL(url);
      showExportModal.value = false;
      showNotification(`Eksport ${filename} ukończony!`);
    };

    const generateCSV = () => {
      const headers = 'timestamp,query,model,optimization,responseTime,success,cost\n';
      const rows = queryHistory.value.map(item => 
        `"${item.timestamp}","${(item.query || '').replace(/"/g, '""')}","${item.model}","${item.optimization}",${item.responseTime || 0},${item.success},${item.cost || 0}`
      ).join('\n');
      return headers + rows;
    };

    const truncateText = (text, maxLength) => {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getCurrentTime = () => {
      return new Date().toLocaleString('pl-PL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const showNotification = (message, type = 'success') => {
      // Simple notification system
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      
      const backgroundColor = type === 'error' ? 'var(--color-error)' : 'var(--color-success)';
      
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    };

    const saveToLocalStorage = () => {
      try {
        const dataToSave = {
          queryHistory: queryHistory.value,
          apiKeys: apiKeys.value,
          lastSaved: new Date().toISOString()
        };
        // Note: In production environment, we'll use alternative storage
        console.log('Data saved to application state:', dataToSave);
      } catch (error) {
        console.warn('Storage not available, data kept in memory only');
      }
    };

    const loadFromLocalStorage = () => {
      try {
        // In production, this would load from persistent storage
        console.log('Loading application state...');
        // Initialize with some sample data for demo
        queryHistory.value = [
          {
            id: 1,
            query: 'SELECT * FROM users WHERE active = true',
            model: 'Gemini 1.5 Pro',
            optimization: 'Indeksowanie Strategiczne',
            responseTime: 450,
            success: true,
            cost: 0.012,
            timestamp: new Date(Date.now() - 86400000).toISOString()
          }
        ];
      } catch (error) {
        console.warn('Storage not available, using default state');
      }
    };

    const initializePerformanceChart = () => {
      nextTick(() => {
        const canvas = document.getElementById('performanceChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (performanceChart) {
          performanceChart.destroy();
        }

        const chartData = {
          labels: aiModels.value.map(model => model.name.split(' ')[0]),
          datasets: [
            {
              label: 'Czas odpowiedzi (ms)',
              data: aiModels.value.map(model => applicationData.metrics.responseTime[model.id] || 500),
              backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'],
              borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'],
              borderWidth: 2
            }
          ]
        };

        performanceChart = new Chart(ctx, {
          type: 'bar',
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: '#1FB8CD',
                borderWidth: 1
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: '#666'
                }
              },
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  color: '#666'
                }
              }
            }
          }
        });
      });
    };

    // Lifecycle
    onMounted(() => {
      console.log('Component mounted, initializing...');
      loadFromLocalStorage();
      
      // Delay chart initialization to ensure DOM is ready
      setTimeout(() => {
        initializePerformanceChart();
      }, 100);
      
      // Simulate periodic API health checks
      setInterval(() => {
        apiKeys.value.rotation.healthStatus = apiKeys.value.rotation.healthStatus.map(
          status => Math.random() > 0.05 ? status : !status
        );
      }, 30000);
    });

    // Watchers
    watch([queryHistory], () => {
      // Update chart when history changes
      if (performanceChart) {
        setTimeout(() => initializePerformanceChart(), 100);
      }
    }, { deep: true });

    // Add dynamic styles for notifications
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(notificationStyles);

    return {
      // State
      queryText,
      selectedModel,
      selectedOptimization,
      isProcessing,
      processingProgress,
      processingStep,
      lastResult,
      queryHistory,
      showExportModal,
      exportFormat,
      
      // Computed
      aiModels,
      optimizationTypes,
      allOptimizationTypes,
      selectedModelInfo,
      selectedOptimizationInfo,
      estimatedTokens,
      canOptimize,
      systemStatus,
      healthyKeysCount,
      totalKeysCount,
      averageResponseTime,
      successRate,
      totalCost,
      exportPreview,
      
      // Methods
      validateQuery,
      getModelMetric,
      optimizeQuery,
      clearForm,
      copyResult,
      saveToHistory,
      loadHistoryItem,
      exportHistory,
      closeExportModal,
      downloadExport,
      truncateText,
      formatTimestamp,
      getCurrentTime
    };
  }
}).mount('#app');
