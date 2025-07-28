// Checkout Debug Helper
class CheckoutDebugger {
    constructor() {
        this.init();
    }

    init() {
        console.log('🔍 Checkout debugger initialized');
        this.addGlobalFunctions();
    }

    addGlobalFunctions() {
        // Debug cart data
        window.debugCartData = () => {
            console.log('🛒 CART DEBUG INFORMATION');
            console.log('========================');
            
            const rentalCart = JSON.parse(localStorage.getItem('rentalCart')) || [];
            const checkoutCart = JSON.parse(localStorage.getItem('checkoutCart')) || [];
            const currentRental = JSON.parse(localStorage.getItem('currentRental')) || {};
            const selectedItem = JSON.parse(localStorage.getItem('selectedItem')) || {};
            
            console.log('📦 Rental Cart (from profile):', rentalCart);
            console.log('🛍️ Checkout Cart (for payment):', checkoutCart);
            console.log('📋 Current Rental (payment data):', currentRental);
            console.log('🎯 Selected Item (single item):', selectedItem);
            
            // Analyze data structure
            if (rentalCart.length > 0) {
                console.log('📊 Rental Cart Analysis:');
                rentalCart.forEach((item, index) => {
                    console.log(`Item ${index + 1}:`, {
                        hasName: !!(item.productName || item.name),
                        hasImage: !!(item.productImage || item.image),
                        hasPrice: !!(item.price || item.rentalFee),
                        hasSize: !!item.size,
                        structure: Object.keys(item)
                    });
                });
            }
            
            if (checkoutCart.length > 0) {
                console.log('💳 Checkout Cart Analysis:');
                checkoutCart.forEach((item, index) => {
                    console.log(`Item ${index + 1}:`, {
                        productName: item.productName,
                        productImage: item.productImage,
                        price: item.price,
                        rentalFee: item.rentalFee,
                        size: item.size,
                        category: item.category,
                        description: item.description
                    });
                });
            }
            
            return {
                rentalCart,
                checkoutCart,
                currentRental,
                selectedItem
            };
        };

        // Fix cart data format
        window.fixCartDataFormat = () => {
            console.log('🔧 Fixing cart data format...');
            
            const rentalCart = JSON.parse(localStorage.getItem('rentalCart')) || [];
            
            if (rentalCart.length === 0) {
                console.log('❌ No cart data to fix');
                return;
            }

            const fixedCart = rentalCart.map(item => ({
                // Ensure all required fields are present
                id: item.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                productId: item.productId || item.id || `prod_${Date.now()}`,
                productName: item.productName || item.name || 'Rental Item',
                productImage: item.productImage || item.image || 'img/placeholder.jpg',
                name: item.productName || item.name || 'Rental Item',
                image: item.productImage || item.image || 'img/placeholder.jpg',
                price: parseFloat(item.price) || 299,
                rentalFee: parseFloat(item.price) || 299,
                size: item.size || 'M',
                quantity: parseInt(item.quantity) || 1,
                startDate: item.startDate || new Date().toISOString().split('T')[0],
                endDate: item.endDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                days: item.days || 1,
                category: item.category || 'Clothing',
                gender: item.gender || 'unisex',
                description: item.description || `Beautiful ${item.productName || item.name || 'rental item'} perfect for any occasion.`,
                color: item.color || 'As Shown',
                brand: item.brand || 'Designer Collection',
                material: item.material || 'Premium Fabric',
                condition: item.condition || 'Excellent',
                available: item.available !== false,
                weeklyPrice: item.weeklyPrice || (parseFloat(item.price) || 299) * 6.2,
                retailPrice: item.retailPrice || (parseFloat(item.price) || 299) * 10
            }));

            // Calculate totals
            const subtotal = fixedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const damageProtection = Math.round(subtotal * 0.15);
            const deliveryFee = subtotal >= 100 ? 0 : 10;
            const tax = Math.round((subtotal + damageProtection + deliveryFee) * 0.08);
            const totalCost = subtotal + damageProtection + deliveryFee + tax;

            const checkoutData = {
                items: fixedCart,
                subtotal,
                damageProtection,
                deliveryFee,
                tax,
                totalCost,
                timestamp: new Date().toISOString(),
                source: 'debug-fix',
                isCartCheckout: fixedCart.length > 1,
                itemCount: fixedCart.length,
                
                // Single item compatibility
                ...(fixedCart.length === 1 ? fixedCart[0] : {})
            };

            // Store fixed data
            localStorage.setItem('checkoutCart', JSON.stringify(fixedCart));
            localStorage.setItem('currentRental', JSON.stringify(checkoutData));
            
            if (fixedCart.length === 1) {
                localStorage.setItem('selectedItem', JSON.stringify(fixedCart[0]));
            }

            console.log('✅ Cart data fixed and stored');
            console.log('Fixed cart:', fixedCart);
            console.log('Checkout data:', checkoutData);
            
            return { fixedCart, checkoutData };
        };

        // Test checkout with sample data
        window.testCheckoutWithSampleData = () => {
            console.log('🧪 Testing checkout with sample data...');
            
            const sampleCart = [
                {
                    id: 'sample1',
                    productId: 'dress001',
                    productName: 'Elegant Evening Dress',
                    productImage: 'img/dress1.jpg',
                    name: 'Elegant Evening Dress',
                    image: 'img/dress1.jpg',
                    price: 299,
                    rentalFee: 299,
                    size: 'M',
                    quantity: 1,
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    days: 1,
                    category: 'Dresses',
                    gender: 'women',
                    description: 'Beautiful elegant evening dress perfect for special occasions.',
                    color: 'Black',
                    brand: 'Designer Collection',
                    material: 'Silk',
                    condition: 'Excellent',
                    available: true,
                    weeklyPrice: 1853.8,
                    retailPrice: 2990
                }
            ];

            // Store sample data
            localStorage.setItem('rentalCart', JSON.stringify(sampleCart));
            
            // Fix and process the data
            window.fixCartDataFormat();
            
            console.log('✅ Sample data setup complete');
            console.log('🔄 You can now test checkout or go to payment.html');
            
            return sampleCart;
        };

        // Clear all checkout data
        window.clearAllCheckoutData = () => {
            console.log('🗑️ Clearing all checkout data...');
            
            const keysToRemove = [
                'rentalCart',
                'checkoutCart',
                'currentRental',
                'selectedItem',
                'checkoutUserData',
                'checkoutAddresses',
                'pendingRental'
            ];
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
                console.log(`Removed: ${key}`);
            });
            
