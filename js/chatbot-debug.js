// Chatbot Debug Script for Home Page
// This script helps debug chatbot loading issues

console.log('🔧 Chatbot debug script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 DOM Content Loaded - checking chatbot status');
    
    // Check if chatbot elements exist
    setTimeout(() => {
        const container = document.getElementById('chatbot-container');
        const toggle = document.getElementById('chatbot-toggle');
        const window = document.getElementById('chatbot-window');
        
        console.log('🔧 Chatbot elements found:', {
            container: !!container,
            toggle: !!toggle,
            window: !!window
        });
        
        if (container) {
            console.log('✅ Chatbot container found');
            console.log('Container styles:', {
                display: getComputedStyle(container).display,
                visibility: getComputedStyle(container).visibility,
                opacity: getComputedStyle(container).opacity,
                position: getComputedStyle(container).position,
                zIndex: getComputedStyle(container).zIndex
            });
        } else {
            console.error('❌ Chatbot container not found');
        }
        
        if (toggle) {
            console.log('✅ Chatbot toggle button found');
            console.log('Toggle button styles:', {
                display: getComputedStyle(toggle).display,
                visibility: getComputedStyle(toggle).visibility,
                opacity: getComputedStyle(toggle).opacity
            });
        } else {
            console.error('❌ Chatbot toggle button not found');
        }
        
        // Check if chatbot instance exists
        if (window.vastraChatbot) {
            console.log('✅ VastraRentChatbot instance found');
        } else {
            console.error('❌ VastraRentChatbot instance not found');
        }
        
        // Check if config exists
        if (window.VastraRentConfig) {
            console.log('✅ VastraRentConfig found');
        } else {
            console.error('❌ VastraRentConfig not found');
        }
        
    }, 2000);
    
    // Test manual initialization
    setTimeout(() => {
        console.log('🔧 Testing manual chatbot initialization...');
        if (window.initVastraChatbot) {
            const result = window.initVastraChatbot();
            console.log('Manual initialization result:', result);
        } else {
            console.error('❌ initVastraChatbot function not found');
        }
    }, 3000);
});

// Global debug functions
window.debugChatbot = function() {
    console.log('🧪 Debugging chatbot...');
    
    // Check all global objects
    console.log('Global objects:', {
        VastraRentConfig: window.VastraRentConfig,
        vastraChatbot: window.vastraChatbot,
        initVastraChatbot: window.initVastraChatbot,
        testChatbotVisibility: window.testChatbotVisibility,
        forceShowChatbot: window.forceShowChatbot
    });
    
    // Check DOM elements
    const container = document.getElementById('chatbot-container');
    const toggle = document.getElementById('chatbot-toggle');
    const window = document.getElementById('chatbot-window');
    
    console.log('DOM elements:', {
        container: container,
        toggle: toggle,
        window: window
    });
    
    // Try to force show chatbot
    if (window.forceShowChatbot) {
        const result = window.forceShowChatbot();
        console.log('Force show result:', result);
    }
    
    return 'Debug complete - check console for details';
};

console.log('🔧 Chatbot debug script ready - use window.debugChatbot() to debug');
