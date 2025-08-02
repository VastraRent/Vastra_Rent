// Vastra Rent Chatbot Widget - Completely Rewritten for Reliability
class VastraRentChatbot {
    constructor() {
        // API Configuration
        this.apiKey = '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';
        this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        this.model = 'google/gemini-2.5-flash-lite';
        this.fallbackModel = 'cognitivecomputations/dolphin-mistral-7b:free';

        // State Management
        this.isOpen = false;
        this.isMinimized = false;
        this.isTyping = false;
        this.isConnected = false;
        this.messages = [];
        this.conversationHistory = [];

        // Configuration
        this.maxRetries = 3;
        this.requestTimeout = 30000;
        this.maxTokens = 1500;

        // Initialize
        this.init();
    }

    init() {
        this.setupSystemMessage();
        this.setupEventListeners();
        this.loadInventoryData();
        this.testConnection();
        this.initializeWidget();
    }

    setupSystemMessage() {
        const systemPrompt = `You are Vastra Rent AI Assistant, powered by Google Gemini AI. You are an expert fashion consultant and rental specialist for Vastra Rent, India's premier fashion rental platform.

BUSINESS INFORMATION:
- Founded: 2025 in Vadodara, Gujarat
- Mission: Make designer fashion accessible for special occasions
- Values: Sustainability, Quality, Accessibility, Community

TEAM:
- Vinit Prajapati: Founder & CEO
- Shreyash Vekariya: Co-founder & CFO  
- Krinal Thummar: Fashion Director & CTO

CONTACT:
- Location: Vadodara, Gujarat, IN 390019
- Phone: +91 9898471702 / +91 7984291916 / +91 9574946483
- Email: project172305@gmail.com
- Hours: Mon-Fri 9am-6pm, Sat 10am-4pm

INVENTORY & PRICING:
Men's Collection:
- Kurta Sets: ₹1,800/day, ₹4,800/week
- Suits: ₹2,000/day, ₹5,500/week
- Blazers: ₹2,200/day, ₹6,000/week
- Tuxedos: ₹2,500/day, ₹6,500/week
- Jodhpuri Suits: ₹2,800/day, ₹7,200/week
- Sherwanis: ₹3,500/day, ₹9,000/week

Women's Collection:
- Gowns: ₹2,800/day, ₹7,500/week
- Sharara Sets: ₹2,800/day, ₹7,500/week
- Anarkalis: ₹3,200/day, ₹8,500/week
- Lehengas: ₹2,800-4,500/day, ₹7,500-12,000/week

SERVICES:
- Professional cleaning included
- Size alterations available
- Home delivery & pickup
- Quality guarantee
- Easy booking process

PERSONALITY:
- Be enthusiastic about fashion 👗✨
- Use appropriate emojis
- Provide specific recommendations with exact prices
- Be helpful, patient, and encouraging
- Show expertise in fashion trends
- Always end with helpful questions or call-to-action

When users search for categories (jodhpuri, kurta, tuxedo, lehnga, gown, anarkali, etc.), display items as interactive cards.`;

        this.messages = [{
            role: 'system',
            content: systemPrompt
        }];
    }

