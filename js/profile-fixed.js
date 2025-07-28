// Profile Page JavaScript - Fixed Version

// Optimized animation functions for 60fps performance
function initializeOptimizedAnimations() {
    const root = document.documentElement;
    root.style.setProperty('--animation-duration', '0.3s');
    root.style.setProperty('--animation-easing', 'cubic-bezier(0.25, 0.46, 0.45, 0.94)');

    const style = document.createElement('style');
    style.textContent = `
        * {
            transition: transform var(--animation-duration) var(--animation-easing),
                       opacity var(--animation-duration) var(--animation-easing),
                       box-shadow var(--animation-duration) var(--animation-easing);
        }
        .gpu-accelerated {
            will-change: transform;
            backface-visibility: hidden;
            perspective: 1000px;
        }
        .fade-out {
            opacity: 0;
            transform: translate3d(-20px, 0, 0);
        }
        .fade-in {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
        .stagger-item {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
            transition: opacity 0.5s var(--animation-easing), transform 0.5s var(--animation-easing);
        }
        .stagger-item.animate {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    `;
    document.head.appendChild(style);

    const animatedElements = document.querySelectorAll('.profile-container, .profile-sidebar, .profile-card, .menu-item, .cart-item, .wishlist-item');
    animatedElements.forEach(el => el.classList.add('gpu-accelerated'));
}

// Animation helper functions
function animateOptimizedButtonClick(button) {
    button.style.transform = 'scale3d(0.95, 0.95, 1)';
    setTimeout(() => {
        button.style.transform = 'scale3d(1, 1, 1)';
    }, 150);
}

function animateOptimizedFormSubmission(form) {
    form.style.transform = 'scale3d(0.98, 0.98, 1)';
    form.style.opacity = '0.8';
    setTimeout(() => {
        form.style.transform = 'scale3d(1, 1, 1)';
        form.style.opacity = '1';
    }, 200);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Currency formatting
function formatCurrency(amount) {
    return `₹${parseFloat(amount).toFixed(2)}`;
}

// Date formatting
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateRange(startDate, endDate) {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} - ${end}`;
}

// Main DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    console.log('Profile page loading...');
    
    // Initialize animations
    initializeOptimizedAnimations();
    
    // Initialize all profile functionality
    initializeProfile();
    initializeMenuNavigation();
    initializeProfileForm();
    loadRentalHistory();
    loadCartItems();
    loadWishlistItems();
    loadAddresses();
    loadPaymentMethods();
    initializeSettings();
    initializeAvatarUpload();
    initializeModals();
    initializeNotifications();
    
    // Auto-refresh data every 30 seconds
    setInterval(function () {
        updateCartCount();
        updateWishlistCount();
        updateProfileStats();
    }, 30000);
    
    console.log('Profile page loaded successfully');
});

// Sample user data
const userData = {
    id: 'USR12345',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 987-6543',
    birthDate: '1992-03-15',
    gender: 'female',
    bio: 'Fashion enthusiast who loves trying new styles without the commitment of buying.',
    avatar: 'https://via.placeholder.com/120x120?text=SJ',
    joinDate: '2023-01-15',
    totalRentals: 18,
    activeRentals: 3,
    totalSpent: 1250.00,
    membershipLevel: 'Gold'
};

// Initialize profile data
function initializeProfile() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const storedUser = currentUser || userData;

        // Update profile display
        const profileNameEl = document.getElementById('profile-name');
        const profileEmailEl = document.getElementById('profile-email');

        if (profileNameEl) {
            profileNameEl.textContent = `${storedUser.firstName} ${storedUser.lastName}`;
        }

        if (profileEmailEl) {
            profileEmailEl.textContent = storedUser.email;
        }

        // Set avatar
        const profileAvatarElement = document.getElementById('profile-avatar');
        const profileFormAvatarElement = document.getElementById('profile-form-avatar');

        const avatarSrc = (storedUser.avatar && storedUser.avatar.startsWith('data:image'))
            ? storedUser.avatar
            : `https://via.placeholder.com/120x120?text=${storedUser.firstName.charAt(0)}${storedUser.lastName.charAt(0)}`;

        if (profileAvatarElement) {
            profileAvatarElement.src = avatarSrc;
        }

        if (profileFormAvatarElement) {
            profileFormAvatarElement.src = avatarSrc;
        }

        // Update stats
        const totalRentalsEl = document.getElementById('total-rentals');
        const activeRentalsEl = document.getElementById('active-rentals');

        if (totalRentalsEl) {
            totalRentalsEl.textContent = storedUser.totalRentals || 0;
        }

        if (activeRentalsEl) {
            activeRentalsEl.textContent = storedUser.activeRentals || 0;
        }

        // Update counts
        updateWishlistCount();
        updateCartCount();

        // Fill form fields
        const formFields = {
            'first-name': storedUser.firstName,
            'last-name': storedUser.lastName,
            'email': storedUser.email,
            'phone': storedUser.phone || '+1 (555) 123-4567',
            'birth-date': storedUser.birthDate || '1990-01-01',
            'gender': storedUser.gender,
            'bio': storedUser.bio || 'Fashion enthusiast exploring new styles with VASTRA RENT.'
        };

        Object.keys(formFields).forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.value = formFields[fieldId];
            }
        });
    } catch (error) {
        console.error('Error initializing profile:', error);
        showNotification('Error loading profile data', 'error');
    }
}

