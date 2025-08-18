// VastraRent AI Chatbot
// Production-ready chatbot with OpenRouter AI integration

class VastraRentChatbot {
    constructor() {
        console.log('🔧 VastraRentChatbot constructor called');
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.rateLimitCount = 0;
        this.lastRateLimitReset = Date.now();
        
        this.init();
    }

    init() {
        console.log('🔧 Initializing chatbot...');
        this.createChatbotHTML();
        this.bindEvents();
        this.loadConversationHistory();
        this.showWelcomeMessage();
        console.log('🔧 Chatbot initialization complete');
    }

    createChatbotHTML() {
        console.log('🔧 Creating chatbot HTML...');
        const chatbotHTML = `
            <div class="chatbot-container" id="chatbot-container">
                <!-- Chatbot Toggle Button -->
                <button class="chatbot-toggle" id="chatbot-toggle" aria-label="Open chat assistant">
                    <i class="fas fa-comments"></i>
                    <div class="chatbot-notification" id="chatbot-notification" style="display: none;">1</div>
                </button>
                
                <!-- Chatbot Window -->
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
                        <div class="welcome-message">
                            <h3>👋 Welcome to Vastra Rent!</h3>
                            <p>I'm your intelligent fashion assistant, ready to help you find the perfect outfit for any occasion. Ask me about our collections, pricing, sizing, or anything else!</p>
                        </div>
                    </div>
                    
                    <div class="chatbot-input">
                        <input type="text" id="chatbot-input" placeholder="Ask me anything about fashion rentals..." maxlength="500" aria-label="Type your message">
                        <button id="chatbot-send" aria-label="Send message">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        console.log('🔧 Chatbot HTML added to page');
        
        // Verify the chatbot elements exist
        const container = document.getElementById('chatbot-container');
        const toggle = document.getElementById('chatbot-toggle');
        const window = document.getElementById('chatbot-window');
        
        console.log('🔧 Chatbot elements check:', {
            container: !!container,
            toggle: !!toggle,
            window: !!window
        });
        
        // Force the toggle button to be visible
        if (toggle) {
            toggle.style.display = 'flex';
            toggle.style.visibility = 'visible';
            toggle.style.opacity = '1';
            console.log('🔧 Toggle button forced visible');
        }
        
        // Add a test message to make sure the chatbot is working
        // Remove this entire debugging block:
        // setTimeout(() => {
        //     if (container) {
        //         container.style.border = '2px solid red';
        //         console.log('🔧 Chatbot container highlighted with red border for debugging');
        //     }
        // }, 1000);
    }

    bindEvents() {
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const input = document.getElementById('chatbot-input');
        const send = document.getElementById('chatbot-send');

        toggle.addEventListener('click', () => this.toggleChatbot());
        close.addEventListener('click', () => this.closeChatbot());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        input.addEventListener('input', (e) => {
            this.handleInputChange(e.target.value);
        });

        send.addEventListener('click', () => this.sendMessage());

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChatbot();
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.chatbot-container')) {
                this.closeChatbot();
            }
        });
    }

    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        this.isOpen = true;
        document.getElementById('chatbot-window').classList.add('active');
        document.getElementById('chatbot-input').focus();
        this.hideNotification();
    }

    closeChatbot() {
        this.isOpen = false;
        document.getElementById('chatbot-window').classList.remove('active');
    }

    showNotification() {
        const notification = document.getElementById('chatbot-notification');
        notification.style.display = 'flex';
    }

    hideNotification() {
        const notification = document.getElementById('chatbot-notification');
        notification.style.display = 'none';
    }

    async sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Check rate limit
        if (!this.checkRateLimit()) {
            this.addMessage('I\'m receiving too many messages right now. Please wait a moment and try again.', 'bot');
            return;
        }

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();

            // Add bot response
            this.addMessage(response.content, 'bot', response.quickReplies, response.suggestionCards);

        } catch (error) {
            console.error('Chatbot Error:', error);
            this.hideTypingIndicator();
            this.addMessage('I apologize, but I\'m having trouble processing your request right now. Please try again or contact our store directly at +91 9898471702.', 'bot');
        }
    }

    async getAIResponse(userMessage) {
        // Check if AI is available
        if (!window.VastraRentConfig || !window.VastraRentConfig.isSecure()) {
            return this.getFallbackResponse(userMessage);
        }

        try {
            const response = await this.callOpenRouterAPI(userMessage);
            return this.processAIResponse(response);
        } catch (error) {
            console.error('AI API Error:', error);
            return this.getFallbackResponse(userMessage);
        }
    }

    async callOpenRouterAPI(userMessage) {
        const config = window.VastraRentConfig.config;
        const apiKey = window.VastraRentConfig.getAPIKey();

        if (!apiKey) {
            throw new Error('API key not available');
        }

        const requestBody = {
            model: config.MODEL,
            messages: [
                {
                    role: 'system',
                    content: `You are Vastra Assistant, an intelligent fashion rental expert for Vastra Rent. You help customers find the perfect outfit for any occasion.

Your expertise includes:
- Fashion rental services and pricing
- Outfit recommendations for different occasions
- Sizing and fitting guidance
- Delivery and pickup options
- Booking and payment processes
- Quality assurance and brand information

Key information about Vastra Rent:
- Location: Vadodara, Gujarat, IN 390019
- Phone: +91 9898471702
- Email: project172305@gmail.com
- Hours: Monday - Sunday: 10:00 AM - 8:00 PM
- Rental prices: ₹600-3500 per day
- Security deposit: ₹2000-5000
- Free delivery within Vadodara city limits

Always be helpful, professional, and provide accurate information. If you don't know something specific, suggest contacting the store directly. Keep responses concise but informative.`
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            max_tokens: config.MAX_TOKENS,
            temperature: config.TEMPERATURE
        };

