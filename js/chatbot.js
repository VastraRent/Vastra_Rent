// Enhanced recommendation system
class SmartRecommendationEngine {
    constructor(inventoryData) {
        this.inventory = inventoryData;
        this.userProfile = this.loadUserProfile();
    }
    
    generateSmartRecommendations(userPreferences, conversationHistory) {
        let recommendations = [];
        
        // Occasion-based recommendations
        if (userPreferences.occasion) {
            recommendations = this.getOccasionBasedItems(userPreferences.occasion, userPreferences.gender);
        }
        
        // Style-based recommendations
        if (userPreferences.style) {
            recommendations = this.filterByStyle(recommendations, userPreferences.style);
        }
        
        // Price-based filtering
        if (userPreferences.priceRange) {
            recommendations = this.filterByPriceRange(recommendations, userPreferences.priceRange);
        }
        
        // Add trending items
        recommendations = [...recommendations, ...this.getTrendingItems(3)];
        
        // Remove duplicates and limit
        recommendations = this.removeDuplicates(recommendations).slice(0, 6);
        
        return recommendations;
    }
    
    getOccasionBasedItems(occasion, gender) {
        const occasionMapping = {
            'wedding': {
                'men': ['Sherwani', 'Jodhpuri', 'Tuxedo'],
                'women': ['Lehnga', 'Anarkali', 'Gown']
            },
            'party': {
                'men': ['Tuxedo', 'Suit', 'Blazer'],
                'women': ['Gown', 'Anarkali', 'Sharara']
            },
            'formal': {
                'men': ['Suit', 'Blazer', 'Jodhpuri'],
                'women': ['Suit', 'Blazer']
            },
            'casual': {
                'men': ['Kurta', 'Blazer'],
                'women': ['Kurta', 'Sharara']
            },
            'festival': {
                'men': ['Kurta', 'Jodhpuri'],
                'women': ['Anarkali', 'Sharara', 'Lehnga']
            }
        };
        
        const relevantCategories = occasionMapping[occasion]?.[gender] || [];
        
        return this.inventory.filter(item => 
            relevantCategories.includes(item.category) && 
            item.available &&
            (!gender || item.gender === gender)
        );
    }
    
    getTrendingItems(count) {
        // Simulate trending based on category popularity
        const trendingCategories = ['Jodhpuri', 'Anarkali', 'Tuxedo', 'Lehnga'];
        
        return this.inventory
            .filter(item => trendingCategories.includes(item.category) && item.available)
            .sort(() => Math.random() - 0.5)
            .slice(0, count);
    }
    
    removeDuplicates(items) {
        const seen = new Set();
        return items.filter(item => {
            if (seen.has(item.id)) {
                return false;
            }
            seen.add(item.id);
            return true;
        });
    }
    
    loadUserProfile() {
        try {
            const profile = localStorage.getItem('userChatProfile');
            return profile ? JSON.parse(profile) : {
                preferences: {},
                history: [],
                favorites: []
            };
        } catch (error) {
            return { preferences: {}, history: [], favorites: [] };
        }
    }
    
    saveUserProfile() {
        try {
            localStorage.setItem('userChatProfile', JSON.stringify(this.userProfile));
        } catch (error) {
            console.warn('Could not save user profile:', error);
        }
    }
}

// Enhanced AI conversation engine with better natural language processing
class EnhancedConversationEngine {
    constructor() {
        this.conversationContext = {
            userPreferences: {
                gender: null,
                occasion: null,
                priceRange: null,
                size: null,
                style: null,
                colors: []
            },
            conversationHistory: [],
            currentTopic: null,
            userMood: 'neutral',
            sessionData: {
                viewedItems: [],
                searchHistory: [],
                recommendations: []
            }
        };
        
        this.personalityTraits = {
            friendly: true,
            helpful: true,
            knowledgeable: true,
            patient: true,
            enthusiastic: true
        };
        
        this.initializeAdvancedPatterns();
    }
    
