// Chatbot Visibility Fix
// Ensures chatbot appears on all pages with fallback styles

(function() {
    'use strict';
    
    // Add fallback CSS if variables aren't loaded
    function addFallbackStyles() {
        const fallbackCSS = `
            .chatbot-container {
                position: fixed !important;
                bottom: 30px !important;
                right: 30px !important;
                z-index: 9999 !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            .chatbot-toggle {
                width: 65px !important;
                height: 65px !important;
                border-radius: 50% !important;
                background: linear-gradient(135deg, #D76D77 0%, #3A1C71 100%) !important;
                border: none !important;
                cursor: pointer !important;
                box-shadow: 0 5px 15px rgba(58, 28, 113, 0.25) !important;
                transition: all 0.3s ease !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
            
            .chatbot-toggle:hover {
                transform: translateY(-3px) scale(1.05) !important;
                box-shadow: 0 8px 25px rgba(58, 28, 113, 0.4) !important;
            }
            
            .chatbot-toggle i {
                color: white !important;
                font-size: 26px !important;
                transition: transform 0.3s ease !important;
            }
            
            .chatbot-window {
                position: absolute !important;
                bottom: 85px !important;
                right: 0 !important;
                width: 400px !important;
                height: 550px !important;
                background: white !important;
                border-radius: 20px !important;
                box-shadow: 0 20px 60px rgba(58, 28, 113, 0.2) !important;
                display: none !important;
                flex-direction: column !important;
                overflow: hidden !important;
                border: 1px solid rgba(58, 28, 113, 0.1) !important;
            }
            
            .chatbot-window.active {
                display: flex !important;
            }
            
            .chatbot-header {
                background: linear-gradient(135deg, #D76D77 0%, #3A1C71 100%) !important;
                color: white !important;
                padding: 20px 25px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
            }
            
            .chatbot-messages {
                flex: 1 !important;
                padding: 25px !important;
                overflow-y: auto !important;
                background: #F8E8EA !important;
            }
            
            .chatbot-input {
                padding: 25px !important;
                background: white !important;
                border-top: 1px solid rgba(58, 28, 113, 0.1) !important;
                display: flex !important;
                align-items: center !important;
                gap: 15px !important;
            }
            
            .chatbot-input input {
                flex: 1 !important;
                border: 2px solid rgba(58, 28, 113, 0.1) !important;
                border-radius: 25px !important;
                padding: 15px 20px !important;
                font-size: 14px !important;
                outline: none !important;
            }
            
            .chatbot-input button {
                width: 45px !important;
                height: 45px !important;
                border-radius: 50% !important;
                background: linear-gradient(135deg, #D76D77 0%, #3A1C71 100%) !important;
                border: none !important;
                color: white !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = fallbackCSS;
        document.head.appendChild(style);
    }
    
    // Force chatbot initialization
    function forceChatbotInit() {
        // Add fallback styles first
        addFallbackStyles();
        
        // Wait for DOM and then initialize
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initChatbot);
        } else {
            initChatbot();
        }
    }
    
    function initChatbot() {
        // Check if chatbot already exists
        if (document.getElementById('chatbot-container')) {
            console.log('✅ Chatbot already exists');
            return;
        }
        
        // Try to initialize with existing code
        if (window.VastraRentChatbot && !window.vastraChatbot) {
            try {
                window.vastraChatbot = new VastraRentChatbot();
                console.log('✅ Chatbot initialized successfully');
                return;
            } catch (error) {
                console.warn('⚠️ Standard chatbot init failed, using fallback:', error);
            }
        }
        
        // Fallback: Create simple chatbot manually
        createFallbackChatbot();
    }
    
    function createFallbackChatbot() {
        const chatbotHTML = `
            <div class="chatbot-container" id="chatbot-container">
                <button class="chatbot-toggle" id="chatbot-toggle" aria-label="Open chat assistant">
                    <i class="fas fa-comments"></i>
                </button>
                
                <div class="chatbot-window" id="chatbot-window">
                    <div class="chatbot-header">
                        <div class="chatbot-header-content">
                            <div class="chatbot-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="chatbot-info">
                                <h3>Vastra Assistant</h3>
                                <p>Your fashion rental expert</p>
                            </div>
                        </div>
                        <button class="chatbot-close" id="chatbot-close" aria-label="Close chat">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="chatbot-messages" id="chatbot-messages">
                        <div class="welcome-message" style="text-align: center; padding: 30px 20px; background: white; border-radius: 15px; margin-bottom: 20px;">
                            <h3 style="margin: 0 0 10px 0; color: #3A1C71;">👋 Welcome to Vastra Rent!</h3>
                            <p style="margin: 0; font-size: 14px;">I'm your fashion assistant! Ask me about our collections, pricing, or anything else.</p>
                        </div>
                    </div>
                    
                    <div class="chatbot-input">
                        <input type="text" id="chatbot-input" placeholder="Ask me anything about fashion rentals..." maxlength="500">
                        <button id="chatbot-send" aria-label="Send message">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        
        // Add basic functionality
        const toggle = document.getElementById('chatbot-toggle');
        const window = document.getElementById('chatbot-window');
        const close = document.getElementById('chatbot-close');
        const input = document.getElementById('chatbot-input');
        const send = document.getElementById('chatbot-send');
        const messages = document.getElementById('chatbot-messages');
        
        if (toggle && window) {
            toggle.addEventListener('click', () => {
                window.classList.toggle('active');
            });
        }
        
        if (close && window) {
            close.addEventListener('click', () => {
                window.classList.remove('active');
            });
        }
        
        // Simple message handling
        function addMessage(text, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                margin-bottom: 15px;
                padding: 12px 18px;
                border-radius: 15px;
                max-width: 80%;
                ${isUser ? 
                    'background: linear-gradient(135deg, #D76D77, #3A1C71); color: white; margin-left: auto; text-align: right;' : 
                    'background: white; color: #3A1C71; border: 1px solid rgba(58, 28, 113, 0.1);'
                }
            `;
            messageDiv.textContent = text;
            messages.appendChild(messageDiv);
            messages.scrollTop = messages.scrollHeight;
        }
        
        function handleSend() {
            const message = input.value.trim();
            if (!message) return;
            
            addMessage(message, true);
            input.value = '';
            
            // Simple responses
            setTimeout(() => {
                const responses = [
                    "Thanks for your message! I'm here to help with your fashion rental needs.",
                    "Great question! Our collection includes traditional and modern outfits for all occasions.",
                    "I'd be happy to help you find the perfect outfit. What occasion are you shopping for?",
                    "Our rental prices are very competitive and we offer flexible rental periods.",
                    "You can browse our full inventory on the Inventory page or try our 'Perfect for You' feature!"
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse);
            }, 1000);
        }
        
        if (send) {
            send.addEventListener('click', handleSend);
        }
        
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSend();
                }
            });
        }
        
        console.log('✅ Fallback chatbot created successfully');
    }
    
    // Start the fix
    forceChatbotInit();
})();