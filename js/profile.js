// Profile Page JavaScript

// Optimized animation functions for 60fps performance
function initializeOptimizedAnimations() {
    // Use CSS custom properties for better performance
    const root = document.documentElement;
    root.style.setProperty('--animation-duration', '0.3s');
    root.style.setProperty('--animation-easing', 'cubic-bezier(0.25, 0.46, 0.45, 0.94)');

    // Add optimized styles
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

    // Add GPU acceleration class to animated elements
    const animatedElements = document.querySelectorAll('.profile-container, .profile-sidebar, .profile-card, .menu-item, .cart-item, .wishlist-item');
    animatedElements.forEach(el => el.classList.add('gpu-accelerated'));
}

// Optimized scroll animations using Intersection Observer
function initializeOptimizedScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                // Optimized stagger effect using requestAnimationFrame
                const children = entry.target.querySelectorAll('.stagger-item');
                let index = 0;

                function animateNext() {
                    if (index < children.length) {
                        const child = children[index];
                        child.style.transitionDelay = `${index * 0.1}s`;
                        child.classList.add('animate');
                        index++;
                        requestAnimationFrame(animateNext);
                    }
                }
                requestAnimationFrame(animateNext);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.content-section, .cart-item, .wishlist-item, .history-item').forEach(el => {
        observer.observe(el);
    });
}

// Optimized menu transition using CSS transforms
function animateOptimizedMenuTransition(targetSection) {
    const contentSections = document.querySelectorAll('.content-section');
    const activeSection = document.querySelector('.content-section.active');

    if (activeSection) {
        // Use CSS classes instead of inline styles for better performance
        activeSection.classList.add('fade-out');

        // Use requestAnimationFrame for smooth transitions
        requestAnimationFrame(() => {
            setTimeout(() => {
                activeSection.classList.remove('active', 'fade-out');
                const newSection = document.getElementById(targetSection);
                if (newSection) {
                    newSection.classList.add('active', 'fade-in');

                    // Optimized item animation
                    requestAnimationFrame(() => {
                        animateOptimizedItems(newSection);
                    });
                }
            }, 300);
        });
    }
}

// Optimized item animation function
function animateOptimizedItems(container) {
    const items = container.querySelectorAll('.cart-item, .history-item, .wishlist-item, .address-item, .payment-item');
    items.forEach((item, index) => {
        item.classList.add('stagger-item');
        item.style.opacity = '0';
        item.style.transform = 'translate3d(0, 20px, 0)';

        // Use requestAnimationFrame for smooth stagger
        requestAnimationFrame(() => {
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                item.style.opacity = '1';
                item.style.transform = 'translate3d(0, 0, 0)';
            }, index * 100);
        });
    });
}

// Optimized counter animation using requestAnimationFrame
function animateOptimizedCounterUpdate(element, newValue) {
    const currentValue = parseInt(element.textContent) || 0;
    const increment = newValue > currentValue ? 1 : -1;
    let current = currentValue;

    function updateCounter() {
        if (current !== newValue) {
            current += increment;
            element.textContent = current;
            element.style.transform = 'scale3d(1.1, 1.1, 1)';
            requestAnimationFrame(() => {
                setTimeout(() => {
                    element.style.transform = 'scale3d(1, 1, 1)';
                }, 100);
            });
            requestAnimationFrame(updateCounter);
        }
    }
    requestAnimationFrame(updateCounter);
}

// Optimized button animation
function animateOptimizedButtonClick(button) {
    button.style.transform = 'scale3d(0.95, 0.95, 1)';
    requestAnimationFrame(() => {
        setTimeout(() => {
            button.style.transform = 'scale3d(1, 1, 1)';
        }, 150);
    });
}

// Optimized form submission animation
function animateOptimizedFormSubmission(form) {
    form.style.transform = 'scale3d(0.98, 0.98, 1)';
    form.style.opacity = '0.8';

    requestAnimationFrame(() => {
        setTimeout(() => {
            form.style.transform = 'scale3d(1, 1, 1)';
            form.style.opacity = '1';
        }, 200);
    });
}

// Animation functions for specific profile sections
function animateCartUpdate() {
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translate3d(-20px, 0, 0)';

        requestAnimationFrame(() => {
            setTimeout(() => {
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translate3d(0, 0, 0)';
            }, index * 80);
        });
    });
}

function animateWishlistUpdate() {
    const wishlistItems = document.querySelectorAll('.wishlist-item');
    wishlistItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translate3d(0, 30px, 0) scale3d(0.9, 0.9, 1)';

        requestAnimationFrame(() => {
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translate3d(0, 0, 0) scale3d(1, 1, 1)';
            }, index * 100);
        });
    });
}

function animateHistoryItems() {
    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translate3d(20px, 0, 0)';

        requestAnimationFrame(() => {
            setTimeout(() => {
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translate3d(0, 0, 0)';
            }, index * 60);
        });
    });
}

function animateAddressItems() {
    const addressItems = document.querySelectorAll('.address-item');
    addressItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translate3d(0, 20px, 0)';

        requestAnimationFrame(() => {
            setTimeout(() => {
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translate3d(0, 0, 0)';
            }, index * 70);
        });
    });
}

function animatePaymentItems() {
    const paymentItems = document.querySelectorAll('.payment-item');
    paymentItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translate3d(-15px, 0, 0)';

        requestAnimationFrame(() => {
            setTimeout(() => {
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translate3d(0, 0, 0)';
            }, index * 90);
        });
    });
}

// Debounced resize handler for performance
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate animations if needed
        initializeOptimizedScrollAnimations();
    }, 250);
});

// Use passive event listeners for better scroll performance
document.addEventListener('scroll', () => {
    // Scroll-related optimizations can be added here
}, { passive: true });