    initializeAdvancedPatterns() {
        this.intentPatterns = {
            'greeting': {
                patterns: [/^(hello|hi|hey|good morning|good afternoon|good evening|hii|hiii|helloo)$/i, /^(hi there|hello there|hey there)$/i],
                responses: [
                    "Hello! Welcome to Vastra Rent! 👋 I'm here to help you find the perfect outfit. What occasion are you shopping for?",
                    "Hi there! 😊 I'm excited to help you discover amazing outfits from our collection. Are you looking for something specific?",
                    "Hey! Great to see you! I'm your personal style assistant. Tell me, what's the special occasion you're dressing for?"
                ]
            },
            'product_search': {
                patterns: [/show|find|looking for|need|want|search|browse/i],
                responses: [
                    "I'd love to help you find the perfect outfit! Let me show you our amazing collection.",
                    "Absolutely! I have access to our entire inventory. Let me curate some options for you."
                ]
            },
            'occasion_based': {
                patterns: [/wedding|party|formal|casual|festival|business|interview/i],
                responses: [
                    "Perfect! I know exactly what works for that occasion. Let me show you our best options.",
                    "Great choice of occasion! I have some stunning recommendations that would be perfect."
                ]
            },
            'price_inquiry': {
                patterns: [/price|cost|budget|expensive|cheap|affordable/i],
                responses: [
                    "I understand budget is important! Our rental prices start from ₹1,800/day. Let me show you options in your range.",
                    "Great question! We have options for every budget. What's your preferred price range?"
                ]
            },
            'size_help': {
                patterns: [/size|fit|measurements|too big|too small/i],
                responses: [
                    "Size is crucial for the perfect fit! We have detailed size guides and can help you choose the right size.",
                    "I can definitely help with sizing! What size do you usually wear, or would you like our size guide?"
                ]
            },
            'compliment': {
                patterns: [/thank you|thanks|great|awesome|perfect|love it/i],
                responses: [
                    "You're so welcome! I'm thrilled I could help! 😊 Is there anything else you'd like to explore?",
                    "Aww, thank you! That makes my day! I'm here whenever you need style advice. 💕"
                ]
            },
            'help_request': {
                patterns: [/help|confused|don't know|not sure|recommend/i],
                responses: [
                    "Of course! I'm here to make this easy for you. Let's start with the basics - what's the occasion?",
                    "No worries at all! I love helping with outfit decisions. Tell me a bit about what you need."
                ]
            },
            'style_advice': {
                patterns: [/what should i wear|style advice|fashion help|outfit suggestion/i],
                responses: [
                    "I'd love to give you style advice! Tell me about the occasion and your preferences.",
                    "Fashion advice is my specialty! What's the event and what style are you going for?"
                ]
            },
            'size_guidance': {
                patterns: [/size guide|what size|how to measure|fitting/i],
                responses: [
                    "I'll help you find the perfect fit! Let me share our size guide and measurement tips.",
                    "Size guidance coming right up! I'll make sure you get the perfect fit."
                ]
            },
            'rental_process': {
                patterns: [/how to rent|rental process|how does it work|booking/i],
                responses: [
                    "Let me walk you through our simple rental process! It's easier than you think.",
                    "Great question! Our rental process is super straightforward. Let me explain."
                ]
            },
            'pricing_details': {
                patterns: [/pricing|cost breakdown|charges|fees/i],
                responses: [
                    "I'll give you a complete pricing breakdown! We believe in transparent pricing.",
                    "Let me explain our pricing structure - no hidden charges, I promise!"
                ]
            }
        };
        
        this.enhancedConversationPatterns = {
            'style_advice': {
                patterns: [/what should i wear|style advice|fashion help|outfit suggestion/i],
                handler: (message, entities) => {
                    const occasion = entities.occasion || 'general';
                    const gender = entities.gender || 'unisex';
                    
                    const advice = {
                        'wedding': {
                            'men': "For weddings, I'd recommend our elegant Sherwanis or classic Jodhpuri suits. They're perfect for the groom or wedding guests!",
                            'women': "For weddings, our Lehngas and Anarkalis are absolutely stunning! They'll make you look like royalty."
                        },
                        'party': {
                            'men': "For parties, our Tuxedos and designer Suits will make you the center of attention!",
                            'women': "For parties, our Gowns and designer Anarkalis are perfect for making a statement!"
                        },
                        'formal': {
                            'men': "For formal events, our Blazers and business Suits are ideal for a professional look.",
                            'women': "For formal occasions, our elegant Suits and sophisticated Blazers are perfect."
                        }
                    };
                    
                    return advice[occasion]?.[gender] || "I'd love to help you choose the perfect outfit! Tell me more about the occasion and your style preferences.";
                }
            },
            
            'size_guidance': {
                patterns: [/size guide|what size|how to measure|fitting/i],
                handler: () => {
                    return `Here's our size guide:\n\n📏 **How to measure:**\n• Chest: Measure around the fullest part\n• Waist: Measure around your natural waistline\n• Hip: Measure around the fullest part\n\n📐 **Size Chart:**\n• XS: Chest 32-34"\n• S: Chest 34-36"\n• M: Chest 36-38"\n• L: Chest 38-40"\n• XL: Chest 40-42"\n\nNeed help choosing? Just tell me your measurements! 📏✨`;
                }
            },
            
            'rental_process': {
                patterns: [/how to rent|rental process|how does it work|booking/i],
                handler: () => {
                    return `Our rental process is super simple! 🎉\n\n**Step 1:** Browse and select your outfit\n**Step 2:** Choose your rental dates\n**Step 3:** Provide measurements and delivery details\n**Step 4:** Make payment\n**Step 5:** We deliver to your doorstep!\n**Step 6:** Enjoy your event! ✨\n**Step 7:** We pick up after your event\n\nRental periods: 1-7 days\nDelivery: Free within city limits\nCleaning: Included in rental price\n\nReady to start? Let me show you our collection! 👗👔`;
                }
            },
            
            'pricing_details': {
                patterns: [/pricing|cost breakdown|charges|fees/i],
                handler: () => {
                    return `Here's our transparent pricing! 💰\n\n**Daily Rates:** ₹1,800 - ₹4,500/day\n**Weekly Rates:** ₹4,800 - ₹12,000/week (up to 30% savings)\n**Security Deposit:** ₹500-2000 (fully refundable)\n\n**Included FREE:**\n✅ Professional cleaning\n✅ Delivery & pickup\n✅ Size alterations (minor)\n✅ Accessories (when available)\n\n**Additional Services:**\n• Express delivery: ₹200\n• Premium insurance: ₹100\n• Styling consultation: ₹500\n\nNo hidden charges! What you see is what you pay! 🌟`;
                }
            }
        };
        
        this.contextualResponses = {
            'first_time': [
                "Welcome to Vastra Rent! I'm so excited to help you with your first rental experience! 🎉",
                "First time here? Perfect! I'll make sure you have an amazing experience finding your ideal outfit."
            ],
            'returning_user': [
                "Welcome back! I remember you! 😊 Ready to find another stunning outfit?",
                "Great to see you again! I hope your last rental was perfect. What can I help you with today?"
            ],
            'indecisive': [
                "I totally understand - choosing the perfect outfit can be overwhelming! Let me help narrow it down.",
                "No pressure at all! How about I show you a few options and we can go from there?"
            ]
        };
    }
    
    // Enhanced message analysis with sentiment and intent detection
    analyzeMessage(message) {
        const analysis = {
            intent: this.detectIntent(message),
            sentiment: this.detectSentiment(message),
            entities: this.extractEntities(message),
            context: this.analyzeContext(message),
            urgency: this.detectUrgency(message),
            originalMessage: message
        };
        
        return analysis;
    }
    
    detectIntent(message) {
        const lowerMessage = message.toLowerCase();
        
        for (const [intent, data] of Object.entries(this.intentPatterns)) {
            for (const pattern of data.patterns) {
                if (pattern.test(lowerMessage)) {
                    return intent;
                }
            }
        }
        
        return 'general_inquiry';
    }
    
    detectSentiment(message) {
        const positiveWords = ['love', 'great', 'awesome', 'perfect', 'beautiful', 'amazing', 'wonderful'];
        const negativeWords = ['hate', 'bad', 'terrible', 'awful', 'disappointed', 'ugly'];
        const neutralWords = ['okay', 'fine', 'alright'];
        
        const lowerMessage = message.toLowerCase();
        
        if (positiveWords.some(word => lowerMessage.includes(word))) {
            return 'positive';
        } else if (negativeWords.some(word => lowerMessage.includes(word))) {
            return 'negative';
        } else {
            return 'neutral';
        }
    }
    
    extractEntities(message) {
        const entities = {
            gender: null,
            category: null,
            occasion: null,
            size: null,
            color: null,
            priceRange: null
        };
        
        const lowerMessage = message.toLowerCase();
        
        // Gender detection
        if (/\b(men|male|man|boy|groom)\b/i.test(message)) entities.gender = 'men';
        if (/\b(women|female|woman|girl|bride|lady)\b/i.test(message)) entities.gender = 'women';
        
        // Category detection
        const categories = ['jodhpuri', 'kurta', 'tuxedo', 'suit', 'blazer', 'sherwani', 'anarkali', 'gown', 'lehnga', 'sharara'];
        categories.forEach(cat => {
            if (lowerMessage.includes(cat)) entities.category = cat;
        });
        
        // Occasion detection
        if (/\b(wedding|marriage|shaadi)\b/i.test(message)) entities.occasion = 'wedding';
        if (/\b(party|celebration|birthday)\b/i.test(message)) entities.occasion = 'party';
        if (/\b(formal|business|office|interview)\b/i.test(message)) entities.occasion = 'formal';
        if (/\b(casual|everyday|regular)\b/i.test(message)) entities.occasion = 'casual';
        if (/\b(festival|diwali|holi|eid)\b/i.test(message)) entities.occasion = 'festival';
        
        // Size detection
        const sizes = ['xs', 's', 'm', 'l', 'xl', 'xxl'];
        sizes.forEach(size => {
            if (new RegExp(`\\b${size}\\b`, 'i').test(message)) entities.size = size;
        });
        
        // Color detection
        const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple', 'orange', 'grey', 'gray'];
        colors.forEach(color => {
            if (lowerMessage.includes(color)) entities.color = color;
        });
        
        // Price range detection
        if (/\b(cheap|budget|affordable|under.*\d+)\b/i.test(message)) entities.priceRange = 'low';
        if (/\b(expensive|premium|luxury|high.*end)\b/i.test(message)) entities.priceRange = 'high';
        if (/\b(mid.*range|moderate|average)\b/i.test(message)) entities.priceRange = 'medium';
        
        return entities;
    }
    
    analyzeContext(message) {
        // Placeholder for context analysis
        return {};
    }
    
    detectUrgency(message) {
        const urgentWords = ['urgent', 'asap', 'immediately', 'today', 'now', 'quick'];
        const lowerMessage = message.toLowerCase();
        return urgentWords.some(word => lowerMessage.includes(word));
    }
    
    // Generate contextual and personalized responses
    generatePersonalizedResponse(analysis, inventoryData) {
        const { intent, sentiment, entities, context } = analysis;
        
        // Check for enhanced conversation patterns first
        const enhancedResponse = this.checkEnhancedPatterns(analysis.originalMessage, entities);
        if (enhancedResponse) {
            return enhancedResponse;
        }
        
        // Update conversation context
        this.updateConversationContext(entities, sentiment);
        
        // Generate base response
        let response = this.getBaseResponse(intent, sentiment);
        
        // Add personalization
        response = this.addPersonalization(response, entities, inventoryData);
        
        // Add inventory suggestions if relevant
        if (this.shouldShowInventory(intent, entities)) {
            response += this.generateInventoryPrompt(entities);
            setTimeout(() => this.showRelevantInventory(entities, inventoryData), 1000);
        }
        
        return response;
    }
    
    // Check enhanced conversation patterns
    checkEnhancedPatterns(message, entities) {
        const lowerMessage = message.toLowerCase();
        
        for (const [patternName, patternData] of Object.entries(this.enhancedConversationPatterns)) {
            for (const pattern of patternData.patterns) {
                if (pattern.test(lowerMessage)) {
                    return patternData.handler(message, entities);
                }
            }
        }
        
        return null;
    }
    
    updateConversationContext(entities, sentiment) {
        // Update user preferences based on entities
        Object.keys(entities).forEach(key => {
            if (entities[key] && this.conversationContext.userPreferences[key] !== undefined) {
                this.conversationContext.userPreferences[key] = entities[key];
            }
        });
        
        this.conversationContext.userMood = sentiment;
        this.conversationContext.conversationHistory.push({
            timestamp: new Date(),
            entities,
            sentiment
        });
    }
    
    getBaseResponse(intent, sentiment) {
        const responses = this.intentPatterns[intent]?.responses || [
            "I'd be happy to help you with that! Let me see what I can find for you.",
            "Great question! I'm here to assist you with finding the perfect outfit."
        ];
        
        let response = responses[Math.floor(Math.random() * responses.length)];
        
        // Adjust tone based on sentiment
        if (sentiment === 'positive') {
            response = this.addEnthusiasm(response);
        } else if (sentiment === 'negative') {
            response = this.addEmpathy(response);
        }
        
        return response;
    }
    
    addPersonalization(response, entities, inventoryData) {
        // Add specific mentions based on detected entities
        if (entities.occasion) {
            response += ` Since you mentioned ${entities.occasion}, I have some perfect suggestions!`;
        }
        
        if (entities.gender) {
            const genderSpecific = entities.gender === 'men' ? 'gentlemen' : 'ladies';
            response += ` Our ${genderSpecific}'s collection has some amazing options.`;
        }
        
        if (entities.color) {
            response += ` I love that you're looking for ${entities.color} - it's such a great choice!`;
        }
        
        return response;
    }
    
    shouldShowInventory(intent, entities) {
        const inventoryIntents = ['product_search', 'occasion_based', 'help_request'];
        return inventoryIntents.includes(intent) || 
               entities.category || 
               entities.occasion || 
               entities.gender;
    }
    
    generateInventoryPrompt(entities) {
        if (entities.occasion && entities.gender) {
            return ` Let me show you our ${entities.gender}'s ${entities.occasion} collection! 👗✨`;
        } else if (entities.category) {
            return ` Here are our beautiful ${entities.category} options! 🌟`;
        } else if (entities.gender) {
            return ` Check out our ${entities.gender}'s collection! 👔👗`;
        } else {
            return ` Let me show you some of our most popular items! ⭐`;
        }
    }
    
    showRelevantInventory(entities, inventoryData) {
        let filteredItems = [...inventoryData];
        
        // Apply filters based on entities
        if (entities.gender) {
            filteredItems = filteredItems.filter(item => item.gender === entities.gender);
        }
        
        if (entities.category) {
            filteredItems = filteredItems.filter(item => 
                item.category.toLowerCase() === entities.category.toLowerCase()
            );
        }
        
        if (entities.occasion) {
            // Map occasions to categories
            const occasionMapping = {
                'wedding': ['Sherwani', 'Lehnga', 'Anarkali', 'Tuxedo'],
                'party': ['Tuxedo', 'Gown', 'Suit', 'Anarkali'],
                'formal': ['Suit', 'Blazer', 'Jodhpuri'],
                'casual': ['Kurta', 'Blazer'],
                'festival': ['Kurta', 'Anarkali', 'Sharara']
            };
            
            const relevantCategories = occasionMapping[entities.occasion] || [];
            if (relevantCategories.length > 0) {
                filteredItems = filteredItems.filter(item => 
                    relevantCategories.includes(item.category)
                );
            }
        }
        
        if (entities.color) {
            filteredItems = filteredItems.filter(item => 
                item.name.toLowerCase().includes(entities.color.toLowerCase()) ||
                item.description.toLowerCase().includes(entities.color.toLowerCase())
            );
        }
        
        if (entities.priceRange) {
            const priceRanges = {
                'low': [0, 30],
                'medium': [30, 50],
                'high': [50, 100]
            };
            
            const [min, max] = priceRanges[entities.priceRange] || [0, 1000];
            filteredItems = filteredItems.filter(item => 
                item.price >= min && item.price <= max
            );
        }
        
        // Show filtered inventory
        if (window.vastraRentChatbot && window.vastraRentChatbot.showInventoryItems) {
            window.vastraRentChatbot.showInventoryItems(null, filteredItems.slice(0, 6));
        }
    }
    
    addEnthusiasm(response) {
        const enthusiasticPhrases = [' 🎉', ' ✨', ' Amazing!', ' Fantastic!'];
        return response + enthusiasticPhrases[Math.floor(Math.random() * enthusiasticPhrases.length)];
    }
    
    addEmpathy(response) {
        const empathyPhrases = [
            " I understand how you feel.",
            " Let me help make this better for you.",
            " I'm here to help you through this."
        ];
        return response + empathyPhrases[Math.floor(Math.random() * empathyPhrases.length)];
    }
}

// AI Engine for Natural Language Processing
class ChatbotAI {
    constructor() {
        this.intentPatterns = this.initializeIntentPatterns();
        this.entityExtractors = this.initializeEntityExtractors();
        this.sentimentKeywords = this.initializeSentimentKeywords();
        this.learningData = this.loadLearningData();
        this.synonyms = this.initializeSynonyms();
    }

    // Natural Language Understanding
    analyzeMessage(message) {
        const normalizedMessage = this.normalizeMessage(message);

        return {
            intent: this.extractIntent(normalizedMessage),
            entities: this.extractEntities(normalizedMessage),
            keywords: this.extractKeywords(normalizedMessage),
            sentiment: this.analyzeSentiment(normalizedMessage),
            confidence: this.calculateConfidence(normalizedMessage)
        };
    }

    normalizeMessage(message) {
        return message.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    extractIntent(message) {
        for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
            for (const pattern of patterns) {
                if (this.matchesPattern(message, pattern)) {
                    return intent;
                }
            }
        }
        return 'general_inquiry';
    }

    extractEntities(message) {
        const entities = {};

        for (const [entityType, extractor] of Object.entries(this.entityExtractors)) {
            const extracted = extractor(message);
            if (extracted) {
                entities[entityType] = extracted;
            }
        }

        return entities;
    }

    extractKeywords(message) {
        const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'that', 'this', 'it', 'from', 'they', 'we', 'say', 'her', 'she', 'he', 'has', 'had', 'can', 'could', 'would', 'should', 'will', 'i', 'you', 'me', 'my', 'your'];

        return message.split(' ')
            .filter(word => word.length > 2 && !stopWords.includes(word))
            .map(word => this.expandSynonyms(word))
            .flat();
    }

    expandSynonyms(word) {
        const synonymGroup = this.synonyms[word];
        return synonymGroup ? [word, ...synonymGroup] : [word];
    }

    analyzeSentiment(message) {
        let score = 0;
        const words = message.split(' ');

        words.forEach(word => {
            if (this.sentimentKeywords.positive.includes(word)) score += 1;
            if (this.sentimentKeywords.negative.includes(word)) score -= 1;
            if (this.sentimentKeywords.very_positive.includes(word)) score += 2;
            if (this.sentimentKeywords.very_negative.includes(word)) score -= 2;
        });

        if (score > 1) return 'positive';
        if (score < -1) return 'negative';
        if (score === 1) return 'slightly_positive';
        if (score === -1) return 'slightly_negative';
        return 'neutral';
    }

    calculateConfidence(message) {
        // Simple confidence calculation based on keyword matches and message length
        const keywords = this.extractKeywords(message);
        const keywordScore = keywords.length * 0.1;
        const lengthScore = Math.min(message.length / 100, 0.5);
        return Math.min(keywordScore + lengthScore, 1.0);
    }