// Menu navigation
function initializeMenuNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Check URL parameters for direct section navigation
    const urlParams = new URLSearchParams(window.location.search);
    const targetSection = urlParams.get('section');

    if (targetSection) {
        navigateToSection(targetSection);
    }

    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            const targetSection = this.dataset.section;
            navigateToSection(targetSection);
        });
    });

    function navigateToSection(sectionName) {
        const menuItems = document.querySelectorAll('.menu-item');
        const contentSections = document.querySelectorAll('.content-section');

        // Update menu items
        menuItems.forEach(menu => {
            menu.classList.remove('active');
        });

        const targetMenuItem = document.querySelector(`[data-section="${sectionName}"]`);
        if (targetMenuItem) {
            targetMenuItem.classList.add('active');
        }

        // Update content sections
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Load section-specific data
        switch (sectionName) {
            case 'rental-history':
                loadRentalHistory();
                break;
            case 'cart':
                loadCartItems();
                break;
            case 'wishlist':
                loadWishlistItems();
                break;
            case 'addresses':
                loadAddresses();
                break;
            case 'payment-methods':
                loadPaymentMethods();
                break;
        }
    }
}

// Profile form handling
function initializeProfileForm() {
    try {
        const editBtn = document.getElementById('edit-profile-btn');
        const cancelBtn = document.getElementById('cancel-edit-btn');
        const form = document.getElementById('profile-form');
        const formActions = document.getElementById('form-actions');

        if (!form) {
            console.warn('Profile form not found');
            return;
        }

        const inputs = form.querySelectorAll('input, select, textarea');

        if (editBtn) {
            editBtn.addEventListener('click', function () {
                inputs.forEach(input => input.disabled = false);
                if (formActions) formActions.style.display = 'flex';
                editBtn.style.display = 'none';
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', function () {
                inputs.forEach(input => input.disabled = true);
                if (formActions) formActions.style.display = 'none';
                if (editBtn) editBtn.style.display = 'inline-flex';
                initializeProfile(); // Reset form values
            });
        }

        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                try {
                    const avatarElement = document.getElementById('profile-avatar');
                    const currentAvatar = avatarElement ? avatarElement.src : '';

                    const updatedUser = {
                        ...userData,
                        firstName: document.getElementById('first-name')?.value || '',
                        lastName: document.getElementById('last-name')?.value || '',
                        email: document.getElementById('email')?.value || '',
                        phone: document.getElementById('phone')?.value || '',
                        birthDate: document.getElementById('birth-date')?.value || '',
                        gender: document.getElementById('gender')?.value || '',
                        bio: document.getElementById('bio')?.value || '',
                        avatar: currentAvatar
                    };

                    localStorage.setItem('userData', JSON.stringify(updatedUser));

                    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
                    const updatedCurrentUser = {
                        ...currentUser,
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        fullName: updatedUser.firstName + ' ' + updatedUser.lastName,
                        email: updatedUser.email,
                        phone: updatedUser.phone,
                        gender: updatedUser.gender,
                        avatar: updatedUser.avatar
                    };
                    localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));

                    inputs.forEach(input => input.disabled = true);
                    if (formActions) formActions.style.display = 'none';
                    if (editBtn) editBtn.style.display = 'inline-flex';

                    initializeProfile();

                    if (window.refreshProfileDropdown) {
                        window.refreshProfileDropdown();
                    }

                    animateOptimizedFormSubmission(form);
                    showNotification('Profile updated successfully!', 'success');
                } catch (error) {
                    console.error('Error updating profile:', error);
                    showNotification('Error updating profile', 'error');
                }
            });
        }
    } catch (error) {
        console.error('Error initializing profile form:', error);
    }
}

