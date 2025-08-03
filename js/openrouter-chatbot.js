// OpenRouter Chatbot Implementation for Vastra Rent
class OpenRouterChatbot {
    constructor() {
        this.apiKey = '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';
        this.model = 'deepseek/deepseek-r1:free';
        this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        this.isOpen = false;
        this.isTyping = false;
        this.conversationHistory = [];

        this.init();
    }

    init() {
        this.createChatWidget();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    createChatWidget() {
        const chatWidget = document.createElement('div');
        chatWidget.id = 'openrouter-chatbot';
        chatWidget.className = 'openrouter-chatbot';
        chatWidget.innerHTML = `
            <!-- Chat Toggle Button -->
            <div id="chat-toggle-btn" class="chat-toggle-btn">
                <i class="fas fa-comments"></i>
                <div class="notification-badge" id="notification-badge" style="display: none;">1</div>
            </div>
            
            <!-- Chat Window -->
            <div id="chat-window" class="chat-window">
                <div class="chat-header">
                    <div class="chat-title">
                        <i class="fas fa-robot"></i>
                        <span>Vastra Rent AI</span>
                    </div>
                    <div class="chat-status">
                        <span class="status-dot online"></span>
                        <span>Online</span>
                    </div>
                    <div class="chat-controls">
                        <button id="clear-chat" class="control-btn" title="Clear Chat History">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        <button id="close-chat" class="close-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div id="chat-messages" class="chat-messages">
                    <!-- Messages will be added here -->
                </div>
                
                <div id="typing-indicator" class="typing-indicator" style="display: none;">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span>AI is thinking...</span>
                </div>
                
                <div class="chat-input-container">
                    <input type="text" id="chat-input" placeholder="Ask me about our clothing collection..." maxlength="500">
                    <button id="send-btn" disabled>
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(chatWidget);
    }

    bindEvents() {
        const toggleBtn = document.getElementById('chat-toggle-btn');
        const closeBtn = document.getElementById('close-chat');
        const clearBtn = document.getElementById('clear-chat');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');

        toggleBtn.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
        clearBtn.addEventListener('click', () => this.clearChat());

        chatInput.addEventListener('input', (e) => {
            sendBtn.disabled = e.target.value.trim() === '';
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        sendBtn.addEventListener('click', () => this.sendMessage());
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const toggleBtn = document.getElementById('chat-toggle-btn');
        const notificationBadge = document.getElementById('notification-badge');

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            chatWindow.classList.add('open');
            toggleBtn.classList.add('active');
            notificationBadge.style.display = 'none';
            document.getElementById('chat-input').focus();
        } else {
            chatWindow.classList.remove('open');
            toggleBtn.classList.remove('active');
        }
    }

    closeChat() {
        this.isOpen = false;
        document.getElementById('chat-window').classList.remove('open');
        document.getElementById('chat-toggle-btn').classList.remove('active');
    }

    clearChat() {
        this.showClearChatModal();
    }

    showClearChatModal() {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'clear-chat-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="clear-chat-modal">
                <div class="modal-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Clear Chat History</h3>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to clear all chat messages?</p>
                    <p class="modal-warning">This action cannot be undone.</p>
                </div>
                <div class="modal-actions">
                    <button class="modal-btn cancel-btn" onclick="this.closest('.clear-chat-modal-overlay').remove()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="modal-btn confirm-btn" onclick="window.confirmClearChat()">
                        <i class="fas fa-trash-alt"></i> Clear Chat
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
        
        // Animate modal in
        setTimeout(() => {
            modalOverlay.classList.add('show');
        }, 10);
    }

    confirmClearChat() {
        // Clear conversation history
        this.conversationHistory = [];
        
        // Clear chat messages container
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = '';
        
        // Add welcome message back
        this.addWelcomeMessage();
        
        // Show success feedback
        this.showClearChatFeedback();
        
        // Remove modal
        const modal = document.querySelector('.clear-chat-modal-overlay');
        if (modal) {
            modal.classList.add('hide');
            setTimeout(() => modal.remove(), 300);
        }
    }

    showClearChatFeedback() {
        const clearBtn = document.getElementById('clear-chat');
        const originalIcon = clearBtn.innerHTML;
        
        // Add success animation
        clearBtn.classList.add('success-animation');
        clearBtn.innerHTML = '<i class="fas fa-check"></i>';
        clearBtn.style.background = 'rgba(76, 175, 80, 0.2)';
        clearBtn.style.color = '#4caf50';
        
        setTimeout(() => {
            clearBtn.classList.remove('success-animation');
            clearBtn.innerHTML = originalIcon;
            clearBtn.style.background = '';
            clearBtn.style.color = '';
        }, 2500);
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            role: 'assistant',
            content: `👋 Hello! I'm your Vastra Rent AI assistant powered by DeepSeek AI.

I have complete knowledge of our entire inventory:

👔 **MEN'S COLLECTION:**
• Jodhpuri Suits (₹2,800/day) - 7 styles
• Kurta Sets (₹1,800/day) - 6 styles  
• Tuxedos (₹2,500/day) - 6 styles
• Sherwanis (₹3,500/day) - 5 styles
• Suits (₹2,000/day) - 6+ styles
• Blazers (₹2,200/day)
• Indo-western (₹2,500/day) - 7 styles

👗 **WOMEN'S COLLECTION:**
• Lehngas (₹4,500/day) - 9 styles
• Gowns (₹2,800/day) - 4 styles
• Anarkalis (₹3,200/day) - 4 styles
• Sharavas (₹2,800/day)

I can help you find the perfect outfit, check availability, provide styling advice, and answer any questions about our rental process!

What occasion are you shopping for?`
        };

        this.addMessageWithQuickButtons(welcomeMessage);
        this.showNotification();
    }

    showNotification() {
        const notificationBadge = document.getElementById('notification-badge');
        if (!this.isOpen) {
            notificationBadge.style.display = 'block';
        }
    }

    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();

        if (!message) return;

        // Add user message to chat
        const userMessage = { role: 'user', content: message };
        this.addMessageToChat(userMessage);
        this.conversationHistory.push(userMessage);

        // Clear input and disable send button
        chatInput.value = '';
        document.getElementById('send-btn').disabled = true;

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Check if we should show clothing cards
            const shouldShowCards = this.shouldShowCards(message);
            let searchResults = null;

            if (shouldShowCards) {
                // Try to get specific category first
                const specificCategory = this.getCategoryFromMessage(message);
                if (specificCategory) {
                    // Search for specific category
                    searchResults = this.searchInventory(specificCategory);
                } else {
                    // General search
                    searchResults = this.searchInventory(message);
                }
            }

            // Get AI response
            const aiResponse = await this.getAIResponse(message);
            this.hideTypingIndicator();

            // Add AI response to chat with cards if applicable
            if (searchResults && searchResults.length > 0) {
                // Show cards for the first matching category
                const firstResult = searchResults[0];
                if (firstResult.type === 'category') {
                    this.addMessageWithCards(
                        aiResponse,
                        firstResult.items,
                        firstResult.category,
                        firstResult.price,
                        firstResult.weeklyPrice
                    );
                } else {
                    // For individual items, group by category
                    const categoryItems = searchResults
                        .filter(r => r.type === 'item' && r.category === firstResult.category)
                        .map(r => r.item);

                    this.addMessageWithCards(
                        aiResponse,
                        categoryItems,
                        firstResult.category,
                        firstResult.price,
                        firstResult.weeklyPrice
                    );
                }
            } else {
                // Regular message without cards
                const assistantMessage = { role: 'assistant', content: aiResponse };

                // Check if we should add quick buttons after this response
                if (this.shouldShowQuickButtons(message)) {
                    this.addMessageWithQuickButtons(assistantMessage);
                } else {
                    this.addMessageToChat(assistantMessage);
                }
            }

            // Add to conversation history
            const assistantMessage = { role: 'assistant', content: aiResponse };
            this.conversationHistory.push(assistantMessage);

        } catch (error) {
            this.hideTypingIndicator();
            console.error('Error getting AI response:', error);

            const errorMessage = {
                role: 'assistant',
                content: '❌ Sorry, I\'m having trouble connecting right now. Please try again in a moment. In the meantime, you can browse our collection or contact us directly!'
            };
            this.addMessageToChat(errorMessage);
        }
    }

    async getAIResponse(userMessage) {
        const systemPrompt = `You are a helpful AI assistant for Vastra Rent, a premium clothing rental service in India. You have complete knowledge of our inventory and company information.

COMPANY INFORMATION:
- Founded: 2025 in Vadodara, Gujarat
- Mission: Making premium fashion accessible through sustainable rental services
- Values: Sustainability, Quality, Accessibility, Community
- Team: Vinit Prajapati (Founder & CEO), Shreyash Vekariya (Co-founder & CFO), Krinal Thummar (Fashion Director & CTO)
- Location: Vadodara, Gujarat, IN 390019
- Contact: +91 9898471702 / +91 7984291916 / +91 9574946483
- Email: project172305@gmail.com
- Business Hours: Mon-Fri 9am-6pm, Sat 10am-4pm, Sun Closed

RENTAL PROCESS:
1. Browse & Select from our collection
2. Book your rental dates (1 day to several weeks)
3. Free delivery to your doorstep
4. Wear & enjoy your event
5. Schedule pickup - we handle cleaning

INVENTORY CATEGORIES & PRICING:
MEN'S COLLECTION:
- Jodhpuri Suits: ₹2,800/day, ₹7,200/week (White classic, Black embroidered, Purple mirror, Grey collar, Navy blue floral, Yellow embroidered, Violet designer)
- Kurta Sets: ₹1,800/day, ₹4,800/week (Blue mirror work, Green embroidered, Pink, White collar, Pista green, Maroon)
- Tuxedos: ₹2,500/day, ₹6,500/week (Black, Dark Blue, Grey, Navy Blue, 3-piece Black, Dark Grey)
- Blazers: ₹2,200/day, ₹6,000/week (Black classic)
- Sherwanis: ₹3,500/day, ₹9,000/week (White, Golden, Green, Peach, Cream)
- Suits: ₹2,000/day, ₹5,500/week (Black, 3-piece Black, Blue Checks, Brick Brown, Green, Dark Green, Red)
- Indo-western: ₹2,500/day, ₹6,500/week (Off-white, Black, Green, Maroon, Blue, Pink, Peach)

WOMEN'S COLLECTION:
- Lehngas: ₹4,500/day, ₹12,000/week (Celebrity style, Maroon, Red, Dark Blue, Light Pink, Purple, Black, Brown, Blue)
- Gowns: ₹2,800/day, ₹7,500/week (Dark Blue, Red, Maroon, Beige)
- Anarkalis: ₹3,200/day, ₹8,500/week (Red, White, Pink, Golden)
- Sharavas: ₹2,800/day, ₹7,500/week

SIZES AVAILABLE: XS, S, M, L, XL (varies by item)

SERVICES:
- Free delivery and returns
- Basic damage protection included
- Professional cleaning service
- Flexible rental periods
- Size consultation
- Styling advice

RESPONSE GUIDELINES:
- Be helpful, friendly, and conversational
- When users ask to "show", "display", or search for categories, I will display visual clothing cards
- For general inquiries, help questions, or greetings, I provide quick action buttons for easy navigation
- Provide specific pricing and availability information
- Suggest alternatives when items aren't available
- Ask clarifying questions to better help customers
- Use emojis appropriately to make responses engaging
- When discussing pricing, always mention both daily and weekly rates
- For wedding/bridal inquiries, emphasize our premium Lehngas and Sherwanis
- For party/cocktail events, recommend Gowns, Tuxedos, and Suits
- For traditional festivals, suggest Kurtas, Anarkalis, and Jodhpuris
- Always mention our free delivery and damage protection
- If customers ask about specific colors or styles, reference our actual inventory
- Provide size information when relevant
- When showing clothing cards, mention that users can click on items for details
- Quick action buttons help users navigate easily - mention they can click buttons for instant access

CARD DISPLAY SCENARIOS:
- When users ask "show me [category]" - display cards with brief description
- When users search for specific items - show relevant category cards
- When users ask about collections - display appropriate category cards
- Always mention that they can click items for more details or view all items

SAMPLE RESPONSES WITH CARDS:
- For "show me lehngas": "Here are our stunning Lehnga collection! We have 9 beautiful styles ranging from ₹4,500/day. Perfect for weddings and special occasions. Click on any item to see full details!"
- For "tuxedo collection": "Our premium Tuxedo collection (₹2,500/day) - perfect for formal events! We have 6 elegant styles in various colors. All include free delivery and damage protection."
- For "wedding outfits": "Here are our top wedding recommendations! For men, check out our Sherwanis (₹3,500/day), and for women, our exquisite Lehngas (₹4,500/day). Click any item for details!"

Keep responses concise but informative. Always end with a helpful question or suggestion.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...this.conversationHistory.slice(-6), // Keep last 6 messages for context
            { role: 'user', content: userMessage }
        ];

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Vastra Rent - Premium Clothing Rental',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: this.model,
                messages: messages,
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    addMessageToChat(message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role}-message`;

        const isUser = message.role === 'user';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${this.formatMessage(message.content)}</div>
                <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    formatMessage(content) {
        // Convert line breaks to <br> tags
        content = content.replace(/\n/g, '<br>');

        // Convert markdown-style bold text
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Convert bullet points
        content = content.replace(/^• /gm, '&bull; ');

        return content;
    }

    // Helper function to get inventory recommendations
    getInventoryRecommendations(occasion, gender, budget) {
        if (typeof window.CHATBOT_INVENTORY_DATA === 'undefined') {
            return null;
        }

        const data = window.CHATBOT_INVENTORY_DATA;
        let recommendations = [];

        if (occasion && data.occasions[occasion.toLowerCase()]) {
            const categories = data.occasions[occasion.toLowerCase()][gender] || [];
            categories.forEach(category => {
                if (data.categories[gender] && data.categories[gender][category]) {
                    const categoryData = data.categories[gender][category];
                    if (!budget || categoryData.basePrice <= budget) {
                        recommendations.push({
                            category: category,
                            price: categoryData.basePrice,
                            weeklyPrice: categoryData.weeklyPrice,
                            items: categoryData.items.slice(0, 3) // Show first 3 items
                        });
                    }
                }
            });
        }

        return recommendations;
    }

    // Helper function to search inventory
    searchInventory(query) {
        if (typeof window.CHATBOT_INVENTORY_DATA === 'undefined') {
            return null;
        }

        const data = window.CHATBOT_INVENTORY_DATA;
        const results = [];
        const searchTerm = query.toLowerCase();

        ['men', 'women'].forEach(gender => {
            Object.keys(data.categories[gender]).forEach(category => {
                const categoryData = data.categories[gender][category];

                // Check if category matches
                if (category.toLowerCase().includes(searchTerm)) {
                    results.push({
                        type: 'category',
                        gender: gender,
                        category: category,
                        price: categoryData.basePrice,
                        weeklyPrice: categoryData.weeklyPrice,
                        items: categoryData.items
                    });
                }

                // Check individual items
                categoryData.items.forEach(item => {
                    if (item.name.toLowerCase().includes(searchTerm)) {
                        results.push({
                            type: 'item',
                            gender: gender,
                            category: category,
                            item: item,
                            price: categoryData.basePrice,
                            weeklyPrice: categoryData.weeklyPrice
                        });
                    }
                });
            });
        });

        return results;
    }

    // Create clothing cards HTML
    createClothingCards(items, category, price, weeklyPrice) {
        if (!items || items.length === 0) {
            console.log('No items provided for cards');
            return '';
        }

        console.log('Creating cards for:', category, 'Items:', items.length);

        const displayItems = items.slice(0, 6); // Show max 6 items
        const hasMore = items.length > 6;

        let cardsHTML = `
            <div class="cards-header">
                <span class="cards-title">${category} Collection</span>
                <span class="cards-count">${items.length} items</span>
            </div>
            <div class="clothing-cards-container">
        `;

        displayItems.forEach((item, index) => {
            console.log(`Creating card ${index + 1}:`, item.name);
            cardsHTML += `
                <div class="clothing-card" onclick="window.openItemDetails(${item.id})">
                    <img src="${item.image || 'img/placeholder.jpg'}" alt="${item.name}" class="clothing-card-image" 
                         onerror="this.style.background='linear-gradient(45deg, #f0f0f0, #e0e0e0)'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.innerHTML='<i class=\\'fas fa-tshirt\\'></i>'">
                    <div class="clothing-card-content">
                        <div class="clothing-card-name">${item.name || 'Unnamed Item'}</div>
                        <div class="clothing-card-details">
                            <div class="clothing-card-price">₹${price || 0}/day</div>
                            <div class="clothing-card-size">Size ${(item.size || 'M').toUpperCase()}</div>
                        </div>
                        <div class="clothing-card-status ${item.available ? 'available' : 'unavailable'}">
                            <i class="fas fa-${item.available ? 'check-circle' : 'times-circle'}"></i>
                            ${item.available ? 'Available' : 'Unavailable'}
                        </div>
                        <button class="clothing-card-rent-btn" ${!item.available ? 'disabled' : ''}>
                            ${item.available ? 'Rent Now' : 'Unavailable'}
                        </button>
                    </div>
                </div>
            `;
        });

        cardsHTML += '</div>';

        if (hasMore) {
            cardsHTML += `
                <button class="view-all-btn" onclick="window.viewAllItems('${category}')">
                    View All ${items.length} ${category} Items
                </button>
            `;
        }

        return cardsHTML;
    }

    // Add message with clothing cards
    addMessageWithCards(textContent, items, category, price, weeklyPrice) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant-message';

        let cardsHTML = '';
        if (items && items.length > 0) {
            cardsHTML = this.createClothingCards(items, category, price, weeklyPrice);
        }

        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${this.formatMessage(textContent)}</div>
                ${cardsHTML}
                <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Add message with quick action buttons
    addMessageWithQuickButtons(message, buttonType = 'default') {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant-message';

        const quickButtons = this.createQuickButtons(buttonType);

        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${this.formatMessage(message.content)}</div>
                ${quickButtons}
                <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Create quick action buttons
    createQuickButtons(type = 'default') {
        let buttons = [];

        if (type === 'default') {
            buttons = [
                { text: 'Show Lehngas', action: 'show me lehngas', icon: 'fas fa-female', emoji: '👗' },
                { text: 'Show Tuxedos', action: 'display tuxedos', icon: 'fas fa-male', emoji: '🤵' },
                { text: 'Wedding Outfits', action: 'wedding outfits', icon: 'fas fa-ring', emoji: '💒' },
                { text: 'Party Collection', action: 'party outfits', icon: 'fas fa-glass-cheers', emoji: '🎉' },
                { text: 'Pricing Info', action: 'what are your rental prices', icon: 'fas fa-tag', emoji: '💰' },
                { text: 'How It Works', action: 'how does rental process work', icon: 'fas fa-question-circle', emoji: '❓' }
            ];
        } else if (type === 'categories') {
            buttons = [
                { text: '👘 Jodhpuri Suits', action: 'show jodhpuri suits', icon: 'fas fa-user-tie' },
                { text: '👔 Kurta Sets', action: 'display kurta collection', icon: 'fas fa-tshirt' },
                { text: '🤵 Sherwanis', action: 'show sherwanis', icon: 'fas fa-crown' },
                { text: '👗 Gowns', action: 'display gowns', icon: 'fas fa-female' },
                { text: '💃 Anarkalis', action: 'show anarkali collection', icon: 'fas fa-magic' },
                { text: '🔙 Back to Main', action: 'help me choose', icon: 'fas fa-arrow-left' }
            ];
        } else if (type === 'occasions') {
            buttons = [
                { text: '💒 Wedding', action: 'wedding collection', icon: 'fas fa-ring' },
                { text: '🎉 Party', action: 'party collection', icon: 'fas fa-glass-cheers' },
                { text: '🎭 Festival', action: 'festival outfits', icon: 'fas fa-star' },
                { text: '💼 Business', action: 'business attire', icon: 'fas fa-briefcase' },
                { text: '🎓 Formal', action: 'formal wear', icon: 'fas fa-graduation-cap' },
                { text: '🔙 Back to Main', action: 'help me choose', icon: 'fas fa-arrow-left' }
            ];
        }

        let buttonsHTML = '<div class="quick-buttons-container">';

        buttons.forEach((button, index) => {
            buttonsHTML += `
                <button class="quick-button" onclick="window.sendQuickMessage('${button.action}')" 
                        data-delay="${index * 100}" title="Click to ${button.text.toLowerCase()}">
                    <span class="button-emoji">${button.emoji || ''}</span>
                    <i class="${button.icon}"></i>
                    <span class="button-text">${button.text}</span>
                </button>
            `;
        });

        buttonsHTML += '</div>';
        return buttonsHTML;
    }

    // Check if user query should show cards
    shouldShowCards(userMessage) {
        const cardTriggers = [
            'show', 'display', 'see', 'browse', 'collection', 'category', 'view',
            'jodhpuri', 'kurta', 'tuxedo', 'sherwani', 'suit', 'blazer', 'indowastern',
            'lehnga', 'gown', 'anarkali', 'sharara',
            'men', 'women', 'wedding', 'party', 'festival'
        ];

        const message = userMessage.toLowerCase();

        // Check for explicit display requests
        const displayRequests = ['show me', 'display', 'i want to see', 'let me see', 'browse'];
        const hasDisplayRequest = displayRequests.some(req => message.includes(req));

        // Check for category mentions
        const hasCategoryMention = cardTriggers.some(trigger => message.includes(trigger));

        return hasDisplayRequest || hasCategoryMention;
    }

    // Get category from user message
    getCategoryFromMessage(userMessage) {
        const message = userMessage.toLowerCase();
        const categories = {
            'jodhpuri': 'Jodhpuri',
            'kurta': 'Kurta',
            'tuxedo': 'Tuxedo',
            'sherwani': 'Sherwani',
            'suit': 'Suit',
            'blazer': 'Blazer',
            'indowastern': 'Indowastern',
            'indo-western': 'Indowastern',
            'lehnga': 'Lehnga',
            'lehenga': 'Lehnga',
            'gown': 'Gown',
            'anarkali': 'Anarkali',
            'sharara': 'Sharara'
        };

        for (const [key, value] of Object.entries(categories)) {
            if (message.includes(key)) {
                return value;
            }
        }

        // Check for occasion-based requests
        if (message.includes('wedding')) {
            return Math.random() > 0.5 ? 'Sherwani' : 'Lehnga';
        }
        if (message.includes('party')) {
            return Math.random() > 0.5 ? 'Tuxedo' : 'Gown';
        }

        return null;
    }

    // Check if we should show quick buttons after response
    shouldShowQuickButtons(userMessage) {
        const message = userMessage.toLowerCase();
        const quickButtonTriggers = [
            'help', 'what can you do', 'options', 'menu', 'guide',
            'pricing', 'how it works', 'process', 'rental',
            'hello', 'hi', 'hey', 'start', 'begin'
        ];

        return quickButtonTriggers.some(trigger => message.includes(trigger));
    }

    showTypingIndicator() {
        this.isTyping = true;
        document.getElementById('typing-indicator').style.display = 'flex';
        document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        document.getElementById('typing-indicator').style.display = 'none';
    }
}

// Global functions for card interactions
window.openItemDetails = function (itemId) {
    // Redirect to product details page or open modal
    const url = `product-details.html?id=${itemId}`;
    window.open(url, '_blank');
};

window.viewAllItems = function (category) {
    // Redirect to inventory page with category filter
    const url = `inventory.html?category=${encodeURIComponent(category)}`;
    window.open(url, '_blank');
};

// Global function for quick button messages
window.sendQuickMessage = function (message) {
    console.log('Quick button clicked:', message);
    
    // Find the chatbot instance and send the message
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    if (chatInput && sendBtn) {
        // Set the message in input
        chatInput.value = message;
        
        // Enable send button
        sendBtn.disabled = false;
        
        // Add visual feedback to the button
        const clickedButton = event.target.closest('.quick-button');
        if (clickedButton) {
            clickedButton.style.transform = 'scale(0.95)';
            clickedButton.style.opacity = '0.7';
            
            setTimeout(() => {
                clickedButton.style.transform = '';
                clickedButton.style.opacity = '';
            }, 150);
        }
        
        // Trigger the send message function
        setTimeout(() => {
            sendBtn.click();
        }, 100);
    } else {
        console.error('Chat input or send button not found');
    }
};

// Global function for confirming clear chat
window.confirmClearChat = function() {
    // Find the chatbot instance
    const chatbotElement = document.getElementById('openrouter-chatbot');
    if (chatbotElement && window.chatbotInstance) {
        window.chatbotInstance.confirmClearChat();
    }
};

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbotInstance = new OpenRouterChatbot();
});