    setupEventListeners() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindEvents());
        } else {
            this.bindEvents();
        }
    }

    bindEvents() {
        // Input handling
        const messageInput = this.getElement('message-input');
        const sendButton = this.getElement('send-button');

        if (messageInput) {
            messageInput.addEventListener('input', () => this.updateSendButton());
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            });
        }

        // Connection monitoring
        window.addEventListener('online', () => this.handleConnectionRestore());
        window.addEventListener('offline', () => this.handleConnectionLoss());

        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isOpen) {
                this.focusInput();
            }
        });

        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Chatbot Error:', event.error);
        });
    }

    getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id '${id}' not found`);
        }
        return element;
    }

    initializeWidget() {
        setTimeout(() => {
            const widget = this.getElement('chatbot-widget');
            if (widget) {
                widget.classList.add('loaded');
            }
        }, 500);

        setTimeout(() => {
            this.showNotification();
        }, 3000);
    }

    showNotification() {
        const notificationDot = this.getElement('notification-dot');
        if (notificationDot && !this.isOpen) {
            notificationDot.classList.add('show');
        }
    }

    hideNotification() {
        const notificationDot = this.getElement('notification-dot');
        if (notificationDot) {
            notificationDot.classList.remove('show');
        }
    }

    openChat() {
        this.isOpen = true;
        this.hideNotification();

        const chatWindow = this.getElement('chat-window');
        const chatToggle = this.getElement('chat-toggle');

        if (chatWindow && chatToggle) {
            chatWindow.classList.add('open');
            chatToggle.classList.add('active');

            setTimeout(() => {
                this.focusInput();
                this.scrollToBottom();
            }, 300);
        }
    }

    closeChat() {
        this.isOpen = false;

        const chatWindow = this.getElement('chat-window');
        const chatToggle = this.getElement('chat-toggle');

        if (chatWindow && chatToggle) {
            chatWindow.classList.remove('open');
            chatToggle.classList.remove('active');
        }
    }

    minimizeChat() {
        this.isMinimized = !this.isMinimized;

        const chatWindow = this.getElement('chat-window');
        if (chatWindow) {
            chatWindow.classList.toggle('minimized', this.isMinimized);
        }
    }

    updateSendButton() {
        const messageInput = this.getElement('message-input');
        const sendButton = this.getElement('send-button');

        if (messageInput && sendButton) {
            const hasText = messageInput.value.trim().length > 0;
            sendButton.disabled = !hasText || this.isTyping;
        }
    }

    focusInput() {
        const messageInput = this.getElement('message-input');
        if (messageInput && !this.isTyping) {
            messageInput.focus();
        }
    }

    async handleSendMessage() {
        try {
            const messageInput = this.getElement('message-input');
            if (!messageInput) return;

            const message = messageInput.value.trim();
            if (!message || this.isTyping) return;

            // Clear input and update UI
            messageInput.value = '';
            this.updateSendButton();

            // Add user message
            this.addUserMessage(message);

            // Add to conversation
            this.messages.push({
                role: 'user',
                content: message
            });

            // Show typing indicator
            this.showTyping();

            // Check for quick responses first
            const quickResponse = this.getQuickResponse(message);
            if (quickResponse) {
                setTimeout(() => {
                    this.hideTyping();
                    this.addBotMessage(quickResponse);
                    this.focusInput();
                }, 1000 + Math.random() * 1000);
                return;
            }

            // Call AI API
            const response = await this.callAI();
            const aiMessage = response || 'Sorry, I had trouble understanding that. Could you please try again?';

            // Add AI response
            this.messages.push({
                role: 'assistant',
                content: aiMessage
            });

            this.hideTyping();
            this.addBotMessageWithCards(aiMessage);

        } catch (error) {
            console.error('Send message error:', error);
            this.hideTyping();
            this.handleError(error);
        }

        this.focusInput();
    }

    getQuickResponse(message) {
        try {
            const lowerMessage = message.toLowerCase();

            // Check for category searches first
            const categoryResponse = this.getCategoryResponse(lowerMessage);
            if (categoryResponse) {
                return categoryResponse;
            }

            const quickResponses = {
                'hello': () => "Hello! 👋 Welcome to Vastra Rent! I'm your AI fashion consultant powered by Google Gemini AI. I have complete knowledge of our 56+ designer items, exact pricing, and services. What occasion are you shopping for today?",
                'hi': () => "Hi there! ✨ I'm excited to help you find the perfect outfit from our amazing collection! We have Sherwanis, Lehengas, Tuxedos, Anarkalis, Kurta sets, Jodhpuri suits, Gowns, and more. Are you looking for something specific or would you like me to recommend based on an occasion?",
                'price': () => "Our current rental prices:\n💙 Kurta Sets: ₹1,800/day\n🤵 Suits: ₹2,000/day\n🎩 Tuxedos: ₹2,500/day\n👑 Sherwanis: ₹3,500/day\n👗 Lehengas: ₹2,800-4,500/day\n💃 Anarkalis: ₹3,200/day\n\nWhat's your budget and occasion?",
                'location': () => "We're based in Vadodara, Gujarat! 📍\n\nOur office: Vadodara, Gujarat, IN 390019\nContact: +91 9898471702 / +91 7984291916 / +91 9574946483\nEmail: project172305@gmail.com\n\nWe're expanding to other cities soon! Which city are you in?",
                'team': () => "Meet our amazing team! 👥\n\n👨‍💼 Vinit Prajapati - Founder & CEO\n💰 Shreyash Vekariya - Co-founder & CFO\n👩‍💻 Krinal Thummar - Fashion Director & CTO\n\nThey've built Vastra Rent to make designer fashion accessible to everyone!",
                'wedding': () => "Perfect for weddings! 💒✨\n\nFor Men: Sherwanis (₹3,500/day), Jodhpuri suits (₹2,800/day)\nFor Women: Premium Lehengas (₹4,500/day), Anarkalis (₹3,200/day)\n\nWe have beautiful options like Golden Sherwani, Celebrity Lehnga, and more! What's your preference?",
                'party': () => "Great party options! 🎉\n\nFor Men: Tuxedos (₹2,500/day), Blazers (₹2,200/day)\nFor Women: Gowns (₹2,800/day), Party Anarkalis (₹3,200/day)\n\nTry our Black Tuxedo or Red Gown for a stunning look! What type of party is it?"
            };

            for (const [key, responseFunc] of Object.entries(quickResponses)) {
                if (lowerMessage.includes(key)) {
                    return responseFunc();
                }
            }

            return null;
        } catch (error) {
            console.warn('Quick response error:', error);
            return null;
        }
    }

    getCategoryResponse(message) {
        const categories = {
            'jodhpuri': 'Jodhpuri',
            'kurta': 'Kurta',
            'tuxedo': 'Tuxedo',
            'blazer': 'Blazer',
            'sherwani': 'Sherwani',
            'suit': 'Suit',
            'lehnga': 'Lehnga',
            'lehenga': 'Lehnga',
            'gown': 'Gown',
            'anarkali': 'Anarkali',
            'sharara': 'Sharara'
        };

        for (const [keyword, category] of Object.entries(categories)) {
            if (message.includes(keyword)) {
                return this.displayCategoryItems(category);
            }
        }

        return null;
    }

    displayCategoryItems(category) {
        const items = this.getItemsByCategory(category);

        if (items.length === 0) {
            return `Sorry, we don't have any ${category} items available right now. 😔\n\nWould you like to see other categories or check our full inventory?`;
        }

        // Create a response with cards
        setTimeout(() => {
            this.addItemCards(items, category);
        }, 500);

        return `Here are our available ${category} items! ✨\n\nWe have ${items.length} beautiful ${category.toLowerCase()} options for you:`;
    }

    getItemsByCategory(category) {
        // Get real inventory data from shared inventory system
        try {
            if (typeof window.getSharedInventoryData === 'function') {
                const allItems = window.getSharedInventoryData();
                
                // Filter by category (case-insensitive)
                const categoryItems = allItems.filter(item => 
                    item.category.toLowerCase() === category.toLowerCase() && 
                    item.available
                );
                
                // Return up to 6 items for display
                return categoryItems.slice(0, 6);
            } else {
                console.warn('Shared inventory system not available, using fallback data');
                return this.getFallbackItems(category);
            }
        } catch (error) {
            console.error('Error getting inventory items:', error);
            return this.getFallbackItems(category);
        }
    }

    getFallbackItems(category) {
        // Fallback data if shared inventory system is not available
        const fallbackItems = [
            { id: 1, name: 'White classic open jacket Jodhpuri', category: 'Jodhpuri', price: 2800, weeklyPrice: 7200, size: 'M', image: 'img/men/Jodhpuri suits/image_22.jpg', available: true },
            { id: 2, name: 'Black embroidered booti Jodhpuri', category: 'Jodhpuri', price: 2800, weeklyPrice: 7200, size: 'L', image: 'img/men/Jodhpuri suits/image_1.jpg', available: true },
            { id: 3, name: 'Purple mirror Jodhpuri', category: 'Jodhpuri', price: 2800, weeklyPrice: 7200, size: 'S', image: 'img/men/Jodhpuri suits/image_15.jpg', available: true },
            { id: 8, name: 'Blue mirror work Kurta with pyjama', category: 'Kurta', price: 1800, weeklyPrice: 4800, size: 'M', image: 'img/men/Kurta Sets/image_1.jpg', available: true },
            { id: 9, name: 'Green heavy embroidered Kurta set', category: 'Kurta', price: 1800, weeklyPrice: 4800, size: 'S', image: 'img/men/Kurta Sets/image_5.jpg', available: true },
            { id: 14, name: 'Black Tuxedo', category: 'Tuxedo', price: 2500, weeklyPrice: 6500, size: 'S', image: 'img/men/Tuxedos/image_1.jpeg', available: true },
            { id: 15, name: 'Dark Blue Tuxedo', category: 'Tuxedo', price: 2500, weeklyPrice: 6500, size: 'S', image: 'img/men/Tuxedos/image_4.jpeg', available: true },
            { id: 21, name: 'Celebrity Lehnga', category: 'Lehnga', price: 4500, weeklyPrice: 12000, size: 'S', image: 'img/women/lehnga/image_1.webp', available: true },
            { id: 22, name: 'Maroon Lehnga', category: 'Lehnga', price: 4500, weeklyPrice: 12000, size: 'S', image: 'img/women/lehnga/image_5.webp', available: true },
            { id: 23, name: 'Red Lehnga', category: 'Lehnga', price: 4500, weeklyPrice: 12000, size: 'S', image: 'img/women/lehnga/image_12.webp', available: true },
            { id: 30, name: 'Dark Blue Gown', category: 'Gown', price: 2800, weeklyPrice: 7500, size: 'S', image: 'img/women/gown/image_1.jpg', available: true },
            { id: 31, name: 'Red Gown', category: 'Gown', price: 2800, weeklyPrice: 7500, size: 'S', image: 'img/women/gown/image_13.jpg', available: true },
            { id: 41, name: 'Red Anarkali', category: 'Anarkali', price: 3200, weeklyPrice: 8500, size: 'S', image: 'img/women/Anarkali/image_1.jpg', available: true },
            { id: 42, name: 'White Anarkali', category: 'Anarkali', price: 3200, weeklyPrice: 8500, size: 'S', image: 'img/women/Anarkali/image_22.jpg', available: true },
            { id: 45, name: 'White Sherwani', category: 'Sherwani', price: 3500, weeklyPrice: 9000, size: 'S', image: 'img/men/Sherwani/image_3.jpg', available: true },
            { id: 46, name: 'Golden Sherwani', category: 'Sherwani', price: 3500, weeklyPrice: 9000, size: 'S', image: 'img/men/Sherwani/image_4.jpg', available: true }
        ];

        return fallbackItems.filter(item => 
            item.category.toLowerCase() === category.toLowerCase()
        ).slice(0, 6);
    }

    addItemCards(items, category) {
        const chatMessages = this.getElement('chat-messages');
        if (!chatMessages) return;

        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'message bot-message cards-message';

        const cardsHTML = items.map(item => `
            <div class="clothing-card" data-id="${item.id}">
                <div class="card-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='img/placeholder.jpg'">
                    <div class="card-badge">${item.category}</div>
                </div>
                <div class="card-content">
                    <h4 class="card-title">${item.name}</h4>
                    <div class="card-details">
                        <div class="card-price">₹${item.price}/day</div>
                        <div class="card-size">Size: ${item.size}</div>
                    </div>
                    ${item.weeklyPrice ? `<div class="card-weekly-price">₹${item.weeklyPrice}/week</div>` : ''}
                    <div class="card-actions">
                        <button class="card-btn primary" onclick="window.chatbot.selectItem('${item.id}', '${item.name}')">
                            <i class="fas fa-heart"></i> Select
                        </button>
                        <button class="card-btn secondary" onclick="window.chatbot.viewDetails('${item.id}', '${item.name}')">
                            <i class="fas fa-eye"></i> Details
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        cardsContainer.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-header">Vastra Rent AI</div>
                <div class="clothing-cards-container">
                    ${cardsHTML}
                </div>
                <div class="cards-footer">
                    <p>💡 Click "Select" to add to your wishlist or "Details" for more info!</p>
                    <button class="view-all-btn" onclick="window.open('inventory.html?category=${category}', '_blank')">
                        <i class="fas fa-external-link-alt"></i> View All ${category} Items
                    </button>
                </div>
            </div>
        `;

        chatMessages.appendChild(cardsContainer);
        this.scrollToBottom();
    }

    selectItem(itemId, itemName) {
        // Try to get item details from inventory
        let item = null;
        try {
            if (typeof window.findInventoryItemById === 'function') {
                item = window.findInventoryItemById(itemId);
            }
        } catch (error) {
            console.warn('Could not get item details:', error);
        }

        const itemDisplayName = itemName || `Item ${itemId}`;
        
        this.addBotMessage(`Great choice! 🎉 You've selected "${itemDisplayName}".\n\n✨ **Next Steps:**\n1. 📞 **Call to Book:** +91 9898471702\n2. 💬 **WhatsApp:** +91 7984291916\n3. 📧 **Email:** project172305@gmail.com\n\n🛍️ Would you like to:\n• See similar items\n• Get styling suggestions\n• Add more items to your selection\n• Learn about our rental process\n\nWhat would you prefer?`);
    }

    viewDetails(itemId, itemName) {
        // Try to get item details from inventory
        let item = null;
        try {
            if (typeof window.findInventoryItemById === 'function') {
                item = window.findInventoryItemById(itemId);
            }
        } catch (error) {
            console.warn('Could not get item details:', error);
        }

        if (item) {
            const weeklyInfo = item.weeklyPrice ? `\n💰 **Weekly Rate:** ₹${item.weeklyPrice}` : '';
            this.addBotMessage(`📋 **${item.name}** Details:\n\n💰 **Daily Rate:** ₹${item.price}${weeklyInfo}\n📏 **Size:** ${item.size.toUpperCase()}\n🏷️ **Category:** ${item.category}\n✅ **Status:** ${item.available ? 'Available' : 'Currently Unavailable'}\n📝 **Description:** ${item.description}\n\n🎯 **Perfect for:** ${this.getOccasionSuggestions(item.category)}\n\n📞 **Ready to book?** Call us at +91 9898471702 or would you like to see similar items?`);
        } else {
            const itemDisplayName = itemName || `Item ${itemId}`;
            this.addBotMessage(`📋 **${itemDisplayName}** Details:\n\n💰 **Pricing:** Available on request\n📏 **Sizes:** Multiple sizes available\n✅ **Status:** Available for rental\n\n💡 Perfect for special occasions! \n\n📞 **Contact us for details:**\n• Phone: +91 9898471702\n• WhatsApp: +91 7984291916\n• Email: project172305@gmail.com\n\nWould you like to see similar options?`);
        }
    }

    getOccasionSuggestions(category) {
        const occasions = {
            'Jodhpuri': 'Weddings, formal events, traditional ceremonies',
            'Kurta': 'Festivals, casual events, family gatherings',
            'Tuxedo': 'Black-tie events, galas, formal parties',
            'Suit': 'Business meetings, formal occasions, interviews',
            'Blazer': 'Business casual, cocktail parties, semi-formal events',
            'Sherwani': 'Weddings, traditional ceremonies, special occasions',
            'Indowastern': 'Modern weddings, cocktail parties, fusion events',
            'Lehnga': 'Weddings, festivals, traditional celebrations',
            'Gown': 'Formal parties, galas, cocktail events',
            'Anarkali': 'Festivals, weddings, traditional occasions',
            'Sharara': 'Weddings, festivals, traditional events'
        };
        
        return occasions[category] || 'Special occasions and celebrations';
    }

    async callAI() {
        let lastError = null;

        // Try primary model first, then fallback
        const modelsToTry = [this.model, this.fallbackModel];

        for (const model of modelsToTry) {
            for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
                try {
                    console.log(`🚀 API Call - Model: ${model}, Attempt: ${attempt}`);

                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

                    const response = await fetch(this.apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.apiKey}`,
                            'HTTP-Referer': window.location.origin,
                            'X-Title': 'Vastra Rent AI Assistant'
                        },
                        body: JSON.stringify({
                            model: model,
                            messages: this.messages,
                            max_tokens: this.maxTokens,
                            temperature: 0.7,
                            stream: false
                        }),
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    if (response.ok) {
                        const data = await response.json();
                        console.log('✅ API Success');
                        this.updateConnectionStatus(true);
                        return data.choices[0]?.message?.content || 'I received your message but had trouble generating a response.';
                    } else {
                        const errorText = await response.text();
                        console.warn(`⚠️ API Error ${response.status}:`, errorText);
                        lastError = new Error(`API Error: ${response.status}`);

                        if (response.status === 429) {
                            // Rate limited, wait before retry
                            await this.sleep(2000 * attempt);
                            continue;
                        } else if (response.status >= 500) {
                            // Server error, try again
                            await this.sleep(1000 * attempt);
                            continue;
                        } else {
                            // Client error, try next model
                            break;
                        }
                    }
                } catch (error) {
                    console.warn(`⚠️ Network Error (${model}, attempt ${attempt}):`, error.message);
                    lastError = error;

                    if (error.name === 'AbortError') {
                        lastError = new Error('Request timeout');
                        break;
                    }

                    if (attempt < this.maxRetries) {
                        await this.sleep(1000 * attempt);
                    }
                }
            }
        }

        // All attempts failed
        this.updateConnectionStatus(false);
        throw lastError || new Error('All API attempts failed');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    addUserMessage(message) {
        const chatMessages = this.getElement('chat-messages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-header">You</div>
                <div class="message-text">${this.escapeHtml(message)}</div>
            </div>
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const chatMessages = this.getElement('chat-messages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-header">Vastra Rent AI</div>
                <div class="message-text">${this.formatMessage(message)}</div>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTyping() {
        this.isTyping = true;
        const typingIndicator = this.getElement('typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
            this.scrollToBottom();
        }
        this.updateSendButton();
    }

    hideTyping() {
        this.isTyping = false;
        const typingIndicator = this.getElement('typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
        this.updateSendButton();
    }

    handleError(error) {
        let errorMessage = "I'm having trouble connecting to our AI service right now. ";

        if (error.message.includes('timeout')) {
            errorMessage += "The request timed out. Please try again.";
        } else if (error.message.includes('429')) {
            errorMessage += "Our AI service is busy. Please wait a moment and try again.";
        } else if (!navigator.onLine) {
            errorMessage += "Please check your internet connection.";
        } else {
            errorMessage += "Our AI service might be temporarily unavailable. Please try again in a moment.";
        }

        this.addBotMessage(errorMessage + "\n\nIn the meantime, here's some quick info:\n\n💰 **Pricing:** ₹1,800 to ₹4,500 per day for our collection\n📍 **Located in:** Vadodara, Gujarat\n📞 **Call us:** +91 9898471702 / +91 7984291916 / +91 9574946483\n📧 **Email:** project172305@gmail.com\n\n💡 You can also browse our inventory directly or contact us for immediate assistance!");
    }

    handleConnectionRestore() {
        if (this.isOpen) {
            this.updateConnectionStatus(true);
            this.addBotMessage("Connection restored! 🌐✅ I'm back and ready to help you find the perfect outfit!");
        }
    }

    handleConnectionLoss() {
        if (this.isOpen) {
            this.updateConnectionStatus(false);
            this.addBotMessage("Connection lost 📡❌ Please check your internet connection. I'll be right back!");
        }
    }

    updateConnectionStatus(isOnline) {
        this.isConnected = isOnline;

        const statusText = document.querySelector('.online-status span:last-child');
        if (statusText) {
            statusText.textContent = isOnline ? 'Online - Ready to help!' : 'Offline - Connection issues';
        }

        const statusDot = document.querySelector('.status-dot');
        if (statusDot) {
            statusDot.style.background = isOnline ? '#43cea2' : '#dc3545';
        }
    }

    scrollToBottom() {
        try {
            const chatMessages = this.getElement('chat-messages');
            if (chatMessages) {
                setTimeout(() => {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 100);
            }
        } catch (error) {
            console.warn('Scroll error:', error);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatMessage(message) {
        let formatted = this.escapeHtml(message);

        // Convert line breaks
        formatted = formatted.replace(/\n/g, '<br>');

        // Format bold text
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Format italic text
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Format prices
        formatted = formatted.replace(/₹(\d+(?:,\d+)*)/g, '<span class="price">₹$1</span>');

        return formatted;
    }

    sendMessage(message) {
        const messageInput = this.getElement('message-input');
        if (messageInput) {
            messageInput.value = message;
            this.handleSendMessage();
        }
    }

    loadInventoryData() {
        // Load inventory data from shared inventory system
        try {
            if (typeof window.getSharedInventoryData === 'function') {
                const inventory = window.getSharedInventoryData();
                console.log(`✅ Loaded ${inventory.length} inventory items for chatbot`);
                
                // Store categories for quick access
                this.availableCategories = [...new Set(inventory.map(item => item.category))];
                console.log('📦 Available categories:', this.availableCategories);
            } else {
                console.warn('⚠️ Shared inventory system not available, will use fallback data');
                this.availableCategories = ['Jodhpuri', 'Kurta', 'Tuxedo', 'Suit', 'Blazer', 'Sherwani', 'Indowastern', 'Lehnga', 'Gown', 'Anarkali', 'Sharara'];
            }
        } catch (error) {
            console.error('❌ Error loading inventory data:', error);
            this.availableCategories = ['Jodhpuri', 'Kurta', 'Tuxedo', 'Suit', 'Blazer', 'Sherwani', 'Indowastern', 'Lehnga', 'Gown', 'Anarkali', 'Sharara'];
        }
    }

    async testConnection() {
        try {
            console.log('🔍 Testing API connection...');

            const testMessages = [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Test connection' }
            ];

            const originalMessages = this.messages;
            this.messages = testMessages;

            await this.callAI();
            console.log('✅ Connection test successful');
            this.updateConnectionStatus(true);

            this.messages = originalMessages;
        } catch (error) {
            console.warn('⚠️ Connection test failed:', error.message);
            this.updateConnectionStatus(false);
        }
    }

    // Category detection and automatic card display
    detectAndDisplayCategories(message) {
        const categories = ['Jodhpuri', 'Kurta', 'Tuxedo', 'Suit', 'Blazer', 'Sherwani', 'Indowastern', 'Lehnga', 'Gown', 'Anarkali', 'Sharara'];
        
        // Check if message mentions any categories
        const mentionedCategories = categories.filter(category => 
            message.toLowerCase().includes(category.toLowerCase())
        );
        
        // Display cards for mentioned categories
        mentionedCategories.forEach(category => {
            setTimeout(() => {
                const items = this.getItemsByCategory(category);
                if (items.length > 0) {
                    console.log(`🎯 Auto-displaying ${items.length} ${category} items`);
                    this.addItemCards(items, category);
                }
            }, 1000); // Small delay to let the text message appear first
        });
        
        return mentionedCategories.length > 0;
    }

    // Enhanced addBotMessage with category detection
    addBotMessageWithCards(message) {
        // First add the text message
        this.addBotMessage(message);
        
        // Then check for categories and display cards
        this.detectAndDisplayCategories(message);
    }
}

// Global functions for HTML onclick events
function toggleChat() {
    if (window.chatbot) {
        if (window.chatbot.isOpen) {
            window.chatbot.closeChat();
        } else {
            window.chatbot.openChat();
        }
    }
}

function closeChat() {
    if (window.chatbot) {
        window.chatbot.closeChat();
    }
}

function minimizeChat() {
    if (window.chatbot) {
        window.chatbot.minimizeChat();
    }
}

function sendMessage(message) {
    if (window.chatbot) {
        window.chatbot.sendMessage(message);
    }
}

function handleSendMessage() {
    if (window.chatbot) {
        window.chatbot.handleSendMessage();
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.chatbot = new VastraRentChatbot();
        console.log('✅ Vastra Rent Chatbot initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize chatbot:', error);
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VastraRentChatbot;
}