// Load cart items
function loadCartItems() {
    try {
        const cartItems = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        const emptyCart = document.getElementById('empty-cart');
        const clearCartBtn = document.getElementById('clear-cart-btn');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (!cartItems) {
            console.error('Cart items container not found');
            return;
        }

        const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];

        if (cart.length === 0) {
            if (cartItems) cartItems.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
            if (emptyCart) emptyCart.style.display = 'block';
            return;
        }

        if (cartItems) cartItems.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'block';
        if (emptyCart) emptyCart.style.display = 'none';

        cartItems.innerHTML = cart.map((item, index) => {
            const itemName = item.productName || item.name || 'Unknown Item';
            const itemImage = item.productImage || item.image || 'img/placeholder.jpg';
            const rentalPrice = item.rentalFee || item.rentalPrice || 0;
            const totalCost = item.totalCost || 0;
            const startDate = item.startDate || '';
            const endDate = item.endDate || '';
            const size = item.size || 'N/A';
            const quantity = item.quantity || 1;
            const days = item.days || 1;

            return `
                <div class="cart-item">
                    <div class="cart-item-image" style="background-image: url('${itemImage}');"></div>
                    <div class="cart-item-details">
                        <h4>${itemName}</h4>
                        <div class="cart-item-meta">
                            <span><i class="fas fa-rupee-sign"></i> ${formatCurrency(rentalPrice)}/day</span>
                            <span><i class="fas fa-expand-arrows-alt"></i> Size: ${size}</span>
                            <span><i class="fas fa-hashtag"></i> Qty: ${quantity}</span>
                        </div>
                        <div class="cart-item-dates">
                            <i class="fas fa-calendar"></i> ${formatDateRange(startDate, endDate)} (${days} day${days > 1 ? 's' : ''})
                        </div>
                        <div class="cart-item-price">${formatCurrency(totalCost)}</div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="btn secondary edit-cart-item" data-index="${index}" title="Edit Item">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="cart-item-remove" data-index="${index}" title="Remove Item">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Calculate totals
        const subtotal = cart.reduce((sum, item) => {
            let cost = item.totalCost || 0;
            if (typeof cost === 'string') {
                cost = parseFloat(cost.replace(/[^0-9.]/g, '') || '0');
            }
            return sum + cost;
        }, 0);

        const protection = Math.round(subtotal * 0.15);
        const delivery = subtotal >= 2000 ? 0 : 10;
        const total = subtotal + protection + delivery;

        // Update summary
        const summaryElements = {
            'cart-subtotal': formatCurrency(subtotal),
            'cart-protection': formatCurrency(protection),
            'cart-delivery': delivery === 0 ? 'FREE' : formatCurrency(delivery),
            'cart-total': formatCurrency(total)
        };

        Object.keys(summaryElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = summaryElements[id];
            }
        });

        // Add event listeners for remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.dataset.index);
                if (confirm('Remove this item from your cart?')) {
                    cart.splice(index, 1);
                    localStorage.setItem('rentalCart', JSON.stringify(cart));
                    loadCartItems();
                    updateCartCount();
                    showNotification('Item removed from cart', 'info');
                }
            });
        });

        // Clear cart button
        if (clearCartBtn) {
            clearCartBtn.onclick = function () {
                if (confirm('Are you sure you want to clear your entire cart?')) {
                    localStorage.removeItem('rentalCart');
                    loadCartItems();
                    updateCartCount();
                    showNotification('Cart cleared', 'info');
                }
            };
        }

        // Enhanced Checkout button
        if (checkoutBtn) {
            checkoutBtn.onclick = null; // Remove existing handler
            
            checkoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Checkout button clicked');
                
                if (cart.length === 0) {
                    showNotification('Your cart is empty', 'error');
                    return;
                }

                // Show loading state
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                this.disabled = true;
                
                animateOptimizedButtonClick(this);

                try {
                    // Store checkout data
                    const checkoutData = {
                        items: cart,
                        totalCost: total,
                        subtotal: subtotal,
                        protection: protection,
                        delivery: delivery,
                        timestamp: new Date().toISOString()
                    };

                    localStorage.setItem('checkoutCart', JSON.stringify(cart));
                    localStorage.setItem('currentRental', JSON.stringify(checkoutData));

                    console.log('Checkout data stored, redirecting to payment.html');
                    
                    // Redirect to payment page
                    setTimeout(() => {
                        window.location.href = 'payment.html';
                    }, 500);
                    
                } catch (error) {
                    console.error('Error processing checkout:', error);
                    this.innerHTML = originalHTML;
                    this.disabled = false;
                    showNotification('Error processing checkout. Please try again.', 'error');
                }
            });
        }
    } catch (error) {
        console.error('Error loading cart items:', error);
        showNotification('Error loading cart items', 'error');
    }
}

// Load wishlist items
function loadWishlistItems() {
    try {
        const wishlistContainer = document.getElementById('wishlist-grid');
        const emptyWishlist = document.getElementById('empty-wishlist');
        const clearWishlistBtn = document.getElementById('clear-wishlist-btn');

        if (!wishlistContainer) {
            console.error('Wishlist container not found');
            return;
        }

        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

        if (wishlist.length === 0) {
            if (wishlistContainer) wishlistContainer.style.display = 'none';
            if (emptyWishlist) emptyWishlist.style.display = 'block';
            if (clearWishlistBtn) clearWishlistBtn.style.display = 'none';
            return;
        }

        if (wishlistContainer) wishlistContainer.style.display = 'grid';
        if (emptyWishlist) emptyWishlist.style.display = 'none';
        if (clearWishlistBtn) clearWishlistBtn.style.display = 'inline-flex';

        // Get full item details
        const wishlistWithDetails = wishlist.map(wishlistItem => {
            if (typeof wishlistItem === 'string' || typeof wishlistItem === 'number') {
                const fullItem = window.findInventoryItemById ?
                    window.findInventoryItemById(wishlistItem) :
                    null;
                return fullItem || { id: wishlistItem, name: 'Unknown Item', price: 0, category: 'Unknown', image: 'img/placeholder.jpg' };
            }
            return wishlistItem;
        });

        wishlistContainer.innerHTML = wishlistWithDetails.map((item, index) => `
            <div class="wishlist-item" data-item-id="${item.id}">
                <div class="wishlist-item-image" style="background-image: url('${item.image || 'img/placeholder.jpg'}');"></div>
                <div class="wishlist-item-details">
                    <h4>${item.name || 'Unknown Item'}</h4>
                    <p class="wishlist-item-price">₹${item.price || 0}/day</p>
                    <p class="wishlist-item-category">${item.category || 'General'}</p>
                </div>
                <div class="wishlist-item-actions">
                    <button class="btn primary view-details-btn" data-item-id="${item.id}" data-index="${index}">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn secondary remove-wishlist-item" data-index="${index}" data-item-name="${item.name || 'Item'}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // View Details buttons
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                
                const itemId = this.dataset.itemId;
                const index = parseInt(this.dataset.index);
                const item = wishlistWithDetails[index];
                
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.disabled = true;
                
                animateOptimizedButtonClick(this);
                
                try {
                    localStorage.setItem('selectedItem', JSON.stringify(item));
                    
                    setTimeout(() => {
                        window.location.href = `product-details.html?id=${itemId}`;
                    }, 500);
                    
                } catch (error) {
                    console.error('Error viewing item details:', error);
                    this.innerHTML = originalHTML;
                    this.disabled = false;
                    showNotification('Error loading item details', 'error');
                }
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-wishlist-item').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                
                const index = parseInt(this.dataset.index);
                const itemName = this.dataset.itemName;
                
                if (confirm(`Remove "${itemName}" from your wishlist?`)) {
                    const currentWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                    currentWishlist.splice(index, 1);
                    localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
                    
                    loadWishlistItems();
                    updateWishlistCount();
                    showNotification(`${itemName} removed from wishlist`, 'success');
                }
            });
        });

        // Clear wishlist button
        if (clearWishlistBtn) {
            clearWishlistBtn.onclick = function (e) {
                e.preventDefault();
                
                if (confirm(`Are you sure you want to clear your entire wishlist? This will remove all ${wishlist.length} items.`)) {
                    localStorage.removeItem('wishlist');
                    loadWishlistItems();
                    updateWishlistCount();
                    showNotification('Wishlist cleared successfully', 'success');
                }
            };
        }
    } catch (error) {
        console.error('Error loading wishlist items:', error);
        showNotification('Error loading wishlist items', 'error');
    }
}