document.addEventListener('DOMContentLoaded', function () {
    // Initialize optimized smooth animations first
    initializeOptimizedAnimations();
    
    // Initialize enhanced animations
    if (window.ProfileAnimations) {
        window.profileAnimations = new ProfileAnimations();
    }

    // Initialize profile data
    initializeProfile();
    
    // Force initialize avatar upload after a delay to ensure DOM is ready
    setTimeout(() => {
        console.log('🔄 Force initializing avatar upload...');
        forceInitializeAvatarUpload();
    }, 1000);
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

    // Initialize optimized scroll animations
    initializeOptimizedScrollAnimations();

    // Auto-refresh data every 30 seconds
    setInterval(function () {
        updateCartCount();
        updateWishlistCount();
        updateProfileStats();
    }, 30000);

    // Global function to refresh all profile data
    window.refreshProfileData = function () {
        updateCartCount();
        updateWishlistCount();
        updateProfileStats();
        loadRentalHistory();
        loadCartItems();
        loadWishlistItems();
    };

    // Global function to manually trigger checkout (for debugging and fallback)
    window.manualCheckout = function() {
        console.log('🔧 Manual checkout triggered');
        const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
        
        if (cart.length === 0) {
            console.log('❌ Cart is empty');
            showNotification('Your cart is empty', 'error');
            return;
        }

        console.log('📦 Cart items:', cart);
        
        try {
            // Process and store cart data
            const processedCart = cart.map(item => ({
                id: item.id || item.productId || Date.now() + Math.random(),
                productId: item.productId || item.id,
                productName: item.productName || item.name,
                productImage: item.productImage || item.image || 'img/placeholder.jpg',
                name: item.productName || item.name,
                image: item.productImage || item.image || 'img/placeholder.jpg',
                price: parseFloat(item.price) || 0,
                rentalFee: parseFloat(item.price) || 0,
                size: item.size || 'M',
                quantity: parseInt(item.quantity) || 1,
                startDate: item.startDate || new Date().toISOString().split('T')[0],
                endDate: item.endDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                days: item.days || 1,
                category: item.category || 'Clothing',
                available: item.available !== false
            }));

            const subtotal = processedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const damageProtection = Math.round(subtotal * 0.15);
            const deliveryFee = subtotal >= 100 ? 0 : 10;
            const tax = Math.round((subtotal + damageProtection + deliveryFee) * 0.08);
            const finalTotal = subtotal + damageProtection + deliveryFee + tax;

            const checkoutData = {
                items: processedCart,
                totalCost: finalTotal,
                subtotal: subtotal,
                damageProtection: damageProtection,
                deliveryFee: deliveryFee,
                tax: tax,
                timestamp: new Date().toISOString(),
                source: 'manual-checkout',
                isCartCheckout: true
            };

            localStorage.setItem('checkoutCart', JSON.stringify(processedCart));
            localStorage.setItem('currentRental', JSON.stringify(checkoutData));

            console.log('✅ Manual checkout data stored');
            console.log('🔄 Redirecting to payment page...');
            
            // Show success message
            showNotification('Redirecting to payment page...', 'success');
            
            // Redirect with slight delay for user feedback
            setTimeout(() => {
                window.location.href = 'payment.html';
            }, 500);
            
        } catch (error) {
            console.error('❌ Manual checkout error:', error);
            showNotification('Manual checkout failed: ' + error.message, 'error');
        }
    };

    // Global function to debug checkout button
    window.debugCheckout = function() {
        console.log('🔍 Debugging checkout functionality...');
        
        const checkoutBtn = document.getElementById('checkout-btn');
        const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
        
        console.log('Checkout button found:', !!checkoutBtn);
        console.log('Cart items count:', cart.length);
        console.log('Cart contents:', cart);
        
        if (checkoutBtn) {
            console.log('Button text:', checkoutBtn.textContent.trim());
            console.log('Button disabled:', checkoutBtn.disabled);
            console.log('Button onclick:', checkoutBtn.onclick);
            console.log('Button event listeners:', getEventListeners ? getEventListeners(checkoutBtn) : 'DevTools required');
        }
        
        // Try to find alternative checkout buttons
        const alternativeButtons = document.querySelectorAll('button');
        const checkoutButtons = Array.from(alternativeButtons).filter(btn => 
            btn.textContent.toLowerCase().includes('checkout') || 
            btn.textContent.toLowerCase().includes('proceed')
        );
        
        console.log('Alternative checkout buttons found:', checkoutButtons.length);
        checkoutButtons.forEach((btn, index) => {
            console.log(`Button ${index + 1}:`, btn.textContent.trim(), btn);
        });
        
        return {
            mainButton: checkoutBtn,
            alternativeButtons: checkoutButtons,
            cartItems: cart
        };
    };

    // Global function to debug avatar upload
    window.debugAvatarUpload = function() {
        console.log('🔍 Debugging avatar upload functionality...');
        
        const avatarEditBtn = document.getElementById('avatar-edit-btn');
        const changePhotoBtn = document.getElementById('change-photo-btn');
        const profileAvatar = document.getElementById('profile-avatar');
        const formAvatar = document.getElementById('profile-form-avatar');
        
        console.log('Avatar elements found:', {
            avatarEditBtn: !!avatarEditBtn,
            changePhotoBtn: !!changePhotoBtn,
            profileAvatar: !!profileAvatar,
            formAvatar: !!formAvatar
        });
        
        if (avatarEditBtn) {
            console.log('Avatar edit button:', avatarEditBtn);
            console.log('Button onclick:', avatarEditBtn.onclick);
        }
        
        if (changePhotoBtn) {
            console.log('Change photo button:', changePhotoBtn);
            console.log('Button onclick:', changePhotoBtn.onclick);
        }
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
        console.log('Current user avatar:', currentUser.avatar ? 'Set' : 'Not set');
        
        return {
            avatarEditBtn,
            changePhotoBtn,
            profileAvatar,
            formAvatar,
            currentUser
        };
    };

    // Global function to manually trigger avatar upload
    window.testAvatarUpload = function() {
        console.log('🧪 Testing avatar upload...');
        triggerAvatarUpload();
    };

    // Global function to reset avatar to default
    window.resetAvatar = function() {
        console.log('🔄 Resetting avatar to default...');
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
        const defaultAvatar = `https://via.placeholder.com/120x120?text=${(currentUser.firstName || 'U').charAt(0)}${(currentUser.lastName || 'ser').charAt(0)}`;
        
        updateAvatarImages(defaultAvatar);
        
        currentUser.avatar = defaultAvatar;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showNotification('Avatar reset to default', 'info');
    };

    // Force initialize avatar upload functionality
    function forceInitializeAvatarUpload() {
        console.log('🚀 Force initializing avatar upload...');
        
        // Find all possible avatar buttons
        const avatarEditBtn = document.getElementById('avatar-edit-btn');
        const changePhotoBtn = document.getElementById('change-photo-btn');
        const profileAvatar = document.getElementById('profile-avatar');
        
        console.log('🔍 Elements found:', {
            avatarEditBtn: !!avatarEditBtn,
            changePhotoBtn: !!changePhotoBtn,
            profileAvatar: !!profileAvatar
        });

        // Simple file upload function
        function simpleAvatarUpload() {
            console.log('📁 Simple avatar upload triggered');
            
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.style.display = 'none';
            
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    console.log('📷 File selected:', file.name);
                    processAvatarFile(file);
                }
            });
            
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        }

        // Process avatar file
        function processAvatarFile(file) {
            console.log('🔄 Processing file:', file.name, file.type, file.size);
            
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const avatarSrc = e.target.result;
                console.log('✅ File processed, updating avatars...');
                
                // Update all avatar images
                const avatars = [
                    document.getElementById('profile-avatar'),
                    document.getElementById('profile-form-avatar'),
                    document.querySelector('.profile-avatar-small')
                ];
                
                avatars.forEach(avatar => {
                    if (avatar) {
                        avatar.src = avatarSrc;
                        console.log('✅ Updated avatar element');
                    }
                });
                
                // Save to localStorage
                try {
                    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
                    currentUser.avatar = avatarSrc;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    const userData = JSON.parse(localStorage.getItem('userData')) || {};
                    userData.avatar = avatarSrc;
                    localStorage.setItem('userData', JSON.stringify(userData));
                    
                    console.log('✅ Avatar saved to localStorage');
                    alert('Profile photo updated successfully!');
                    
                } catch (error) {
                    console.error('❌ Error saving avatar:', error);
                    alert('Error saving profile photo');
                }
            };
            
            reader.onerror = function() {
                console.error('❌ Error reading file');
                alert('Error reading file');
            };
            
            reader.readAsDataURL(file);
        }

        // Add event listeners to all buttons
        if (avatarEditBtn) {
            avatarEditBtn.onclick = null; // Remove existing
            avatarEditBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 Avatar edit button clicked');
                simpleAvatarUpload();
            });
            console.log('✅ Avatar edit button initialized');
        }

        if (changePhotoBtn) {
            changePhotoBtn.onclick = null; // Remove existing
            changePhotoBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 Change photo button clicked');
                simpleAvatarUpload();
            });
            console.log('✅ Change photo button initialized');
        }

        if (profileAvatar) {
            profileAvatar.style.cursor = 'pointer';
            profileAvatar.onclick = null; // Remove existing
            profileAvatar.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 Profile avatar clicked');
                simpleAvatarUpload();
            });
            console.log('✅ Profile avatar click initialized');
        }

        // Global test function
        window.forceAvatarUpload = simpleAvatarUpload;
        
        console.log('✅ Force avatar upload initialization complete');
    }

    // Sample user data (in a real app, this would come from a database)
    const userData = {
        id: 'USR12345',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 987-6543',
        birthDate: '1992-03-15',
        gender: 'female',
        bio: 'Fashion enthusiast who loves trying new styles without the commitment of buying. Always looking for sustainable fashion options.',
        avatar: 'https://via.placeholder.com/120x120?text=SJ',
        joinDate: '2023-01-15',
        totalRentals: 18,
        activeRentals: 3,
        totalSpent: 1250.00,
        membershipLevel: 'Gold'
    };

    function initializeProfile() {
        try {
            // Load user data from login or use default
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

            // Set avatar - prioritize uploaded avatar, then generate initials placeholder
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

            // Update wishlist count
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const wishlistCountEl = document.getElementById('wishlist-count');
            if (wishlistCountEl) {
                wishlistCountEl.textContent = wishlist.length;
            }

            // Update cart count
            const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
            const cartCountEl = document.getElementById('cart-count');
            if (cartCountEl) {
                cartCountEl.textContent = cart.length;
            }

            // Fill form fields safely
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

    function initializeMenuNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');
        const contentSections = document.querySelectorAll('.content-section');

        // Check URL parameters for direct section navigation
        const urlParams = new URLSearchParams(window.location.search);
        const targetSection = urlParams.get('section');

        if (targetSection) {
            // Navigate to specific section from URL
            navigateToSection(targetSection);
        }

        menuItems.forEach(item => {
            item.addEventListener('click', function () {
                const targetSection = this.dataset.section;
                // Use the animated navigation function
                navigateToSectionAnimated(targetSection);
            });
        });

        function navigateToSectionAnimated(sectionName) {
            const menuItems = document.querySelectorAll('.menu-item');
            const contentSections = document.querySelectorAll('.content-section');

            // Animate menu items
            menuItems.forEach(menu => {
                menu.classList.remove('active');
                menu.style.transform = 'translateX(0)';
            });

            const targetMenuItem = document.querySelector(`[data-section="${sectionName}"]`);
            if (targetMenuItem) {
                targetMenuItem.classList.add('active');
                targetMenuItem.style.transform = 'translateX(8px)';
            }

            // Animate content sections with optimized transitions
            animateOptimizedMenuTransition(sectionName);

            // Load section-specific data with animations
            switch (sectionName) {
                case 'rental-history':
                    setTimeout(() => {
                        loadRentalHistory();
                        animateHistoryItems();
                    }, 300);
                    break;
                case 'cart':
                    setTimeout(() => {
                        loadCartItems();
                        animateCartUpdate();
                    }, 300);
                    break;
                case 'wishlist':
                    setTimeout(() => {
                        loadWishlistItems();
                        animateWishlistUpdate();
                    }, 300);
                    break;
                case 'addresses':
                    setTimeout(() => {
                        loadAddresses();
                        animateAddressItems();
                    }, 300);
                    break;
                case 'payment-methods':
                    setTimeout(() => {
                        loadPaymentMethods();
                        animatePaymentItems();
                    }, 300);
                    break;
            }
        }

        // Keep original function for URL navigation
        function navigateToSection(sectionName) {
            navigateToSectionAnimated(sectionName);
        }
    }

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
                    // Enable form fields
                    inputs.forEach(input => input.disabled = false);
                    if (formActions) formActions.style.display = 'flex';
                    editBtn.style.display = 'none';
                });
            }

            if (cancelBtn) {
                cancelBtn.addEventListener('click', function () {
                    // Disable form fields and reset values
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
                        // Get current avatar from the displayed image
                        const avatarElement = document.getElementById('profile-avatar');
                        const currentAvatar = avatarElement ? avatarElement.src : '';

                        // Save updated user data
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

                        // Update both userData and currentUser
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

                        // Disable form fields
                        inputs.forEach(input => input.disabled = true);
                        if (formActions) formActions.style.display = 'none';
                        if (editBtn) editBtn.style.display = 'inline-flex';

                        // Update profile display
                        initializeProfile();

                        // Update profile dropdown in header
                        if (window.refreshProfileDropdown) {
                            window.refreshProfileDropdown();
                        }

                        // Animate form submission with optimized animation
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
                // Handle different data structures from product details page
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

            // Calculate totals safely
            const subtotal = cart.reduce((sum, item) => {
                let cost = item.totalCost || 0;
                if (typeof cost === 'string') {
                    cost = parseFloat(cost.replace(/[^0-9.]/g, '') || '0');
                }
                return sum + cost;
            }, 0);

            const protection = Math.round(subtotal * 0.15);
            const delivery = subtotal >= 100 ? 0 : 10;
            const total = subtotal + protection + delivery;

            // Update summary elements safely
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

            // Add event listeners for edit buttons
            document.querySelectorAll('.edit-cart-item').forEach(btn => {
                btn.addEventListener('click', function () {
                    const index = parseInt(this.dataset.index);
                    const item = cart[index];
                    showEditCartItemModal(item, index);
                });
            });

            // Add event listeners for view details buttons
            document.querySelectorAll('.view-cart-details').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const index = parseInt(this.dataset.index);
                    const item = cart[index];
                    console.log('Cart item clicked for details:', item);
                    
                    // Show loading state
                    const originalCursor = this.style.cursor;
                    this.style.cursor = 'wait';
                    
                    try {
                        // Store item data for product details page
                        const itemForDetails = {
                            id: item.productId || item.id || `cart_${index}`,
                            productId: item.productId || item.id,
                            name: item.productName || item.name,
                            productName: item.productName || item.name,
                            image: item.productImage || item.image,
                            productImage: item.productImage || item.image,
                            price: item.rentalFee || item.rentalPrice || item.price,
                            rentalPrice: item.rentalFee || item.rentalPrice,
                            size: item.size,
                            category: item.category,
                            description: item.description,
                            // Include rental-specific data
                            startDate: item.startDate,
                            endDate: item.endDate,
                            days: item.days,
                            quantity: item.quantity,
                            totalCost: item.totalCost
                        };
                        
                        localStorage.setItem('selectedItem', JSON.stringify(itemForDetails));
                        
                        // Add visual feedback
                        this.style.transform = 'scale(0.98)';
                        
                        // Navigate to product details
                        setTimeout(() => {
                            window.location.href = `product-details.html?id=${itemForDetails.id}`;
                        }, 200);
                        
                    } catch (error) {
                        console.error('Error viewing cart item details:', error);
                        this.style.cursor = originalCursor;
                        showNotification('Unable to view item details', 'error');
                    }
                });
            });

            // Add click functionality to cart items for viewing details
            document.querySelectorAll('.cart-item').forEach((cartItem, index) => {
                // Make cart item clickable (excluding action buttons)
                cartItem.style.cursor = 'pointer';
                
                cartItem.addEventListener('click', function(e) {
                    // Don't trigger if clicking on action buttons
                    if (e.target.closest('.cart-item-actions') || 
                        e.target.closest('.cart-item-remove') || 
                        e.target.closest('.edit-cart-item') ||
                        e.target.closest('.view-cart-details')) {
                        return;
                    }
                    
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const item = cart[index];
                    console.log('Cart item clicked for details:', item);
                    
                    // Show loading state
                    const originalCursor = this.style.cursor;
                    this.style.cursor = 'wait';
                    
                    try {
                        // Store item data for product details page
                        const itemForDetails = {
                            id: item.productId || item.id || `cart_${index}`,
                            productId: item.productId || item.id,
                            name: item.productName || item.name,
                            productName: item.productName || item.name,
                            image: item.productImage || item.image,
                            productImage: item.productImage || item.image,
                            price: item.rentalFee || item.rentalPrice || item.price,
                            rentalPrice: item.rentalFee || item.rentalPrice,
                            size: item.size,
                            category: item.category,
                            description: item.description,
                            // Include rental-specific data
                            startDate: item.startDate,
                            endDate: item.endDate,
                            days: item.days,
                            quantity: item.quantity,
                            totalCost: item.totalCost
                        };
                        
                        localStorage.setItem('selectedItem', JSON.stringify(itemForDetails));
                        
                        // Add visual feedback
                        this.style.transform = 'scale(0.98)';
                        
                        // Navigate to product details
                        setTimeout(() => {
                            window.location.href = `product-details.html?id=${itemForDetails.id}`;
                        }, 200);
                        
                    } catch (error) {
                        console.error('Error viewing cart item details:', error);
                        this.style.cursor = originalCursor;
                        showNotification('Unable to view item details', 'error');
                    }
                });
                
                // Add hover effect for better UX
                cartItem.addEventListener('mouseenter', function() {
                    if (!this.style.cursor.includes('wait')) {
                        this.style.cursor = 'pointer';
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

            // Enhanced Checkout button with robust error handling and proper payment page integration
            if (checkoutBtn) {
                // Remove any existing event listeners
                checkoutBtn.onclick = null;
                checkoutBtn.removeEventListener('click', arguments.callee);

                // Add new enhanced event listener
                checkoutBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    console.log('🛒 Checkout button clicked');
                    console.log('📦 Cart contents:', cart);
                    console.log('💰 Total cost:', total);

                    if (cart.length === 0) {
                        showNotification('Your cart is empty', 'error');
                        return;
                    }

                    // Show loading state with animation
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                    this.disabled = true;

                    // Add visual feedback with animation
                    if (window.profileAnimations) {
                        window.profileAnimations.animateButtonClick(this);
                    } else {
                        this.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            this.style.transform = 'scale(1)';
                        }, 150);
                    }

                    try {
                        // Validate and prepare cart data for payment page
                        const validCart = cart.filter(item => {
                            return item && (item.productName || item.name) && item.price;
                        });

                        if (validCart.length === 0) {
                            throw new Error('No valid items in cart');
                        }

                        // Calculate totals
                        const subtotal = validCart.reduce((sum, item) => {
                            const itemPrice = parseFloat(item.price) || 0;
                            const quantity = parseInt(item.quantity) || 1;
                            return sum + (itemPrice * quantity);
                        }, 0);

                        const damageProtection = Math.round(subtotal * 0.15);
                        const deliveryFee = subtotal >= 100 ? 0 : 10;
                        const tax = Math.round((subtotal + damageProtection + deliveryFee) * 0.08);
                        const finalTotal = subtotal + damageProtection + deliveryFee + tax;

                        // Prepare cart items for payment page with comprehensive data mapping
                        const processedCartItems = validCart.map(item => {
                            console.log('Processing cart item:', item);
                            
                            return {
                                // Primary identifiers
                                id: item.id || item.productId || `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                                productId: item.productId || item.id || `prod_${Date.now()}`,
                                
                                // Names (multiple formats for compatibility)
                                productName: item.productName || item.name || item.title || 'Rental Item',
                                name: item.productName || item.name || item.title || 'Rental Item',
                                itemName: item.productName || item.name || item.title || 'Rental Item',
                                title: item.productName || item.name || item.title || 'Rental Item',
                                
                                // Images (multiple formats for compatibility)
                                productImage: item.productImage || item.image || item.img || item.photo || 'img/placeholder.jpg',
                                image: item.productImage || item.image || item.img || item.photo || 'img/placeholder.jpg',
                                itemImage: item.productImage || item.image || item.img || item.photo || 'img/placeholder.jpg',
                                
                                // Pricing
                                price: parseFloat(item.price) || parseFloat(item.rentalFee) || parseFloat(item.dailyRate) || 0,
                                rentalFee: parseFloat(item.price) || parseFloat(item.rentalFee) || parseFloat(item.dailyRate) || 0,
                                dailyRate: parseFloat(item.price) || parseFloat(item.rentalFee) || parseFloat(item.dailyRate) || 0,
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
                                description: item.description || item.desc || `Beautiful ${item.productName || item.name || 'rental item'} perfect for any occasion.`,
                                specialRequests: item.specialRequests || item.notes || '',
                                
                                // Availability and status
                                available: item.available !== false,
                                inStock: item.inStock !== false,
                                status: item.status || 'available',
                                
                                // Additional metadata
                                source: 'profile-cart',
                                addedDate: item.addedDate || new Date().toISOString(),
                                lastModified: new Date().toISOString()
                            };
                        });

                        // Store cart data for payment page (format expected by payment.js)
                        const checkoutData = {
                            // Cart items
                            items: processedCartItems,
                            
                            // Cost breakdown
                            totalCost: finalTotal,
                            subtotal: subtotal,
                            damageProtection: damageProtection,
                            deliveryFee: deliveryFee,
                            tax: tax,
                            
                            // For single item compatibility (if only one item)
                            ...(processedCartItems.length === 1 ? {
                                productId: processedCartItems[0].productId,
                                productName: processedCartItems[0].productName,
                                productImage: processedCartItems[0].productImage,
                                name: processedCartItems[0].name,
                                image: processedCartItems[0].image,
                                price: processedCartItems[0].price,
                                rentalFee: processedCartItems[0].rentalFee,
                                size: processedCartItems[0].size,
                                quantity: processedCartItems[0].quantity,
                                startDate: processedCartItems[0].startDate,
                                endDate: processedCartItems[0].endDate,
                                days: processedCartItems[0].days,
                                category: processedCartItems[0].category,
                                gender: processedCartItems[0].gender,
                                description: processedCartItems[0].description,
                                available: processedCartItems[0].available
                            } : {}),
                            
                            // Metadata
                            timestamp: new Date().toISOString(),
                            source: 'profile-cart',
                            isCartCheckout: processedCartItems.length > 1,
                            itemCount: processedCartItems.length
                        };

                        console.log('💾 Storing checkout data:', checkoutData);

                        // Store data in the format expected by payment.js
                        localStorage.setItem('checkoutCart', JSON.stringify(processedCartItems));
                        localStorage.setItem('currentRental', JSON.stringify(checkoutData));
                        
                        // Also store individual item data for compatibility
                        if (processedCartItems.length === 1) {
                            localStorage.setItem('selectedItem', JSON.stringify(processedCartItems[0]));
                        }

                        // Store user data for payment page
                        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
                        const userData = JSON.parse(localStorage.getItem('userData')) || {};
                        const userAddresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
                        
                        if (Object.keys(currentUser).length > 0 || Object.keys(userData).length > 0) {
                            const mergedUserData = { ...userData, ...currentUser };
                            localStorage.setItem('checkoutUserData', JSON.stringify(mergedUserData));
                        }

                        if (userAddresses.length > 0) {
                            localStorage.setItem('checkoutAddresses', JSON.stringify(userAddresses));
                        }

                        // Verify data was stored successfully
                        const storedCart = localStorage.getItem('checkoutCart');
                        const storedRental = localStorage.getItem('currentRental');

                        if (!storedCart || !storedRental) {
                            throw new Error('Failed to store checkout data');
                        }

                        console.log('✅ Checkout data stored successfully');
                        console.log('🔄 Redirecting to payment.html...');

                        // Show success animation
                        if (window.profileAnimations) {
                            window.profileAnimations.showSuccessMessage('Redirecting to payment...');
                        }

                        // Immediate redirect with fallback strategies
                        const redirectToPayment = () => {
                            try {
                                // Primary redirect method
                                window.location.href = 'payment.html';
                            } catch (redirectError) {
                                console.warn('Primary redirect failed, trying alternative:', redirectError);
                                try {
                                    window.location.replace('payment.html');
                                } catch (fallbackError) {
                                    console.error('All redirect methods failed:', fallbackError);
                                    // Manual fallback
                                    window.open('payment.html', '_self');
                                }
                            }
                        };

                        // Execute redirect immediately
                        redirectToPayment();

                        // Fallback redirect after short delay
                        setTimeout(() => {
                            if (window.location.pathname.includes('profile.html')) {
                                console.log('🔄 Using fallback redirect');
                                redirectToPayment();
                            }
                        }, 1000);

                        // Final fallback with user interaction
                        setTimeout(() => {
                            if (window.location.pathname.includes('profile.html')) {
                                this.innerHTML = originalHTML;
                                this.disabled = false;

                                const userConfirm = confirm('Redirect to payment page failed. Would you like to open the payment page manually?');
                                if (userConfirm) {
                                    window.open('payment.html', '_blank');
                                } else {
                                    showNotification('Checkout cancelled. Your cart data has been saved.', 'info');
                                }
                            }
                        }, 3000);

                    } catch (error) {
                        console.error('❌ Error processing checkout:', error);
                        this.innerHTML = originalHTML;
                        this.disabled = false;

                        // Show user-friendly error message
                        const errorMessage = error.message || 'Unknown error occurred';
                        showNotification(`Checkout failed: ${errorMessage}. Please try again.`, 'error');
                        
                        if (window.profileAnimations) {
                            window.profileAnimations.showErrorMessage(`Checkout failed: ${errorMessage}`);
                        }

                        // Log detailed error info for debugging
                        console.error('🔍 Detailed checkout error:', {
                            error: error,
                            cart: cart,
                            cartLength: cart.length,
                            total: total,
                            localStorage: {
                                checkoutCart: localStorage.getItem('checkoutCart'),
                                currentRental: localStorage.getItem('currentRental')
                            }
                        });
                    }
                });

                console.log('✅ Enhanced checkout button initialized');

            } else {
                console.error('❌ Checkout button not found! Looking for element with ID: checkout-btn');

                // Try to find the button with alternative methods and selectors
                setTimeout(() => {
                    const alternativeSelectors = [
                        '#checkout-btn',
                        '.checkout-btn',
                        'button[data-action="checkout"]',
                        'button[onclick*="checkout"]',
                        'button:contains("Proceed to Checkout")',
                        'button:contains("Checkout")',
                        '[id*="checkout"]',
                        '[class*="checkout"]',
                        '.btn-checkout',
                        '#proceed-checkout',
                        '.proceed-checkout'
                    ];

                    let foundButton = null;
                    for (const selector of alternativeSelectors) {
                        try {
                            if (selector.includes(':contains')) {
                                // Handle text-based selectors manually
                                const buttons = document.querySelectorAll('button');
                                for (const btn of buttons) {
                                    if (btn.textContent.toLowerCase().includes('checkout') || 
                                        btn.textContent.toLowerCase().includes('proceed')) {
                                        foundButton = btn;
                                        console.log('🔍 Found checkout button by text content:', btn.textContent.trim());
                                        break;
                                    }
                                }
                            } else {
                                foundButton = document.querySelector(selector);
                            }
                            
                            if (foundButton) {
                                console.log('🔍 Found alternative checkout button with selector:', selector);
                                break;
                            }
                        } catch (selectorError) {
                            console.warn('Selector failed:', selector, selectorError);
                        }
                    }

                    if (foundButton) {
                        console.log('🎯 Setting up alternative checkout button');
                        
                        // Remove any existing listeners
                        foundButton.onclick = null;
                        
                        foundButton.addEventListener('click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            console.log('🔄 Alternative checkout button clicked');

                            const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
                            if (cart.length === 0) {
                                showNotification('Your cart is empty', 'error');
                                return;
                            }

                            // Show loading state
                            const originalHTML = this.innerHTML;
                            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                            this.disabled = true;

                            try {
                                // Process cart data similar to main checkout
                                const processedCart = cart.map(item => ({
                                    id: item.id || item.productId || Date.now() + Math.random(),
                                    productId: item.productId || item.id,
                                    productName: item.productName || item.name,
                                    productImage: item.productImage || item.image || 'img/placeholder.jpg',
                                    name: item.productName || item.name,
                                    image: item.productImage || item.image || 'img/placeholder.jpg',
                                    price: parseFloat(item.price) || 0,
                                    rentalFee: parseFloat(item.price) || 0,
                                    size: item.size || 'M',
                                    quantity: parseInt(item.quantity) || 1,
                                    startDate: item.startDate || new Date().toISOString().split('T')[0],
                                    endDate: item.endDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                                    days: item.days || 1,
                                    category: item.category || 'Clothing',
                                    available: item.available !== false
                                }));

                                const subtotal = processedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                                const checkoutData = {
                                    items: processedCart,
                                    totalCost: subtotal,
                                    subtotal: subtotal,
                                    timestamp: new Date().toISOString(),
                                    source: 'profile-cart-alternative',
                                    isCartCheckout: true
                                };

                                localStorage.setItem('checkoutCart', JSON.stringify(processedCart));
                                localStorage.setItem('currentRental', JSON.stringify(checkoutData));

                                console.log('✅ Alternative checkout data stored, redirecting...');
                                
                                // Redirect to payment page
                                setTimeout(() => {
                                    window.location.href = 'payment.html';
                                }, 500);

                            } catch (error) {
                                console.error('❌ Alternative checkout error:', error);
                                this.innerHTML = originalHTML;
                                this.disabled = false;
                                showNotification('Checkout failed. Please try again.', 'error');
                            }
                        });
                        
                        console.log('✅ Alternative checkout button setup complete');
                    } else {
                        console.error('❌ No checkout button found with any selector');
                        
                        // Create a manual checkout button as last resort
                        const cartSection = document.querySelector('#cart-items') || document.querySelector('.cart-section');
                        if (cartSection) {
                            const manualCheckoutBtn = document.createElement('button');
                            manualCheckoutBtn.className = 'btn primary checkout-btn';
                            manualCheckoutBtn.innerHTML = '<i class="fas fa-credit-card"></i> Proceed to Checkout';
                            manualCheckoutBtn.style.cssText = `
                                margin-top: 1rem;
                                width: 100%;
                                padding: 1rem;
                                font-size: 1.1rem;
                                font-weight: 600;
                            `;
                            
                            manualCheckoutBtn.addEventListener('click', function(e) {
                                e.preventDefault();
                                const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
                                if (cart.length === 0) {
                                    showNotification('Your cart is empty', 'error');
                                    return;
                                }
                                
                                localStorage.setItem('checkoutCart', JSON.stringify(cart));
                                window.location.href = 'payment.html';
                            });
                            
                            cartSection.appendChild(manualCheckoutBtn);
                            console.log('✅ Manual checkout button created');
                        }
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Error loading cart items:', error);
            showNotification('Error loading cart items', 'error');
        }
    }

    function showEditCartItemModal(item, index) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';

        const itemName = item.productName || item.name || 'Unknown Item';
        const startDate = item.startDate || '';
        const endDate = item.endDate || '';
        const size = item.size || 'M';
        const quantity = item.quantity || 1;

        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <span class="close-modal">&times;</span>
                <h3>Edit Cart Item</h3>
                <form id="edit-cart-form">
                    <div class="form-group">
                        <label>Item: ${itemName}</label>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-start-date">Start Date:</label>
                            <input type="date" id="edit-start-date" value="${startDate}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-end-date">End Date:</label>
                            <input type="date" id="edit-end-date" value="${endDate}" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-size">Size:</label>
                            <select id="edit-size">
                                <option value="XS" ${size === 'XS' ? 'selected' : ''}>XS</option>
                                <option value="S" ${size === 'S' ? 'selected' : ''}>S</option>
                                <option value="M" ${size === 'M' ? 'selected' : ''}>M</option>
                                <option value="L" ${size === 'L' ? 'selected' : ''}>L</option>
                                <option value="XL" ${size === 'XL' ? 'selected' : ''}>XL</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="edit-quantity">Quantity:</label>
                            <input type="number" id="edit-quantity" min="1" max="5" value="${quantity}">
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                        <button type="submit" class="btn primary">Update Item</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Form submission
        modal.querySelector('#edit-cart-form').addEventListener('submit', (e) => {
            e.preventDefault();

            const newStartDate = document.getElementById('edit-start-date')?.value || '';
            const newEndDate = document.getElementById('edit-end-date')?.value || '';
            const newSize = document.getElementById('edit-size')?.value || 'M';
            const newQuantity = parseInt(document.getElementById('edit-quantity')?.value || '1');

            if (new Date(newStartDate) >= new Date(newEndDate)) {
                showNotification('End date must be after start date', 'error');
                return;
            }

            // Update cart item
            const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
            if (cart[index]) {
                cart[index].startDate = newStartDate;
                cart[index].endDate = newEndDate;
                cart[index].size = newSize;
                cart[index].quantity = newQuantity;

                // Recalculate days and cost
                const days = Math.ceil((new Date(newEndDate) - new Date(newStartDate)) / (1000 * 60 * 60 * 24));
                cart[index].days = days;

                const basePrice = cart[index].rentalFee || cart[index].rentalPrice || 0;
                const newTotalCost = (basePrice + Math.round(basePrice * 0.15) + (basePrice >= 100 ? 0 : 10)) * newQuantity;
                cart[index].totalCost = newTotalCost;

                localStorage.setItem('rentalCart', JSON.stringify(cart));
                loadCartItems();
                showNotification('Cart item updated successfully!', 'success');
            }

            modal.remove();
        });
    }

    function loadRentalHistory() {
        const historyList = document.getElementById('rental-history-list');
        if (!historyList) return;

        // Get rental history from integration system
        let rentalHistory = [];

        if (window.rentalIntegration) {
            rentalHistory = window.rentalIntegration.getRentalHistory();
        }

        // If no data, use sample data
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
                },
                {
                    id: 'RNT-003',
                    productName: 'Traditional Kurta Set',
                    productImage: 'img/casual1.jpg',
                    category: 'Kurta',
                    startDate: '2024-02-01',
                    endDate: '2024-02-03',
                    totalCost: 90.00,
                    status: 'completed'
                }
            ];
        }

        historyList.innerHTML = rentalHistory.map(item => `
            <div class="history-item">
                <div class="history-image" style="background-image: url('${item.itemImage}');"></div>
                <div class="history-details">
                    <h4>${item.itemName}</h4>
                    <div class="history-meta">
                        <span><i class="fas fa-tag"></i> ${item.category}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDateRange(item.startDate, item.endDate)}</span>
                        <span><i class="fas fa-rupee-sign"></i> ₹${item.totalCost.toFixed(2)}</span>
                    </div>
                    <div class="history-status ${item.status}">${item.status.toUpperCase()}</div>
                </div>
                <div class="history-actions">
                    <button class="btn secondary" onclick="showRentalDetails('${item.id}')">View Details</button>
                    ${item.status === 'completed' ? '<button class="btn primary" onclick="reorderItem(\'' + item.id + '\')">Rent Again</button>' : ''}
                </div>
            </div>
        `).join('');
    }

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

            // Get full item details from shared inventory
            const wishlistWithDetails = wishlist.map(wishlistItem => {
                // If wishlistItem is just an ID, get full details from inventory
                if (typeof wishlistItem === 'string' || typeof wishlistItem === 'number') {
                    const fullItem = window.findInventoryItemById ?
                        window.findInventoryItemById(wishlistItem) :
                        null;
                    return fullItem || { id: wishlistItem, name: 'Unknown Item', price: 0, category: 'Unknown', image: 'img/placeholder.jpg' };
                }
                // If it's already a full object, use it as is
                return wishlistItem;
            });

            wishlistContainer.innerHTML = wishlistWithDetails.map((item, index) => `
            <div class="wishlist-item" data-item-id="${item.id}">
                <div class="wishlist-item-image" style="background-image: url('${item.image || 'img/placeholder.jpg'}');"></div>
                <div class="wishlist-item-details">
                    <h4>${item.name || 'Unknown Item'}</h4>
                    <p class="wishlist-item-price">₹${item.price || 0}/day</p>
                    <p class="wishlist-item-category">${item.category || 'General'}</p>
                    ${item.description ? `<p class="wishlist-item-description">${item.description.substring(0, 80)}...</p>` : ''}
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

            // Add enhanced button functionality

            // View Details buttons
            document.querySelectorAll('.view-details-btn').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    const itemId = this.dataset.itemId;
                    const index = parseInt(this.dataset.index);
                    const item = wishlistWithDetails[index];

                    console.log('View Details clicked for item:', itemId, item);

                    // Show loading state
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                    this.disabled = true;

                    // Add visual feedback
                    animateOptimizedButtonClick(this);

                    try {
                        // Store item data for product details page
                        localStorage.setItem('selectedItem', JSON.stringify(item));

                        // Redirect to product details page
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

            // Remove from wishlist buttons
            document.querySelectorAll('.remove-wishlist-item').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    const index = parseInt(this.dataset.index);
                    const itemName = this.dataset.itemName;

                    console.log('Remove from wishlist clicked for index:', index);

                    // Show confirmation dialog
                    if (confirm(`Remove "${itemName}" from your wishlist?`)) {
                        // Add visual feedback
                        const wishlistItem = this.closest('.wishlist-item');
                        wishlistItem.style.transform = 'scale(0.9)';
                        wishlistItem.style.opacity = '0.5';

                        // Remove from wishlist
                        const currentWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                        currentWishlist.splice(index, 1);
                        localStorage.setItem('wishlist', JSON.stringify(currentWishlist));

                        // Update UI
                        setTimeout(() => {
                            loadWishlistItems();
                            updateWishlistCount();
                            showNotification(`${itemName} removed from wishlist`, 'success');

                            // Trigger wishlist update event for other pages
                            document.dispatchEvent(new CustomEvent('wishlistUpdated', {
                                detail: { action: 'remove', itemId: wishlistItem.dataset.itemId }
                            }));
                        }, 300);
                    }
                });
            });

            // Clear wishlist button
            if (clearWishlistBtn) {
                clearWishlistBtn.onclick = function (e) {
                    e.preventDefault();

                    if (confirm(`Are you sure you want to clear your entire wishlist? This will remove all ${wishlist.length} items.`)) {
                        // Add visual feedback
                        const wishlistItems = document.querySelectorAll('.wishlist-item');
                        wishlistItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.style.transform = 'scale(0.8)';
                                item.style.opacity = '0';
                            }, index * 100);
                        });

                        // Clear wishlist after animation
                        setTimeout(() => {
                            localStorage.removeItem('wishlist');
                            loadWishlistItems();
                            updateWishlistCount();
                            showNotification('Wishlist cleared successfully', 'success');

                            // Trigger wishlist update event
                            document.dispatchEvent(new CustomEvent('wishlistUpdated', {
                                detail: { action: 'clear' }
                            }));
                        }, wishlistItems.length * 100 + 300);
                    }
                };
            }

            // Add hover effects to wishlist items
            document.querySelectorAll('.wishlist-item').forEach(item => {
                item.addEventListener('mouseenter', function () {
                    this.style.transform = 'translateY(-5px)';
                    this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                });

                item.addEventListener('mouseleave', function () {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '';
                });
            });
        } catch (error) {
            console.error('Error loading wishlist items:', error);
            showNotification('Error loading wishlist items', 'error');
        }
    }

    function loadAddresses() {
        const addressesList = document.getElementById('addresses-list');
        const addAddressBtn = document.getElementById('add-address-btn');

        if (!addressesList) return;

        // Sample addresses
        const addresses = JSON.parse(localStorage.getItem('userAddresses')) || [
            {
                id: 1,
                type: 'Home',
                name: 'Sarah Johnson',
                street: '123 Main Street',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                isDefault: true
            },
            {
                id: 2,
                type: 'Work',
                name: 'Sarah Johnson',
                street: '456 Business Ave',
                city: 'New York',
                state: 'NY',
                zip: '10002',
                isDefault: false
            }
        ];

        addressesList.innerHTML = addresses.map(address => `
            <div class="address-item ${address.isDefault ? 'default' : ''}">
                <div class="address-details">
                    <h4>${address.type} ${address.isDefault ? '(Default)' : ''}</h4>
                    <p>${address.name}</p>
                    <p>${address.street}</p>
                    <p>${address.city}, ${address.state} ${address.zip}</p>
                </div>
                <div class="address-actions">
                    <button class="btn secondary" onclick="editAddress(${address.id})">Edit</button>
                    <button class="btn danger" onclick="deleteAddress(${address.id})">Delete</button>
                    ${!address.isDefault ? `<button class="btn primary" onclick="setDefaultAddress(${address.id})">Set Default</button>` : ''}
                </div>
            </div>
        `).join('');

        // Add address button
        if (addAddressBtn) {
            addAddressBtn.onclick = function () {
                showAddAddressModal();
            };
        }
    }

    function loadPaymentMethods() {
        const paymentList = document.getElementById('payment-methods-list');
        const addPaymentBtn = document.getElementById('add-payment-btn');

        if (!paymentList) return;

        // Sample payment methods
        const paymentMethods = JSON.parse(localStorage.getItem('userPaymentMethods')) || [
            {
                id: 1,
                type: 'Credit Card',
                last4: '4242',
                brand: 'Visa',
                expiry: '12/25',
                isDefault: true
            },
            {
                id: 2,
                type: 'Credit Card',
                last4: '8888',
                brand: 'Mastercard',
                expiry: '06/26',
                isDefault: false
            }
        ];

        paymentList.innerHTML = paymentMethods.map(method => `
            <div class="payment-item ${method.isDefault ? 'default' : ''}">
                <div class="payment-details">
                    <h4>${method.brand} ending in ${method.last4} ${method.isDefault ? '(Default)' : ''}</h4>
                    <p>Expires ${method.expiry}</p>
                </div>
                <div class="payment-actions">
                    <button class="btn secondary" onclick="editPaymentMethod(${method.id})">Edit</button>
                    <button class="btn danger" onclick="deletePaymentMethod(${method.id})">Delete</button>
                    ${!method.isDefault ? `<button class="btn primary" onclick="setDefaultPayment(${method.id})">Set Default</button>` : ''}
                </div>
            </div>
        `).join('');

        // Add payment method button
        if (addPaymentBtn) {
            addPaymentBtn.onclick = function () {
                showAddPaymentModal();
            };
        }
    }

    function initializeSettings() {
        // Change password button
        const changePasswordBtn = document.getElementById('change-password-btn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', function () {
                showChangePasswordModal();
            });
        }

        // Privacy settings button
        const privacySettingsBtn = document.getElementById('privacy-settings-btn');
        if (privacySettingsBtn) {
            privacySettingsBtn.addEventListener('click', function () {
                showPrivacySettingsModal();
            });
        }

        // Delete account button
        const deleteAccountBtn = document.getElementById('delete-account-btn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', function () {
                showDeleteAccountModal();
            });
        }

        // Two-factor authentication toggle
        const twoFactorToggle = document.getElementById('two-factor-auth');
        if (twoFactorToggle) {
            twoFactorToggle.addEventListener('change', function () {
                if (this.checked) {
                    showNotification('Two-factor authentication enabled', 'success');
                } else {
                    showNotification('Two-factor authentication disabled', 'info');
                }
            });
        }
    }

    function initializeNotifications() {
        // Email notifications toggle
        const emailNotifications = document.getElementById('email-notifications');
        if (emailNotifications) {
            emailNotifications.addEventListener('change', function () {
                animateNotificationToggle(this.closest('.toggle-switch'));
                const status = this.checked ? 'enabled' : 'disabled';
                showNotification(`Email notifications ${status}`, 'info');
                localStorage.setItem('emailNotifications', this.checked);
            });
        }

        // SMS notifications toggle
        const smsNotifications = document.getElementById('sms-notifications');
        if (smsNotifications) {
            smsNotifications.addEventListener('change', function () {
                animateNotificationToggle(this.closest('.toggle-switch'));
                const status = this.checked ? 'enabled' : 'disabled';
                showNotification(`SMS notifications ${status}`, 'info');
                localStorage.setItem('smsNotifications', this.checked);
            });
        }

        // Marketing emails toggle
        const marketingEmails = document.getElementById('marketing-emails');
        if (marketingEmails) {
            marketingEmails.addEventListener('change', function () {
                const status = this.checked ? 'enabled' : 'disabled';
                showNotification(`Marketing emails ${status}`, 'info');
                localStorage.setItem('marketingEmails', this.checked);
            });
        }

        // Rental reminders toggle
        const rentalReminders = document.getElementById('rental-reminders');
        if (rentalReminders) {
            rentalReminders.addEventListener('change', function () {
                const status = this.checked ? 'enabled' : 'disabled';
                showNotification(`Rental reminders ${status}`, 'info');
                localStorage.setItem('rentalReminders', this.checked);
            });
        }
    }

    function initializeAvatarUpload() {
        console.log('🖼️ Initializing avatar upload functionality...');
        
        // Find all possible avatar edit buttons
        const avatarEditBtn = document.getElementById('avatar-edit-btn');
        const changePhotoBtn = document.getElementById('change-photo-btn');
        const profileAvatar = document.getElementById('profile-avatar');
        
        console.log('Avatar elements found:', {
            avatarEditBtn: !!avatarEditBtn,
            changePhotoBtn: !!changePhotoBtn,
            profileAvatar: !!profileAvatar
        });

        // Enhanced avatar edit button handler
        if (avatarEditBtn) {
            // Remove any existing listeners
            avatarEditBtn.onclick = null;
            
            avatarEditBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 Avatar edit button clicked');
                triggerAvatarUpload();
            });
            
            console.log('✅ Avatar edit button initialized');
        } else {
            console.warn('⚠️ Avatar edit button not found');
        }

        // Enhanced change photo button handler
        if (changePhotoBtn) {
            // Remove any existing listeners
            changePhotoBtn.onclick = null;
            
            changePhotoBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 Change photo button clicked');
                triggerAvatarUpload();
            });
            
            console.log('✅ Change photo button initialized');
        } else {
            console.warn('⚠️ Change photo button not found');
        }

        // Make avatar clickable as well
        if (profileAvatar) {
            profileAvatar.style.cursor = 'pointer';
            profileAvatar.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 Profile avatar clicked');
                triggerAvatarUpload();
            });
            
            console.log('✅ Profile avatar click handler added');
        }

        // Add drag and drop functionality
        if (profileAvatar) {
            setupAvatarDragDrop(profileAvatar);
        }

        console.log('✅ Avatar upload initialization complete');
    }

    function triggerAvatarUpload() {
        console.log('📁 Triggering file selection...');
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = false;
        
        input.onchange = function (e) {
            const file = e.target.files[0];
            if (file) {
                console.log('📷 File selected:', file.name, file.size, 'bytes');
                handleAvatarUpload(file);
            } else {
                console.log('❌ No file selected');
            }
        };
        
        input.onerror = function (e) {
            console.error('❌ File input error:', e);
            showNotification('Error opening file selector', 'error');
        };
        
        // Trigger file selection
        try {
            input.click();
        } catch (error) {
            console.error('❌ Error triggering file input:', error);
            showNotification('Error opening file selector', 'error');
        }
    }

    function setupAvatarDragDrop(avatarElement) {
        console.log('🎯 Setting up drag and drop for avatar');
        
        avatarElement.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.opacity = '0.7';
            this.style.transform = 'scale(1.05)';
        });
        
        avatarElement.addEventListener('dragleave', function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        avatarElement.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    console.log('📷 Image dropped:', file.name);
                    handleAvatarUpload(file);
                } else {
                    showNotification('Please drop an image file', 'error');
                }
            }
        });
    }

    function handleAvatarUpload(file) {
        console.log('🔄 Processing avatar upload:', file.name, file.type, file.size);
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please select an image file', 'error');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('File size must be less than 5MB', 'error');
            return;
        }

        // Show loading state
        const profileAvatar = document.getElementById('profile-avatar');
        const formAvatar = document.getElementById('profile-form-avatar');
        
        if (profileAvatar) {
            profileAvatar.style.opacity = '0.5';
            profileAvatar.style.filter = 'blur(2px)';
        }
        
        if (formAvatar) {
            formAvatar.style.opacity = '0.5';
            formAvatar.style.filter = 'blur(2px)';
        }

        showNotification('Uploading profile photo...', 'info');

        const reader = new FileReader();
        
        reader.onload = function (e) {
            try {
                const avatarSrc = e.target.result;
                console.log('✅ File read successfully, data length:', avatarSrc.length);

                // Create image to validate
                const img = new Image();
                img.onload = function () {
                    console.log('✅ Image validated:', img.width, 'x', img.height);
                    
                    // Update all avatar images
                    updateAvatarImages(avatarSrc);
                    
                    // Save to localStorage
                    saveAvatarToStorage(avatarSrc);
                    
                    // Animate avatar update
                    animateAvatarUpload();
                    
                    // Show success message
                    showNotification('Profile photo updated successfully!', 'success');
                    
                    console.log('✅ Avatar upload complete');
                };
                
                img.onerror = function () {
                    console.error('❌ Invalid image file');
                    resetAvatarLoadingState();
                    showNotification('Invalid image file', 'error');
                };
                
                img.src = avatarSrc;
                
            } catch (error) {
                console.error('❌ Error processing image:', error);
                resetAvatarLoadingState();
                showNotification('Error processing image', 'error');
            }
        };
        
        reader.onerror = function (error) {
            console.error('❌ FileReader error:', error);
            resetAvatarLoadingState();
            showNotification('Error reading file', 'error');
        };
        
        reader.readAsDataURL(file);
    }

    function updateAvatarImages(avatarSrc) {
        console.log('🖼️ Updating avatar images...');
        
        const avatarElements = [
            document.getElementById('profile-avatar'),
            document.getElementById('profile-form-avatar'),
            document.querySelector('.profile-avatar-small'),
            document.querySelector('.profile-avatar img')
        ];

        avatarElements.forEach((element, index) => {
            if (element) {
                element.src = avatarSrc;
                element.style.opacity = '1';
                element.style.filter = 'none';
                console.log(`✅ Updated avatar element ${index + 1}`);
            }
        });

        // Update any other avatar images in the page
        const allAvatars = document.querySelectorAll('img[alt*="Profile"], img[alt*="Avatar"], img[id*="avatar"]');
        allAvatars.forEach((avatar, index) => {
            if (avatar && avatar.src.includes('placeholder')) {
                avatar.src = avatarSrc;
                console.log(`✅ Updated additional avatar ${index + 1}`);
            }
        });
    }

    function saveAvatarToStorage(avatarSrc) {
        console.log('💾 Saving avatar to localStorage...');
        
        try {
            // Update currentUser
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
            currentUser.avatar = avatarSrc;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update userData as well for consistency
            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            userData.avatar = avatarSrc;
            localStorage.setItem('userData', JSON.stringify(userData));
            
            console.log('✅ Avatar saved to localStorage');
            
        } catch (error) {
            console.error('❌ Error saving avatar:', error);
            showNotification('Error saving profile photo', 'error');
        }
    }

    function resetAvatarLoadingState() {
        console.log('🔄 Resetting avatar loading state...');
        
        const profileAvatar = document.getElementById('profile-avatar');
        const formAvatar = document.getElementById('profile-form-avatar');
        
        if (profileAvatar) {
            profileAvatar.style.opacity = '1';
            profileAvatar.style.filter = 'none';
        }
        
        if (formAvatar) {
            formAvatar.style.opacity = '1';
            formAvatar.style.filter = 'none';
        }
    }

    function initializeModals() {
        // Close modals when clicking outside
        document.addEventListener('click', function (e) {
            if (e.target.classList.contains('modal')) {
                e.target.remove();
            }
        });

        // Close modals with escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => modal.remove());
            }
        });
    }

    // Utility functions
    function formatDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const options = { month: 'short', day: 'numeric' };

        if (start.getFullYear() !== new Date().getFullYear()) {
            options.year = 'numeric';
        }

        return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    }

    function updateCartCount() {
        try {
            const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
            const cartCountElements = document.querySelectorAll('#cart-count, #header-cart-count');

            cartCountElements.forEach(element => {
                if (element) {
                    element.textContent = cart.length;
                    element.style.display = cart.length > 0 ? 'inline' : 'none';
                }
            });
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    }

    function updateWishlistCount() {
        try {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const wishlistCountElements = document.querySelectorAll('#wishlist-count, #header-wishlist-count');

            wishlistCountElements.forEach(element => {
                if (element) {
                    element.textContent = wishlist.length;
                    element.style.display = wishlist.length > 0 ? 'inline' : 'none';
                }
            });
        } catch (error) {
            console.error('Error updating wishlist count:', error);
        }
    }

    function updateProfileStats() {
        // Update rental statistics
        const totalRentalsEl = document.getElementById('total-rentals');
        const activeRentalsEl = document.getElementById('active-rentals');

        if (totalRentalsEl) {
            const currentCount = parseInt(totalRentalsEl.textContent) || 0;
            totalRentalsEl.textContent = currentCount;
        }

        if (activeRentalsEl) {
            const currentCount = parseInt(activeRentalsEl.textContent) || 0;
            activeRentalsEl.textContent = currentCount;
        }
    }

    // Modal functions
    function showAddAddressModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Add New Address</h3>
                <form id="add-address-form">
                    <div class="form-group">
                        <label for="address-type">Address Type:</label>
                        <select id="address-type" required>
                            <option value="">Select Type</option>
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="address-name">Full Name:</label>
                        <input type="text" id="address-name" required>
                    </div>
                    <div class="form-group">
                        <label for="address-street">Street Address:</label>
                        <input type="text" id="address-street" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="address-city">City:</label>
                            <input type="text" id="address-city" required>
                        </div>
                        <div class="form-group">
                            <label for="address-state">State:</label>
                            <input type="text" id="address-state" required>
                        </div>
                        <div class="form-group">
                            <label for="address-zip">ZIP Code:</label>
                            <input type="text" id="address-zip" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="address-default"> Set as default address
                        </label>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                        <button type="submit" class="btn primary">Add Address</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        // Form submission
        modal.querySelector('#add-address-form').addEventListener('submit', (e) => {
            e.preventDefault();

            const addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
            const newAddress = {
                id: Date.now(),
                type: document.getElementById('address-type')?.value || '',
                name: document.getElementById('address-name')?.value || '',
                street: document.getElementById('address-street')?.value || '',
                city: document.getElementById('address-city')?.value || '',
                state: document.getElementById('address-state')?.value || '',
                zip: document.getElementById('address-zip')?.value || '',
                isDefault: document.getElementById('address-default')?.checked || false
            };

            // If this is set as default, remove default from others
            if (newAddress.isDefault) {
                addresses.forEach(addr => addr.isDefault = false);
            }

            addresses.push(newAddress);
            localStorage.setItem('userAddresses', JSON.stringify(addresses));
            loadAddresses();
            showNotification('Address added successfully!', 'success');
            modal.remove();
        });
    }

    function showAddPaymentModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Add Payment Method</h3>
                <form id="add-payment-form">
                    <div class="form-group">
                        <label for="card-number">Card Number:</label>
                        <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="card-expiry">Expiry Date:</label>
                            <input type="text" id="card-expiry" placeholder="MM/YY" required>
                        </div>
                        <div class="form-group">
                            <label for="card-cvv">CVV:</label>
                            <input type="text" id="card-cvv" placeholder="123" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="card-name">Cardholder Name:</label>
                        <input type="text" id="card-name" required>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="payment-default"> Set as default payment method
                        </label>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                        <button type="submit" class="btn primary">Add Payment Method</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        // Form submission
        modal.querySelector('#add-payment-form').addEventListener('submit', (e) => {
            e.preventDefault();

            const paymentMethods = JSON.parse(localStorage.getItem('userPaymentMethods')) || [];
            const cardNumber = (document.getElementById('card-number')?.value || '').replace(/\s/g, '');
            const last4 = cardNumber.slice(-4);
            const brand = getCardBrand(cardNumber);

            const newPayment = {
                id: Date.now(),
                type: 'Credit Card',
                last4: last4,
                brand: brand,
                expiry: document.getElementById('card-expiry')?.value || '',
                isDefault: document.getElementById('payment-default')?.checked || false
            };

            // If this is set as default, remove default from others
            if (newPayment.isDefault) {
                paymentMethods.forEach(method => method.isDefault = false);
            }

            paymentMethods.push(newPayment);
            localStorage.setItem('userPaymentMethods', JSON.stringify(paymentMethods));
            loadPaymentMethods();
            showNotification('Payment method added successfully!', 'success');
            modal.remove();
        });
    }

    function showChangePasswordModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Change Password</h3>
                <form id="change-password-form">
                    <div class="form-group">
                        <label for="current-password">Current Password:</label>
                        <input type="password" id="current-password" required>
                    </div>
                    <div class="form-group">
                        <label for="new-password">New Password:</label>
                        <input type="password" id="new-password" required>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">Confirm New Password:</label>
                        <input type="password" id="confirm-password" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                        <button type="submit" class="btn primary">Change Password</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        // Form submission
        modal.querySelector('#change-password-form').addEventListener('submit', (e) => {
            e.preventDefault();

            const newPassword = document.getElementById('new-password')?.value || '';
            const confirmPassword = document.getElementById('confirm-password')?.value || '';

            if (newPassword !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }

            if (newPassword.length < 8) {
                showNotification('Password must be at least 8 characters long', 'error');
                return;
            }

            // In a real app, you would validate the current password and update it
            showNotification('Password changed successfully!', 'success');
            modal.remove();
        });
    }

    function showDeleteAccountModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Delete Account</h3>
                <div class="warning-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>This action cannot be undone. All your data will be permanently deleted.</p>
                </div>
                <form id="delete-account-form">
                    <div class="form-group">
                        <label for="delete-password">Enter your password to confirm:</label>
                        <input type="password" id="delete-password" required>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="delete-confirm" required> 
                            I understand that this action cannot be undone
                        </label>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                        <button type="submit" class="btn danger">Delete Account</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        // Form submission
        modal.querySelector('#delete-account-form').addEventListener('submit', (e) => {
            e.preventDefault();

            if (confirm('Are you absolutely sure you want to delete your account? This cannot be undone.')) {
                // In a real app, you would delete the account
                showNotification('Account deletion request submitted', 'info');
                modal.remove();
            }
        });
    }

    function showPrivacySettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Privacy Settings</h3>
                <div class="privacy-settings">
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Profile Visibility</h4>
                            <p>Control who can see your profile information</p>
                        </div>
                        <select id="profile-visibility">
                            <option value="public">Public</option>
                            <option value="friends">Friends Only</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Data Collection</h4>
                            <p>Allow collection of usage data for service improvement</p>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="data-collection" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Personalized Ads</h4>
                            <p>Show personalized advertisements based on your preferences</p>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="personalized-ads">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button type="button" class="btn primary" onclick="savePrivacySettings()">Save Settings</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
    }

    // Global functions for button actions
    window.editAddress = function (id) {
        showNotification('Edit address functionality would be implemented here', 'info');
    };

    window.deleteAddress = function (id) {
        if (confirm('Are you sure you want to delete this address?')) {
            const addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
            const updatedAddresses = addresses.filter(addr => addr.id !== id);
            localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
            loadAddresses();
            showNotification('Address deleted successfully', 'success');
        }
    };

    window.setDefaultAddress = function (id) {
        const addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
        addresses.forEach(addr => {
            addr.isDefault = addr.id === id;
        });
        localStorage.setItem('userAddresses', JSON.stringify(addresses));
        loadAddresses();
        showNotification('Default address updated', 'success');
    };

    window.editPaymentMethod = function (id) {
        showNotification('Edit payment method functionality would be implemented here', 'info');
    };

    window.deletePaymentMethod = function (id) {
        if (confirm('Are you sure you want to delete this payment method?')) {
            const paymentMethods = JSON.parse(localStorage.getItem('userPaymentMethods')) || [];
            const updatedMethods = paymentMethods.filter(method => method.id !== id);
            localStorage.setItem('userPaymentMethods', JSON.stringify(updatedMethods));
            loadPaymentMethods();
            showNotification('Payment method deleted successfully', 'success');
        }
    };

    window.setDefaultPayment = function (id) {
        const paymentMethods = JSON.parse(localStorage.getItem('userPaymentMethods')) || [];
        paymentMethods.forEach(method => {
            method.isDefault = method.id === id;
        });
        localStorage.setItem('userPaymentMethods', JSON.stringify(paymentMethods));
        loadPaymentMethods();
        showNotification('Default payment method updated', 'success');
    };

    window.showRentalDetails = function (id) {
        showNotification('Rental details modal would be implemented here', 'info');
    };

    window.reorderItem = function (id) {
        showNotification('Reorder functionality would redirect to product page', 'info');
    };

    window.savePrivacySettings = function () {
        const settings = {
            profileVisibility: document.getElementById('profile-visibility')?.value || 'public',
            dataCollection: document.getElementById('data-collection')?.checked || false,
            personalizedAds: document.getElementById('personalized-ads')?.checked || false
        };

        localStorage.setItem('privacySettings', JSON.stringify(settings));
        showNotification('Privacy settings saved successfully!', 'success');
        document.querySelector('.modal').remove();
    };

    // Utility functions
    function getCardBrand(cardNumber) {
        const firstDigit = cardNumber.charAt(0);
        const firstTwoDigits = cardNumber.substring(0, 2);

        if (firstDigit === '4') return 'Visa';
        if (firstTwoDigits >= '51' && firstTwoDigits <= '55') return 'Mastercard';
        if (firstTwoDigits === '34' || firstTwoDigits === '37') return 'American Express';
        if (firstTwoDigits === '60' || firstTwoDigits === '65') return 'Discover';

        return 'Unknown';
    }

    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            min-width: 300px;
            animation: slideInRight 0.3s ease;
        `;

        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
            opacity: 0.8;
        `;

        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        });

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    function getNotificationColor(type) {
        switch (type) {
            case 'success': return '#28a745';
            case 'error': return '#dc3545';
            case 'warning': return '#ffc107';
            default: return '#17a2b8';
        }
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
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
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal-content {
            background: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        }

        .close-modal {
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }

        .close-modal:hover {
            color: #000;
        }

        .warning-message {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #856404;
        }

        .warning-message i {
            color: #f39c12;
            font-size: 20px;
        }
    `;
    document.head.appendChild(style);

    // Initialize cart and wishlist counts on page load
    updateCartCount();
    updateWishlistCount();

    // Initialize scroll animations
    initializeScrollAnimations();
});

// Add scroll reveal functionality
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Add stagger effect for child elements
                const children = entry.target.querySelectorAll('.stagger-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.animationDelay = `${index * 0.1}s`;
                        child.classList.add('animate');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe all elements with scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });

    // Add scroll-reveal class to profile elements
    document.querySelectorAll('.content-section, .form-group, .rental-card').forEach(el => {
        el.classList.add('scroll-reveal');
    });
};

// Animation Functions
function initializeAnimations() {
    // Add smooth transitions to all elements
    const style = document.createElement('style');
    style.textContent = `
            * {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .profile-container {
                animation: fadeInUp 0.8s ease-out;
            }
            
            .profile-sidebar {
                animation: slideInLeft 0.6s ease-out;
            }
            
            .profile-content {
                animation: slideInRight 0.6s ease-out 0.2s both;
            }
            
            .menu-item {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .menu-item:hover {
                transform: translateX(8px);
                background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
                color: white;
                box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
            }
            
            .content-section {
                animation: fadeInUp 0.5s ease-out;
            }
            
            .cart-item, .history-item, .wishlist-item {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .cart-item:hover, .history-item:hover, .wishlist-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            }
            
            .btn {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }
            
            .btn::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.6s, height 0.6s;
            }
            
            .btn:hover::before {
                width: 300px;
                height: 300px;
            }
            
            .btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }
            
            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                transform: scale(1.02);
                box-shadow: 0 0 20px rgba(74, 144, 226, 0.2);
            }
            
            .profile-avatar img:hover {
                transform: scale(1.1) rotate(5deg);
                box-shadow: 0 0 30px rgba(74, 144, 226, 0.4);
            }
            
            .stat:hover {
                transform: translateY(-5px) scale(1.05);
                background: rgba(74, 144, 226, 0.1);
                border-radius: 10px;
                padding: 10px;
                margin: -10px;
            }
            
            .modal-content {
                animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .notification {
                animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .stagger-animation {
                opacity: 0;
                transform: translateY(20px);
                animation: staggerFadeIn 0.5s ease-out forwards;
            }
            
            @keyframes staggerFadeIn {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
    document.head.appendChild(style);
}

function initializeScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                // Add stagger animation to child elements
                const children = entry.target.querySelectorAll('.cart-item, .history-item, .wishlist-item, .address-item, .payment-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('stagger-animation');
                        child.style.animationDelay = `${index * 0.1}s`;
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe all content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => observer.observe(section));
}

function animateMenuTransition(targetSection) {
    const contentSections = document.querySelectorAll('.content-section');
    const activeSection = document.querySelector('.content-section.active');

    if (activeSection) {
        // Animate out current section
        activeSection.style.animation = 'fadeOutLeft 0.3s ease-out';

        setTimeout(() => {
            activeSection.classList.remove('active');
            activeSection.style.animation = '';

            // Animate in new section
            const newSection = document.getElementById(targetSection);
            if (newSection) {
                newSection.classList.add('active');
                newSection.style.animation = 'fadeInRight 0.4s ease-out';

                // Add stagger animation to items
                setTimeout(() => {
                    const items = newSection.querySelectorAll('.cart-item, .history-item, .wishlist-item, .address-item, .payment-item');
                    items.forEach((item, index) => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }, 200);
            }
        }, 300);
    }
}

function animateCartUpdate() {
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach((item, index) => {
        item.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`;
    });
}

function animateWishlistUpdate() {
    const wishlistItems = document.querySelectorAll('.wishlist-item');
    wishlistItems.forEach((item, index) => {
        item.style.animation = `scaleIn 0.5s ease-out ${index * 0.1}s both`;
    });
}

function animateStatUpdate(element) {
    element.style.transform = 'scale(1.2)';
    element.style.color = 'var(--accent-color)';

    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.color = '';
    }, 300);
}

function animateFormSubmission(form) {
    const button = form.querySelector('button[type="submit"]');
    if (button) {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        button.disabled = true;

        // Add success animation after delay
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check"></i> Saved!';
            button.style.background = 'var(--success-color)';

            setTimeout(() => {
                button.innerHTML = 'Save Changes';
                button.style.background = '';
                button.disabled = false;
            }, 1500);
        }, 1000);
    }
}

function animateAvatarUpload() {
    const avatar = document.getElementById('profile-avatar');
    if (avatar) {
        avatar.style.animation = 'pulse 0.6s ease-in-out';

        setTimeout(() => {
            avatar.style.animation = '';
        }, 600);
    }
}

function animateNotificationToggle(toggle) {
    const slider = toggle.querySelector('.slider');
    if (slider) {
        slider.style.transform = 'scale(1.1)';

        setTimeout(() => {
            slider.style.transform = 'scale(1)';
        }, 200);
    }
}

function animateItemRemoval(item) {
    item.style.animation = 'slideOutRight 0.4s ease-out';
    item.style.transformOrigin = 'right center';

    setTimeout(() => {
        item.remove();
    }, 400);
}

function animateCounterUpdate(element, newValue) {
    const currentValue = parseInt(element.textContent) || 0;
    const increment = newValue > currentValue ? 1 : -1;
    let current = currentValue;

    const counter = setInterval(() => {
        current += increment;
        element.textContent = current;
        element.style.transform = 'scale(1.1)';

        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 100);

        if (current === newValue) {
            clearInterval(counter);
        }
    }, 50);
}

// Enhanced navigation with animations
function navigateToSection(sectionName) {
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');

    // Animate menu items
    menuItems.forEach(menu => {
        menu.classList.remove('active');
        menu.style.transform = 'translateX(0)';
    });

    const targetMenuItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (targetMenuItem) {
        targetMenuItem.classList.add('active');
        targetMenuItem.style.transform = 'translateX(8px)';
    }

    // Animate content sections
    animateMenuTransition(sectionName);

    // Load section-specific data with animations
    switch (sectionName) {
        case 'rental-history':
            setTimeout(() => {
                loadRentalHistory();
                animateHistoryItems();
            }, 300);
            break;
        case 'cart':
            setTimeout(() => {
                loadCartItems();
                animateCartUpdate();
            }, 300);
            break;
        case 'wishlist':
            setTimeout(() => {
                loadWishlistItems();
                animateWishlistUpdate();
            }, 300);
            break;
        case 'addresses':
            setTimeout(() => {
                loadAddresses();
                animateAddressItems();
            }, 300);
            break;
        case 'payment-methods':
            setTimeout(() => {
                loadPaymentMethods();
                animatePaymentItems();
            }, 300);
            break;
    }
}

function animateHistoryItems() {
    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 150);
    });
}

function animateAddressItems() {
    const addressItems = document.querySelectorAll('.address-item');
    addressItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function animatePaymentItems() {
    const paymentItems = document.querySelectorAll('.payment-item');
    paymentItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        }, index * 100);
    });
}

// Override existing functions to include animations
const originalUpdateCartCount = updateCartCount;
updateCartCount = function () {
    const cartCountElements = document.querySelectorAll('#cart-count, #header-cart-count');
    const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];

    cartCountElements.forEach(element => {
        if (element) {
            const currentCount = parseInt(element.textContent) || 0;
            const newCount = cart.length;

            if (currentCount !== newCount) {
                animateOptimizedCounterUpdate(element, newCount);
            }

            element.style.display = newCount > 0 ? 'inline' : 'none';
        }
    });
};

const originalUpdateWishlistCount = updateWishlistCount;
updateWishlistCount = function () {
    const wishlistCountElements = document.querySelectorAll('#wishlist-count, #header-wishlist-count');
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    wishlistCountElements.forEach(element => {
        if (element) {
            const currentCount = parseInt(element.textContent) || 0;
            const newCount = wishlist.length;

            if (currentCount !== newCount) {
                animateOptimizedCounterUpdate(element, newCount);
            }

            element.style.display = newCount > 0 ? 'inline' : 'none';
        }
    });
};

// Add CSS animations for fade effects
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
        @keyframes fadeOutLeft {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(-30px);
            }
        }
        
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .loading-shimmer {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
            0% {
                background-position: -200% 0;
            }
            100% {
                background-position: 200% 0;
            }
        }
    `;
document.head.appendChild(additionalStyles);

// Initialize cart and wishlist counts on page load with animations
setTimeout(() => {
    updateCartCount();
    updateWishlistCount();
}, 500);

// Animation helper functions
function animateButtonClick(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

function animateModalOpen(modal) {
    if (modal) {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 50);
    }
}

// Enhanced button interactions
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
        const button = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
        animateOptimizedButtonClick(button);
    }
});

// Enhanced modal animations
const originalShowModal = window.showModal || function () { };
window.showModal = function (modal) {
    originalShowModal.call(this, modal);
    animateModalOpen(modal);
};

// Add CSS for smooth animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
        .animate-in {
            animation: slideInUp 0.6s ease-out;
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .profile-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .profile-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .menu-item {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .menu-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s ease;
        }

        .menu-item:hover::before {
            left: 100%;
        }

        .content-section {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cart-item, .wishlist-item, .history-item, .address-item, .payment-item {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cart-item:hover, .wishlist-item:hover, .history-item:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .btn {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .btn::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }

        .btn:active::after {
            width: 300px;
            height: 300px;
        }

        .stat-number {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .avatar-edit-btn {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .avatar-edit-btn:hover {
            transform: scale(1.1) rotate(15deg);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(74, 144, 226, 0.15);
        }

        .modal-content {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .notification {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toggle-switch .slider {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toggle-switch .slider:before {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Stagger animations for lists */
        .stagger-animation {
            animation: staggerFadeIn 0.5s ease-out forwards;
        }

        @keyframes staggerFadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Loading states */
        .loading-shimmer {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
            0% {
                background-position: -200% 0;
            }
            100% {
                background-position: 200% 0;
            }
        }

        /* Smooth scrolling */
        html {
            scroll-behavior: smooth;
        }

        /* Enhanced hover effects */
        .profile-avatar img:hover {
            transform: scale(1.1);
            filter: brightness(1.1);
        }

        .cart-count {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cart-count:hover {
            transform: scale(1.2);
            background: var(--accent-color);
        }
    `;
document.head.appendChild(animationStyles);

// Initialize cart and wishlist counts on page load
updateCartCount();
updateWishlistCount();

// Utility function to format date range
function formatDateRange(startDate, endDate) {
    if (!startDate || !endDate) return 'Date not specified';

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const options = { month: 'short', day: 'numeric' };
        const startFormatted = start.toLocaleDateString('en-US', options);
        const endFormatted = end.toLocaleDateString('en-US', options);

        return `${startFormatted} - ${endFormatted}`;
    } catch (error) {
        return 'Invalid date';
    }
}

// Utility function to format currency
function formatCurrency(amount) {
    if (typeof amount === 'string') {
        amount = parseFloat(amount.replace(/[^0-9.]/g, '') || '0');
    }
    return `₹${amount.toFixed(2)}`;
}

// Utility function to generate star ratings
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star" style="color: #ffc107;"></i>';
        } else {
            stars += '<i class="far fa-star" style="color: #ddd;"></i>';
        }
    }
    return stars;
}

// Listen for rental integration events
document.addEventListener('rentalCreated', function (e) {
    // Refresh profile data when new rental is created
    if (typeof refreshProfileData === 'function') {
        refreshProfileData();
    }
});

document.addEventListener('rentalStatusUpdated', function (e) {
    // Refresh profile data when rental status changes
    if (typeof refreshProfileData === 'function') {
        refreshProfileData();
    }
});

document.addEventListener('dataSynced', function (e) {
    // Refresh profile data when data is synced
    if (typeof refreshProfileData === 'function') {
        refreshProfileData();
    }
});
// Enhanced Wishlist Functions
function removeFromWishlist(index) {
    try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (index >= 0 && index < wishlist.length) {
            const removedItem = wishlist[index];
            wishlist.splice(index, 1);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            loadWishlistItems();
            updateWishlistCount();
            showNotification(`${removedItem.name || 'Item'} removed from wishlist`, 'info');
        }
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        showNotification('Error removing item from wishlist', 'error');
    }
}

function addWishlistItemToCart(index) {
    try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const item = wishlist[index];

        if (!item) {
            showNotification('Item not found in wishlist', 'error');
            return;
        }

        // Create rental data for cart
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date(tomorrow);
        dayAfter.setDate(dayAfter.getDate() + 1);

        const cartItem = {
            cartItemId: Date.now().toString(),
            productId: item.id,
            productName: item.name,
            productImage: item.image,
            category: item.category,
            size: item.size || 'M',
            startDate: tomorrow.toISOString().split('T')[0],
            endDate: dayAfter.toISOString().split('T')[0],
            quantity: 1,
            rentalFee: item.price || 0,
            totalCost: calculateEstimatedTotal(item.price || 0),
            days: 1,
            specialRequests: '',
            addedAt: new Date().toISOString(),
            source: 'wishlist'
        };

        // Add to cart
        const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];

        // Check if item already exists in cart
        const existingIndex = cart.findIndex(cartItem =>
            cartItem.productId === item.id && cartItem.size === (item.size || 'M')
        );

        if (existingIndex >= 0) {
            showNotification('Item is already in your cart', 'info');
            return;
        }

        cart.push(cartItem);
        localStorage.setItem('rentalCart', JSON.stringify(cart));

        updateCartCount();
        showNotification(`${item.name} added to cart`, 'success');

        // Optionally remove from wishlist
        if (confirm('Item added to cart! Would you like to remove it from your wishlist?')) {
            removeFromWishlist(index);
        }
    } catch (error) {
        console.error('Error adding wishlist item to cart:', error);
        showNotification('Error adding item to cart', 'error');
    }
}

function viewWishlistItemDetails(itemId) {
    try {
        // Store the item data and redirect to product details
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const item = wishlist.find(i => i.id == itemId);

        if (item) {
            localStorage.setItem('selectedItem', JSON.stringify(item));
            localStorage.setItem('currentItemId', itemId.toString());
            window.location.href = `product-details.html?id=${itemId}`;
        } else {
            showNotification('Item not found', 'error');
        }
    } catch (error) {
        console.error('Error viewing wishlist item details:', error);
        showNotification('Error loading item details', 'error');
    }
}

function viewWishlistItem(itemId) {
    // Quick view functionality - could open a modal
    viewWishlistItemDetails(itemId);
}

function getCategoryDisplayName(category) {
    const categoryNames = {
        // Men's categories
        'Jodhpuri': 'Jodhpuri',
        'Kurta': 'Kurta',
        'Tuxedo': 'Tuxedo',
        'Suit': 'Suit',
        'Sherwani': 'Sherwani',
        'Blazer': 'Blazer',
        'Indowastern': 'Indowastern',
        // Women's categories
        'Anarkali': 'Anarkali',
        'Gown': 'Gown',
        'Lehnga': 'Lehnga'
    };
    return categoryNames[category] || (category ? category.charAt(0).toUpperCase() + category.slice(1) : 'General');
}

function formatRelativeTime(dateString) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;

        return date.toLocaleDateString();
    } catch (error) {
        return 'recently';
    }
}

function calculateEstimatedTotal(dailyPrice) {
    const price = typeof dailyPrice === 'number' ? dailyPrice : parseFloat(dailyPrice || 0);
    const damageProtection = Math.round(price * 0.15);
    const deliveryFee = price >= 100 ? 0 : 10;
    const tax = Math.round((price + damageProtection + deliveryFee) * 0.08);
    return price + damageProtection + deliveryFee + tax;
}

// Duplicate functions removed - using the ones defined earlier in the file

// Global function to add items to cart
window.addToCart = function (item, rentalData = {}) {
    try {
        const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];

        // Create cart item with proper structure
        const cartItem = {
            id: item.id,
            productId: item.id,
            productName: item.name,
            productImage: item.image,
            name: item.name,
            image: item.image,
            price: item.price,
            rentalFee: item.price,
            rentalPrice: item.price,
            weeklyPrice: item.weeklyPrice,
            category: item.category,
            size: item.size,
            gender: item.gender,
            quantity: rentalData.quantity || 1,
            days: rentalData.days || 1,
            startDate: rentalData.startDate || new Date().toISOString().split('T')[0],
            endDate: rentalData.endDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            totalCost: rentalData.totalCost || item.price,
            addedAt: new Date().toISOString()
        };

        // Check if item already exists in cart
        const existingIndex = cart.findIndex(cartItem => cartItem.productId === item.id);
        if (existingIndex !== -1) {
            // Update existing item
            cart[existingIndex] = { ...cart[existingIndex], ...cartItem };
            showNotification(`${item.name} updated in cart`, 'info');
        } else {
            // Add new item
            cart.push(cartItem);
            showNotification(`${item.name} added to cart`, 'success');
        }

        localStorage.setItem('rentalCart', JSON.stringify(cart));
        updateCartCount();

        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding item to cart', 'error');
        return false;
    }
};

// Make functions globally available
window.removeFromWishlist = removeFromWishlist;
window.addWishlistItemToCart = addWishlistItemToCart;
window.viewWishlistItemDetails = viewWishlistItemDetails;
window.viewWishlistItem = viewWishlistItem;
window.updateWishlistCount = updateWishlistCount;
window.updateCartCount = updateCartCount;

// Additional optimized animations for profile interactions

// Optimized notification animation
function showOptimizedNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

    // Add GPU acceleration
    notification.classList.add('gpu-accelerated');
    notification.style.transform = 'translate3d(100%, 0, 0)';
    notification.style.opacity = '0';

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease';
        notification.style.transform = 'translate3d(0, 0, 0)';
        notification.style.opacity = '1';
    });

    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translate3d(100%, 0, 0)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 4000);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translate3d(100%, 0, 0)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    });
}

// Optimized modal animations
function animateOptimizedModalOpen(modal) {
    modal.style.opacity = '0';
    modal.style.transform = 'scale3d(0.9, 0.9, 1)';

    requestAnimationFrame(() => {
        modal.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        modal.style.opacity = '1';
        modal.style.transform = 'scale3d(1, 1, 1)';
    });
}

function animateOptimizedModalClose(modal) {
    modal.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    modal.style.opacity = '0';
    modal.style.transform = 'scale3d(0.95, 0.95, 1)';

    setTimeout(() => modal.remove(), 200);
}

// Optimized avatar upload animation
function animateOptimizedAvatarUpdate(avatarElement, newSrc) {
    avatarElement.style.transform = 'scale3d(0.8, 0.8, 1)';
    avatarElement.style.opacity = '0.5';

    const img = new Image();
    img.onload = () => {
        avatarElement.src = newSrc;
        requestAnimationFrame(() => {
            avatarElement.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease';
            avatarElement.style.transform = 'scale3d(1, 1, 1)';
            avatarElement.style.opacity = '1';
        });
    };
    img.src = newSrc;
}

// Optimized loading state animation
function showOptimizedLoadingState(element, text = 'Loading...') {
    const originalContent = element.innerHTML;
    element.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    element.disabled = true;
    element.style.opacity = '0.7';

    return () => {
        element.innerHTML = originalContent;
        element.disabled = false;
        element.style.opacity = '1';
    };
}

// Performance monitoring for animations
let animationFrameCount = 0;
let lastFrameTime = performance.now();

function monitorAnimationPerformance() {
    const currentTime = performance.now();
    animationFrameCount++;

    if (currentTime - lastFrameTime >= 1000) {
        const fps = Math.round((animationFrameCount * 1000) / (currentTime - lastFrameTime));

        if (fps < 30) {
            console.warn('Animation performance is low:', fps, 'fps');
            // Reduce animation complexity if needed
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
        }

        animationFrameCount = 0;
        lastFrameTime = currentTime;
    }

    requestAnimationFrame(monitorAnimationPerformance);
}

// Start performance monitoring
requestAnimationFrame(monitorAnimationPerformance);

// Optimize animations based on device capabilities
function optimizeForDevice() {
    const isLowEndDevice = navigator.hardwareConcurrency <= 2 ||
        navigator.deviceMemory <= 2 ||
        /Android.*Chrome\/[.0-9]*\s/.test(navigator.userAgent);

    if (isLowEndDevice) {
        document.documentElement.style.setProperty('--animation-duration', '0.2s');
        document.documentElement.classList.add('reduced-motion');
    }
}

// Initialize device optimization
optimizeForDevice();
// Enhanced Wishlist Functionality
function initializeWishlistFunctionality() {
    // Global function to add item to wishlist
    window.addToWishlist = function (item) {
        try {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

            // Check if item already exists
            const existingIndex = wishlist.findIndex(w =>
                (typeof w === 'object' ? w.id : w) === item.id
            );

            if (existingIndex === -1) {
                wishlist.push(item);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                updateWishlistCount();
                showNotification(`${item.name} added to wishlist`, 'success');

                // Trigger wishlist update event
                document.dispatchEvent(new CustomEvent('wishlistUpdated', {
                    detail: { action: 'add', item: item }
                }));

                return true;
            } else {
                showNotification(`${item.name} is already in your wishlist`, 'info');
                return false;
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            showNotification('Error adding item to wishlist', 'error');
            return false;
        }
    };

    // Global function to remove item from wishlist
    window.removeFromWishlist = function (itemId) {
        try {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const filteredWishlist = wishlist.filter(item =>
                (typeof item === 'object' ? item.id : item) !== itemId
            );

            if (filteredWishlist.length < wishlist.length) {
                localStorage.setItem('wishlist', JSON.stringify(filteredWishlist));
                updateWishlistCount();

                // Reload wishlist if on profile page
                if (document.getElementById('wishlist-grid')) {
                    loadWishlistItems();
                }

                // Trigger wishlist update event
                document.dispatchEvent(new CustomEvent('wishlistUpdated', {
                    detail: { action: 'remove', itemId: itemId }
                }));

                return true;
            }
            return false;
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            return false;
        }
    };

    // Global function to check if item is in wishlist
    window.isInWishlist = function (itemId) {
        try {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            return wishlist.some(item =>
                (typeof item === 'object' ? item.id : item) === itemId
            );
        } catch (error) {
            console.error('Error checking wishlist:', error);
            return false;
        }
    };

    // Global function to get wishlist count
    window.getWishlistCount = function () {
        try {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            return wishlist.length;
        } catch (error) {
            console.error('Error getting wishlist count:', error);
            return 0;
        }
    };

    // Debug function for wishlist
    window.debugWishlist = function () {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
        const removeButtons = document.querySelectorAll('.remove-wishlist-item');

        console.log('=== WISHLIST DEBUG INFO ===');
        console.log('Wishlist items:', wishlist);
        console.log('View Details buttons found:', viewDetailsButtons.length);
        console.log('Remove buttons found:', removeButtons.length);
        console.log('Wishlist container:', document.getElementById('wishlist-grid'));
        console.log('=== END WISHLIST DEBUG ===');

        return {
            wishlistCount: wishlist.length,
            viewDetailsButtons: viewDetailsButtons.length,
            removeButtons: removeButtons.length
        };
    };
}

// Initialize wishlist functionality when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWishlistFunctionality);
} else {
    initializeWishlistFunctionality();
}

// Backup event delegation for wishlist buttons
document.addEventListener('click', function (e) {
    // Handle View Details button clicks
    if (e.target.matches('.view-details-btn') || e.target.closest('.view-details-btn')) {
        const button = e.target.matches('.view-details-btn') ? e.target : e.target.closest('.view-details-btn');
        const itemId = button.dataset.itemId;

        if (itemId) {
            console.log('Backup View Details handler triggered for item:', itemId);
            window.location.href = `product-details.html?id=${itemId}`;
        }
    }

    // Handle Remove from wishlist button clicks
    if (e.target.matches('.remove-wishlist-item') || e.target.closest('.remove-wishlist-item')) {
        const button = e.target.matches('.remove-wishlist-item') ? e.target : e.target.closest('.remove-wishlist-item');
        const index = parseInt(button.dataset.index);
        const itemName = button.dataset.itemName;

        if (!isNaN(index)) {
            console.log('Backup Remove handler triggered for index:', index);

            if (confirm(`Remove "${itemName}" from your wishlist?`)) {
                const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                wishlist.splice(index, 1);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));

                // Reload wishlist
                if (typeof loadWishlistItems === 'function') {
                    loadWishlistItems();
                }
                if (typeof updateWishlistCount === 'function') {
                    updateWishlistCount();
                }
                if (typeof showNotification === 'function') {
                    showNotification(`${itemName} removed from wishlist`, 'success');
                }
            }
        }
    }
});
// Enhanced Checkout Backup System
function initializeCheckoutBackup() {
    console.log('Initializing checkout backup system...');

    // Wait for DOM to be fully ready
    setTimeout(() => {
        const checkoutButtons = document.querySelectorAll('#checkout-btn, .checkout-btn, [data-action="checkout"]');

        console.log('Found checkout buttons:', checkoutButtons.length);

        checkoutButtons.forEach((btn, index) => {
            // Add backup event listener if button doesn't have proper functionality
            if (!btn.onclick && !btn.hasAttribute('data-backup-added')) {
                console.log(`Adding backup checkout handler to button ${index + 1}`);

                btn.setAttribute('data-backup-added', 'true');
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    console.log('Backup checkout handler triggered');

                    const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];

                    if (cart.length === 0) {
                        alert('Your cart is empty. Please add items before checkout.');
                        return;
                    }

                    // Show loading state
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                    this.disabled = true;

                    try {
                        // Calculate totals
                        const subtotal = cart.reduce((sum, item) => {
                            const cost = parseFloat(item.totalCost) || 0;
                            return sum + cost;
                        }, 0);

                        const protection = Math.round(subtotal * 0.15);
                        const delivery = subtotal >= 2000 ? 0 : 10;
                        const total = subtotal + protection + delivery;

                        // Store checkout data
                        const checkoutData = {
                            items: cart,
                            totalCost: total,
                            subtotal: subtotal,
                            protection: protection,
                            delivery: delivery,
                            timestamp: new Date().toISOString(),
                            source: 'backup-system'
                        };

                        localStorage.setItem('checkoutCart', JSON.stringify(cart));
                        localStorage.setItem('currentRental', JSON.stringify(checkoutData));

                        console.log('Backup checkout data stored:', checkoutData);

                        // Redirect to payment page
                        console.log('Backup system redirecting to payment.html...');
                        window.location.href = 'payment.html';

                    } catch (error) {
                        console.error('Backup checkout error:', error);
                        this.innerHTML = originalHTML;
                        this.disabled = false;
                        alert('Error processing checkout. Please try again.');
                    }
                });
            }
        });

        // Add floating backup button if main button is not working
        if (checkoutButtons.length === 0) {
            console.log('No checkout buttons found, creating floating backup button');
            createFloatingCheckoutButton();
        }

    }, 1500);
}

// Create floating backup checkout button
function createFloatingCheckoutButton() {
    const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];

    if (cart.length > 0 && window.location.pathname.includes('profile.html')) {
        const floatingButton = document.createElement('button');
        floatingButton.innerHTML = '<i class="fas fa-shopping-cart"></i> Checkout';
        floatingButton.id = 'floating-checkout-btn';
        floatingButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #d76d77, #c55a64);
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 30px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 6px 20px rgba(215, 109, 119, 0.4);
            font-weight: bold;
            font-size: 16px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        floatingButton.addEventListener('click', function () {
            console.log('Floating checkout button clicked');
            manualCheckout();
        });

        floatingButton.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1) translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(215, 109, 119, 0.6)';
        });

        floatingButton.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) translateY(0)';
            this.style.boxShadow = '0 6px 20px rgba(215, 109, 119, 0.4)';
        });

        document.body.appendChild(floatingButton);

        console.log('Floating checkout button created');
    }
}

// Global manual checkout function
window.manualCheckout = function () {
    console.log('Manual checkout function called');

    const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];

    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        return false;
    }

    try {
        // Calculate totals
        const subtotal = cart.reduce((sum, item) => {
            const cost = parseFloat(item.totalCost) || 0;
            return sum + cost;
        }, 0);

        const protection = Math.round(subtotal * 0.15);
        const delivery = subtotal >= 2000 ? 0 : 10;
        const total = subtotal + protection + delivery;

        // Store checkout data
        const checkoutData = {
            items: cart,
            totalCost: total,
            subtotal: subtotal,
            protection: protection,
            delivery: delivery,
            timestamp: new Date().toISOString(),
            source: 'manual-function'
        };

        localStorage.setItem('checkoutCart', JSON.stringify(cart));
        localStorage.setItem('currentRental', JSON.stringify(checkoutData));

        console.log('Manual checkout data stored:', checkoutData);

        // Redirect to payment page
        window.location.href = 'payment.html';
        return true;

    } catch (error) {
        console.error('Manual checkout error:', error);
        alert('Error processing checkout. Please try again.');
        return false;
    }
};

// Debug function for checkout
window.debugCheckout = function () {
    const checkoutBtn = document.getElementById('checkout-btn');
    const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
    const checkoutButtons = document.querySelectorAll('#checkout-btn, .checkout-btn, [data-action="checkout"]');

    console.log('=== CHECKOUT DEBUG INFO ===');
    console.log('Main checkout button found:', !!checkoutBtn);
    console.log('Main checkout button element:', checkoutBtn);
    console.log('All checkout buttons found:', checkoutButtons.length);
    console.log('Cart items count:', cart.length);
    console.log('Cart contents:', cart);
    console.log('Button onclick handler:', checkoutBtn?.onclick);
    console.log('Button disabled:', checkoutBtn?.disabled);
    console.log('Button innerHTML:', checkoutBtn?.innerHTML);
    console.log('Stored checkout data:', {
        checkoutCart: localStorage.getItem('checkoutCart'),
        currentRental: localStorage.getItem('currentRental')
    });
    console.log('=== END DEBUG INFO ===');

    return {
        buttonFound: !!checkoutBtn,
        totalButtons: checkoutButtons.length,
        cartCount: cart.length,
        buttonDisabled: checkoutBtn?.disabled,
        hasOnclickHandler: !!checkoutBtn?.onclick
    };
};

// Initialize backup checkout system
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCheckoutBackup);
} else {
    initializeCheckoutBackup();
}

// Additional event delegation for checkout buttons
document.addEventListener('click', function (e) {
    if (e.target.matches('#checkout-btn, .checkout-btn') || e.target.closest('#checkout-btn, .checkout-btn')) {
        const button = e.target.matches('#checkout-btn, .checkout-btn') ? e.target : e.target.closest('#checkout-btn, .checkout-btn');

        // If button doesn't have proper handler, use manual checkout
        if (!button.onclick && !button.hasAttribute('data-backup-added')) {
            console.log('Event delegation checkout handler triggered');
            e.preventDefault();
            e.stopPropagation();
            window.manualCheckout();
        }
    }
});

console.log('Checkout backup system loaded successfully');