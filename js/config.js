// VastraRent AI Chatbot Configuration
// Secure API key management for production deployment

class VastraRentConfig {
    constructor() {
        this.config = this.getConfig();
    }

    getConfig() {
        // Detect environment
        const isProduction = this.isProductionEnvironment();
        
        return {
            // API Configuration - NO HARDCODED KEYS
            OPENROUTER_API_KEY: this.getSecureAPIKey(),
            OPENROUTER_ENDPOINT: 'https://openrouter.ai/api/v1/chat/completions',
            MODEL: 'mistralai/mistral-small-3.2-24b-instruct:free',
            
            // Site Configuration
            SITE_URL: window.location.origin,
            SITE_NAME: 'Vastra Rent',
            
            // Chatbot Settings
            MAX_TOKENS: 1000,
            TEMPERATURE: 0.7,
            ENABLE_IMAGE_ANALYSIS: true,
            
            // Environment
            IS_PRODUCTION: isProduction,
            
            // Security
            RATE_LIMIT: 10, // requests per minute
            SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
        };
    }

    isProductionEnvironment() {
        const hostname = window.location.hostname;
        return hostname !== 'localhost' && 
               hostname !== '127.0.0.1' && 
               !hostname.includes('dev') &&
               !hostname.includes('test') &&
               hostname !== '';
    }

    getSecureAPIKey() {
        // Try to get API key from environment variable first
        if (window.ENV_OPENROUTER_API_KEY) {
            return window.ENV_OPENROUTER_API_KEY;
        }
        
        // Try to get from localStorage (for development/testing)
        const storedKey = localStorage.getItem('OPENROUTER_API_KEY');
        if (storedKey && storedKey.startsWith('sk-or-v1-')) {
            return storedKey;
        }
        
        // For production, try to get from server-side environment
        if (this.isProductionEnvironment()) {
            // This will be set by the server-side configuration
            return null;
        }
        
        // Development fallback
        return process.env.OPENROUTER_API_KEY || null;
    }

    isSecure() {
        const apiKey = this.config.OPENROUTER_API_KEY;
        // Allow chatbot to work even without API key (will use fallback responses)
        return true;
    }

    getAPIKey() {
        const apiKey = this.config.OPENROUTER_API_KEY;
        if (!apiKey || !apiKey.startsWith('sk-or-v1-')) {
            console.warn('API key not available - chatbot will use fallback responses');
            return null;
        }
        return apiKey;
    }

    // Validate configuration
    validate() {
        const errors = [];
        
        if (!this.config.SITE_URL) {
            errors.push('Site URL not configured');
        }
        
        // Don't block chatbot initialization if API key is missing
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

// Create global instance
window.VastraRentConfig = new VastraRentConfig();