// Load rental history
function loadRentalHistory() {
    const historyList = document.getElementById('rental-history-list');
    if (!historyList) return;

    let rentalHistory = [];

    if (window.rentalIntegration) {
        rentalHistory = window.rentalIntegration.getRentalHistory();
    }

    if (!rentalHistory || rentalHistory.length === 0) {
        rentalHistory = [
            {
                id: 'RNT-001',
                productName: 'Designer Evening Gown',
                productImage: 'img/dress1.jpg',
                category: 'Gown',
                startDate: '2024-01-15',
                endDate: '2024-01-17',
                totalCost: 135.00,
                status: 'completed'
            },
            {
                id: 'RNT-002',
                productName: 'Premium Business Suit',
                productImage: 'img/suit1.jpg',
                category: 'Suit',
                startDate: '2024-01-20',
                endDate: '2024-01-25',
                totalCost: 350.00,
                status: 'active'
            }
        ];
    }

    historyList.innerHTML = rentalHistory.map(rental => `
        <div class="history-item">
            <div class="history-item-image" style="background-image: url('${rental.productImage}');"></div>
            <div class="history-item-details">
                <h4>${rental.productName}</h4>
                <p>Rental ID: ${rental.id}</p>
                <p>Period: ${formatDateRange(rental.startDate, rental.endDate)}</p>
                <p>Total: ${formatCurrency(rental.totalCost)}</p>
                <span class="status-badge ${rental.status}">${rental.status.toUpperCase()}</span>
            </div>
        </div>
    `).join('');
}