            console.log('✅ All checkout data cleared');
        };

        // Simulate payment page data loading
        window.simulatePaymentPageLoad = () => {
            console.log('💳 Simulating payment page data loading...');
            
            const rentalData = JSON.parse(localStorage.getItem('currentRental'));
            const cartData = JSON.parse(localStorage.getItem('checkoutCart'));
            const selectedItem = JSON.parse(localStorage.getItem('selectedItem'));
            
            console.log('Payment page would receive:');
            console.log('- rentalData:', rentalData);
            console.log('- cartData:', cartData);
            console.log('- selectedItem:', selectedItem);
            
            // Simulate the logic from payment.js
            let isCartCheckout = false;
            
            if (!rentalData && selectedItem) {
                console.log('📱 Would use selectedItem data');
            } else if (!rentalData && cartData && cartData.length > 0) {
                isCartCheckout = true;
                console.log('🛒 Would process as cart checkout');
            } else if (rentalData) {
                console.log('📋 Would use rentalData');
            } else {
                console.log('❌ No data found - would redirect to inventory');
            }
            
            return {
                rentalData,
                cartData,
                selectedItem,
                isCartCheckout
            };
        };
    }
}

// Initialize debugger
document.addEventListener('DOMContentLoaded', () => {
    window.checkoutDebugger = new CheckoutDebugger();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    window.checkoutDebugger = new CheckoutDebugger();
}

console.log('🔍 Checkout debug helper loaded');