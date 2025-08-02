// Vastra Rent Chatbot - Easy Website Integration Script
// Simply include this script in your website to add the chatbot widget

(function() {
    'use strict';
    
    // Configuration
    const CHATBOT_CONFIG = {
        apiKey: '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',
        apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
        position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
        theme: 'default', // default, dark, custom
        autoOpen: false,
        showNotification: true,
        notificationDelay: 5000
    };

    // Check if chatbot is already loaded
    if (window.VastraRentChatbotLoaded) {
        return;
    }
    window.VastraRentChatbotLoaded = true;

    // Create and inject CSS
    function injectCSS() {
        const css = `
        /* Vastra Rent Chatbot Widget Styles */
        #vastra-chatbot-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .vastra-chat-toggle {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            border: 3px solid rgba(255, 255, 255, 0.2);
            position: relative;
        }

        .vastra-chat-toggle:hover {
            transform: scale(1.1) translateY(-2px);
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
        }

        .vastra-chat-toggle.active {
            background: linear-gradient(135deg, #D76D77, #3A1C71);
        }

        .vastra-chat-icon {
            color: white;
            font-size: 24px;
            transition: all 0.3s ease;
        }

        .vastra-notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            background: #ef4444;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: 600;
            border: 3px solid white;
            animation: vastra-pulse 2s infinite;
        }

        .vastra-notification-badge.show {
            display: flex;
        }

        @keyframes vastra-pulse {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            }
            50% {
                transform: scale(1.1);
                box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
            }
        }

        .vastra-chat-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 380px;
            height: 600px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            display: none;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0.8) translateY(20px);
            opacity: 0;
            transition: all 0.3s ease;
            border: 1px solid #e2e8f0;
        }

        .vastra-chat-window.open {
            display: flex;
            transform: scale(1) translateY(0);
            opacity: 1;
        }

        .vastra-chat-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .vastra-bot-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .vastra-bot-avatar {
            width: 36px;
            height: 36px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .vastra-bot-details h4 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }

        .vastra-bot-details p {
            margin: 2px 0 0;
            font-size: 11px;
            opacity: 0.8;
        }

        .vastra-close-btn {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .vastra-close-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .vastra-chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%);
        }

        .vastra-message {
            display: flex;
            margin-bottom: 16px;
            animation: vastra-slide-in 0.3s ease;
        }

        @keyframes vastra-slide-in {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .vastra-message.user {
            justify-content: flex-end;
        }

        .vastra-message-content {
            max-width: 75%;
            background: white;
            border-radius: 12px;
            padding: 12px 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
        }

        .vastra-message.user .vastra-message-content {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .vastra-message-header {
            font-size: 11px;
            font-weight: 600;
            margin-bottom: 4px;
            opacity: 0.7;
        }

        .vastra-message-text {
            font-size: 13px;
            line-height: 1.5;
        }

        .vastra-chat-input {
            padding: 16px 20px;
            background: white;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .vastra-input-field {
            flex: 1;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 10px 16px;
            font-size: 13px;
            outline: none;
            transition: all 0.3s ease;
            background: #f8fafc;
        }

        .vastra-input-field:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            background: white;
        }

        .vastra-send-btn {
            width: 36px;
            height: 36px;
            border: none;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .vastra-send-btn:hover:not(:disabled) {
            transform: scale(1.1);
        }

        .vastra-send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .vastra-typing {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            margin-bottom: 16px;
            border: 1px solid #e2e8f0;
        }

        .vastra-typing-dots {
            display: flex;
            gap: 2px;
        }

        .vastra-typing-dot {
            width: 4px;
            height: 4px;
            background: #667eea;
            border-radius: 50%;
            animation: vastra-typing 1.4s infinite ease-in-out;
        }

        .vastra-typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .vastra-typing-dot:nth-child(2) { animation-delay: -0.16s; }
        .vastra-typing-dot:nth-child(3) { animation-delay: 0s; }

        @keyframes vastra-typing {
            0%, 80%, 100% {
                transform: scale(0.8);
                opacity: 0.5;
            }
            40% {
                transform: scale(1.2);
                opacity: 1;
            }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            #vastra-chatbot-widget {
                bottom: 15px;
                right: 15px;
            }
            
            .vastra-chat-window {
                width: calc(100vw - 30px);
                height: calc(100vh - 100px);
                right: -15px;
                bottom: 70px;
            }
        }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Create chatbot HTML
    function createChatbotHTML() {
        return `
            <div class="vastra-chat-toggle" onclick="VastraRentChatbot.toggle()">
                <i class="vastra-chat-icon">💬</i>
                <div class="vastra-notification-badge" id="vastra-notification">1</div>
            </div>
            
            <div class="vastra-chat-window" id="vastra-chat-window">
                <div class="vastra-chat-header">
                    <div class="vastra-bot-info">
                        <div class="vastra-bot-avatar">🤖</div>
                        <div class="vastra-bot-details">
                            <h4>Vastra Rent AI</h4>
                            <p>Powered by Dolphin Mistral AI</p>
                        </div>
                    </div>
                    <button class="vastra-close-btn" onclick="VastraRentChatbot.close()">×</button>
                </div>
                
                <div class="vastra-chat-messages" id="vastra-messages">
                    <div class="vastra-message">
                        <div class="vastra-message-content">
                            <div class="vastra-message-header">Vastra Rent AI</div>
                            <div class="vastra-message-text">
                                👋 Hello! I'm your AI fashion consultant powered by Dolphin Mistral AI. 
                                
                                I have complete knowledge of our designer collection, pricing, and services. What can I help you find today?
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="vastra-chat-input">
                    <input type="text" class="vastra-input-field" id="vastra-input" 
                           placeholder="Ask about our collection, pricing, or styling advice..." 
                           maxlength="500">
                    <button class="vastra-send-btn" id="vastra-send" onclick="VastraRentChatbot.sendMessage()" disabled>
                        ➤
                    </button>
                </div>
            </div>
        `;
    }

    // Chatbot functionality
    class VastraRentChatbotEmbed {
        constructor() {
            this.isOpen = false;
            this.isTyping = false;
            this.messages = [];
            this.init();
        }

        init() {
            this.addSystemMessage();
            this.setupEventListeners();
            this.showNotificationAfterDelay();
        }

        addSystemMessage() {
            this.messages.push({
                role: 'system',
                content: `You are Vastra Rent AI Assistant, powered by Dolphin Mistral AI. You are an expert fashion consultant for Vastra Rent, India's premier fashion rental platform.

COMPLETE BUSINESS DATA:
- Designer Collection: Sabyasachi, Manish Malhotra, Tarun Tahiliani, etc.
- Pricing: ₹500-15,000+ for 3-day rentals
- Categories: Evening gowns, ethnic wear, formal suits, accessories
- Locations: Mumbai, Delhi, Bangalore, Pune, Hyderabad
- Services: Free delivery/pickup, professional cleaning, alterations
- Sizes: XS-XXXL for women, S-XXXXL for men

Be helpful, enthusiastic, and provide specific recommendations with prices when possible.`
            });
        }

        setupEventListeners() {
            const input = document.getElementById('vastra-input');
            const sendBtn = document.getElementById('vastra-send');

            if (input) {
                input.addEventListener('input', () => this.updateSendButton());
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.sendMessage();
                    }
                });
            }
        }

        updateSendButton() {
            const input = document.getElementById('vastra-input');
            const sendBtn = document.getElementById('vastra-send');
            
            if (input && sendBtn) {
                sendBtn.disabled = !input.value.trim() || this.isTyping;
            }
        }

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        open() {
            this.isOpen = true;
            const chatWindow = document.getElementById('vastra-chat-window');
            const toggle = document.querySelector('.vastra-chat-toggle');
            const notification = document.getElementById('vastra-notification');
            
            if (chatWindow) chatWindow.classList.add('open');
            if (toggle) toggle.classList.add('active');
            if (notification) notification.classList.remove('show');
            
            setTimeout(() => {
                const input = document.getElementById('vastra-input');
                if (input) input.focus();
            }, 300);
        }

        close() {
            this.isOpen = false;
            const chatWindow = document.getElementById('vastra-chat-window');
            const toggle = document.querySelector('.vastra-chat-toggle');
            
            if (chatWindow) chatWindow.classList.remove('open');
            if (toggle) toggle.classList.remove('active');
        }

        async sendMessage() {
            const input = document.getElementById('vastra-input');
            if (!input || this.isTyping) return;

            const message = input.value.trim();
            if (!message) return;

            input.value = '';
            this.updateSendButton();

            this.addUserMessage(message);
            this.messages.push({ role: 'user', content: message });

            this.showTyping();

            try {
                const response = await fetch(CHATBOT_CONFIG.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${CHATBOT_CONFIG.apiKey}`,
                        'HTTP-Referer': window.location.origin,
                        'X-Title': 'Vastra Rent AI Assistant'
                    },
                    body: JSON.stringify({
                        model: CHATBOT_CONFIG.model,
                        messages: this.messages,
                        max_tokens: 1500,
                        temperature: 0.7,
                        frequency_penalty: 0.1,
                        presence_penalty: 0.1
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const aiMessage = data.choices[0].message.content;
                    
                    this.messages.push({ role: 'assistant', content: aiMessage });
                    this.hideTyping();
                    this.addBotMessage(aiMessage);
                } else {
                    throw new Error('API Error');
                }
            } catch (error) {
                this.hideTyping();
                this.addBotMessage("I'm having trouble connecting right now. Please try again or call us at +91-9876543210 for immediate assistance!");
            }

            const inputField = document.getElementById('vastra-input');
            if (inputField) inputField.focus();
        }

        addUserMessage(message) {
            const messagesContainer = document.getElementById('vastra-messages');
            if (!messagesContainer) return;

            const messageDiv = document.createElement('div');
            messageDiv.className = 'vastra-message user';
            messageDiv.innerHTML = `
                <div class="vastra-message-content">
                    <div class="vastra-message-header">You</div>
                    <div class="vastra-message-text">${this.escapeHtml(message)}</div>
                </div>
            `;

            messagesContainer.appendChild(messageDiv);
            this.scrollToBottom();
        }

        addBotMessage(message) {
            const messagesContainer = document.getElementById('vastra-messages');
            if (!messagesContainer) return;

            const messageDiv = document.createElement('div');
            messageDiv.className = 'vastra-message';
            messageDiv.innerHTML = `
                <div class="vastra-message-content">
                    <div class="vastra-message-header">Vastra Rent AI</div>
                    <div class="vastra-message-text">${this.formatMessage(message)}</div>
                </div>
            `;

            messagesContainer.appendChild(messageDiv);
            this.scrollToBottom();
        }

        showTyping() {
            this.isTyping = true;
            const messagesContainer = document.getElementById('vastra-messages');
            if (!messagesContainer) return;

            const typingDiv = document.createElement('div');
            typingDiv.id = 'vastra-typing-indicator';
            typingDiv.className = 'vastra-typing';
            typingDiv.innerHTML = `
                <div>AI is thinking</div>
                <div class="vastra-typing-dots">
                    <div class="vastra-typing-dot"></div>
                    <div class="vastra-typing-dot"></div>
                    <div class="vastra-typing-dot"></div>
                </div>
            `;

            messagesContainer.appendChild(typingDiv);
            this.scrollToBottom();
            this.updateSendButton();
        }

        hideTyping() {
            this.isTyping = false;
            const typingIndicator = document.getElementById('vastra-typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            this.updateSendButton();
        }

        scrollToBottom() {
            const messagesContainer = document.getElementById('vastra-messages');
            if (messagesContainer) {
                setTimeout(() => {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }, 100);
            }
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        formatMessage(message) {
            let formatted = this.escapeHtml(message);
            formatted = formatted.replace(/\n/g, '<br>');
            formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            formatted = formatted.replace(/₹(\d+(?:,\d+)*)/g, '<span style="color: #10b981; font-weight: 600;">₹$1</span>');
            return formatted;
        }

        showNotificationAfterDelay() {
            if (CHATBOT_CONFIG.showNotification) {
                setTimeout(() => {
                    const notification = document.getElementById('vastra-notification');
                    if (notification && !this.isOpen) {
                        notification.classList.add('show');
                    }
                }, CHATBOT_CONFIG.notificationDelay);
            }
        }
    }

    // Initialize when DOM is ready
    function initializeChatbot() {
        // Inject CSS
        injectCSS();

        // Create widget container
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'vastra-chatbot-widget';
        widgetContainer.innerHTML = createChatbotHTML();
        document.body.appendChild(widgetContainer);

        // Initialize chatbot
        const chatbot = new VastraRentChatbotEmbed();

        // Expose global API
        window.VastraRentChatbot = {
            open: () => chatbot.open(),
            close: () => chatbot.close(),
            toggle: () => chatbot.toggle(),
            sendMessage: () => chatbot.sendMessage(),
            isOpen: () => chatbot.isOpen
        };

        console.log('Vastra Rent Chatbot loaded successfully!');
    }

    // Load when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChatbot);
    } else {
        initializeChatbot();
    }

})();