// Load addresses
function loadAddresses() {
    const addressesList = document.getElementById('addresses-list');
    if (!addressesList) return;

    const addresses = JSON.parse(localStorage.getItem('userAddresses')) || [
        {
            id: 1,
            type: 'Home',
            name: 'Sarah Johnson',
            address: '123 Fashion Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            zip: '400001',
            phone: '+91 98765 43210',
            isDefault: true
        }
    ];

    addressesList.innerHTML = addresses.map(address => `
        <div class="address-item">
            <div class="address-header">
                <h4>${address.type} ${address.isDefault ? '(Default)' : ''}</h4>
                <div class="address-actions">
                    <button class="btn secondary" onclick="editAddress(${address.id})">Edit</button>
                    <button class="btn danger" onclick="deleteAddress(${address.id})">Delete</button>
                </div>
            </div>
            <div class="address-details">
                <p><strong>${address.name}</strong></p>
                <p>${address.address}</p>
                <p>${address.city}, ${address.state} ${address.zip}</p>
                <p>Phone: ${address.phone}</p>
            </div>
        </div>
    `).join('');
}

// Load payment methods
function loadPaymentMethods() {
    const paymentList = document.getElementById('payment-methods-list');
    const addPaymentBtn = document.getElementById('add-payment-btn');
    
    if (!paymentList) return;

    const paymentMethods = JSON.parse(localStorage.getItem('userPaymentMethods')) || [
        {
            id: 1,
            type: 'Credit Card',
            cardNumber: '**** **** **** 1234',
            cardHolder: 'Sarah Johnson',
            expiryDate: '12/25',
            isDefault: true
        }
    ];

    if (paymentMethods.length === 0) {
        paymentList.innerHTML = `
            <div class="empty-payment-methods">
                <i class="fas fa-credit-card"></i>
                <h3>No Payment Methods</h3>
                <p>Add a payment method to make checkout faster</p>
                <button class="btn primary" onclick="addPaymentMethod()">
                    <i class="fas fa-plus"></i> Add Payment Method
                </button>
            </div>
        `;
        return;
    }

    paymentList.innerHTML = paymentMethods.map(method => `
        <div class="payment-item" data-payment-id="${method.id}">
            <div class="payment-header">
                <h4>
                    <i class="fab fa-cc-${method.type.toLowerCase().replace(' ', '-')}"></i>
                    ${method.type} ${method.isDefault ? '<span class="default-badge">Default</span>' : ''}
                </h4>
                <div class="payment-actions">
                    <button class="btn secondary edit-payment-btn" data-id="${method.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn danger delete-payment-btn" data-id="${method.id}" ${method.isDefault ? 'disabled title="Cannot delete default payment method"' : ''}>
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <div class="payment-details">
                <div class="payment-info">
                    <p class="card-number">${method.cardNumber}</p>
                    <p class="card-holder">${method.cardHolder}</p>
                    <p class="card-expiry">Expires: ${method.expiryDate}</p>
                </div>
                ${!method.isDefault ? `
                    <button class="btn outline set-default-btn" data-id="${method.id}">
                        <i class="fas fa-star"></i> Set as Default
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');

    // Add event listeners
    setupPaymentMethodEventListeners();

    // Add payment method button
    if (addPaymentBtn) {
        addPaymentBtn.onclick = addPaymentMethod;
    }
}

// Setup event listeners for payment methods
function setupPaymentMethodEventListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-payment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const paymentId = parseInt(this.dataset.id);
            editPaymentMethod(paymentId);
        });
    });

    // Delete buttons
    document.querySelectorAll('.delete-payment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const paymentId = parseInt(this.dataset.id);
            deletePaymentMethod(paymentId);
        });
    });

    // Set default buttons
    document.querySelectorAll('.set-default-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const paymentId = parseInt(this.dataset.id);
            setDefaultPaymentMethod(paymentId);
        });
    });
}

