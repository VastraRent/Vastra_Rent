// Main JavaScript file for shared functionality across all pages

document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const headerNav = document.querySelector('.header-nav');

    if (mobileMenuBtn && headerNav) {
        mobileMenuBtn.addEventListener('click', function () {
            headerNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Profile dropdown functionality
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileTrigger = document.querySelector('.profile-trigger');

    if (profileDropdown && profileTrigger) {
        profileTrigger.addEventListener('click', function (e) {
            e.preventDefault();
            profileDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('active');
            }
        });

        // Close dropdown when pressing ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                profileDropdown.classList.remove('active');
            }
        });
    }

    // Category card functionality
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        const exploreBtn = card.querySelector('.explore-btn');
        const category = card.dataset.category;

        // Handle category card click
        card.addEventListener('click', function (e) {
            if (!e.target.classList.contains('explore-btn')) {
                navigateToCategory(category);
            }
        });

        // Handle explore button click
        if (exploreBtn) {
            exploreBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                navigateToCategory(category);
            });
        }

        // Add hover effects
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    function navigateToCategory(category) {
        // Map home page categories to inventory categories
        const categoryMapping = {
            'lehenga': 'Lehnga',
            'gown': 'Gown',
            'anarkali': 'Anarkali',
            'sherwani': 'Sherwani',
            'indo-western': 'Indowastern',
            'JODHAPURI': 'Jodhpuri'
        };

        // Get the mapped category or use the original if no mapping exists
        const mappedCategory = categoryMapping[category] || category;
        
        console.log('Home page category clicked:', category);
        console.log('Mapped to inventory category:', mappedCategory);
        console.log('Navigating to URL:', `inventory.html?category=${mappedCategory}`);
        
        // Navigate to inventory page with category filter
        window.location.href = `inventory.html?category=${mappedCategory}`;
    }

    // Update profile dropdown with user data
    function updateProfileDropdown() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const storedUserData = JSON.parse(localStorage.getItem('userData'));

        // Merge data from both sources, prioritizing currentUser
        const userData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            avatar: null,
            ...storedUserData,
            ...currentUser
        };

        // Update profile info in dropdown
        const profileNameSmall = document.querySelector('.profile-name-small');
        const profileEmailSmall = document.querySelector('.profile-email-small');
        const profileAvatarSmall = document.querySelector('.profile-avatar-small');

        if (profileNameSmall) {
            profileNameSmall.textContent = `${userData.firstName} ${userData.lastName}`;
        }
        if (profileEmailSmall) {
            profileEmailSmall.textContent = userData.email;
        }
        if (profileAvatarSmall) {
            // Use uploaded avatar if available, otherwise use placeholder with initials
            if (userData.avatar && userData.avatar.startsWith('data:image')) {
                profileAvatarSmall.src = userData.avatar;
            } else {
                profileAvatarSmall.src = `https://via.placeholder.com/40x40?text=${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`;
            }
        }

        // Update cart and wishlist counts
        updateHeaderCounts();
    }

    function updateHeaderCounts() {
        const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

        const headerCartCount = document.getElementById('header-cart-count');
        const headerWishlistCount = document.getElementById('header-wishlist-count');

        if (headerCartCount) {
            headerCartCount.textContent = cart.length;
            headerCartCount.style.display = cart.length > 0 ? 'inline' : 'none';
        }
        if (headerWishlistCount) {
            headerWishlistCount.textContent = wishlist.length;
            headerWishlistCount.style.display = wishlist.length > 0 ? 'inline' : 'none';
        }
    }

    // Initialize profile dropdown
    updateProfileDropdown();

    // Update counts periodically
    setInterval(updateHeaderCounts, 5000);

    // Update profile dropdown periodically to catch avatar changes
    setInterval(updateProfileDropdown, 2000);

    // Global function to update profile dropdown (can be called from other pages)
    window.refreshProfileDropdown = function () {
        updateProfileDropdown();
    };

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();

            if (confirm('Are you sure you want to logout?')) {
                // Clear all user session data
                localStorage.removeItem('currentUser');
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userData');
                localStorage.removeItem('rentalCart');
                localStorage.removeItem('wishlist');

                // Redirect to login page
                window.location.href = 'login.html';
            }
        });
    }

    // Check if user is logged in
    function checkAuth() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const isLoginPage = window.location.pathname.includes('login.html') ||
            window.location.pathname.includes('index.html') ||
            window.location.pathname.endsWith('/');

        if (!isLoggedIn && !isLoginPage) {
            // Redirect to login page if not logged in and not already on login page
            window.location.href = 'login.html';
        } else if (isLoggedIn && isLoginPage) {
            // Redirect to home page if logged in and on login page
            window.location.href = 'home.html';
        }
    }

    // Call the auth check function
    checkAuth();

    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal, .close-modal-btn');

    // Function to open modal
    window.openModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        }
    };

    // Function to close modal
    window.closeModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    };

    // Close modal when clicking the close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
    });

    // Close modal when clicking outside the modal content
    modals.forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
    });

    // Format currency
    window.formatCurrency = function (amount) {
        return '₹' + parseFloat(amount).toFixed(2);
    };

    // Format date
    window.formatDate = function (dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Calculate rental duration in days
    window.calculateDuration = function (startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Generate a random rental ID
    window.generateRentalId = function () {
        return 'RNT-' + Math.floor(10000 + Math.random() * 90000);
    };

    // Add days to a date
    window.addDays = function (date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    // Format date to YYYY-MM-DD for input fields
    window.formatDateForInput = function (date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    // Set minimum date for date inputs to today (except birth-date)
    const dateInputs = document.querySelectorAll('input[type="date"]');
    if (dateInputs.length > 0) {
        const today = new Date();
        const formattedDate = formatDateForInput(today);

        dateInputs.forEach(input => {
            // Don't set minimum date for birth-date input - allow any date
            if (input.id !== 'birth-date') {
                input.min = formattedDate;
            }
        });
    }
});