        const response = await fetch(config.OPENROUTER_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': config.SITE_URL,
                'X-Title': config.SITE_NAME,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        return await response.json();
    }

    processAIResponse(apiResponse) {
        if (!apiResponse.choices || apiResponse.choices.length === 0) {
            throw new Error('No response from AI model');
        }

        const content = apiResponse.choices[0].message.content;
        
        // Generate quick replies based on content
        const quickReplies = this.generateQuickReplies(content);

        return {
            content: content,
            quickReplies: quickReplies,
            usage: apiResponse.usage
        };
    }

    getFallbackResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        const data = window.VASTA_RENT_DATA;
        
        if (!data) {
            return this.getBasicFallbackResponse(userMessage);
        }
        
        // Greetings
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return {
                content: `Hello! 👋 Welcome to ${data.company.name}! I'm your fashion rental expert, ready to help you find the perfect outfit for any occasion. How can I assist you today?`,
                quickReplies: ['Show me collections', 'What are your prices?', 'Help me find my size', 'Tell me about delivery']
            };
        }
        
        // Pricing
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('rental')) {
            const specialOffers = Object.values(data.pricing.specialOffers).join(', ');
            return {
                content: `💰 Our rental prices range from ${data.pricing.rentalRange}. Security deposit: ${data.pricing.depositRange}.\n\nSpecial offers: ${specialOffers}\n\n${data.pricing.delivery.withinCity}`,
                quickReplies: ['Show me collections', 'Payment methods', 'Book consultation', 'Special offers']
            };
        }
        
        // Collections/Categories
        if (lowerMessage.includes('collection') || lowerMessage.includes('category') || lowerMessage.includes('outfit') || lowerMessage.includes('dress')) {
            const womenCategories = Object.keys(data.categories.women.subcategories).join(', ');
            const menCategories = Object.keys(data.categories.men.subcategories).join(', ');
            
            // Create suggestion cards for main categories
            const suggestionCards = [
                {
                    title: "Women's Collection",
                    description: "Elegant and stylish outfits for women",
                    image: "img/women-collection.jpg",
                    action: "show_category",
                    query: "Show me women's collection"
                },
                {
                    title: "Men's Collection",
                    description: "Sophisticated and stylish outfits for men",
                    image: "img/men-collection.jpg",
                    action: "show_category",
                    query: "Show me men's collection"
                }
            ];

            return {
                content: `👗 **Women's Collection**: ${womenCategories}\n\n👔 **Men's Collection**: ${menCategories}\n\nEach category has multiple styles and price ranges. What type of outfit are you looking for?`,
                quickReplies: ['Women\'s collection', 'Men\'s collection', 'Wedding outfits', 'Business wear'],
                suggestionCards: suggestionCards
            };
        }
        
        // Women's collection
        if (lowerMessage.includes('women') || lowerMessage.includes('ladies') || lowerMessage.includes('girl')) {
            const categories = data.categories.women.subcategories;
            let content = `👗 **Women's Collection**:\n\n`;
            Object.values(categories).forEach(cat => {
                content += `• **${cat.name}**: ${cat.description}\nPrice: ${cat.priceRange}\n\n`;
            });
            
            // Create suggestion cards for women's categories
            const suggestionCards = Object.values(categories).map(cat => ({
                title: cat.name,
                description: cat.description,
                price: cat.priceRange,
                image: `img/women/${cat.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
                action: "show_category",
                query: `Show me ${cat.name}`
            }));

            return {
                content: content,
                quickReplies: ['Anarkali suits', 'Lehnga collection', 'Gowns', 'Sharara suits'],
                suggestionCards: suggestionCards
            };
        }
        
        // Men's collection
        if (lowerMessage.includes('men') || lowerMessage.includes('gents') || lowerMessage.includes('boy')) {
            const categories = data.categories.men.subcategories;
            let content = `👔 **Men's Collection**:\n\n`;
            Object.values(categories).forEach(cat => {
                content += `• **${cat.name}**: ${cat.description}\nPrice: ${cat.priceRange}\n\n`;
            });
            
            // Create suggestion cards for men's categories
            const suggestionCards = Object.values(categories).map(cat => ({
                title: cat.name,
                description: cat.description,
                price: cat.priceRange,
                image: `img/men/${cat.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
                action: "show_category",
                query: `Show me ${cat.name}`
            }));

            return {
                content: content,
                quickReplies: ['Sherwani', 'Business suits', 'Jodhpuri suits', 'Blazers'],
                suggestionCards: suggestionCards
            };
        }
        
        // Size guide
        if (lowerMessage.includes('size') || lowerMessage.includes('fit') || lowerMessage.includes('measurement')) {
            return {
                content: `📏 **Size Guide**:\n\n**Women**: XS to XXL\n**Men**: S to XXXL\n\nWe offer free size consultations and alterations. All basic alterations are included in your rental!`,
                quickReplies: ['Book consultation', 'Size chart', 'Free alterations', 'Contact store']
            };
        }
        
        // Delivery
        if (lowerMessage.includes('delivery') || lowerMessage.includes('pickup') || lowerMessage.includes('address')) {
            return {
                content: `🚚 **Delivery & Pickup**:\n\n📍 Address: ${data.contact.address}\n📞 Phone: ${data.contact.phone}\n\n${data.pricing.delivery.withinCity}\n${data.pricing.delivery.sameDay}\n${data.pricing.delivery.express}`,
                quickReplies: ['Store location', 'Delivery charges', 'Book delivery', 'Contact store']
            };
        }
        
        // Payment methods
        if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card') || lowerMessage.includes('upi')) {
            const onlineMethods = Object.values(data.paymentMethods.online).join(', ');
            return {
                content: `💳 **Payment Methods**:\n\n**Online**: ${onlineMethods}\n**Offline**: Cash, Card, Bank Transfer\n\nAll payments are SSL encrypted and secure!`,
                quickReplies: ['Book now', 'Payment security', 'Contact store', 'Browse collection']
            };
        }
        
        // Occasions
        if (lowerMessage.includes('wedding') || lowerMessage.includes('party') || lowerMessage.includes('business') || lowerMessage.includes('festival')) {
            const occasions = data.occasions;
            let content = `🎉 **Perfect for Every Occasion**:\n\n`;
            Object.values(occasions).forEach(occasion => {
                content += `• **${occasion.name}**: ${occasion.description}\nRecommendations: ${occasion.recommendations.join(', ')}\nPrice: ${occasion.priceRange}\n\n`;
            });
            return {
                content: content,
                quickReplies: ['Wedding outfits', 'Party wear', 'Business attire', 'Festival collection']
            };
        }
        
        // Services
        if (lowerMessage.includes('service') || lowerMessage.includes('alteration') || lowerMessage.includes('consultation') || lowerMessage.includes('cleaning')) {
            const services = data.services;
            let content = `✨ **Our Services**:\n\n`;
            Object.values(services).forEach(service => {
                content += `• **${service.name}**: ${service.description}\n\n`;
            });
            return {
                content: content,
                quickReplies: ['Free alterations', 'Style consultation', 'Professional cleaning', 'Book service']
            };
        }
        
        // About us
        if (lowerMessage.includes('about') || lowerMessage.includes('company') || lowerMessage.includes('story')) {
            const teamMembers = Object.values(data.team);
            const suggestionCards = teamMembers.map(member => ({
                title: member.name,
                description: member.title,
                image: member.image,
                action: 'show_team',
                query: `Tell me about ${member.name}`
            }));

            return {
                content: `🏢 **About ${data.company.name}**:\n\n${data.company.description}\n\n**Mission**: ${data.company.mission}\n**Vision**: ${data.company.vision}\n\n**Contact**: ${data.contact.phone} | ${data.contact.email}`,
                quickReplies: ['Our team', 'Awards', 'Testimonials', 'Contact us'],
                suggestionCards: suggestionCards
            };
        }
        
        // Team members
        if (lowerMessage.includes('team') || lowerMessage.includes('founder') || lowerMessage.includes('ceo') || lowerMessage.includes('cfo') || lowerMessage.includes('cto')) {
            const teamMembers = Object.values(data.team);
            const suggestionCards = teamMembers.map(member => ({
                title: member.name,
                description: member.title,
                image: member.image,
                action: 'show_team',
                query: `Tell me about ${member.name}`
            }));

            return {
                content: `👥 **Our Team**:\n\nMeet the amazing people behind ${data.company.name}! Click on any team member to learn more about them.`,
                quickReplies: ['About company', 'Contact us', 'Our services', 'Browse collection'],
                suggestionCards: suggestionCards
            };
        }

        // Individual team member queries
        const teamMembers = Object.values(data.team);
        for (const member of teamMembers) {
            if (lowerMessage.includes(member.name.toLowerCase()) || lowerMessage.includes(member.title.toLowerCase())) {
                return {
                    content: `👤 **${member.name}**\n\n**Position**: ${member.title}\n\n**About**: ${member.description}\n\n**Contact**: ${data.contact.phone}`,
                    quickReplies: ['Other team members', 'About company', 'Contact us', 'Our services']
                };
            }
        }

        // Contact
        if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('hours')) {
            return {
                content: `📞 **Contact Information**:\n\n📱 Phone: ${data.contact.phone}\n📧 Email: ${data.contact.email}\n📍 Address: ${data.contact.address}\n🕒 Hours: ${data.contact.workingHours}`,
                quickReplies: ['Call now', 'Send email', 'Visit store', 'Book consultation']
            };
        }
        
        // Default response
        return {
            content: `Thank you for your message! I'm here to help with your fashion rental needs. For specific questions, please contact our store directly at ${data.contact.phone} or visit us in ${data.contact.address}.`,
            quickReplies: ['Contact store', 'Browse collection', 'Book consultation', 'Store location']
        };
    }

    getBasicFallbackResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return {
                content: 'Hello! 👋 I\'m here to help you with your fashion rental needs. How can I assist you today?',
                quickReplies: ['Show me collections', 'What are your prices?', 'Help me find my size', 'Tell me about delivery']
            };
        }
        
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
            return {
                content: '💰 Our rental prices start from ₹600 per day and go up to ₹3500 for premium designer pieces. The exact price depends on the outfit type, designer, and rental duration. Would you like to know more about our pricing structure?',
                quickReplies: ['Show me collections', 'Pricing details', 'Book consultation', 'Contact store']
            };
        }
        
        return {
            content: 'Thank you for your message! I\'m here to help with your fashion rental needs. For specific questions, please contact our store directly at +91 9898471702 or visit us in Vadodara.',
            quickReplies: ['Contact store', 'Browse collection', 'Book consultation', 'Store location']
        };
    }

    generateQuickReplies(content) {
        const lowerContent = content.toLowerCase();
        const replies = [];
        
        if (lowerContent.includes('collection') || lowerContent.includes('outfit')) {
            replies.push('Show me collections');
        }
        
        if (lowerContent.includes('price') || lowerContent.includes('cost')) {
            replies.push('Pricing details');
        }
        
        if (lowerContent.includes('size') || lowerContent.includes('fit')) {
            replies.push('Size guide');
        }
        
        if (lowerContent.includes('delivery') || lowerContent.includes('pickup')) {
            replies.push('Delivery info');
        }
        
        if (replies.length === 0) {
            replies.push('Contact store', 'Browse collection', 'Book consultation');
        }
        
        return replies.slice(0, 3); // Limit to 3 replies
    }

    addMessage(text, sender, quickReplies = [], suggestionCards = []) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = this.formatMessage(text);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        // Add suggestion cards if provided
        if (suggestionCards && suggestionCards.length > 0) {
            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'suggestion-cards';
            suggestionCards.forEach(card => {
                const cardElement = this.createSuggestionCard(card);
                cardsContainer.appendChild(cardElement);
            });
            messageDiv.appendChild(cardsContainer);
        }

        // Add quick replies if provided
        if (quickReplies && quickReplies.length > 0) {
            const quickRepliesDiv = document.createElement('div');
            quickRepliesDiv.className = 'quick-replies';
            quickReplies.forEach(reply => {
                const button = document.createElement('button');
                button.className = 'quick-reply';
                button.textContent = reply;
                button.addEventListener('click', () => {
                    document.getElementById('chatbot-input').value = reply;
                    this.sendMessage();
                });
                quickRepliesDiv.appendChild(button);
            });
            messageDiv.appendChild(quickRepliesDiv);
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Store message in history
        this.messages.push({ text, sender, timestamp: new Date() });
        this.saveConversationHistory();
    }

    createSuggestionCard(cardData) {
        const card = document.createElement('div');
        card.className = 'suggestion-card';
        
        if (cardData.image) {
            const image = document.createElement('img');
            image.src = cardData.image;
            image.alt = cardData.title;
            image.className = 'suggestion-card-image';
            card.appendChild(image);
        }
        
        const content = document.createElement('div');
        content.className = 'suggestion-card-content';
        
        const title = document.createElement('h4');
        title.textContent = cardData.title;
        content.appendChild(title);
        
        if (cardData.description) {
            const description = document.createElement('p');
            description.textContent = cardData.description;
            content.appendChild(description);
        }
        
        if (cardData.price) {
            const price = document.createElement('div');
            price.className = 'suggestion-card-price';
            price.textContent = cardData.price;
            content.appendChild(price);
        }
        
        card.appendChild(content);
        
        // Add click handler
        card.addEventListener('click', () => {
            if (cardData.action) {
                this.handleCardAction(cardData.action, cardData);
            }
        });
        
        return card;
    }

    handleCardAction(action, cardData) {
        switch (action) {
            case 'show_category':
                this.addMessage(`Show me ${cardData.title} collection`, 'user');
                this.sendMessage();
                break;
            case 'show_team':
                this.addMessage(`Tell me about ${cardData.title}`, 'user');
                this.sendMessage();
                break;
            case 'show_occasion':
                this.addMessage(`Show me outfits for ${cardData.title}`, 'user');
                this.sendMessage();
                break;
            default:
                if (cardData.query) {
                    this.addMessage(cardData.query, 'user');
                    this.sendMessage();
                }
        }
    }

    formatMessage(text) {
        // Convert URLs to clickable links
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        // Convert line breaks to <br> tags
        text = text.replace(/\n/g, '<br>');
        
        // Highlight important terms
        const highlightTerms = ['₹', 'discount', 'offer', 'sale', 'free', 'delivery', 'deposit', 'rental'];
        highlightTerms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            text = text.replace(regex, '<strong>$1</strong>');
        });

        return text;
    }

    showTypingIndicator() {
        this.isTyping = true;
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-indicator-message';
        typingDiv.id = 'typing-indicator';

        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    handleInputChange(value) {
        const sendButton = document.getElementById('chatbot-send');
        if (value.trim().length > 0) {
            sendButton.style.opacity = '1';
            sendButton.style.pointerEvents = 'auto';
        } else {
            sendButton.style.opacity = '0.5';
            sendButton.style.pointerEvents = 'none';
        }
    }

    checkRateLimit() {
        const now = Date.now();
        const config = window.VastraRentConfig?.config;
        
        if (!config) return true; // No rate limiting if config not available
        
        // Reset rate limit counter every minute
        if (now - this.lastRateLimitReset > 60000) {
            this.rateLimitCount = 0;
            this.lastRateLimitReset = now;
        }
        
        if (this.rateLimitCount >= config.RATE_LIMIT) {
            return false;
        }
        
        this.rateLimitCount++;
        return true;
    }

    showWelcomeMessage() {
        const lastInteraction = localStorage.getItem('chatbot_last_interaction');
        const now = new Date().getTime();
        
        if (!lastInteraction || (now - parseInt(lastInteraction)) > 24 * 60 * 60 * 1000) {
            setTimeout(() => {
                this.showNotification();
            }, 5000);
        }
    }

    loadConversationHistory() {
        const saved = localStorage.getItem('chatbot_conversation');
        if (saved) {
            this.messages = JSON.parse(saved);
        }
    }

    saveConversationHistory() {
        localStorage.setItem('chatbot_conversation', JSON.stringify(this.messages));
        localStorage.setItem('chatbot_last_interaction', new Date().getTime().toString());
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 DOM Content Loaded - Checking chatbot initialization...');
    
    // Check if config is loaded
    if (window.VastraRentConfig) {
        console.log('🔧 VastraRentConfig found:', window.VastraRentConfig);
        
        // Validate configuration
        const validation = window.VastraRentConfig.validate();
        if (!validation.isValid) {
            console.warn('Chatbot configuration issues:', validation.errors);
        }
        
        // Initialize chatbot
        if (!window.vastraChatbot) {
            console.log('🔧 Creating new chatbot instance...');
            window.vastraChatbot = new VastraRentChatbot();
        } else {
            console.log('🔧 Chatbot already exists:', window.vastraChatbot);
        }
    } else {
        console.error('❌ VastraRent Config not loaded. Please include config.js before chatbot.js');
    }
    
    // Additional debugging
    console.log('🔧 Available global objects:', {
        VastraRentConfig: !!window.VastraRentConfig,
        vastraChatbot: !!window.vastraChatbot,
        documentBody: !!document.body
    });
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VastraRentChatbot;
}

// Fallback initialization - in case DOMContentLoaded doesn't fire
setTimeout(() => {
    if (!window.vastraChatbot && document.body) {
        console.log('🔧 Fallback chatbot initialization...');
        if (window.VastraRentConfig) {
            window.vastraChatbot = new VastraRentChatbot();
        } else {
            console.error('❌ Fallback failed - VastraRentConfig not available');
        }
    }
}, 1000);

// Global function to manually initialize chatbot
window.initVastraChatbot = function() {
    console.log('🔧 Manual chatbot initialization...');
    if (!window.vastraChatbot && window.VastraRentConfig) {
        window.vastraChatbot = new VastraRentChatbot();
        return true;
    }
    return false;
};

// Global function to test chatbot visibility
window.testChatbotVisibility = function() {
    console.log('🧪 Testing chatbot visibility...');
    
    const container = document.getElementById('chatbot-container');
    const toggle = document.getElementById('chatbot-toggle');
    const window = document.getElementById('chatbot-window');
    
    console.log('Chatbot elements:', {
        container: container,
        toggle: toggle,
        window: window
    });
    
    if (container) {
        console.log('Container styles:', {
            display: container.style.display,
            visibility: container.style.visibility,
            opacity: container.style.opacity,
            position: container.style.position,
            zIndex: container.style.zIndex
        });
    }
    
    if (toggle) {
        console.log('Toggle button styles:', {
            display: toggle.style.display,
            visibility: toggle.style.visibility,
            opacity: toggle.style.opacity
        });
    }
    
    return {
        container: !!container,
        toggle: !!toggle,
        window: !!window
    };
};

// Global function to force show chatbot
window.forceShowChatbot = function() {
    console.log('🔧 Forcing chatbot to show...');
    
    const container = document.getElementById('chatbot-container');
    const toggle = document.getElementById('chatbot-toggle');
    
    if (container) {
        container.style.display = 'block';
        container.style.visibility = 'visible';
        container.style.opacity = '1';
        container.style.border = '3px solid green';
        console.log('✅ Container forced visible');
    }
    
    if (toggle) {
        toggle.style.display = 'flex';
        toggle.style.visibility = 'visible';
        toggle.style.opacity = '1';
        toggle.style.border = '3px solid green';
        console.log('✅ Toggle button forced visible');
    }
    
    return 'Chatbot visibility forced on. Check the page for a green-bordered chatbot.';
};