// Rental Integration System - Connects product-details, rental-status, and profile pages

class RentalIntegrationSystem {
    constructor() {
        this.storageKeys = {
            rentalHistory: 'rentalHistory',
            activeRentals: 'activeRentals',
            upcomingRentals: 'upcomingRentals',
            completedRentals: 'completedRentals',
            rentalCart: 'rentalCart',
            currentUser: 'currentUser'
        };
        
        this.init();
    }

    init() {
        // Initialize storage if not exists
        this.initializeStorage();
        
        // Set up event listeners for cross-page communication
        this.setupEventListeners();
        
        // Auto-sync data every 30 seconds
        setInterval(() => {
            this.syncAllData();
        }, 30000);
    }

    initializeStorage() {
        // Initialize rental history if not exists
        if (!localStorage.getItem(this.storageKeys.rentalHistory)) {
            localStorage.setItem(this.storageKeys.rentalHistory, JSON.stringify([]));
        }
        
        // Initialize other storage keys
        Object.values(this.storageKeys).forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify([]));
            }
        });
    }

    setupEventListeners() {
        // Listen for storage changes across tabs/windows
        window.addEventListener('storage', (e) => {
            if (Object.values(this.storageKeys).includes(e.key)) {
                this.handleStorageChange(e.key, e.newValue);
            }
        });

        // Listen for custom events
        document.addEventListener('rentalCompleted', (e) => {
            this.handleRentalCompleted(e.detail);
        });

        document.addEventListener('rentalCancelled', (e) => {
            this.handleRentalCancelled(e.detail);
        });

        document.addEventListener('rentalExtended', (e) => {
            this.handleRentalExtended(e.detail);
        });
    }

    // Create a new rental from product details page
    createRental(rentalData) {
        try {
            // Validate that the item exists in inventory
            if (!this.validateInventoryItem(rentalData.productId)) {
                throw new Error(`Item with ID ${rentalData.productId} not found in inventory`);
            }
            
            // Generate unique rental ID
            const rentalId = this.generateRentalId();
            
            // Create rental object with all necessary fields
            const rental = {
                id: rentalId,
                productId: rentalData.productId,
                productName: rentalData.productName || rentalData.name,
                productImage: rentalData.productImage || rentalData.image,
                category: rentalData.category,
                size: rentalData.size,
                startDate: rentalData.startDate,
                endDate: rentalData.endDate,
                quantity: rentalData.quantity || 1,
                rentalFee: rentalData.rentalFee || rentalData.price,
                totalCost: rentalData.totalCost,
                days: rentalData.days,
                specialRequests: rentalData.specialRequests || '',
                status: 'pending_payment', // Always start with pending payment
                createdAt: new Date().toISOString(),
                userId: this.getCurrentUserId(),
                paymentStatus: 'pending',
                deliveryStatus: 'pending',
                // Additional fields for better tracking
                itemName: rentalData.productName || rentalData.name, // For backward compatibility
                itemImage: rentalData.productImage || rentalData.image, // For backward compatibility
                rentalId: rentalId // For backward compatibility
            };

            // Add to rental history
            this.addToRentalHistory(rental);
            
            // Update user stats
            this.updateUserStats();
            
            // Trigger events
            this.triggerEvent('rentalCreated', rental);
            
            return rental;
        } catch (error) {
            console.error('Error creating rental:', error);
            throw error;
        }
    }

    // Add rental to history and categorize
    addToRentalHistory(rental) {
        const history = this.getRentalHistory();
        history.push(rental);
        
        // Sort by creation date (newest first)
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Save to storage
        localStorage.setItem(this.storageKeys.rentalHistory, JSON.stringify(history));
        
        // Update categorized rentals
        this.updateCategorizedRentals();
    }

    // Get all rental history
    getRentalHistory() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKeys.rentalHistory)) || [];
        } catch (error) {
            console.error('Error getting rental history:', error);
            return [];
        }
    }

    // Update categorized rentals (active, upcoming, completed)
    updateCategorizedRentals() {
        const history = this.getRentalHistory();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const active = [];
        const upcoming = [];
        const completed = [];

        history.forEach(rental => {
            const startDate = new Date(rental.startDate);
            const endDate = new Date(rental.endDate);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            if (rental.status === 'completed' || rental.status === 'cancelled' || endDate < today) {
                completed.push(rental);
            } else if (startDate > today) {
                upcoming.push(rental);
            } else {
                active.push(rental);
            }
        });

        // Save categorized rentals
        localStorage.setItem(this.storageKeys.activeRentals, JSON.stringify(active));
        localStorage.setItem(this.storageKeys.upcomingRentals, JSON.stringify(upcoming));
        localStorage.setItem(this.storageKeys.completedRentals, JSON.stringify(completed));
    }

    // Get rentals by category
    getRentalsByCategory(category) {
        try {
            return JSON.parse(localStorage.getItem(this.storageKeys[category + 'Rentals'])) || [];
        } catch (error) {
            console.error(`Error getting ${category} rentals:`, error);
            return [];
        }
    }

    // Update rental status
    updateRentalStatus(rentalId, newStatus, additionalData = {}) {
        const history = this.getRentalHistory();
        const rentalIndex = history.findIndex(r => r.id === rentalId);

        if (rentalIndex !== -1) {
            history[rentalIndex].status = newStatus;
            history[rentalIndex].updatedAt = new Date().toISOString();
            
            // Add additional data
            Object.assign(history[rentalIndex], additionalData);

            // Save updated history
            localStorage.setItem(this.storageKeys.rentalHistory, JSON.stringify(history));
            
            // Update categorized rentals
            this.updateCategorizedRentals();
            
            // Update user stats
            this.updateUserStats();
            
            // Trigger event
            this.triggerEvent('rentalStatusUpdated', {
                rentalId,
                newStatus,
                rental: history[rentalIndex]
            });

            return history[rentalIndex];
        }

        return null;
    }

    // Complete payment and activate rental
    completePayment(rentalId, paymentData = {}) {
        const history = this.getRentalHistory();
        const rentalIndex = history.findIndex(r => r.id === rentalId);

        if (rentalIndex !== -1) {
            const rental = history[rentalIndex];
            
            // Update payment status
            rental.paymentStatus = 'completed';
            rental.paymentCompletedAt = new Date().toISOString();
            rental.paymentData = paymentData;
            
            // Determine new status based on dates
            rental.status = this.determineRentalStatus(rental.startDate, rental.endDate);
            
            // Save updated history
            localStorage.setItem(this.storageKeys.rentalHistory, JSON.stringify(history));
            
            // Update categorized rentals
            this.updateCategorizedRentals();
            
            // Trigger event
            this.triggerEvent('paymentCompleted', {
                rentalId,
                rental: rental
            });

            return rental;
        }

        return null;
    }

    // Process payment completion - activate rental after payment
    processPaymentCompletion(rentalData, paymentInfo = {}) {
        try {
            // Find the rental by rental data or create if doesn't exist
            let rental = null;
            
            if (rentalData.rentalId) {
                // If we have a rental ID, find existing rental
                rental = this.getRentalHistory().find(r => r.id === rentalData.rentalId);
                
                if (rental) {
                    // Complete payment for existing rental
                    return this.completePayment(rental.id, paymentInfo);
                }
            }
            
            // If no existing rental found, create new one with payment completed
            const newRentalData = {
                ...rentalData,
                paymentStatus: 'completed',
                paymentCompletedAt: new Date().toISOString(),
                paymentData: paymentInfo
            };
            
            // Create the rental
            rental = this.createRental(newRentalData);
            
            // Update status to active/upcoming based on dates
            rental.status = this.determineRentalStatus(rental.startDate, rental.endDate);
            rental.paymentStatus = 'completed';
            
            // Update the rental in history
            this.updateRentalStatus(rental.id, rental.status, {
                paymentStatus: 'completed',
                paymentCompletedAt: new Date().toISOString(),
                paymentData: paymentInfo
            });
            
            return rental;
        } catch (error) {
            console.error('Error processing payment completion:', error);
            throw error;
        }
    }

    // Extend rental
    extendRental(rentalId, extensionDays) {
        const history = this.getRentalHistory();
        const rentalIndex = history.findIndex(r => r.id === rentalId);

        if (rentalIndex !== -1) {
            const rental = history[rentalIndex];
            const endDate = new Date(rental.endDate);
            endDate.setDate(endDate.getDate() + parseInt(extensionDays));
            
            rental.endDate = this.formatDateForInput(endDate);
            rental.days += parseInt(extensionDays);
            rental.extensionHistory = rental.extensionHistory || [];
            rental.extensionHistory.push({
                date: new Date().toISOString(),
                days: parseInt(extensionDays),
                previousEndDate: rental.endDate
            });

            // Recalculate cost (simplified - in real app, this would be more complex)
            const dailyRate = rental.rentalFee / rental.days;
            rental.totalCost += dailyRate * parseInt(extensionDays);

            // Save updated history
            localStorage.setItem(this.storageKeys.rentalHistory, JSON.stringify(history));
            
            // Update categorized rentals
            this.updateCategorizedRentals();
            
            // Trigger event
            this.triggerEvent('rentalExtended', {
                rentalId,
                extensionDays,
                rental: rental
            });

            return rental;
        }

        return null;
    }

    // Cancel rental
    cancelRental(rentalId, reason = '') {
        return this.updateRentalStatus(rentalId, 'cancelled', {
            cancellationReason: reason,
            cancelledAt: new Date().toISOString()
        });
    }

    // Complete rental
    completeRental(rentalId, rating = null, review = '') {
        return this.updateRentalStatus(rentalId, 'completed', {
            completedAt: new Date().toISOString(),
            rating: rating,
            review: review
        });
    }

    // Process payment completion
    processPaymentCompletion(rentalData) {
        try {
            // Create rental from payment data
            const rental = this.createRental(rentalData);
            
            // Update payment status
            this.updateRentalStatus(rental.id, rental.status, {
                paymentStatus: 'completed',
                paymentCompletedAt: new Date().toISOString()
            });

            // Clear cart if this was from cart checkout
            const cart = JSON.parse(localStorage.getItem(this.storageKeys.rentalCart)) || [];
            if (cart.length > 0) {
                // If multiple items, create multiple rentals
                cart.forEach(cartItem => {
                    if (cartItem.productId !== rentalData.productId) {
                        this.createRental(cartItem);
                    }
                });
                
                // Clear cart
                localStorage.setItem(this.storageKeys.rentalCart, JSON.stringify([]));
            }

            return rental;
        } catch (error) {
            console.error('Error processing payment completion:', error);
            throw error;
        }
    }

    // Update user statistics
    updateUserStats() {
        const history = this.getRentalHistory();
        const active = this.getRentalsByCategory('active');
        const completed = this.getRentalsByCategory('completed');

        const totalSpent = history.reduce((sum, rental) => {
            return sum + (rental.totalCost || 0);
        }, 0);

        const stats = {
            totalRentals: history.length,
            activeRentals: active.length,
            completedRentals: completed.length,
            totalSpent: totalSpent,
            lastRentalDate: history.length > 0 ? history[0].createdAt : null
        };

        // Update current user data
        const currentUser = JSON.parse(localStorage.getItem(this.storageKeys.currentUser)) || {};
        Object.assign(currentUser, stats);
        localStorage.setItem(this.storageKeys.currentUser, JSON.stringify(currentUser));

        return stats;
    }

    // Sync data across all pages
    syncAllData() {
        this.updateCategorizedRentals();
        this.updateUserStats();
        
        // Trigger sync event
        this.triggerEvent('dataSynced', {
            timestamp: new Date().toISOString()
        });
    }

    // Handle storage changes from other tabs
    handleStorageChange(key, newValue) {
        try {
            const data = JSON.parse(newValue);
            
            // Trigger appropriate events based on changed data
            switch (key) {
                case this.storageKeys.rentalHistory:
                    this.triggerEvent('rentalHistoryUpdated', data);
                    break;
                case this.storageKeys.rentalCart:
                    this.triggerEvent('cartUpdated', data);
                    break;
            }
        } catch (error) {
            console.error('Error handling storage change:', error);
        }
    }

    // Event handlers
    handleRentalCompleted(detail) {
        this.completeRental(detail.rentalId, detail.rating, detail.review);
    }

    handleRentalCancelled(detail) {
        this.cancelRental(detail.rentalId, detail.reason);
    }

    handleRentalExtended(detail) {
        this.extendRental(detail.rentalId, detail.extensionDays);
    }

    // Utility methods
    generateRentalId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `RNT-${timestamp}-${random}`;
    }

    getCurrentUserId() {
        const currentUser = JSON.parse(localStorage.getItem(this.storageKeys.currentUser)) || {};
        return currentUser.id || 'guest';
    }

    determineRentalStatus(startDate, endDate) {
        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        today.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        if (start > today) {
            return 'upcoming';
        } else if (end < today) {
            return 'completed';
        } else {
            return 'active';
        }
    }

    formatDateForInput(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    // Validate that item exists in inventory
    validateInventoryItem(productId) {
        try {
            // Try to get inventory data from various sources
            let inventoryData = [];
            
            if (window.getSharedInventoryData) {
                inventoryData = window.getSharedInventoryData();
            } else if (window.inventoryData) {
                inventoryData = window.inventoryData;
            } else {
                const storedData = localStorage.getItem('inventoryData');
                if (storedData) {
                    inventoryData = JSON.parse(storedData);
                }
            }
            
            // Check if item exists in inventory
            const item = inventoryData.find(item => item.id === productId);
            
            if (!item) {
                console.error(`Item with ID ${productId} not found in inventory`);
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error validating inventory item:', error);
            return false;
        }
    }

    triggerEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    // Public API methods for pages to use
    static getInstance() {
        if (!window.rentalIntegration) {
            window.rentalIntegration = new RentalIntegrationSystem();
        }
        return window.rentalIntegration;
    }
}

// Initialize the integration system
document.addEventListener('DOMContentLoaded', function() {
    window.rentalIntegration = RentalIntegrationSystem.getInstance();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RentalIntegrationSystem;
}
// Test function to verify inventory integration
window.testInventoryIntegration = function() {
    console.log('Testing inventory integration...');
    
    // Check if inventory data is available
    const inventoryData = window.inventoryData || JSON.parse(localStorage.getItem('inventoryData') || '[]');
    console.log('Available inventory items:', inventoryData.length);
    
    if (inventoryData.length === 0) {
        console.error('No inventory data found!');
        return false;
    }
    
    // Test creating rentals for different inventory items
    const testItems = inventoryData.slice(0, 3); // Test first 3 items
    
    testItems.forEach((item, index) => {
        const testRental = {
            productId: item.id,
            productName: item.name,
            productImage: item.image,
            category: item.category,
            size: item.size,
            startDate: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            endDate: new Date(Date.now() + (index + 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            quantity: 1,
            rentalFee: item.price,
            totalCost: item.price * 1.3, // Add some fees
            days: 1,
            specialRequests: `Test rental for ${item.name}`
        };
        
        try {
            const rental = window.rentalIntegration.createRental(testRental);
            console.log(`✅ Successfully created test rental for ${item.name}:`, rental.id);
        } catch (error) {
            console.error(`❌ Failed to create rental for ${item.name}:`, error);
        }
    });
    
    // Check rental history
    const history = window.rentalIntegration.getRentalHistory();
    console.log('Total rentals in history:', history.length);
    
    return true;
};

// Auto-test on page load (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            if (window.testInventoryIntegration) {
                console.log('Running inventory integration test...');
                window.testInventoryIntegration();
            }
        }, 1000);
    });
}