    matchesPattern(message, pattern) {
        if (typeof pattern === 'string') {
            return message.includes(pattern);
        }
        if (pattern instanceof RegExp) {
            return pattern.test(message);
        }
        if (typeof pattern === 'function') {
            return pattern(message);
        }
        return false;
    }

    // Machine Learning - Simple pattern learning
    learnFromInteraction(userMessage, botResponse, context) {
        const interaction = {
            timestamp: Date.now(),
            userMessage: userMessage,
            botResponse: botResponse,
            context: { ...context },
            sentiment: context.userSentiment
        };

        this.learningData.interactions.push(interaction);
        this.updatePatternWeights(userMessage, context);
        this.saveLearningData();
    }

    updatePatternWeights(message, context) {
        const keywords = this.extractKeywords(message);
        keywords.forEach(keyword => {
            if (!this.learningData.keywordWeights[keyword]) {
                this.learningData.keywordWeights[keyword] = 0;
            }
            this.learningData.keywordWeights[keyword] += 1;
        });
    }

    loadLearningData() {
        try {
            const stored = localStorage.getItem('chatbot_learning_data');
            return stored ? JSON.parse(stored) : {
                interactions: [],
                keywordWeights: {},
                userPreferences: {},
                successfulResponses: {}
            };
        } catch (error) {
            return {
                interactions: [],
                keywordWeights: {},
                userPreferences: {},
                successfulResponses: {}
            };
        }
    }

    saveLearningData() {
        try {
            localStorage.setItem('chatbot_learning_data', JSON.stringify(this.learningData));
        } catch (error) {
            console.warn('Could not save learning data:', error);
        }
    }

    // Recommendation Engine
    generateRecommendations(context) {
        const { sessionData, userPreferences } = context;
        const inventory = window.vastraRentChatbot?.inventoryData || [];

        let recommendations = [...inventory];

        // Filter by user preferences
        if (sessionData.gender) {
            recommendations = recommendations.filter(item =>
                item.gender === sessionData.gender || item.gender === 'unisex'
            );
        }

        if (sessionData.occasion) {
            recommendations = recommendations.filter(item =>
                this.matchesOccasion(item, sessionData.occasion)
            );
        }

        if (sessionData.priceRange) {
            recommendations = recommendations.filter(item =>
                item.price >= sessionData.priceRange.min &&
                item.price <= sessionData.priceRange.max
            );
        }

        if (sessionData.size) {
            recommendations = recommendations.filter(item => item.size === sessionData.size);
        }

        // Sort by relevance score
        recommendations = recommendations.map(item => ({
            ...item,
            relevanceScore: this.calculateRelevanceScore(item, context)
        })).sort((a, b) => b.relevanceScore - a.relevanceScore);

        return recommendations.slice(0, 6);
    }

    calculateRelevanceScore(item, context) {
        let score = 0;

        // Boost score for preferred categories
        if (context.sessionData.preferredCategories.includes(item.category)) {
            score += 3;
        }

        // Boost score for items similar to viewed items
        context.sessionData.viewedItems.forEach(viewedItem => {
            if (viewedItem.category === item.category) score += 1;
            if (viewedItem.gender === item.gender) score += 1;
        });

        // Boost score based on keyword weights
        const itemKeywords = [item.name, item.description, item.category].join(' ').toLowerCase();
        Object.entries(this.learningData.keywordWeights).forEach(([keyword, weight]) => {
            if (itemKeywords.includes(keyword)) {
                score += weight * 0.1;
            }
        });

        // Availability boost
        if (item.available) score += 2;

        return score;
    }

    matchesOccasion(item, occasion) {
        const occasionMap = {
            'wedding': ['formal', 'party'],
            'party': ['party', 'formal'],
            'casual': ['casual'],
            'business': ['business', 'formal'],
            'festival': ['formal', 'party'],
            'date': ['casual', 'party']
        };

        return occasionMap[occasion]?.includes(item.category) || false;
    }

    // Removed old getInventoryData methods - now using loaded inventory data directly

    // Initialize AI patterns and data
    initializeIntentPatterns() {
        return {
            'product_search': [
                /show.*(?:lehenga|dress|suit|outfit)/,
                /looking for.*(?:clothes|outfit|dress)/,
                /need.*(?:something|outfit|dress)/,
                'browse', 'search', 'find', 'show me'
            ],
            'price_inquiry': [
                /how much.*cost/, /what.*price/, /cost of/,
                'price', 'cost', 'expensive', 'cheap', 'budget'
            ],
            'size_inquiry': [
                /what size/, /size guide/, /fit/,
                'size', 'fitting', 'measurements'
            ],
            'availability': [
                /is.*available/, /in stock/, /can i rent/,
                'available', 'stock', 'rent'
            ],
            'company_info': [
                /who is.*ceo/, /about company/, /founded/,
                'ceo', 'founder', 'company', 'about', 'team'
            ],
            'contact_info': [
                /contact/, /phone/, /email/, /address/,
                'contact', 'reach', 'location', 'phone', 'email'
            ],
            'delivery_inquiry': [
                /delivery/, /shipping/, /pickup/,
                'delivery', 'shipping', 'pickup', 'transport'
            ],
            'return_policy': [
                /return/, /refund/, /exchange/,
                'return', 'refund', 'exchange', 'policy'
            ]
        };
    }

    initializeEntityExtractors() {
        return {
            price_range: (message) => {
                const priceMatch = message.match(/(\d+).*(?:to|-).*(\d+)/);
                if (priceMatch) {
                    return { min: parseInt(priceMatch[1]), max: parseInt(priceMatch[2]) };
                }
                const singlePrice = message.match(/under.*(\d+)|below.*(\d+)|less than.*(\d+)/);
                if (singlePrice) {
                    return { min: 0, max: parseInt(singlePrice[1] || singlePrice[2] || singlePrice[3]) };
                }
                return null;
            },

            occasion: (message) => {
                const occasions = ['wedding', 'party', 'casual', 'business', 'festival', 'date', 'formal'];
                return occasions.find(occasion => message.includes(occasion));
            },

            size: (message) => {
                const sizeMatch = message.match(/size\s*(xs|s|m|l|xl|xxl|\d+)/i);
                return sizeMatch ? sizeMatch[1].toLowerCase() : null;
            },

            gender: (message) => {
                if (message.includes('women') || message.includes('female') || message.includes('girl')) return 'women';
                if (message.includes('men') || message.includes('male') || message.includes('boy')) return 'men';
                return null;
            },

            category: (message) => {
                const categories = ['lehenga', 'suit', 'dress', 'gown', 'saree', 'sherwani', 'jodhpuri'];
                return categories.find(category => message.includes(category));
            }
        };
    }

    initializeSentimentKeywords() {
        return {
            positive: ['good', 'great', 'excellent', 'amazing', 'wonderful', 'perfect', 'love', 'like', 'beautiful', 'nice', 'awesome', 'fantastic', 'brilliant'],
            negative: ['bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'ugly', 'poor', 'worst', 'disappointing'],
            very_positive: ['outstanding', 'incredible', 'phenomenal', 'extraordinary', 'magnificent', 'superb'],
            very_negative: ['disgusting', 'appalling', 'dreadful', 'abysmal', 'atrocious']
        };
    }

    initializeSynonyms() {
        return {
            'dress': ['gown', 'outfit', 'attire'],
            'suit': ['formal wear', 'business attire'],
            'cheap': ['affordable', 'budget', 'inexpensive'],
            'expensive': ['costly', 'pricey', 'high-end'],
            'beautiful': ['gorgeous', 'stunning', 'elegant'],
            'wedding': ['marriage', 'ceremony', 'celebration'],
            'party': ['celebration', 'event', 'function']
        };
    }
}

// AI-Powered Chatbot Functionality
class VastraRentChatbot {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.responses = this.initializeResponses();
        // Add AI API configuration
        this.aiApiKey = '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';
        this.aiApiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        this.conversationContext = {
            userPreferences: {},
            currentTopic: null,
            previousQuestions: [],
            userSentiment: 'neutral',
            sessionData: {
                viewedItems: [],
                searchHistory: [],
                preferredCategories: [],
                priceRange: null,
                occasion: null,
                size: null,
                gender: null
            }
        };
        this.aiEngine = new ChatbotAI();
        
        // Initialize inventory data as empty array, will be loaded later
        this.inventoryData = [];
        this.inventoryLoadAttempts = 0;
        this.maxInventoryLoadAttempts = 10;

        // Load persistent state
        this.loadPersistentState();

        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();

        // Start inventory loading process
        this.startInventoryLoading();

        // Restore chat messages after HTML is created
        setTimeout(() => {
            console.log('Initializing chatbot with', this.messages.length, 'saved messages');

            if (this.hasPersistentData && this.messages.length > 0) {
                // Restore conversation
                this.restoreChatMessages();
                this.addContinuationMessage();

                // Add visual indicator for persistent history
                const header = document.querySelector('.chatbot-header');
                if (header) {
                    header.classList.add('has-history');
                }

                console.log('Conversation restored successfully');
            } else {
                // Show welcome message for new conversations
                this.showWelcomeMessage();
                console.log('Starting new conversation');
            }
        }, 200);

        // Handle page navigation and persistence
        this.handlePageNavigation();
        this.addPageContext();

        // Add loaded class for animation
        setTimeout(() => {
            const container = document.querySelector('.chatbot-container');
            if (container) {
                container.classList.add('loaded');
            }           
        }, 500);
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div class="chatbot-container">
                <button class="chatbot-toggle" id="chatbot-toggle">
                    <i class="fas fa-comments"></i>
                    <i class="fas fa-times"></i>
                    <div class="chatbot-notification show" id="chatbot-notification">1</div>
                </button>
                
                <div class="chatbot-window" id="chatbot-window">
                    <div class="chatbot-header">
                        <div class="chatbot-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="chatbot-info">
                            <h3>Vastra Assistant</h3>
                            <p>Here to help with your rental needs</p>
                        </div>
                        <div class="chatbot-controls">
                            <button class="clear-chat-btn" id="clear-chat-btn" title="Clear Chat History">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                            <div class="chatbot-status">
                                <div class="status-dot"></div>
                                <span>Online</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chatbot-messages" id="chatbot-messages">
                        <div class="welcome-message">
                            <h4>👋 Welcome to Vastra Rent!</h4>
                            <p>I'm here to help you find the perfect outfit for your special occasion.</p>
                        </div>
                    </div>
                    
                    <div class="chatbot-input">
                        <div class="input-container">
                            <textarea 
                                id="chatbot-textarea" 
                                placeholder="Type your message..."
                                rows="1"
                            ></textarea>
                            <button class="send-button" id="send-button">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    bindEvents() {
        const toggle = document.getElementById('chatbot-toggle');
        const window = document.getElementById('chatbot-window');
        const textarea = document.getElementById('chatbot-textarea');
        const sendButton = document.getElementById('send-button');

        // Check if elements exist before binding events
        if (!toggle || !textarea || !sendButton) {
            console.error('Chatbot elements not found. Cannot bind events.');
            return;
        }

        // Toggle chatbot
        toggle.addEventListener('click', () => this.toggleChatbot());

        // Send message on button click
        sendButton.addEventListener('click', () => this.sendMessage());

        // Send message on Enter key (Shift+Enter for new line)
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px';
        });

        // Clear chat button with confirmation
        const clearChatBtn = document.getElementById('clear-chat-btn');
        if (clearChatBtn) {
            let confirmTimeout;
            clearChatBtn.addEventListener('click', (e) => {
                e.stopPropagation();

                if (clearChatBtn.classList.contains('confirming')) {
                    // Second click - actually clear
                    this.clearChatHistory();
                    clearChatBtn.classList.remove('confirming');
                    clearTimeout(confirmTimeout);
                } else {
                    // First click - show confirmation
                    clearChatBtn.classList.add('confirming');
                    clearChatBtn.title = 'Click again to confirm';

                    // Reset after 3 seconds
                    confirmTimeout = setTimeout(() => {
                        clearChatBtn.classList.remove('confirming');
                        clearChatBtn.title = 'Clear Chat History';
                    }, 3000);
                }
            });
        }

