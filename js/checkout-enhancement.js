// Enhanced Checkout Functionality for Profile Cart
class CheckoutEnhancement {
    constructor() {
        this.initialized = false;
        this.checkoutButton = null;
        this.retryCount = 0;
        this.maxRetries = 5;
        this.init();
    }

    init() {
        console.log('🚀 Initializing checkout enhancement...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Try to find and enhance checkout button
        this.findAndEnhanceCheckoutButton();
        
        // Set up observers for dynamic content
        this.setupObservers();
        
        // Add global checkout functions
        this.addGlobalFunctions();
        
        console.log('✅ Checkout enhancement setup complete');
    }

    findAndEnhanceCheckoutButton() {
        const selectors = [
            '#checkout-btn',
            '.checkout-btn',
            '#proceed-checkout',
            '.proceed-checkout',
            'button[data-action="checkout"]',
            'button[onclick*="checkout"]'
        ];

        // Try each selector
        for (const selector of selectors) {
            const button = document.querySelector(selector);
            if (button) {
                console.log(`✅ Found checkout button with selector: ${selector}`);
                this.enhanceCheckoutButton(button);
                return;
            }
        }

        // If no button found by selector, search by text content
        this.findCheckoutButtonByText();
    }

    findCheckoutButtonByText() {
        const buttons = document.querySelectorAll('button');
        const checkoutKeywords = ['checkout', 'proceed', 'payment', 'pay now'];
        
        for (const button of buttons) {
            const buttonText = button.textContent.toLowerCase().trim();
            const hasCheckoutKeyword = checkoutKeywords.some(keyword => 
                buttonText.includes(keyword)
            );
            
            if (hasCheckoutKeyword) {
                console.log(`✅ Found checkout button by text: "${button.textContent.trim()}"`);
                this.enhanceCheckoutButton(button);
                return;
            }
        }

        // If still no button found, create one
        this.createCheckoutButton();
    }

    enhanceCheckoutButton(button) {
        if (!button) return;

        this.checkoutButton = button;
        
        // Remove existing event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        this.checkoutButton = newButton;

        // Add enhanced click handler
        this.checkoutButton.addEventListener('click', (e) => this.handleCheckout(e));
        
        // Add visual enhancements
        this.addButtonEnhancements();
        
        console.log('✅ Checkout button enhanced successfully');
        this.initialized = true;
    }

    addButtonEnhancements() {
        if (!this.checkoutButton) return;

        // Add CSS classes for styling
        this.checkoutButton.classList.add('enhanced-checkout-btn');
        
        // Add loading state styles
        const style = document.createElement('style');
        style.textContent = `
            .enhanced-checkout-btn {
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .enhanced-checkout-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(215, 109, 119, 0.3);
            }
            
            .enhanced-checkout-btn.loading {
                pointer-events: none;
                opacity: 0.8;
            }
            
            .enhanced-checkout-btn .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 8px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .checkout-success-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                box-shadow: 0 8px 32px rgba(40, 167, 69, 0.3);
                z-index: 10000;
                animation: slideInRight 0.5s ease-out;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        
        if (!document.querySelector('#checkout-enhancement-styles')) {
            style.id = 'checkout-enhancement-styles';
            document.head.appendChild(style);
        }
    }

    handleCheckout(e) {
        e.preventDefault();
        e.stopPropagation();

        console.log('🛒 Enhanced checkout initiated');

        // Get cart data
        const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
        
        if (cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Process cart data
            const processedData = this.processCartData(cart);
            
            // Store data for payment page
            this.storeCheckoutData(processedData);
            
            // Show success message
            this.showNotification('Redirecting to payment...', 'success');
            
            // Redirect to payment page
            this.redirectToPayment();
            
        } catch (error) {
            console.error('❌ Checkout error:', error);
            this.setLoadingState(false);
            this.showNotification('Checkout failed: ' + error.message, 'error');
        }
    }

    processCartData(cart) {
        console.log('📦 Processing cart data:', cart);

        // Validate and process cart items with comprehensive data mapping
        const processedItems = cart.filter(item => item && (item.productName || item.name || item.title))
            .map(item => {
                console.log('🔄 Processing cart item for payment:', item);
                
                return {
                    // Primary identifiers
                    id: item.id || item.productId || this.generateId(),
                    productId: item.productId || item.id || `prod_${Date.now()}`,
                    
                    // Names (multiple formats for compatibility)
                    productName: item.productName || item.name || item.title || 'Rental Item',
                    name: item.productName || item.name || item.title || 'Rental Item',
                    itemName: item.productName || item.name || item.title || 'Rental Item',
                    title: item.productName || item.name || item.title || 'Rental Item',
                    
                    // Images (multiple formats for compatibility)
                    productImage: item.productImage || item.image || item.img || 'img/placeholder.jpg',
                    image: item.productImage || item.image || item.img || 'img/placeholder.jpg',
                    itemImage: item.productImage || item.image || item.img || 'img/placeholder.jpg',
                    
                    // Pricing
                    price: parseFloat(item.price) || parseFloat(item.rentalFee) || 0,
                    rentalFee: parseFloat(item.price) || parseFloat(item.rentalFee) || 0,
                    dailyRate: parseFloat(item.price) || parseFloat(item.rentalFee) || 0,
                    weeklyPrice: item.weeklyPrice || (parseFloat(item.price) || 0) * 6.2,
                    retailPrice: item.retailPrice || (parseFloat(item.price) || 0) * 10,
                    
                    // Physical attributes
                    size: (item.size || 'M').toString().toUpperCase(),
                    color: item.color || 'As Shown',
                    brand: item.brand || 'Designer Collection',
                    material: item.material || 'Premium Fabric',
                    condition: item.condition || 'Excellent',
                    
                    // Rental details
                    quantity: parseInt(item.quantity) || 1,
                    startDate: item.startDate || new Date().toISOString().split('T')[0],
                    endDate: item.endDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    days: parseInt(item.days) || 1,
                    
                    // Categories and classification
                    category: item.category || 'Clothing',
                    gender: item.gender || 'unisex',
                    type: item.type || item.category || 'Clothing',
                    
                    // Descriptions and details
                    description: item.description || `Beautiful ${item.productName || item.name || 'rental item'} perfect for any occasion.`,
                    specialRequests: item.specialRequests || '',
                    
                    // Availability and status
                    available: item.available !== false,
                    inStock: item.inStock !== false,
                    status: item.status || 'available',
                    
                    // Additional metadata
                    source: 'enhanced-checkout',
                    addedDate: item.addedDate || new Date().toISOString(),
                    lastModified: new Date().toISOString()
                };
            });

        if (processedItems.length === 0) {
            throw new Error('No valid items in cart');
        }

        // Calculate totals
        const subtotal = processedItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        const damageProtection = Math.round(subtotal * 0.15);
        const deliveryFee = subtotal >= 100 ? 0 : 10;
        const tax = Math.round((subtotal + damageProtection + deliveryFee) * 0.08);
        const finalTotal = subtotal + damageProtection + deliveryFee + tax;

        const checkoutData = {
            // Cart items
            items: processedItems,
            
            // Cost breakdown
            subtotal: subtotal,
            damageProtection: damageProtection,
            deliveryFee: deliveryFee,
            tax: tax,
            totalCost: finalTotal,
            
            // For single item compatibility (if only one item)
            ...(processedItems.length === 1 ? {
                productId: processedItems[0].productId,
                productName: processedItems[0].productName,
                productImage: processedItems[0].productImage,
                name: processedItems[0].name,
                image: processedItems[0].image,
                price: processedItems[0].price,
                rentalFee: processedItems[0].rentalFee,
                size: processedItems[0].size,
                quantity: processedItems[0].quantity,
                startDate: processedItems[0].startDate,
                endDate: processedItems[0].endDate,
                days: processedItems[0].days,
                category: processedItems[0].category,
                gender: processedItems[0].gender,
                description: processedItems[0].description,
                available: processedItems[0].available,
                color: processedItems[0].color,
                brand: processedItems[0].brand,
                material: processedItems[0].material,
                condition: processedItems[0].condition
            } : {}),
            
            // Metadata
            timestamp: new Date().toISOString(),
            source: 'enhanced-checkout',
            isCartCheckout: processedItems.length > 1,
            itemCount: processedItems.length
        };
        
        console.log('📦 Processed checkout data:', checkoutData);
        return checkoutData;
    }

    storeCheckoutData(data) {
        console.log('💾 Storing checkout data:', data);

        // Store in the format expected by payment.js
        localStorage.setItem('checkoutCart', JSON.stringify(data.items));
        localStorage.setItem('currentRental', JSON.stringify(data));
        
        // Store individual item for single-item compatibility
        if (data.items.length === 1) {
            localStorage.setItem('selectedItem', JSON.stringify(data.items[0]));
        }

        // Store user data if available
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        
        if (Object.keys(currentUser).length > 0 || Object.keys(userData).length > 0) {
            const mergedUserData = { ...userData, ...currentUser };
            localStorage.setItem('checkoutUserData', JSON.stringify(mergedUserData));
        }

        // Verify data was stored
        const storedCart = localStorage.getItem('checkoutCart');
        const storedRental = localStorage.getItem('currentRental');

        if (!storedCart || !storedRental) {
            throw new Error('Failed to store checkout data');
        }

        console.log('✅ Checkout data stored successfully');
    }

    redirectToPayment() {
        console.log('🔄 Redirecting to payment page...');

        const redirect = () => {
            try {
                window.location.href = 'payment.html';
            } catch (error) {
                console.warn('Primary redirect failed, trying alternative:', error);
                try {
                    window.location.replace('payment.html');
                } catch (fallbackError) {
                    console.error('All redirect methods failed:', fallbackError);
                    window.open('payment.html', '_self');
                }
            }
        };

        // Immediate redirect
        redirect();

        // Fallback redirect
        setTimeout(() => {
            if (window.location.pathname.includes('profile.html')) {
                console.log('🔄 Using fallback redirect');
                redirect();
            }
        }, 1000);

        // Final fallback with user interaction
        setTimeout(() => {
            if (window.location.pathname.includes('profile.html')) {
                this.setLoadingState(false);
                const userConfirm = confirm('Redirect failed. Open payment page manually?');
                if (userConfirm) {
                    window.open('payment.html', '_blank');
                }
            }
        }, 3000);
    }

    setLoadingState(loading) {
        if (!this.checkoutButton) return;

        if (loading) {
            this.originalButtonHTML = this.checkoutButton.innerHTML;
            this.checkoutButton.innerHTML = '<span class="loading-spinner"></span>Processing...';
            this.checkoutButton.classList.add('loading');
            this.checkoutButton.disabled = true;
        } else {
            this.checkoutButton.innerHTML = this.originalButtonHTML || this.checkoutButton.innerHTML;
            this.checkoutButton.classList.remove('loading');
            this.checkoutButton.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.checkout-notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = `checkout-notification checkout-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: 'linear-gradient(135deg, #28a745, #20c997)',
            error: 'linear-gradient(135deg, #dc3545, #e74c3c)',
            info: 'linear-gradient(135deg, #17a2b8, #138496)'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.5s ease-in';
                setTimeout(() => notification.remove(), 500);
            }
        }, 3000);
    }

    createCheckoutButton() {
        console.log('🔧 Creating checkout button as fallback');

        const cartSection = document.querySelector('#cart-items') || 
                           document.querySelector('.cart-section') ||
                           document.querySelector('[id*="cart"]');

        if (!cartSection) {
            console.error('❌ No cart section found to add checkout button');
            return;
        }

        const checkoutContainer = document.createElement('div');
        checkoutContainer.className = 'checkout-container';
        checkoutContainer.style.cssText = `
            margin-top: 2rem;
            padding: 1rem;
            border-top: 2px solid #eee;
            text-align: center;
        `;

        const checkoutButton = document.createElement('button');
        checkoutButton.className = 'btn primary checkout-btn enhanced-checkout-btn';
        checkoutButton.innerHTML = '<i class="fas fa-credit-card"></i> Proceed to Checkout';
        checkoutButton.style.cssText = `
            width: 100%;
            padding: 1rem 2rem;
            font-size: 1.1rem;
            font-weight: 600;
            background: linear-gradient(135deg, #D76D77, #c55a64);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        checkoutContainer.appendChild(checkoutButton);
        cartSection.appendChild(checkoutContainer);

        this.enhanceCheckoutButton(checkoutButton);
        console.log('✅ Fallback checkout button created');
    }

    setupObservers() {
        // Observe for dynamically added content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && !this.initialized) {
                    // Retry finding checkout button if not initialized
                    if (this.retryCount < this.maxRetries) {
                        this.retryCount++;
                        setTimeout(() => this.findAndEnhanceCheckoutButton(), 1000);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    addGlobalFunctions() {
        // Add global functions for debugging and manual use
        window.enhancedCheckout = {
            triggerCheckout: () => {
                if (this.checkoutButton) {
                    this.checkoutButton.click();
                } else {
                    window.manualCheckout();
                }
            },
            
            debugCheckout: () => {
                console.log('🔍 Enhanced checkout debug info:');
                console.log('Initialized:', this.initialized);
                console.log('Button found:', !!this.checkoutButton);
                console.log('Cart items:', JSON.parse(localStorage.getItem('rentalCart')) || []);
                return {
                    initialized: this.initialized,
                    button: this.checkoutButton,
                    cart: JSON.parse(localStorage.getItem('rentalCart')) || []
                };
            },
            
            reinitialize: () => {
                this.initialized = false;
                this.retryCount = 0;
                this.findAndEnhanceCheckoutButton();
            }
        };
    }

    generateId() {
        return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.checkoutEnhancement = new CheckoutEnhancement();
    });
} else {
    window.checkoutEnhancement = new CheckoutEnhancement();
}

// Export for global use
window.CheckoutEnhancement = CheckoutEnhancement;

console.log('✅ Checkout enhancement script loaded');