// Add new payment method
function addPaymentMethod() {
    showPaymentMethodModal();
}

// Edit payment method
function editPaymentMethod(paymentId) {
    const paymentMethods = JSON.parse(localStorage.getItem('userPaymentMethods')) || [];
    const method = paymentMethods.find(m => m.id === paymentId);
    
    if (method) {
        showPaymentMethodModal(method);
    }
}

// Delete payment method
function deletePaymentMethod(paymentId) {
    const paymentMethods = JSON.parse(localStorage.getItem('userPaymentMethods')) || [];
    const method = paymentMethods.find(m => m.id === paymentId);
    
    if (!method) return;
    
    if (method.isDefault) {
        showNotification('Cannot delete the default payment method', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete this ${method.type}?`)) {
        const updatedMethods = paymentMethods.filter(m => m.id !== paymentId);
        localStorage.setItem('userPaymentMethods', JSON.stringify(updatedMethods));
        loadPaymentMethods();
        showNotification('Payment method deleted successfully', 'success');
    }
}

// Set default payment method
function setDefaultPaymentMethod(paymentId) {
    const paymentMethods = JSON.parse(localStorage.getItem('userPaymentMethods')) || [];
    
    // Remove default from all methods
    paymentMethods.forEach(method => {
        method.isDefault = false;
    });
    
    // Set new default
    const method = paymentMethods.find(m => m.id === paymentId);
    if (method) {
        method.isDefault = true;
        localStorage.setItem('userPaymentMethods', JSON.stringify(paymentMethods));
        loadPaymentMethods();
        showNotification(`${method.type} set as default payment method`, 'success');
    }
}

// Show payment method modal
function showPaymentMethodModal(existingMethod = null) {
    const isEdit = !!existingMethod;
    const modal = document.createElement('div');
    modal.className = 'modal payment-method-modal';
    modal.style.display = 'block';

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>
                    <i class="fas fa-credit-card"></i>
                    ${isEdit ? 'Edit Payment Method' : 'Add Payment Method'}
                </h3>
                <span class="close-modal">&times;</span>
            </div>
            <form id="payment-method-form" class="modal-body">
                <div class="form-group">
                    <label for="payment-type">Payment Type</label>
                    <select id="payment-type" required>
                        <option value="">Select payment type</option>
                        <option value="Credit Card" ${existingMethod?.type === 'Credit Card' ? 'selected' : ''}>Credit Card</option>
                        <option value="Debit Card" ${existingMethod?.type === 'Debit Card' ? 'selected' : ''}>Debit Card</option>
                        <option value="UPI" ${existingMethod?.type === 'UPI' ? 'selected' : ''}>UPI</option>
                    </select>
                </div>
                
                <div class="card-fields" style="display: ${existingMethod?.type?.includes('Card') ? 'block' : 'none'}">
                    <div class="form-group">
                        <label for="card-holder">Card Holder Name</label>
                        <input type="text" id="card-holder" value="${existingMethod?.cardHolder || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="card-number-input">Card Number</label>
                        <input type="text" id="card-number-input" placeholder="1234 5678 9012 3456" maxlength="19" required>
                        <small class="form-help">We'll mask this for security</small>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="expiry-month">Expiry Month</label>
                            <select id="expiry-month" required>
                                <option value="">MM</option>
                                ${Array.from({length: 12}, (_, i) => {
                                    const month = (i + 1).toString().padStart(2, '0');
                                    const selected = existingMethod?.expiryDate?.split('/')[0] === month ? 'selected' : '';
                                    return `<option value="${month}" ${selected}>${month}</option>`;
                                }).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="expiry-year">Expiry Year</label>
                            <select id="expiry-year" required>
                                <option value="">YY</option>
                                ${Array.from({length: 10}, (_, i) => {
                                    const year = (new Date().getFullYear() + i).toString().slice(-2);
                                    const selected = existingMethod?.expiryDate?.split('/')[1] === year ? 'selected' : '';
                                    return `<option value="${year}" ${selected}>${year}</option>`;
                                }).join('')}
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="upi-fields" style="display: ${existingMethod?.type === 'UPI' ? 'block' : 'none'}">
                    <div class="form-group">
                        <label for="upi-id">UPI ID</label>
                        <input type="text" id="upi-id" placeholder="yourname@upi" value="${existingMethod?.upiId || ''}">
                    </div>
                </div>
                
                <div class="form-group checkbox">
                    <input type="checkbox" id="set-default" ${existingMethod?.isDefault || !isEdit ? 'checked' : ''}>
                    <label for="set-default">Set as default payment method</label>
                </div>
            </form>
            <div class="modal-footer">
                <button type="button" class="btn secondary cancel-btn">Cancel</button>
                <button type="submit" form="payment-method-form" class="btn primary">
                    <i class="fas fa-save"></i>
                    ${isEdit ? 'Update' : 'Add'} Payment Method
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Setup modal functionality
    setupPaymentMethodModal(modal, existingMethod);
}

// Setup payment method modal functionality
function setupPaymentMethodModal(modal, existingMethod) {
    const form = modal.querySelector('#payment-method-form');
    const paymentTypeSelect = modal.querySelector('#payment-type');
    const cardFields = modal.querySelector('.card-fields');
    const upiFields = modal.querySelector('.upi-fields');
    const cardNumberInput = modal.querySelector('#card-number-input');
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');

    // Close modal functionality
    const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Payment type change handler
    paymentTypeSelect.addEventListener('change', function() {
        const isCard = this.value.includes('Card');
        cardFields.style.display = isCard ? 'block' : 'none';
        upiFields.style.display = this.value === 'UPI' ? 'block' : 'none';
        
        // Update required fields
        const cardInputs = cardFields.querySelectorAll('input, select');
        const upiInputs = upiFields.querySelectorAll('input');
        
        cardInputs.forEach(input => input.required = isCard);
        upiInputs.forEach(input => input.required = this.value === 'UPI');
    });

    // Card number formatting
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const paymentType = document.getElementById('payment-type').value;
        const setDefault = document.getElementById('set-default').checked;
        
        let paymentMethod;
        
        if (paymentType.includes('Card')) {
            const cardNumber = document.getElementById('card-number-input').value;
            const maskedNumber = '**** **** **** ' + cardNumber.slice(-4);
            const expiryMonth = document.getElementById('expiry-month').value;
            const expiryYear = document.getElementById('expiry-year').value;
            
            paymentMethod = {
                id: existingMethod?.id || Date.now(),
                type: paymentType,
                cardHolder: document.getElementById('card-holder').value,
                cardNumber: maskedNumber,
                expiryDate: `${expiryMonth}/${expiryYear}`,
                isDefault: setDefault
            };
        } else if (paymentType === 'UPI') {
            paymentMethod = {
                id: existingMethod?.id || Date.now(),
                type: 'UPI',
                upiId: document.getElementById('upi-id').value,
                cardHolder: document.getElementById('upi-id').value.split('@')[0],
                cardNumber: document.getElementById('upi-id').value,
                expiryDate: 'N/A',
                isDefault: setDefault
            };
        }
        
        savePaymentMethod(paymentMethod, !!existingMethod);
        closeModal();
    });

    // Add modal styles
    addPaymentMethodModalStyles();
}

// Save payment method
function savePaymentMethod(paymentMethod, isEdit) {
    try {
        let paymentMethods = JSON.parse(localStorage.getItem('userPaymentMethods')) || [];
        
        if (paymentMethod.isDefault) {
            // Remove default from all existing methods
            paymentMethods.forEach(method => {
                method.isDefault = false;
            });
        }
        
        if (isEdit) {
            // Update existing method
            const index = paymentMethods.findIndex(m => m.id === paymentMethod.id);
            if (index !== -1) {
                paymentMethods[index] = paymentMethod;
            }
        } else {
            // Add new method
            paymentMethods.push(paymentMethod);
        }
        
        localStorage.setItem('userPaymentMethods', JSON.stringify(paymentMethods));
        loadPaymentMethods();
        
        const action = isEdit ? 'updated' : 'added';
        showNotification(`Payment method ${action} successfully!`, 'success');
        
    } catch (error) {
        console.error('Error saving payment method:', error);
        showNotification('Error saving payment method', 'error');
    }
}

// Add modal styles
function addPaymentMethodModalStyles() {
    if (document.getElementById('payment-method-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'payment-method-modal-styles';
    style.textContent = `
        .payment-method-modal .modal-content {
            max-width: 500px;
            width: 90%;
        }
        
        .payment-method-modal .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 25px;
            border-bottom: 1px solid #eee;
            background: linear-gradient(135deg, #d76d77, #c55a64);
            color: white;
            border-radius: 12px 12px 0 0;
        }
        
        .payment-method-modal .modal-header h3 {
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .payment-method-modal .close-modal {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: white;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        
        .payment-method-modal .close-modal:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .payment-method-modal .modal-body {
            padding: 25px;
        }
        
        .payment-method-modal .form-group {
            margin-bottom: 20px;
        }
        
        .payment-method-modal .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
        }
        
        .payment-method-modal .form-group input,
        .payment-method-modal .form-group select {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .payment-method-modal .form-group input:focus,
        .payment-method-modal .form-group select:focus {
            outline: none;
            border-color: #d76d77;
            box-shadow: 0 0 0 3px rgba(215, 109, 119, 0.1);
        }
        
        .payment-method-modal .form-row {
            display: flex;
            gap: 15px;
        }
        
        .payment-method-modal .form-row .form-group {
            flex: 1;
        }
        
        .payment-method-modal .form-help {
            display: block;
            margin-top: 5px;
            font-size: 0.8rem;
            color: #666;
        }
        
        .payment-method-modal .checkbox {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .payment-method-modal .checkbox input {
            width: auto;
            margin: 0;
        }
        
        .payment-method-modal .checkbox label {
            margin: 0;
            font-weight: normal;
        }
        
        .payment-method-modal .modal-footer {
            padding: 20px 25px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            background: #f8f9fa;
            border-radius: 0 0 12px 12px;
        }
        
        .payment-item {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 15px;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .payment-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }
        
        .payment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-bottom: 1px solid #dee2e6;
        }
        
        .payment-header h4 {
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #495057;
        }
        
        .default-badge {
            background: #28a745;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .payment-actions {
            display: flex;
            gap: 8px;
        }
        
        .payment-details {
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .payment-info p {
            margin: 0 0 5px 0;
            color: #6c757d;
        }
        
        .card-number {
            font-family: 'Courier New', monospace;
            font-weight: 600;
            color: #495057 !important;
        }
        
        .empty-payment-methods {
            text-align: center;
            padding: 60px 20px;
            color: #6c757d;
        }
        
        .empty-payment-methods i {
            font-size: 4rem;
            margin-bottom: 20px;
            opacity: 0.5;
        }
        
        .empty-payment-methods h3 {
            margin-bottom: 10px;
            color: #495057;
        }
        
        .empty-payment-methods p {
            margin-bottom: 25px;
        }
        
        @media (max-width: 768px) {
            .payment-method-modal .form-row {
                flex-direction: column;
                gap: 0;
            }
            
            .payment-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 15px;
            }
            
            .payment-details {
                flex-direction: column;
                align-items: flex-start;
                gap: 15px;
            }
            
            .payment-actions {
                width: 100%;
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(style);
}

// Update counts
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
    const cartCountElements = document.querySelectorAll('#cart-count, #header-cart-count');
    cartCountElements.forEach(el => {
        if (el) el.textContent = cart.length;
    });
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistCountElements = document.querySelectorAll('#wishlist-count, #header-wishlist-count');
    wishlistCountElements.forEach(el => {
        if (el) el.textContent = wishlist.length;
    });
}

function updateProfileStats() {
    // Update profile statistics if needed
    console.log('Profile stats updated');
}

// Placeholder functions for missing functionality
function initializeSettings() {
    console.log('Settings initialized');
}

function initializeAvatarUpload() {
    console.log('Avatar upload initialized');
}

function initializeModals() {
    console.log('Modals initialized');
}

function initializeNotifications() {
    console.log('Notifications initialized');
}

// Global functions for external use
window.refreshProfileData = function () {
    updateCartCount();
    updateWishlistCount();
    updateProfileStats();
    loadRentalHistory();
    loadCartItems();
    loadWishlistItems();
};

// Manual checkout function for backup
window.manualCheckout = function() {
    const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
    
    if (cart.length === 0) {
        alert('Your cart is empty');
        return false;
    }
    
    localStorage.setItem('checkoutCart', JSON.stringify(cart));
    window.location.href = 'payment.html';
    return true;
};

// Debug function
window.debugProfile = function() {
    console.log('=== PROFILE DEBUG INFO ===');
    console.log('Cart items:', JSON.parse(localStorage.getItem('rentalCart')) || []);
    console.log('Wishlist items:', JSON.parse(localStorage.getItem('wishlist')) || []);
    console.log('Current user:', JSON.parse(localStorage.getItem('currentUser')) || {});
    console.log('=== END DEBUG INFO ===');
};

console.log('Profile page script loaded successfully');