        // Close chatbot when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.chatbot-container') && this.isOpen) {
                this.toggleChatbot();
            }
        });
    }

    toggleChatbot() {
        const toggle = document.getElementById('chatbot-toggle');
        const chatWindow = document.getElementById('chatbot-window');
        const notification = document.getElementById('chatbot-notification');

        if (!toggle || !chatWindow) {
            console.error('Chatbot elements not found. Cannot toggle.');
            return;
        }

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            toggle.classList.add('active');
            chatWindow.classList.add('active');
            if (notification) {
                notification.classList.remove('show');
                notification.classList.add('hide');
            }
            document.getElementById('chatbot-textarea').focus();
        } else {
            toggle.classList.remove('active');
            chatWindow.classList.remove('active');
        }

        // Save state when toggling
        this.savePersistentState();
    }

    sendMessage() {
        const textarea = document.getElementById('chatbot-textarea');
        
        if (!textarea) {
            console.error('Textarea not found. Cannot send message.');
            return;
        }
        
        const message = textarea.value.trim();

        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage(message, 'user');
        textarea.value = '';
        textarea.style.height = 'auto';

        // Show typing indicator and respond
        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            this.respondToMessage(message);
        }, 1000 + Math.random() * 1000); // Random delay for realism
    }

    addMessage(content, sender, showQuickActions = false) {
        const messagesContainer = document.getElementById('chatbot-messages');
        
        if (!messagesContainer) {
            console.error('Messages container not found. Cannot add message.');
            return;
        }
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const messageHTML = `
            <div class="message ${sender}">
                <div class="message-avatar">
                    <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
                </div>
                <div class="message-content">
                    ${content}
                    <div class="message-time">${time}</div>
                    ${showQuickActions ? this.getQuickActionsHTML() : ''}
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();

        // Bind quick action events
        if (showQuickActions) {
            this.bindQuickActions();
        }
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        
        if (!messagesContainer) {
            console.error('Messages container not found. Cannot show typing indicator.');
            return;
        }
        
        this.isTyping = true;

        const typingHTML = `
            <div class="message bot typing-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="typing-indicator">
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
        this.isTyping = false;
    }

    async respondToMessage(message) {
        // Update conversation context
        this.updateConversationContext(message);

        // Analyze user sentiment
        const sentiment = this.aiEngine.analyzeSentiment(message);
        this.conversationContext.userSentiment = sentiment;

        // Extract entities and intent
        const analysis = this.aiEngine.analyzeMessage(message);

        // Generate AI-powered response
        const response = await this.generateAIResponse(message.toLowerCase(), analysis);

        // Determine if quick actions should be shown based on context
        const showQuickActions = this.shouldShowQuickActions(analysis);

        this.addMessage(response, 'bot', showQuickActions);

        // Learn from interaction
        this.aiEngine.learnFromInteraction(message, response, this.conversationContext);
    }

    generateResponse(message) {
        try {
            // Validate input
            if (!message || typeof message !== 'string') {
                return "I didn't receive a valid message. Please try again.";
            }
            
            // Initialize enhanced conversation engine if not exists
            if (!this.conversationEngine) {
                this.conversationEngine = new EnhancedConversationEngine();
            }
            
            // Get current inventory data
            const inventoryData = this.inventoryData || [];
            
            // Analyze the message
            const analysis = this.conversationEngine.analyzeMessage(message);
            
            // Generate personalized response
            const response = this.conversationEngine.generatePersonalizedResponse(analysis, inventoryData);
            
            return response || "I'm sorry, I couldn't process your request. Please try rephrasing your question.";
        } catch (error) {
            console.error('Error generating response:', error);
            return "I encountered an error processing your message. Please try again.";
        }
    }

    // Enhanced AI-powered response generation
    async generateAIResponse(message, analysis) {
        try {
            // First try to get AI response from OpenAI API
            const aiResponse = await this.getAIResponse(message, analysis);
            if (aiResponse) {
                return aiResponse;
            }
        } catch (error) {
            console.warn('AI API failed, falling back to local processing:', error);
        }

        // Fallback to existing logic if AI API fails
        const { intent, entities, sentiment, confidence } = analysis;

        switch (intent) {
            case 'product_search':
                return await this.handleProductSearch(message, entities, sentiment);
            case 'price_inquiry':
                return this.handlePriceInquiry(entities, sentiment);
            case 'size_inquiry':
                return this.handleSizeInquiry(sentiment);
            case 'availability':
                return this.handleAvailabilityInquiry(entities, sentiment);
            case 'company_info':
                return this.handleCompanyInfo(message, sentiment);
            case 'contact_info':
                return this.handleContactInfo(sentiment);
            case 'delivery_inquiry':
                return this.handleDeliveryInquiry(sentiment);
            case 'return_policy':
                return this.handleReturnPolicy(sentiment);
            default:
                return this.handleGeneralInquiry(message, analysis);
        }
    }

    // Enhanced AI response generation with improved accuracy
    async getAIResponse(userMessage, analysis) {
        try {
            const systemPrompt = this.buildSystemPrompt();
            const conversationHistory = this.buildConversationHistory();
            
            const response = await fetch(this.aiApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.aiApiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Vastra Rent Chatbot'
                },
                body: JSON.stringify({
                    model: 'meta-llama/llama-3.1-8b-instruct:free',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        ...conversationHistory,
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    max_tokens: 150, // Reduced from 300 for more concise responses
                    temperature: 0.3, // Reduced from 0.7 for more focused responses
                    top_p: 0.8, // Reduced from 0.9 for better accuracy
                    frequency_penalty: 0.3, // Added to reduce repetition
                    presence_penalty: 0.2 // Added to encourage focused responses
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                let aiResponse = data.choices[0].message.content.trim();
                
                // Enhanced post-processing for accuracy
                aiResponse = this.enhancedPostProcessing(aiResponse, userMessage, analysis);
                
                return aiResponse;
            }
            
            return null;
        } catch (error) {
            console.error('AI API Error:', error);
            return null;
        }
    }

    // Enhanced system prompt for better accuracy and specificity
    buildSystemPrompt() {
        // Get current inventory data for context
        const inventoryContext = this.buildInventoryContext();
        
        return `You are a precise AI assistant for Vastra Rent, a clothing rental service in Vadodara, Gujarat, India.

COMPANY DATA:
- Founded: 2025 | CEO: Vinit Prajapati
- Team: Shreyash Vekariya (CFO), Krinal Thummar (CTO)
- Location: Vadodara, Gujarat 390019
- Contact: +91 9898471702, +91 7984291916, +91 9574946483
- Email: project172305@gmail.com
- Hours: Mon-Fri 9am-6pm, Sat 10am-4pm, Closed Sunday

SERVICES:
- Rental prices: ₹1,800-₹4,500 per day (duration-based)
- Weekly rentals: ₹4,800-₹12,000 per week
- Free delivery/pickup in Vadodara
- Same-day express delivery available
- Sizes: XS-4XL with alterations
- Weekly discounts: up to 30%

PRICING STRUCTURE:
Men's Clothing:
- Tuxedos: ₹2,500/day, ₹6,500/week
- Suits: ₹2,000/day, ₹5,500/week  
- Sherwanis: ₹3,500/day, ₹9,000/week
- Blazers: ₹2,200/day, ₹6,000/week
- Kurtas: ₹1,800/day, ₹4,800/week
- Jodhpuris: ₹2,800/day, ₹7,200/week
- Indo-western: ₹2,500/day, ₹6,500/week

Women's Clothing:
- Gowns: ₹2,800/day, ₹7,500/week
- Anarkalis: ₹3,200/day, ₹8,500/week
- Lehengas: ₹4,500/day, ₹12,000/week
- Shararas: ₹2,800/day, ₹7,500/week

CURRENT INVENTORY DATA:
${inventoryContext}

RESPONSE RULES:
1. Answer ONLY what is asked - be direct and specific
2. Maximum 2-3 sentences per response
3. Use ONLY the inventory data provided above for product suggestions
4. If information unavailable, say "I'll need to check that for you"
5. No unnecessary elaboration or marketing language
6. Focus on the specific question asked
7. Provide actionable information only
8. When suggesting items, use ONLY items from the current inventory data

EXAMPLES:
Q: "What are your prices?" A: "Our rental prices range from ₹1,800-₹4,500 per day depending on the item and duration. We also offer weekly discounts up to 30%."
Q: "Do you deliver?" A: "Yes, we provide free home delivery and pickup within Vadodara. Same-day express delivery is also available."

Be precise, helpful, and stick to facts only. Only suggest items that exist in the current inventory data.`;
    }

    // Build inventory context for AI
    buildInventoryContext() {
        if (!this.inventoryData || this.inventoryData.length === 0) {
            return "No inventory data available.";
        }
        
        // Group items by category and gender
        const categories = {};
        this.inventoryData.forEach(item => {
            // Check if item has required properties
            if (!item || !item.category || !item.gender || !item.name) {
                return; // Skip invalid items
            }
            
            if (!categories[item.category]) {
                categories[item.category] = { men: [], women: [] };
            }
            if (item.available) {
                categories[item.category][item.gender].push({
                    id: item.id,
                    name: item.name,
                    price: item.price || 0,
                    size: item.size || 'N/A'
                });
            }
        });
        
        let context = "Available Items by Category:\n";
        Object.keys(categories).forEach(category => {
            context += `\n${category}:\n`;
            if (categories[category].men.length > 0) {
                context += `  Men: ${categories[category].men.map(item => `${item.name} (₹${item.price}/day, Size: ${item.size})`).join(', ')}\n`;
            }
            if (categories[category].women.length > 0) {
                context += `  Women: ${categories[category].women.map(item => `${item.name} (₹${item.price}/day, Size: ${item.size})`).join(', ')}\n`;
            }
        });
        
        return context;
    }

    // Build conversation history for context
    buildConversationHistory() {
        // Get last 6 messages for context (3 exchanges)
        const recentMessages = this.messages.slice(-6);
        
        return recentMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));
    }

    // Enhanced post-processing for better accuracy
    enhancedPostProcessing(aiResponse, userMessage, analysis) {
        // Check if aiResponse is valid
        if (!aiResponse || typeof aiResponse !== 'string') {
            return 'I apologize, but I encountered an issue processing your request. Please try again.';
        }
        
        // Remove unnecessary phrases and make response more direct
        aiResponse = aiResponse
            .replace(/I'd be happy to help!/gi, '')
            .replace(/That's a great question!/gi, '')
            .replace(/Absolutely!/gi, '')
            .replace(/Of course!/gi, '')
            .replace(/Let me tell you/gi, '')
            .replace(/Here's what I can tell you/gi, '')
            .trim();

        // Ensure response starts with direct answer
        if (aiResponse.startsWith(',') || aiResponse.startsWith('.')) {
            aiResponse = aiResponse.substring(1).trim();
        }

        // Limit response length for specificity
        const sentences = aiResponse.split('. ');
        if (sentences.length > 3) {
            aiResponse = sentences.slice(0, 3).join('. ') + '.';
        }

        // Handle inventory display logic
        const lowerMessage = userMessage.toLowerCase();
        const lowerResponse = aiResponse.toLowerCase();
        
        if ((lowerMessage.includes('show') || lowerMessage.includes('see') || lowerResponse.includes('here are') || lowerResponse.includes('let me show')) && 
            (lowerMessage.includes('lehenga') || lowerMessage.includes('dress') || lowerMessage.includes('suit') || 
             lowerMessage.includes('inventory') || lowerMessage.includes('collection') || lowerMessage.includes('items'))) {
            
            let filterType = null;
            if (lowerMessage.includes('lehenga')) filterType = 'lehenga';
            else if (lowerMessage.includes('jodhpuri')) filterType = 'jodhpuri';
            else if (lowerMessage.includes('formal') || lowerMessage.includes('wedding')) filterType = 'formal';
            else if (lowerMessage.includes('casual')) filterType = 'casual';
            else if (lowerMessage.includes('party')) filterType = 'party';
            
            setTimeout(() => this.showInventoryItems(filterType), 1000);
        }

        return aiResponse;
    }

    async handleProductSearch(message, entities, sentiment) {
        // Update session data with extracted entities
        if (entities.category) this.conversationContext.sessionData.preferredCategories.push(entities.category);
        if (entities.occasion) this.conversationContext.sessionData.occasion = entities.occasion;
        if (entities.size) this.conversationContext.sessionData.size = entities.size;
        if (entities.gender) this.conversationContext.sessionData.gender = entities.gender;
        if (entities.price_range) this.conversationContext.sessionData.priceRange = entities.price_range;

        // Generate personalized recommendations
        const recommendations = this.aiEngine.generateRecommendations(this.conversationContext);

        // Show inventory based on context
        const filterType = entities.category || entities.occasion || null;
        setTimeout(() => this.showInventoryItems(filterType, recommendations), 1000);

        // Generate contextual response based on sentiment and entities
        let response = this.generateContextualResponse(entities, sentiment);

        if (recommendations.length > 0) {
            response += " I've curated some personalized recommendations based on your preferences!";
        }

        return response;
    }

    generateContextualResponse(entities, sentiment) {
        let response = "";

        // Sentiment-based greeting
        if (sentiment === 'positive' || sentiment === 'very_positive') {
            response = "I love your enthusiasm! ";
        } else if (sentiment === 'negative') {
            response = "I understand your concerns. Let me help you find something perfect! ";
        }

        // Entity-based response
        if (entities.occasion) {
            const occasionResponses = {
                'wedding': "Weddings are such special occasions! Here are some stunning options perfect for the celebration:",
                'party': "Time to party in style! Here are some amazing outfits that will make you shine:",
                'business': "Professional and elegant! Here are some business attire options:",
                'casual': "Comfort meets style! Here are some great casual wear options:",
                'festival': "Festival season calls for vibrant and beautiful outfits! Here's what I recommend:"
            };
            response += occasionResponses[entities.occasion] || "Here are some great options for your occasion:";
        } else if (entities.category) {
            const categoryResponses = {
                'lehenga': "Lehengas are absolutely gorgeous! Here are some beautiful options:",
                'suit': "Sharp and sophisticated! Here are some excellent suit options:",
                'dress': "Dresses are so versatile! Here are some lovely options:",
                'gown': "Elegant and glamorous! Here are some stunning gown options:"
            };
            response += categoryResponses[entities.category] || "Here are some great options in that category:";
        } else {
            response += "Let me show you our curated collection:";
        }

        return response;
    }

    handlePriceInquiry(entities, sentiment) {
        let response = "";

        if (sentiment === 'negative') {
            response = "I understand budget is important! ";
        }

        if (entities.price_range) {
            response += `Great! I can show you options in your budget range of ₹${entities.price_range.min}-₹${entities.price_range.max}. `;
        }

        response += "Our rental prices are very competitive! Most outfits range from ₹1,800-₹4,500 depending on the item and rental duration. We also offer weekly discounts that can save you up to 30%!";

        if (entities.occasion) {
            response += ` For ${entities.occasion} occasions, we have options starting from ₹1,800.`;
        }

        return response;
    }

    handleSizeInquiry(sentiment) {
        return "Perfect question! We provide detailed size charts and virtual fitting consultations. Our sizes range from XS to 4XL, and we also offer minor alterations to ensure the perfect fit. Would you like me to help you determine your size or show you our size guide?";
    }

    handleAvailabilityInquiry(entities, sentiment) {
        let response = "Let me check availability for you! ";

        if (entities.category) {
            response += `We currently have several ${entities.category} options available. `;
        }

        response += "Most of our items are available for immediate rental, and I can show you real-time availability. Would you like to see what's available for your preferred dates?";

        return response;
    }

    handleCompanyInfo(message, sentiment) {
        if (message.includes('ceo') || message.includes('founder')) {
            return "Our CEO and founder is Vinit Prajapati! He established Vastra Rent in 2025 with a vision to make premium fashion accessible through smart rental solutions. He's passionate about transforming how businesses handle inventory efficiently and effortlessly.";
        }

        if (message.includes('team')) {
            return "We have an amazing leadership team! Vinit Prajapati leads as our Founder & CEO, Shreyash Vekariya handles operations as our Co-founder & CFO, and Krinal Thummar curates our collection as our Fashion Director & CTO. Together, we're revolutionizing the fashion rental industry!";
        }

        return "Vastra Rent was founded in 2025 as a premium clothing rental service. We're based in Vadodara, Gujarat, and we focus on sustainability, quality, accessibility, and community building. Our mission is to make premium fashion available to everyone while reducing environmental impact!";
    }

    handleContactInfo(sentiment) {
        return "I'd be happy to help you get in touch! You can reach us at:\n📍 Vadodara, Gujarat, IN 390019\n📞 +91 9898471702 / +91 7984291916 / +91 9574946483\n📧 project172305@gmail.com\n\nOur business hours are Monday-Friday 9am-6pm, Saturday 10am-4pm. We're closed on Sundays. Is there anything specific you'd like to discuss with our team?";
    }

    handleDeliveryInquiry(sentiment) {
        return "Great question about delivery! We offer free home delivery and pickup within Vadodara city. Standard delivery takes 1-2 days, and we also have express same-day delivery available for urgent needs. We handle all the logistics so you can focus on looking amazing! What's your location?";
    }

    handleReturnPolicy(sentiment) {
        return "Our return process is super simple and hassle-free! We'll pick up the items from your location within your rental period. Just ensure the items are returned in the same condition (normal wear is totally fine). We handle all the cleaning and maintenance. Need help scheduling a return or have specific concerns?";
    }

    handleGeneralInquiry(message, analysis) {
        // Use learning data to provide better responses
        const similarInteractions = this.findSimilarInteractions(message);

        if (similarInteractions.length > 0) {
            const bestMatch = similarInteractions[0];
            return this.adaptResponse(bestMatch.botResponse, analysis.sentiment);
        }

        // Sentiment-based default responses
        const sentimentResponses = {
            'positive': [
                "I love your enthusiasm! I'm here to help you find the perfect outfit. What are you looking for?",
                "That's wonderful! Let me assist you in finding something amazing for your needs.",
                "Great to hear! I'm excited to help you discover our beautiful collection."
            ],
            'negative': [
                "I understand your concerns, and I'm here to help make things better! What can I assist you with?",
                "I hear you, and I want to ensure you have a great experience. How can I help?",
                "Let me help turn this around for you! What would you like to know about our service?"
            ],
            'neutral': [
                "I'm here to help you with all your fashion rental needs! What would you like to know?",
                "Thanks for reaching out! I can assist you with finding outfits, pricing, delivery, or any other questions.",
                "I'd be happy to help! Whether you're looking for a specific outfit or just browsing, I'm here for you."
            ]
        };

        const responses = sentimentResponses[analysis.sentiment] || sentimentResponses['neutral'];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    findSimilarInteractions(message) {
        const keywords = this.aiEngine.extractKeywords(message);

        return this.aiEngine.learningData.interactions
            .filter(interaction => {
                const interactionKeywords = this.aiEngine.extractKeywords(interaction.userMessage);
                const commonKeywords = keywords.filter(k => interactionKeywords.includes(k));
                return commonKeywords.length > 0;
            })
            .sort((a, b) => {
                const aKeywords = this.aiEngine.extractKeywords(a.userMessage);
                const bKeywords = this.aiEngine.extractKeywords(b.userMessage);
                const aCommon = keywords.filter(k => aKeywords.includes(k)).length;
                const bCommon = keywords.filter(k => bKeywords.includes(k)).length;
                return bCommon - aCommon;
            })
            .slice(0, 3);
    }

    adaptResponse(originalResponse, currentSentiment) {
        // Adapt the response tone based on current sentiment
        if (currentSentiment === 'negative') {
            return "I understand your concerns. " + originalResponse;
        } else if (currentSentiment === 'positive') {
            return "I'm glad you're interested! " + originalResponse;
        }
        return originalResponse;
    }

    updateConversationContext(message) {
        this.conversationContext.previousQuestions.push(message);

        // Keep only last 5 questions for context
        if (this.conversationContext.previousQuestions.length > 5) {
            this.conversationContext.previousQuestions.shift();
        }

        // Update search history
        const keywords = this.aiEngine.extractKeywords(message);
        this.conversationContext.sessionData.searchHistory.push(...keywords);
    }

    shouldShowQuickActions(analysis) {
        // Only show quick actions for greetings and when user seems lost
        if (analysis.intent === 'greeting') return true;
        if (analysis.confidence < 0.2) return true; // Only when very uncertain
        return false; // Don't show quick actions for other intents
    }

    matchesPattern(message, pattern) {
        // Simple pattern matching for better responses
        const keywords = pattern.split(' ');
        return keywords.some(keyword => message.includes(keyword));
    }

    initializeResponses() {
        return {
            'hello': [
                "Hello! Welcome to Vastra Rent! 👋 How can I help you find the perfect outfit today?",
                "Hi there! I'm excited to help you discover amazing rental options. What occasion are you shopping for?",
                "Hello! Great to see you here. What kind of outfit are you looking for?"
            ],
            'hi': [
                "Hi! Welcome to Vastra Rent! How can I assist you today?",
                "Hey there! Ready to find your perfect rental outfit?",
                "Hi! I'm here to help you with all your clothing rental needs."
            ],
            'ceo': [
                "Our CEO is Vinit Prajapati, the founder of Vastra Rent! He's passionate about transforming how businesses handle inventory efficiently and effortlessly. You can connect with him on LinkedIn!",
                "Vinit Prajapati is our Founder & CEO. He founded Vastra Rent in 2025 with a vision to make premium fashion accessible through smart rental solutions.",
                "Our CEO Vinit Prajapati leads the company with a focus on innovation and customer satisfaction in the fashion rental industry."
            ],
            'founder': [
                "Vastra Rent was founded by Vinit Prajapati in 2025. He started this company to make premium fashion accessible to everyone through our rental service.",
                "Our founder Vinit Prajapati established Vastra Rent as a go-to platform for smart fashion choices, focusing on affordability and convenience."
            ],
            'team': [
                "Our amazing team includes:\n• Vinit Prajapati - Founder & CEO\n• Shreyash Vekariya - Co-founder & CFO (Logistics expert)\n• Krinal Thummar - Fashion Director & CTO\n\nTogether, we're revolutionizing the fashion rental industry!",
                "We have a fantastic leadership team! Vinit leads as CEO, Shreyash handles operations as CFO, and Krinal curates our collection as Fashion Director & CTO."
            ],
            'company': [
                "Vastra Rent was founded in 2025 as a simple website for renting occasional clothes. We've grown into a user-friendly platform focusing on affordability, convenience, and sustainability in fashion.",
                "We're a premium clothing rental service based in Vadodara, Gujarat. Since 2025, we've been helping people access high-quality fashion for special occasions without the commitment of buying."
            ],
            'about': [
                "Vastra Rent is your premium clothing rental service founded in 2025. We believe in making fashion accessible, sustainable, and convenient. Our mission is to reduce fashion waste while helping you look amazing for any occasion!",
                "We're a fashion rental platform that started in Vadodara, Gujarat. We focus on sustainability, quality, accessibility, and community - making premium fashion available to everyone."
            ],
            'contact': [
                "You can reach us at:\n📍 Vadodara, Gujarat, IN 390019\n📞 +91 9898471702 / +91 7984291916 / +91 9574946483\n📧 project172305@gmail.com\n\nBusiness Hours: Mon-Fri 9am-6pm, Sat 10am-4pm, Closed Sunday",
                "Our contact details:\nPhone: +91 9898471702, +91 7984291916, +91 9574946483\nEmail: project172305@gmail.com\nLocation: Vadodara, Gujarat\nWe're available Mon-Fri 9am-6pm!"
            ],
            'location': [
                "We're located in Vadodara, Gujarat, India (PIN: 390019). We provide free delivery and pickup services in the city!",
                "Our base is in Vadodara, Gujarat. We offer free home delivery and pickup within the city, with express same-day delivery available for urgent needs."
            ],
            'mission': [
                "Our mission is built on four core values:\n🌱 Sustainability - Reducing fashion waste\n⭐ Quality - Curating only the finest clothing\n🤝 Accessibility - Premium fashion for all budgets\n❤️ Community - Building a fashion-conscious community",
                "We're committed to sustainability, quality, accessibility, and community building. We want to make premium fashion available to everyone while reducing environmental impact."
            ],
            'lehenga': [
                "Beautiful choice! We have stunning lehengas perfect for weddings, festivals, and special occasions. Let me show you some options from our inventory! Would you like to see our lehenga collection?",
                "Our lehenga collection is amazing! We have traditional and contemporary designs from ₹4,500/day. I can help you browse our current lehenga inventory - shall I show you what's available?",
                "Lehengas are so popular! We have bridal, party, and festival lehengas. Let me help you explore our lehenga inventory right now!"
            ],
            'inventory': [
                "I can help you browse our complete inventory! We have formal wear, casual wear, business attire, party wear, and seasonal collections for both men and women. Would you like me to show you specific categories?",
                "Our inventory includes amazing options for every occasion! I can show you our current collection and help you find exactly what you need. What type of outfit interests you?",
                "Let me help you explore our inventory! We have over 50+ items including suits, dresses, traditional wear, and more. Shall I show you what's available?"
            ],
            'jodhpuri': [
                "Excellent choice! We have elegant Jodhpuri suits perfect for formal events and traditional occasions. Our Jodhpuri White is very popular - would you like me to show you this and other similar options?",
                "Jodhpuri suits are perfect for formal occasions! We have several styles available. Let me show you our Jodhpuri collection from our inventory."
            ],
            'show inventory': [
                "I'd love to show you our inventory! Let me display our current collection for you to browse.",
                "Perfect! Here's our current inventory with all available items. You can click on any item to see more details!"
            ],
            'browse': [
                "Great! I can help you browse our collection. What are you looking for specifically? I can show you our inventory organized by category, gender, or occasion.",
                "Let's browse together! I can display our inventory and help you filter by what you need. What type of outfit or occasion are you shopping for?"
            ],
            'help': [
                "I'm here to help! I can assist you with:\n• Finding outfits for specific occasions\n• Rental pricing and duration\n• Size and fit guidance\n• Booking and delivery information\n• Account and order support",
                "Of course! I can help you with outfit selection, rental terms, sizing, delivery, and any questions about our service.",
                "I'd love to help! What specific information do you need about our rental service?"
            ],
            'price': [
                "Our rental prices vary by item and duration. Most outfits range from ₹1,800-₹4,500 per day. Would you like me to help you find something specific?",
                "Pricing depends on the outfit and rental period. Designer pieces start from ₹1,800 per day. What type of outfit are you interested in?",
                "Great question! Rental costs vary by item. Traditional wear typically ranges ₹1,800-₹4,500 per day. Shall I show you some options?"
            ],
            'cost': [
                "Rental costs depend on the item and duration. Most pieces are ₹1,800-₹4,500 per day. What occasion are you shopping for?",
                "Our pricing is quite competitive! Weekly rentals range from ₹4,800-₹12,000. Would you like to see some specific categories?",
                "Costs vary by outfit type and rental length. Designer pieces start around ₹1,800 per day. What's your budget range?"
            ],
            'lehenga': [
                "Beautiful choice! We have stunning lehengas perfect for weddings, festivals, and special occasions. Prices start from ₹4,500 per day. Would you like to see our collection?",
                "Our lehenga collection is amazing! We have traditional and contemporary designs at ₹4,500/day. What's the occasion?",
                "Lehengas are so popular! We have bridal, party, and festival lehengas. Shall I show you some options based on your event?"
            ],
            'wedding': [
                "Congratulations! 🎉 We have an extensive bridal and wedding guest collection. Are you the bride or attending as a guest?",
                "How exciting! Our wedding collection includes lehengas, sarees, sherwanis, and suits. What role will you be playing at the wedding?",
                "Perfect timing! We specialize in wedding attire. Are you looking for bridal wear or guest outfits?"
            ],
            'size': [
                "We offer sizes from XS to 4XL and provide detailed size charts. We also offer virtual fitting consultations. What size do you usually wear?",
                "Size is important! We have comprehensive sizing and offer alterations if needed. Would you like help finding your perfect fit?",
                "Great question! We carry all sizes and provide fitting guidance. Our team can help ensure the perfect fit for your rental."
            ],
            'delivery': [
                "We offer free delivery and pickup within the city! Delivery usually takes 1-2 days. Where would you like your outfit delivered?",
                "Delivery is free and typically arrives within 24-48 hours. We also offer express same-day delivery for urgent needs. What's your location?",
                "We provide free home delivery and pickup! Standard delivery is 1-2 days, express is same-day. Where are you located?"
            ],
            'return': [
                "Returns are easy! Just schedule a pickup within your rental period. Items should be returned in the same condition. Any specific concerns?",
                "Our return process is simple - we'll pick up from your location. Just ensure items are in good condition. Need help scheduling a return?",
                "Returns are hassle-free! We handle pickup and cleaning. Just let us know when you're ready to return your items."
            ],
            'booking': [
                "Booking is simple! Browse our collection, select your dates, choose size, and checkout. Would you like me to guide you through the process?",
                "Easy booking process! Just pick your outfit, rental dates, and we'll handle the rest. Ready to start browsing?",
                "Booking takes just a few minutes! Select items, choose dates, confirm size, and you're done. Shall we start?"
            ],
            'occasion': [
                "We cater to all occasions! Weddings, parties, festivals, corporate events, dates, and more. What's your special event?",
                "Perfect! We have outfits for every occasion - traditional ceremonies, modern parties, professional events. What's the event?",
                "Great question! Whether it's a wedding, party, festival, or business event, we've got you covered. What's the occasion?"
            ],
            'thank': [
                "You're very welcome! Happy to help make your special occasion perfect! 😊",
                "My pleasure! I hope you find the perfect outfit for your event!",
                "You're welcome! Feel free to ask if you need anything else!"
            ],
            'bye': [
                "Goodbye! Thanks for choosing Vastra Rent. Have a wonderful day! 👋",
                "See you later! Don't hesitate to reach out if you need any help!",
                "Bye! Hope to help you again soon. Enjoy your special occasion!"
            ]
        };
    }

    getQuickActionsHTML() {
        // All questions from the images - displayed together
        const actions = [
            // Set 1 - Customer Service Questions
            "Can I cancel or change my order?",
            "What happens if I return the item late?",
            "What if the outfit is damaged or stained?",
            "Can I buy an outfit I love?",
            "How can I get help picking an outfit?",
            "When is the deposit returned?",
            
            // Set 2 - Instant Answers
            "Track my order",
            "How do I pick the correct size?",
            "How can I be sure the outfit will fit?",
            "How does women's (or men's) sizing work through you?",
            "What is the security deposit used for?",
            "What are the shipping details?",
            "How long will my order take to arrive?",
            "How does return shipping work?",
            "Can I get expedited shipping?"
        ];

        // Display ALL questions instead of random selection
        return `
            <div class="quick-actions">
                ${actions.map(action => `<button class="quick-action" data-action="${action}"><i class="fas fa-${this.getActionIcon(action)}"></i> ${action}</button>`).join('')}
            </div>
        `;
    }

    getActionIcon(action) {
        const icons = {
            // Icons for all the new questions
            "Can I cancel or change my order?": "edit",
            "What happens if I return the item late?": "clock",
            "What if the outfit is damaged or stained?": "exclamation-triangle",
            "Can I buy an outfit I love?": "heart",
            "How can I get help picking an outfit?": "hands-helping",
            "When is the deposit returned?": "money-bill-wave",
            "Track my order": "search",
            "How do I pick the correct size?": "ruler-combined",
            "How can I be sure the outfit will fit?": "check-circle",
            "How does women's (or men's) sizing work through you?": "venus-mars",
            "What is the security deposit used for?": "shield-alt",
            "What are the shipping details?": "shipping-fast",
            "How long will my order take to arrive?": "calendar-alt",
            "How does return shipping work?": "undo",
            "Can I get expedited shipping?": "rocket"
        };
        return icons[action] || "star";
    }

    bindQuickActions() {
        document.querySelectorAll('.quick-action').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    handleQuickAction(action) {
        const responses = {
            // Comprehensive answers for all questions
            "Can I cancel or change my order?": "Yes! You can cancel or modify your order up to 24 hours before delivery. For cancellations, you'll receive a full refund minus processing fees. For changes, contact our support team and we'll help you update your order details like size, delivery date, or items.",
            
            "What happens if I return the item late?": "Late returns incur additional charges of ₹100 per day per item. We understand emergencies happen, so please contact us immediately if you need an extension. We can often arrange a grace period or help you extend your rental at discounted rates.",
            
            "What if the outfit is damaged or stained?": "Don't worry! Minor stains and normal wear are covered in your rental. For significant damage, we'll assess the repair cost and deduct it from your security deposit. We recommend treating stains immediately and contacting us for guidance on care.",
            
            "Can I buy an outfit I love?": "Absolutely! Many of our rental items are available for purchase. If you fall in love with an outfit during your rental, contact us and we'll provide a purchase price (often with a rental credit applied). Some exclusive pieces may not be available for sale.",
            
            "How can I get help picking an outfit?": "Our style experts are here to help! 👗✨ You can:\n• Chat with me for AI-powered recommendations\n• Book a virtual styling consultation (₹500)\n• Use our occasion-based filters\n• Check our style guides and lookbooks\n• Contact our personal shoppers for custom curation",
            
            "When is the deposit returned?": "Your security deposit is returned within 3-5 business days after we receive and inspect the returned items. The refund goes back to your original payment method. If there are any deductions for damage or late fees, we'll send you a detailed breakdown.",
            
            "Track my order": "You can track your order easily! 📦\n• Check your email for tracking links\n• Log into your account on our website\n• Use the order number we provided\n• Contact our support team\n• I can help you check status if you provide your order details!",
            
            "How do I pick the correct size?": "Great question! Here's how to get the perfect fit: 📏\n• Use our detailed size charts\n• Measure yourself with our guide\n• Check the specific item's fit notes\n• Consider the style (fitted vs. loose)\n• Contact us for personalized sizing help\n• We offer free minor alterations!",
            
            "How can I be sure the outfit will fit?": "We guarantee the perfect fit! ✅\n• Detailed size guides for each item\n• Virtual fitting consultations available\n• Free minor alterations included\n• Easy exchanges if size isn't right\n• Our fit specialists can help you choose\n• Customer reviews include fit feedback",
            
            "How does women's (or men's) sizing work through you?": "Our sizing system is comprehensive! 👔👗\n\n**Women's Sizing:**\n• Standard sizes: XS-4XL\n• Detailed bust, waist, hip measurements\n• Length specifications for each item\n\n**Men's Sizing:**\n• Chest, waist, and length measurements\n• Collar and sleeve specifications\n• Both Indian and international sizing\n\nWe provide conversion charts and personal assistance!",
            
            "What is the security deposit used for?": "Your security deposit protects both of us! 🛡️\n• Covers potential damage beyond normal wear\n• Ensures timely return of items\n• Protects against loss or theft\n• Typically ₹500-₹2000 per item\n• Fully refundable upon safe return\n• Transparent damage assessment process",
            
            "What are the shipping details?": "Our shipping is designed for your convenience! 🚚\n• **Free delivery & pickup** within city limits\n• **Standard delivery:** 1-2 business days\n• **Express delivery:** Same day (₹200 extra)\n• **Pickup scheduling:** Flexible timing\n• **Packaging:** Secure, eco-friendly boxes\n• **Coverage:** Pan-India delivery available",
            
            "How long will my order take to arrive?": "Delivery timing depends on your location and service: ⏰\n• **Same city:** 1-2 days (standard), same day (express)\n• **Metro cities:** 2-3 days\n• **Other cities:** 3-5 days\n• **Express option:** Available in major cities\n• **Preparation time:** 24 hours for quality check\n• **Weekend delivery:** Available with express",
            
            "How does return shipping work?": "Returns are super easy! 📦↩️\n• **Free pickup** from your location\n• **Flexible scheduling** - choose your time\n• **No packaging needed** - we bring bags\n• **Quality check** done at pickup\n• **Instant confirmation** via SMS/email\n• **Deposit refund** processed within 3-5 days",
            
            "Can I get expedited shipping?": "Yes! We offer expedited shipping! 🚀\n• **Same-day delivery** in major cities (₹200)\n• **Express 24-hour** delivery available\n• **Priority processing** for urgent orders\n• **Weekend delivery** with express service\n• **Real-time tracking** for express orders\n• **Emergency styling** consultations available"
        };

        setTimeout(() => {
            const response = responses[action];
            if (typeof response === 'function') {
                const message = response();
                this.addMessage(message, 'bot');
            } else {
                this.addMessage(response || "Thanks for your interest! How else can I help you?", 'bot');
            }
        }, 500);
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    showWelcomeMessage() {
        // Notification is already visible by default
        // Hide notification after 15 seconds if not opened
        setTimeout(() => {
            if (!this.isOpen) {
                const notification = document.getElementById('chatbot-notification');
                if (notification) {
                    notification.classList.remove('show');
                    notification.classList.add('hide');
                }
            }
        }, 15000);
    }

    // Removed old getInventoryData method - now using loaded inventory data directly

    // Show inventory items in chat with AI recommendations
    showInventoryItems(filterType = null, recommendations = null) {
        let filteredItems;

        // Use AI recommendations if provided
        if (recommendations && recommendations.length > 0) {
            filteredItems = recommendations;
        } else {
            // Use only the loaded inventory data
            filteredItems = this.inventoryData || [];
        }

        // Apply filters using loaded inventory data
        if (filterType && !recommendations) {
            const baseData = this.inventoryData || [];
            if (filterType === 'lehenga') {
                filteredItems = baseData.filter(item =>
                    item && item.name && item.description &&
                    (item.name.toLowerCase().includes('lehenga') ||
                    item.description.toLowerCase().includes('lehenga') ||
                    (item.category === 'formal' && item.gender === 'women'))
                );
            } else if (filterType === 'jodhpuri') {
                filteredItems = baseData.filter(item =>
                    item && item.name && item.description &&
                    (item.name.toLowerCase().includes('jodhpuri') ||
                    item.description.toLowerCase().includes('jodhpuri'))
                );
            } else {
                filteredItems = baseData.filter(item => item && item.category === filterType);
            }
        }

        // Limit to first 6 items for chat display
        filteredItems = filteredItems.slice(0, 6);

        if (filteredItems.length === 0) {
            this.addMessage("Sorry, I couldn't find any items matching your criteria. Would you like to see our complete inventory?", 'bot');
            return;
        }

        // Create inventory display HTML
        const inventoryHTML = this.createInventoryHTML(filteredItems);

        // Add inventory message with AI insights
        setTimeout(() => {
            const messagesContainer = document.getElementById('chatbot-messages');
            const inventoryMessage = document.createElement('div');
            inventoryMessage.className = 'message bot inventory-message';

            // Add AI insights if using recommendations
            let aiInsights = '';
            if (recommendations && recommendations.length > 0) {
                aiInsights = `
                    <div class="ai-insights">
                        <div class="ai-badge">
                            <i class="fas fa-brain"></i> AI Curated
                        </div>
                        <p>Based on your preferences and browsing history, I've selected these items specifically for you!</p>
                    </div>
                `;
            }

            inventoryMessage.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    ${aiInsights}
                    <div class="inventory-grid-chat">
                        ${inventoryHTML}
                    </div>
                    <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div class="inventory-actions">
                        <button class="quick-action" onclick="window.location.href='inventory.html'">
                            <i class="fas fa-external-link-alt"></i> View Full Inventory
                        </button>
                        ${recommendations ? '<button class="quick-action" onclick="window.vastraRentChatbot.showMoreRecommendations()"><i class="fas fa-magic"></i> More AI Suggestions</button>' : ''}
                    </div>
                </div>
            `;

            messagesContainer.appendChild(inventoryMessage);
            this.scrollToBottom();

            // Bind click events for inventory items
            this.bindInventoryItemEvents();
        }, 500);
    }

    // Create HTML for inventory items
    createInventoryHTML(items) {
        return items.map(item => `
            <div class="inventory-item-chat" data-id="${item.id}">
                <div class="item-image-chat" style="background-image: url('${item.image}');">
                    <div class="item-overlay-chat">
                        <button class="view-details-btn" data-id="${item.id}">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                </div>
                <div class="item-info-chat">
                    <h4>${item.name}</h4>
                    <p class="item-price-chat">₹${item.price}/day</p>
                    <p class="item-category-chat">${this.getCategoryName(item.category)}</p>
                    <div class="item-status-chat ${item.available ? 'available' : 'unavailable'}">
                        <i class="fas fa-${item.available ? 'check-circle' : 'times-circle'}"></i>
                        ${item.available ? 'Available' : 'Unavailable'}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Get category display name
    getCategoryName(category) {
        const categoryNames = {
            'formal': 'Formal Wear',
            'casual': 'Casual Wear',
            'business': 'Business Attire',
            'party': 'Party Wear',
            'seasonal': 'Seasonal'
        };
        return categoryNames[category] || category;
    }

    // Bind events for inventory items in chat
    bindInventoryItemEvents() {
        // Remove existing event listeners to prevent duplicates
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        
        document.querySelectorAll('.inventory-item-chat').forEach(item => {
            item.replaceWith(item.cloneNode(true));
        });

        // Add new event listeners
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const itemId = parseInt(btn.dataset.id);
                if (!isNaN(itemId)) {
                    this.handleItemClick(itemId);
                }
            });
        });

        document.querySelectorAll('.inventory-item-chat').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('view-details-btn')) {
                    const itemId = parseInt(item.dataset.id);
                    if (!isNaN(itemId)) {
                        this.handleItemClick(itemId);
                    }
                }
            });
        });
    }

    // Handle item click - redirect to product details
    handleItemClick(itemId) {
        const inventoryData = this.inventoryData || [];
        const item = inventoryData.find(i => i.id === itemId);

        if (!item) {
            this.addMessage("Sorry, I couldn't find that item. Please try again.", 'bot');
            return;
        }

        // Store item data for product details page
        const itemData = {
            ...item,
            selectedAt: new Date().toISOString(),
            source: 'chatbot'
        };

        localStorage.setItem('selectedItem', JSON.stringify(itemData));
        sessionStorage.setItem('selectedItem', JSON.stringify(itemData));
        localStorage.setItem('currentItemId', itemId.toString());

        // Show confirmation message
        this.addMessage(`Great choice! Taking you to the details page for "${item.name}". You can rent it directly from there! 🛍️`, 'bot');

        // Redirect after brief delay
        setTimeout(() => {
            window.location.href = `product-details.html?id=${itemId}`;
        }, 1500);
    }

    // Show more AI recommendations
    showMoreRecommendations() {
        const recommendations = this.aiEngine.generateRecommendations(this.conversationContext);
        this.addMessage("Here are some more AI-curated recommendations based on your preferences!", 'bot');
        setTimeout(() => this.showInventoryItems(null, recommendations), 500);
    }

    // Get AI insights about user preferences
    getAIInsights() {
        const { sessionData } = this.conversationContext;
        const insights = [];

        if (sessionData.preferredCategories.length > 0) {
            insights.push(`You seem to prefer ${sessionData.preferredCategories.join(', ')} styles`);
        }

        if (sessionData.occasion) {
            insights.push(`Looking for ${sessionData.occasion} wear`);
        }

        if (sessionData.priceRange) {
            insights.push(`Budget range: ₹${sessionData.priceRange.min}-₹${sessionData.priceRange.max}`);
        }

        return insights;
    }

    // Show notification badge
    showNotification(count = 1) {
        const notification = document.getElementById('chatbot-notification');
        if (notification && !this.isOpen) {
            notification.textContent = count;
            notification.classList.remove('hide');
            notification.classList.add('show');
        }
    }

    // Hide notification badge
    hideNotification() {
        const notification = document.getElementById('chatbot-notification');
        if (notification) {
            notification.classList.remove('show');
            notification.classList.add('hide');
        }
    }

    // Update notification count
    updateNotificationCount(count) {
        const notification = document.getElementById('chatbot-notification');
        if (notification) {
            notification.textContent = count;
            if (count > 0 && !this.isOpen) {
                notification.classList.remove('hide');
                notification.classList.add('show');
            } else {
                notification.classList.remove('show');
                notification.classList.add('hide');
            }
        }
    }

    // Generate unique session ID
    generateSessionId() {
        return 'chatbot_session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Save chatbot state to localStorage
    savePersistentState() {
        try {
            const state = {
                sessionId: this.sessionId,
                isOpen: this.isOpen,
                messages: this.messages,
                conversationContext: this.conversationContext,
                timestamp: Date.now(),
                currentPage: window.location.pathname,
                version: '1.0' // Add version for future compatibility
            };

            localStorage.setItem('vastra_chatbot_state', JSON.stringify(state));
            console.log('Saved chatbot state with', this.messages.length, 'messages');
        } catch (error) {
            console.warn('Could not save chatbot state:', error);
        }
    }

    // Start inventory loading with retry mechanism
    startInventoryLoading() {
        console.log('Starting inventory loading process...');
        this.loadInventoryDataWithRetry();
        
        // Set up periodic check for inventory data
        const inventoryCheckInterval = setInterval(() => {
            if (this.inventoryData && this.inventoryData.length > 0) {
                console.log('Inventory data successfully loaded:', this.inventoryData.length, 'items');
                clearInterval(inventoryCheckInterval);
            } else if (this.inventoryLoadAttempts < this.maxInventoryLoadAttempts) {
                this.loadInventoryDataWithRetry();
            } else {
                console.warn('Max inventory load attempts reached. Chatbot will work with limited functionality.');
                clearInterval(inventoryCheckInterval);
            }
        }, 3000);
    }

    // Load inventory data with retry mechanism
    loadInventoryDataWithRetry() {
        this.inventoryLoadAttempts++;
        console.log(`Inventory load attempt ${this.inventoryLoadAttempts}/${this.maxInventoryLoadAttempts}`);
        
        const data = this.loadInventoryData();
        if (data && data.length > 0) {
            this.inventoryData = data;
            console.log('Inventory data loaded successfully:', this.inventoryData.length, 'items');
            return true;
        }
        
        // If no data found, schedule retry with exponential backoff
        if (this.inventoryLoadAttempts < this.maxInventoryLoadAttempts) {
            const delay = Math.min(1000 * Math.pow(2, this.inventoryLoadAttempts - 1), 10000);
            console.log(`Retrying inventory load in ${delay}ms...`);
            setTimeout(() => {
                this.loadInventoryDataWithRetry();
            }, delay);
        }
        
        return false;
    }

    // Load inventory data from the inventory.js file
    loadInventoryData() {
        try {
            // Try to get from window.inventoryData first (most reliable)
            if (window.inventoryData && Array.isArray(window.inventoryData) && window.inventoryData.length > 0) {
                console.log('Loaded inventory data from window.inventoryData:', window.inventoryData.length, 'items');
                return window.inventoryData;
            }
            
            // Try to get from shared inventory function
            if (typeof window.getSharedInventoryData === 'function') {
                const data = window.getSharedInventoryData();
                if (data && Array.isArray(data) && data.length > 0) {
                    console.log('Loaded inventory data from shared function:', data.length, 'items');
                    return data;
                }
            }
            
            // Fallback to localStorage
            const storedData = localStorage.getItem('inventoryData');
            if (storedData) {
                try {
                    const data = JSON.parse(storedData);
                    if (data && Array.isArray(data) && data.length > 0) {
                        console.log('Loaded inventory data from localStorage:', data.length, 'items');
                        return data;
                    }
                } catch (parseError) {
                    console.warn('Error parsing inventory data from localStorage:', parseError);
                }
            }
            
            // Try alternative localStorage key
            const altStoredData = localStorage.getItem('vastra_inventory_data');
            if (altStoredData) {
                try {
                    const data = JSON.parse(altStoredData);
                    if (data && Array.isArray(data) && data.length > 0) {
                        console.log('Loaded inventory data from alternative localStorage:', data.length, 'items');
                        return data;
                    }
                } catch (parseError) {
                    console.warn('Error parsing alternative inventory data from localStorage:', parseError);
                }
            }
            
            console.warn('No inventory data found in any source');
            return [];
        } catch (error) {
            console.error('Error loading inventory data:', error);
            return [];
        }
    }

    // Refresh inventory data (useful when inventory is updated)
    refreshInventoryData() {
        const newData = this.loadInventoryData();
        if (newData && newData.length > 0) {
            this.inventoryData = newData;
            console.log('Inventory data refreshed:', this.inventoryData.length, 'items');
            return true;
        }
        return false;
    }

    // Load chatbot state from localStorage
    loadPersistentState() {
        try {
            const savedState = localStorage.getItem('vastra_chatbot_state');

            if (savedState) {
                const state = JSON.parse(savedState);

                // Check if state is recent (within 24 hours)
                const isRecent = (Date.now() - state.timestamp) < (24 * 60 * 60 * 1000);

                if (isRecent && state.sessionId && state.messages && state.messages.length > 0) {
                    console.log('Restoring chatbot state with', state.messages.length, 'messages');
                    this.sessionId = state.sessionId;
                    this.messages = state.messages || [];
                    this.conversationContext = { ...this.conversationContext, ...state.conversationContext };

                    // Mark as having persistent data
                    this.hasPersistentData = true;

                    // Don't restore isOpen state to avoid auto-opening on page load
                    // this.isOpen = state.isOpen || false;
                } else {
                    console.log('No recent or valid chatbot state found');
                    this.hasPersistentData = false;
                }
            } else {
                console.log('No saved chatbot state found');
                this.hasPersistentData = false;
            }
        } catch (error) {
            console.warn('Could not load chatbot state:', error);
            this.hasPersistentData = false;
        }
    }

    // Restore chat messages in the UI
    restoreChatMessages() {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) {
            console.warn('Messages container not found');
            return;
        }

        // Only clear and restore if we have persistent data
        if (this.hasPersistentData && this.messages.length > 0) {
            console.log('Restoring', this.messages.length, 'messages to UI');

            // Clear existing messages except welcome message
            const welcomeMessage = messagesContainer.querySelector('.welcome-message');
            messagesContainer.innerHTML = '';

            // Don't add welcome message if we have conversation history

            // Restore saved messages
            this.messages.forEach((message, index) => {
                this.addMessageToUI(message.content, message.sender, false, message.timestamp);
            });

            this.scrollToBottom();
        } else {
            console.log('No persistent data to restore');
        }
    }

    // Add message to UI with timestamp
    addMessageToUI(content, sender, showQuickActions = false, timestamp = null) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const time = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const messageHTML = `
            <div class="message ${sender}" data-timestamp="${timestamp || Date.now()}">
                <div class="message-avatar">
                    <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
                </div>
                <div class="message-content">
                    ${content}
                    <div class="message-time">${time}</div>
                    ${showQuickActions ? this.getQuickActionsHTML() : ''}
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();

        // Bind quick action events
        if (showQuickActions) {
            this.bindQuickActions();
        }
    }

    // Override the original addMessage method to include persistence
    addMessage(content, sender, showQuickActions = false) {
        const timestamp = Date.now();

        // Add to messages array for persistence
        this.messages.push({
            content: content,
            sender: sender,
            timestamp: timestamp
        });

        console.log('Added message:', sender, '- Total messages:', this.messages.length);

        // Add to UI
        this.addMessageToUI(content, sender, showQuickActions, timestamp);

        // Mark as having persistent data
        this.hasPersistentData = true;

        // Save state immediately
        this.savePersistentState();

        // Limit message history to prevent storage bloat
        if (this.messages.length > 50) {
            this.messages = this.messages.slice(-40); // Keep last 40 messages
            this.savePersistentState(); // Save again after trimming
        }
    }

    // Clear chat history
    clearChatHistory() {
        console.log('Clearing chat history');

        this.messages = [];
        this.hasPersistentData = false;
        this.conversationContext = {
            userPreferences: {},
            currentTopic: null,
            previousQuestions: [],
            userSentiment: 'neutral',
            sessionData: {
                viewedItems: [],
                searchHistory: [],
                preferredCategories: [],
                priceRange: null,
                occasion: null,
                size: null,
                gender: null
            }
        };

        // Clear from storage
        localStorage.removeItem('vastra_chatbot_state');

        // Clear UI
        const messagesContainer = document.getElementById('chatbot-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <h4>👋 Welcome to Vastra Rent!</h4>
                    <p>I'm here to help you find the perfect outfit for your special occasion.</p>
                </div>
            `;
        }

        // Remove history indicator
        const header = document.querySelector('.chatbot-header');
        if (header) {
            header.classList.remove('has-history');
        }

        console.log('Chat history cleared');
    }

    // Handle page navigation
    handlePageNavigation() {
        // Save state before page unload
        window.addEventListener('beforeunload', () => {
            console.log('Page unloading, saving state');
            this.savePersistentState();
        });

        // Save state on page hide (more reliable than beforeunload)
        window.addEventListener('pagehide', () => {
            console.log('Page hiding, saving state');
            this.savePersistentState();
        });

        // Save state periodically (more frequent)
        setInterval(() => {
            if (this.messages.length > 0) {
                this.savePersistentState();
            }
        }, 10000); // Save every 10 seconds if there are messages

        // Save state on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('Page hidden, saving state');
                this.savePersistentState();
            }
        });

        // Save state on focus change
        window.addEventListener('blur', () => {
            this.savePersistentState();
        });

        // Save state when user interacts with page
        document.addEventListener('click', () => {
            if (this.messages.length > 0) {
                this.savePersistentState();
            }
        });
    }

    // Add page context to conversation
    addPageContext() {
        const currentPage = window.location.pathname;
        const pageContext = this.getPageContext(currentPage);

        if (pageContext && this.conversationContext.currentPage !== currentPage) {
            this.conversationContext.currentPage = currentPage;
            this.conversationContext.pageContext = pageContext;
            this.savePersistentState();
        }
    }

    // Get context based on current page
    getPageContext(pathname) {
        const pageContexts = {
            '/home.html': { page: 'home', context: 'browsing homepage' },
            '/inventory.html': { page: 'inventory', context: 'viewing product inventory' },
            '/product-details.html': { page: 'product-details', context: 'viewing product details' },
            '/profile.html': { page: 'profile', context: 'managing user profile' },
            '/about.html': { page: 'about', context: 'learning about company' },
            '/rental-status.html': { page: 'rental-status', context: 'checking rental status' },
            '/payment.html': { page: 'payment', context: 'processing payment' }
        };

        return pageContexts[pathname] || { page: 'unknown', context: 'browsing website' };
    }

    // Add continuation message when restoring conversation
    addContinuationMessage() {
        const currentPage = this.getPageContext(window.location.pathname);
        const pageSpecificMessage = this.getPageSpecificMessage(currentPage.page);

        const continuationHTML = `
            <div class="continuation-message">
                <div class="continuation-icon">
                    <i class="fas fa-history"></i>
                </div>
                <div class="continuation-text">
                    <p><strong>Conversation continued</strong></p>
                    <p>${pageSpecificMessage}</p>
                </div>
            </div>
        `;

        const messagesContainer = document.getElementById('chatbot-messages');
        if (messagesContainer) {
            messagesContainer.insertAdjacentHTML('beforeend', continuationHTML);
            this.scrollToBottom();
        }
    }

    // Get page-specific continuation message
    getPageSpecificMessage(page) {
        const messages = {
            'home': "I see you're back on the homepage! How can I help you explore our collection?",
            'inventory': "Great! You're browsing our inventory. I can help you find specific items or answer questions about our products.",
            'product-details': "I see you're looking at product details. I can help with sizing, availability, or rental information!",
            'profile': "You're in your profile section. I can help with account settings, rental history, or preferences.",
            'about': "Learning more about us? I'm here if you have any questions about our company or services.",
            'rental-status': "Checking your rental status? I can help with any questions about your current or past rentals.",
            'payment': "Processing a payment? I'm here to help if you have any questions about pricing or payment options."
        };

        return messages[page] || "I'm still here to help with any questions about Vastra Rent!";
    }

    // Force save state (for debugging)
    forceSave() {
        console.log('Force saving state with', this.messages.length, 'messages');
        this.savePersistentState();

        // Verify save worked
        setTimeout(() => {
            const saved = localStorage.getItem('vastra_chatbot_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                console.log('Verified save:', parsed.messages.length, 'messages saved');
            }
        }, 100);
    }

    // Test persistence (for debugging)
    testPersistence() {
        console.log('Testing persistence...');
        console.log('Current messages:', this.messages.length);
        console.log('Has persistent data:', this.hasPersistentData);

        const saved = localStorage.getItem('vastra_chatbot_state');
        if (saved) {
            const parsed = JSON.parse(saved);
            console.log('Saved messages:', parsed.messages.length);
            console.log('Saved timestamp:', new Date(parsed.timestamp));
        } else {
            console.log('No saved state found');
        }
    }
}


// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Small delay to ensure all other scripts are loaded
    setTimeout(() => {
        try {
            window.vastraRentChatbot = new VastraRentChatbot();

            // Add debugging methods to window for testing
            window.testChatbot = () => {
                if (window.vastraRentChatbot) {
                    window.vastraRentChatbot.testPersistence();
                }
            };

            window.forceSaveChatbot = () => {
                if (window.vastraRentChatbot) {
                    window.vastraRentChatbot.forceSave();
                }
            };

            window.refreshChatbotInventory = () => {
                if (window.vastraRentChatbot) {
                    window.vastraRentChatbot.refreshInventoryData();
                }
            };

            console.log('Chatbot initialized successfully. Use testChatbot(), forceSaveChatbot(), or refreshChatbotInventory() for debugging.');
        } catch (error) {
            console.error('Failed to initialize chatbot:', error);
        }
    }, 1000);
});

// Export for potential external use
window.VastraRentChatbot = VastraRentChatbot;
window.ChatbotAI = ChatbotAI;
window.EnhancedConversationEngine = EnhancedConversationEngine;