// Enhanced Profile Animations JavaScript
class ProfileAnimations {
    constructor() {
        this.animationQueue = [];
        this.isAnimating = false;
        this.observers = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupAnimationClasses();
        this.initializePageAnimations();
        this.setupEventListeners();
        console.log('Profile animations initialized');
    }

    // Intersection Observer for scroll animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        const elements = document.querySelectorAll(
            '.cart-item, .wishlist-item, .history-item, .address-item, .payment-item, .profile-card, .form-group'
        );
        
        elements.forEach(el => observer.observe(el));
        this.observers.set('scroll', observer);
    }

    // Add animation classes to elements
    setupAnimationClasses() {
        // Add stagger classes to containers
        const containers = document.querySelectorAll('#cart-items, #wishlist-grid, #rental-history-list, #addresses-list, #payment-methods-list');
        containers.forEach(container => {
            container.classList.add('stagger-container');
            const items = container.children;
            Array.from(items).forEach((item, index) => {
                item.classList.add('stagger-item');
                item.style.animationDelay = `${index * 0.1}s`;
            });
        });
    }

    // Initialize page load animations
    initializePageAnimations() {
        // Animate profile header
        this.animateProfileHeader();
        
        // Animate sidebar menu
        this.animateMenuItems();
        
        // Animate content sections
        this.animateContentSections();
        
        // Add loading animations
        this.addLoadingAnimations();
    }

    // Animate profile header elements
    animateProfileHeader() {
        const header = document.querySelector('.profile-header');
        const avatar = document.querySelector('.profile-avatar');
        const info = document.querySelector('.profile-info');

        if (header) {
            header.style.animation = 'slideInDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both';
        }

        if (avatar) {
            avatar.style.animation = 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s both';
            
            // Add hover animation
            avatar.addEventListener('mouseenter', () => {
                avatar.style.animation = 'float 2s ease-in-out infinite';
            });
            
            avatar.addEventListener('mouseleave', () => {
                avatar.style.animation = '';
            });
        }

        if (info) {
            const infoElements = info.querySelectorAll('h2, p');
            infoElements.forEach((el, index) => {
                el.style.animation = `fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${0.8 + index * 0.2}s both`;
            });
        }
    }

    // Animate menu items
    animateMenuItems() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach((item, index) => {
            item.style.animation = `fadeInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${0.1 + index * 0.1}s both`;
            
            // Add click animation
            item.addEventListener('click', (e) => {
                this.animateMenuClick(item);
            });
            
            // Add hover effects
            this.addMenuHoverEffects(item);
        });
    }

    // Add menu hover effects
    addMenuHoverEffects(menuItem) {
        const icon = menuItem.querySelector('i');
        
        menuItem.addEventListener('mouseenter', () => {
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.color = '#D76D77';
            }
            menuItem.style.transform = 'translateX(10px)';
            menuItem.style.boxShadow = '0 8px 32px rgba(215, 109, 119, 0.15)';
        });
        
        menuItem.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.transform = '';
                icon.style.color = '';
            }
            menuItem.style.transform = '';
            menuItem.style.boxShadow = '';
        });
    }

    // Animate menu click
    animateMenuClick(clickedItem) {
        // Remove active class from all items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        clickedItem.classList.add('active');
        
        // Add click animation
        clickedItem.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            clickedItem.style.animation = '';
        }, 600);
    }

    // Animate content sections
    animateContentSections() {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            if (!section.classList.contains('active')) {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
            }
        });
    }

    // Add loading animations
    addLoadingAnimations() {
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(el => {
            el.innerHTML = '<div class="loading-spinner"></div>';
        });
    }

    // Animate element when it comes into view
    animateElement(element) {
        if (element.classList.contains('animate')) return;
        
        element.classList.add('animate');
        
        // Add specific animations based on element type
        if (element.classList.contains('cart-item')) {
            this.animateCartItem(element);
        } else if (element.classList.contains('wishlist-item')) {
            this.animateWishlistItem(element);
        } else if (element.classList.contains('history-item')) {
            this.animateHistoryItem(element);
        } else if (element.classList.contains('profile-card')) {
            this.animateProfileCard(element);
        }
    }

    // Animate cart item
    animateCartItem(item) {
        const image = item.querySelector('.cart-item-image img');
        const controls = item.querySelector('.quantity-controls');
        
        if (image) {
            image.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.05)';
            });
            
            image.addEventListener('mouseleave', () => {
                image.style.transform = '';
            });
        }
        
        if (controls) {
            const buttons = controls.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.animateButtonClick(btn);
                });
            });
        }
        
        // Add remove button animation
        const removeBtn = item.querySelector('.cart-item-remove');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.animateItemRemoval(item);
            });
        }
    }

    // Animate wishlist item
    animateWishlistItem(item) {
        const image = item.querySelector('.wishlist-item-image img');
        const heartIcon = item.querySelector('.heart-icon');
        
        if (image) {
            image.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.1) rotate(2deg)';
            });
            
            image.addEventListener('mouseleave', () => {
                image.style.transform = '';
            });
        }
        
        if (heartIcon) {
            heartIcon.addEventListener('click', () => {
                heartIcon.style.animation = 'pulse 0.6s ease-in-out';
                heartIcon.style.color = '#e74c3c';
                setTimeout(() => {
                    heartIcon.style.animation = '';
                }, 600);
            });
        }
        
        // Add remove button animation
        const removeBtn = item.querySelector('.remove-wishlist-item');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.animateItemRemoval(item);
            });
        }
    }

    // Animate history item
    animateHistoryItem(item) {
        const statusBadge = item.querySelector('.status-badge');
        
        if (statusBadge) {
            if (statusBadge.textContent.toLowerCase().includes('active')) {
                statusBadge.style.animation = 'glow 2s ease-in-out infinite';
            }
        }
    }

    // Animate profile card
    animateProfileCard(card) {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 16px 48px rgba(215, 109, 119, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    }

    // Animate button click
    animateButtonClick(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Add ripple effect
        this.addRippleEffect(button);
    }

    // Add ripple effect to button
    addRippleEffect(button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: 50%;
            top: 50%;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Animate item removal
    animateItemRemoval(item) {
        item.style.animation = 'fadeOut 0.4s ease-out forwards';
        item.style.transform = 'translateX(-100%)';
        item.style.opacity = '0';
        
        setTimeout(() => {
            item.remove();
        }, 400);
    }

    // Animate section transition
    animateSectionTransition(fromSection, toSection) {
        if (fromSection) {
            fromSection.classList.add('fade-out');
            fromSection.style.transform = 'translateX(-20px)';
            fromSection.style.opacity = '0';
            
            setTimeout(() => {
                fromSection.classList.remove('active', 'fade-out');
                fromSection.style.transform = '';
                fromSection.style.opacity = '';
            }, 300);
        }
        
        if (toSection) {
            setTimeout(() => {
                toSection.classList.add('active', 'fade-in');
                toSection.style.transform = 'translateX(0)';
                toSection.style.opacity = '1';
                
                // Animate items in the new section
                this.animateItemsInSection(toSection);
            }, 150);
        }
    }

    // Animate items in section
    animateItemsInSection(section) {
        const items = section.querySelectorAll('.cart-item, .wishlist-item, .history-item, .address-item, .payment-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Animate counter update
    animateCounterUpdate(element, newValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const increment = newValue > currentValue ? 1 : -1;
        let current = currentValue;
        
        element.classList.add('updating');
        
        const updateCounter = () => {
            if (current !== newValue) {
                current += increment;
                element.textContent = current;
                requestAnimationFrame(updateCounter);
            } else {
                element.classList.remove('updating');
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    // Animate form submission
    animateFormSubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Add loading spinner
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="loading-spinner"></div>';
            
            // Simulate form processing
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Show success message
                this.showSuccessMessage('Profile updated successfully!');
            }, 2000);
        }
    }

    // Show success message
    showSuccessMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'success-message';
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(40, 167, 69, 0.3);
            z-index: 1000;
            animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.animation = 'fadeOut 0.4s ease-out forwards';
            setTimeout(() => {
                messageEl.remove();
            }, 400);
        }, 3000);
    }

    // Show error message
    showErrorMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'error-message';
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #dc3545, #e74c3c);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(220, 53, 69, 0.3);
            z-index: 1000;
            animation: shake 0.6s ease-in-out;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.animation = 'fadeOut 0.4s ease-out forwards';
            setTimeout(() => {
                messageEl.remove();
            }, 400);
        }, 3000);
    }

    // Setup event listeners
    setupEventListeners() {
        // Form submissions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.animateFormSubmission(form);
            });
        });
        
        // Button clicks
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.animateButtonClick(btn);
            });
        });
        
        // Menu navigation
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetSection = item.dataset.section;
                const currentSection = document.querySelector('.content-section.active');
                const newSection = document.getElementById(targetSection);
                
                if (newSection && newSection !== currentSection) {
                    this.animateSectionTransition(currentSection, newSection);
                }
            });
        });
    }

    // Public methods for external use
    refreshAnimations() {
        this.setupAnimationClasses();
        this.initializePageAnimations();
    }

    animateNewItem(item) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px) scale(0.9)';
        
        requestAnimationFrame(() => {
            item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
        });
    }

    updateCounter(selector, newValue) {
        const element = document.querySelector(selector);
        if (element) {
            this.animateCounterUpdate(element, newValue);
        }
    }
}

// Additional CSS animations
const additionalCSS = `
@keyframes fadeOut {
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(-20px);
    }
}

@keyframes ripple {
    to {
        transform: translate(-50%, -50%) scale(2);
        opacity: 0;
    }
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.profileAnimations = new ProfileAnimations();
});

// Export for global use
window.ProfileAnimations = ProfileAnimations;