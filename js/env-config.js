// Environment Configuration for VastraRent Chatbot
// This file sets environment variables for the chatbot to work

// Set the OpenRouter API key for development
window.ENV_OPENROUTER_API_KEY = "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";

// Alternative: Store in localStorage for development
if (typeof localStorage !== 'undefined') {
    localStorage.setItem('OPENROUTER_API_KEY', window.ENV_OPENROUTER_API_KEY);
}

console.log('Environment configuration loaded for VastraRent Chatbot');
