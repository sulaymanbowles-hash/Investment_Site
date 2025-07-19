/**
 * Investment Thesis Platform - API Configuration
 * Phase 1: Foundation Setup - No API calls yet, just structure
 */

class APIConfig {
  constructor() {
    // Development phase flags
    this.developmentMode = true;
    this.enableAPICalls = false; // Phase 1: Foundation only
    
    // API endpoints configuration (for future use)
    this.endpoints = {
      gemini: {
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        model: 'gemini-pro',
        maxTokens: 4096
      },
      alphaVantage: {
        baseUrl: 'https://www.alphavantage.co/query',
        functions: {
          quote: 'GLOBAL_QUOTE',
          intraday: 'TIME_SERIES_INTRADAY',
          daily: 'TIME_SERIES_DAILY_ADJUSTED',
          overview: 'OVERVIEW',
          earnings: 'EARNINGS'
        }
      },
      fred: {
        baseUrl: 'https://api.stlouisfed.org/fred',
        format: 'json'
      },
      coinGecko: {
        baseUrl: 'https://api.coingecko.com/api/v3',
        pro: 'https://pro-api.coingecko.com/api/v3'
      }
    };

    // Rate limiting configuration
    this.rateLimits = {
      gemini: 60, // requests per minute
      alphaVantage: 5, // requests per minute (free tier)
      fred: 120, // requests per minute
      coinGecko: 50 // requests per minute
    };

    // Cache configuration
    this.cache = {
      defaultTTL: 15 * 60 * 1000, // 15 minutes
      quoteTTL: 1 * 60 * 1000,    // 1 minute for real-time quotes
      dailyTTL: 24 * 60 * 60 * 1000, // 24 hours for daily data
      newsTTL: 5 * 60 * 1000      // 5 minutes for news
    };
  }

  // Phase 1: Return mock data instead of API calls
  async getAPIKey(service) {
    if (!this.enableAPICalls) {
      console.log(`[Phase 1] Skipping API key for ${service} - using mock data`);
      return 'MOCK_KEY_PHASE_1';
    }
    
    // Future implementation will read from .env
    return process.env[`${service.toUpperCase()}_API_KEY`];
  }

  // Development mode configuration
  isDevelopmentMode() {
    return this.developmentMode;
  }

  shouldUseAPIs() {
    return this.enableAPICalls;
  }

  // Enable APIs for Phase 2+
  enableProductionMode() {
    this.developmentMode = false;
    this.enableAPICalls = true;
    console.log('[API Config] Production mode enabled - APIs active');
  }
}

// Export singleton instance
const apiConfig = new APIConfig();
export default apiConfig;
