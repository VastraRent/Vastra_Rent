// Rental Status Page JavaScript
class RentalStatusManager {
    constructor() {
        this.rentals = [];
        this.filteredRentals = [];
        this.currentFilter = 'all';
        this.currentSort = 'date-desc';
        this.searchTerm = '';
        this.selectedRating = 0;
        
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.updateStats();
        this.displayRentals();
    }

    loadSampleData() {
        // Sample rental data with correct image paths from inventory
        this.rentals = [
            {
                id: 'RNT001',
                itemName: 'Royal Blue Jodhpuri Suit',
                image: 'img/men/Jodhpuri suits/image_15.jpg', // Updated to match inventory
                category: 'Jodhpuri',
                size: 'L',
                gender: 'Men',
                status: 'active',
                startDate: new Date('2024-01-15'),
                endDate: new Date('2024-01-22'),
                basePrice: 2800,
                weeklyPrice: 7200,
                totalPaid: 7200,
                progress: 65,
                rating: 0,
                review: ''
            },
            {
                id: 'RNT002',
                itemName: 'Celebrity Lehnga',
                image: 'img/women/lehnga/image_1.webp', // Updated to match inventory
                category: 'Lehnga',
                size: 'M',
                gender: 'Women',
                status: 'upcoming',
                startDate: new Date('2024-01-25'),
                endDate: new Date('2024-02-01'),
                basePrice: 4500,
                weeklyPrice: 12000,
                totalPaid: 12000,
                progress: 0,
                rating: 0,
                review: ''
            },
            {
                id: 'RNT003',
                itemName: 'Black Tuxedo',
                image: 'img/men/Tuxedos/image_1.jpeg', // Updated to match inventory
                category: 'Tuxedo',
                size: 'XL',
                gender: 'Men',
                status: 'completed',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-08'),
                basePrice: 2500,
                weeklyPrice: 6500,
                totalPaid: 6500,
                progress: 100,
                rating: 5,
                review: 'Excellent quality and perfect fit!'
            },
            {
                id: 'RNT004',
                itemName: 'Maroon Lehnga',
                image: 'img/women/lehnga/image_5.webp', // Updated to match inventory
                category: 'Lehnga',
                size: 'S',
                gender: 'Women',
                status: 'active',
                startDate: new Date('2024-01-18'),
                endDate: new Date('2024-01-25'),
                basePrice: 4500,
                weeklyPrice: 12000,
                totalPaid: 12000,
                progress: 45,
                rating: 0,
                review: ''
            },
            {
                id: 'RNT005',
                itemName: 'Red Gown',
                image: 'img/women/gown/image_13.jpg', // Updated to match inventory
                category: 'Gown',
                size: 'S',
                gender: 'Women',
                status: 'completed',
                startDate: new Date('2023-12-20'),
                endDate: new Date('2023-12-27'),
                basePrice: 2800,
                weeklyPrice: 7500,
                totalPaid: 7500,
                progress: 100,
                rating: 4,
                review: 'Beautiful dress, received many compliments!'
            },
            {
                id: 'RNT006',
                itemName: 'Black Blazer',
                image: 'img/men/Blazer/image_1.jpg', // Updated to match inventory
                category: 'Blazer',
                size: 'M',
                gender: 'Men',
                status: 'upcoming',
                startDate: new Date('2024-02-05'),
                endDate: new Date('2024-02-12'),
                basePrice: 2200,
                weeklyPrice: 6000,
                totalPaid: 6000,
                progress: 0,
                rating: 0,
                review: ''
            },
            {
                id: 'RNT007',
                itemName: 'White Sherwani',
                image: 'img/men/Sherwani/image_3.jpg', // Added new rental
                category: 'Sherwani',
                size: 'L',
                gender: 'Men',
                status: 'active',
                startDate: new Date('2024-01-20'),
                endDate: new Date('2024-01-27'),
                basePrice: 2800,
                weeklyPrice: 7500,
                totalPaid: 7500,
                progress: 30,
                rating: 0,
                review: ''
            },
            {
                id: 'RNT008',
                itemName: 'Red Anarkali',
                image: 'img/women/Anarkali/image_1.jpg', // Added new rental
                category: 'Anarkali',
                size: 'M',
                gender: 'Women',
                status: 'completed',
                startDate: new Date('2023-12-10'),
                endDate: new Date('2023-12-17'),
                basePrice: 2800,
                weeklyPrice: 7500,
                totalPaid: 7500,
                progress: 100,
                rating: 5,
                review: 'Perfect for the wedding ceremony!'
            },
            {
                id: 'RNT009',
                itemName: 'Grey collar embroidered Jodhpuri',
                image: 'img/men/Jodhpuri suits/image_10.jpg', // Added new rental
                category: 'Jodhpuri',
                size: 'XL',
                gender: 'Men',
                status: 'upcoming',
                startDate: new Date('2024-02-10'),
                endDate: new Date('2024-02-17'),
                basePrice: 2800,
                weeklyPrice: 7200,
                totalPaid: 7200,
                progress: 0,
                rating: 0,
                review: ''
            },
            {
                id: 'RNT010',
                itemName: 'Beige Gown',
                image: 'img/women/gown/image_22.jpg', // Added new rental
                category: 'Gown',
                size: 'M',
                gender: 'Women',
                status: 'completed',
                startDate: new Date('2023-11-15'),
                endDate: new Date('2023-11-22'),
                basePrice: 2800,
                weeklyPrice: 7500,
                totalPaid: 7500,
                progress: 100,
                rating: 3,
                review: 'Good quality, but could be better fitted.'
            }
        ];
    }

    setupEventListeners() {
        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.setActiveFilter(e.target.dataset.tab);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterAndDisplayRentals();
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.filterAndDisplayRentals();
            });
        }

        // Sort functionality
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.filterAndDisplayRentals();
            });
        }

        // Header actions
        const refreshBtn = document.getElementById('refresh-btn');
        const exportBtn = document.getElementById('export-btn');
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshData();
            });
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }

        // Modal event listeners
        this.setupModalListeners();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.refreshData();
            }
        });
    }

    setupModalListeners() {
        // Close modal listeners
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Form submissions
        const extendForm = document.getElementById('extend-form');
        const returnForm = document.getElementById('return-form');
        const reviewForm = document.getElementById('review-form');
        
        if (extendForm) {
            extendForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleExtendRental();
            });
        }

        if (returnForm) {
            returnForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleReturnItem();
            });
        }

        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmitReview();
            });
        }

        // Star rating functionality
        document.querySelectorAll('.star-rating i').forEach(star => {
            star.addEventListener('click', (e) => {
                this.setRating(parseInt(e.target.dataset.rating));
            });
            
            star.addEventListener('mouseenter', (e) => {
                this.highlightStars(parseInt(e.target.dataset.rating));
            });
        });

        const starRating = document.querySelector('.star-rating');
        if (starRating) {
            starRating.addEventListener('mouseleave', () => {
                this.highlightStars(this.selectedRating);
            });
        }

        // Extension days change
        const extendDays = document.getElementById('extend-days');
        if (extendDays) {
            extendDays.addEventListener('change', (e) => {
                this.updateExtensionSummary(parseInt(e.target.value));
            });
        }
    }

    setActiveFilter(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-tab="${filter}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        this.filterAndDisplayRentals();
    }

    filterAndDisplayRentals() {
        this.filteredRentals = this.rentals.filter(rental => {
            // Filter by status
            if (this.currentFilter !== 'all' && rental.status !== this.currentFilter) {
                return false;
            }
            
            // Filter by search term
            if (this.searchTerm) {
                const searchFields = [
                    rental.itemName,
                    rental.category,
                    rental.id,
                    rental.gender
                ].join(' ').toLowerCase();
                
                if (!searchFields.includes(this.searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.sortRentals();
        this.displayRentals();
    }

    sortRentals() {
        this.filteredRentals.sort((a, b) => {
            switch (this.currentSort) {
                case 'date-desc':
                    return new Date(b.startDate) - new Date(a.startDate);
                case 'date-asc':
                    return new Date(a.startDate) - new Date(b.startDate);
                case 'price-desc':
                    return b.totalPaid - a.totalPaid;
                case 'price-asc':
                    return a.totalPaid - b.totalPaid;
                default:
                    return 0;
            }
        });
    }

    displayRentals() {
        const container = document.getElementById('rentals-container');
        const loadingState = document.getElementById('loading-state');
        
        if (!container) return;
        
        // Hide loading state
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        
        if (this.filteredRentals.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
            return;
        }
        
        const rentalsHTML = `
            <div class="rentals-grid">
                ${this.filteredRentals.map(rental => this.generateRentalCard(rental)).join('')}
            </div>
        `;
        
        container.innerHTML = rentalsHTML;
        
        // Add event listeners to action buttons
        this.setupRentalCardListeners();
    }

    generateRentalCard(rental) {
        const statusConfig = this.getStatusConfig(rental.status);
        const duration = this.calculateDuration(rental.startDate, rental.endDate);
        const daysRemaining = this.calculateDaysRemaining(rental.endDate);
        
        return `
            <div class="rental-card" data-rental-id="${rental.id}">
                <div class="rental-card-header">
                    <div class="rental-status-badge">
                        <i class="${statusConfig.icon}"></i>
                        ${rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                    </div>
                    <div class="rental-id">#${rental.id}</div>
                </div>
                
                <div class="rental-card-image">
                    <img src="${rental.image}" alt="${rental.itemName}" onerror="this.src='img/placeholder.svg'">
                    <div class="image-overlay">
                        <span class="category-tag">${rental.category}</span>
                    </div>
                </div>
                
                <div class="rental-card-body">
                    <div class="rental-card-title">
                        <h3>${rental.itemName}</h3>
                    </div>
                    
                    <div class="rental-details">
                        <span><i class="fas fa-ruler"></i> ${rental.size}</span>
                        <span><i class="fas fa-venus-mars"></i> ${rental.gender}</span>
                    </div>
                    
                    <div class="rental-dates">
                        <div class="date-info">
                            <i class="fas fa-calendar-alt"></i>
                            ${this.formatDate(rental.startDate)} - ${this.formatDate(rental.endDate)}
                        </div>
                        <div class="duration">${duration} days</div>
                    </div>
                    
                    <div class="rental-pricing">
                        <div class="price-item">
                            <span>Base Price:</span>
                            <span>₹${rental.basePrice.toLocaleString()}</span>
                        </div>
                        <div class="price-item">
                            <span>Weekly Rate:</span>
                            <span>₹${rental.weeklyPrice.toLocaleString()}</span>
                        </div>
                        <div class="price-item total">
                            <span>Total Paid:</span>
                            <span>₹${rental.totalPaid.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    ${rental.status === 'active' ? `
                        <div class="rental-progress">
                            <div class="progress-label">
                                ${daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Overdue'}
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${rental.progress}%"></div>
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="rental-actions">
                        ${this.generateActionButtons(rental)}
                    </div>
                    
                    ${rental.rating > 0 ? `
                        <div class="rental-review">
                            <div class="rating">
                                ${this.generateStars(rental.rating)}
                            </div>
                            ${rental.review ? `<p class="review-text">"${rental.review}"</p>` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    generateActionButtons(rental) {
        switch (rental.status) {
            case 'active':
                return `
                    <button class="action-btn primary" onclick="rentalManager.openExtendModal('${rental.id}')">
                        <i class="fas fa-calendar-plus"></i> Extend
                    </button>
                    <button class="action-btn secondary" onclick="rentalManager.openReturnModal('${rental.id}')">
                        <i class="fas fa-undo"></i> Return
                    </button>
                `;
            case 'upcoming':
                return `
                    <button class="action-btn secondary" onclick="rentalManager.cancelRental('${rental.id}')">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="action-btn primary" onclick="rentalManager.modifyRental('${rental.id}')">
                        <i class="fas fa-edit"></i> Modify
                    </button>
                `;
            case 'completed':
                return `
                    <button class="action-btn primary" onclick="rentalManager.rentAgain('${rental.id}')">
                        <i class="fas fa-redo"></i> Rent Again
                    </button>
                    ${rental.rating === 0 ? `
                        <button class="action-btn secondary" onclick="rentalManager.openReviewModal('${rental.id}')">
                            <i class="fas fa-star"></i> Review
                        </button>
                    ` : ''}
                `;
            default:
                return '';
        }
    }

    setupRentalCardListeners() {
        // Add any additional event listeners for rental cards if needed
    }

    getStatusConfig(status) {
        const configs = {
            active: { icon: 'fas fa-clock', color: '#28a745' },
            upcoming: { icon: 'fas fa-calendar-alt', color: '#007bff' },
            completed: { icon: 'fas fa-check-circle', color: '#6c757d' }
        };
        return configs[status] || configs.active;
    }

    calculateDuration(startDate, endDate) {
        const diffTime = Math.abs(endDate - startDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    calculateDaysRemaining(endDate) {
        const today = new Date();
        const diffTime = endDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    formatDate(date) {
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fas fa-star star ${i <= rating ? 'active' : ''}"></i>`;
        }
        return stars;
    }

    updateStats() {
        const stats = {
            active: this.rentals.filter(r => r.status === 'active').length,
            upcoming: this.rentals.filter(r => r.status === 'upcoming').length,
            completed: this.rentals.filter(r => r.status === 'completed').length,
            totalSpent: this.rentals.reduce((sum, r) => sum + r.totalPaid, 0)
        };
        
        const activeCount = document.getElementById('active-count');
        const upcomingCount = document.getElementById('upcoming-count');
        const completedCount = document.getElementById('completed-count');
        const totalSpent = document.getElementById('total-spent');
        
        if (activeCount) activeCount.textContent = stats.active;
        if (upcomingCount) upcomingCount.textContent = stats.upcoming;
        if (completedCount) completedCount.textContent = stats.completed;
        if (totalSpent) totalSpent.textContent = `₹${stats.totalSpent.toLocaleString()}`;
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-inbox"></i>
                </div>
                <h3>No rentals found</h3>
                <p>You don't have any rentals matching your current filters.</p>
                <button class="btn" onclick="window.location.href='inventory.html'">
                    <i class="fas fa-plus"></i> Browse Collection
                </button>
            </div>
        `;
    }

    // Modal Functions
    openExtendModal(rentalId) {
        const rental = this.rentals.find(r => r.id === rentalId);
        if (!rental) return;
        
        const modal = document.getElementById('extend-modal');
        const detailsContainer = document.getElementById('extend-item-details');
        
        if (!modal || !detailsContainer) return;
        
        detailsContainer.innerHTML = `
            <div class="item-summary">
                <img src="${rental.image}" alt="${rental.itemName}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 15px; float: left;" onerror="this.src='img/placeholder.svg'">
                <div>
                    <h4>${rental.itemName}</h4>
                    <p>Current Return Date: ${this.formatDate(rental.endDate)}</p>
                    <p>Rental ID: #${rental.id}</p>
                </div>
                <div style="clear: both;"></div>
            </div>
        `;
        
        modal.dataset.rentalId = rentalId;
        this.showModal(modal);
        this.updateExtensionSummary(1);
    }

    openReturnModal(rentalId) {
        const rental = this.rentals.find(r => r.id === rentalId);
        if (!rental) return;
        
        const modal = document.getElementById('return-modal');
        const detailsContainer = document.getElementById('return-item-details');
        
        if (!modal || !detailsContainer) return;
        
        detailsContainer.innerHTML = `
            <div class="item-summary">
                <img src="${rental.image}" alt="${rental.itemName}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 15px; float: left;" onerror="this.src='img/placeholder.svg'">
                <div>
                    <h4>${rental.itemName}</h4>
                    <p>Return Date: ${this.formatDate(rental.endDate)}</p>
                    <p>Rental ID: #${rental.id}</p>
                </div>
                <div style="clear: both;"></div>
            </div>
        `;
        
        modal.dataset.rentalId = rentalId;
        this.showModal(modal);
    }

    openReviewModal(rentalId) {
        const rental = this.rentals.find(r => r.id === rentalId);
        if (!rental) return;
        
        const modal = document.getElementById('review-modal');
        const detailsContainer = document.getElementById('review-item-details');
        
        if (!modal || !detailsContainer) return;
        
        detailsContainer.innerHTML = `
            <div class="item-summary">
                <img src="${rental.image}" alt="${rental.itemName}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 15px; float: left;" onerror="this.src='img/placeholder.svg'">
                <div>
                    <h4>${rental.itemName}</h4>
                    <p>Rental Period: ${this.formatDate(rental.startDate)} - ${this.formatDate(rental.endDate)}</p>
                    <p>Rental ID: #${rental.id}</p>
                </div>
                <div style="clear: both;"></div>
            </div>
        `;
        
        modal.dataset.rentalId = rentalId;
        this.selectedRating = 0;
        this.highlightStars(0);
        const reviewText = document.getElementById('review-text');
        if (reviewText) reviewText.value = '';
        this.showModal(modal);
    }

    showModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    updateExtensionSummary(days) {
        const costs = { 1: 200, 3: 500, 7: 1000, 14: 1800 };
        const cost = costs[days] || 0;
        
        const modal = document.getElementById('extend-modal');
        const rentalId = modal.dataset.rentalId;
        const rental = this.rentals.find(r => r.id === rentalId);
        
        if (rental) {
            const newDate = new Date(rental.endDate);
            newDate.setDate(newDate.getDate() + days);
            
            const newReturnDate = document.getElementById('new-return-date');
            const extensionCost = document.getElementById('extension-cost');
            
            if (newReturnDate) newReturnDate.textContent = this.formatDate(newDate);
            if (extensionCost) extensionCost.textContent = `₹${cost}`;
        }
    }

    setRating(rating) {
        this.selectedRating = rating;
        this.highlightStars(rating);
    }

    highlightStars(rating) {
        document.querySelectorAll('.star-rating i').forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // Form Handlers
    handleExtendRental() {
        const modal = document.getElementById('extend-modal');
        const rentalId = modal.dataset.rentalId;
        const extendDays = document.getElementById('extend-days');
        const days = extendDays ? parseInt(extendDays.value) : 1;
        
        // Simulate API call
        this.showNotification('Rental extended successfully!', 'success');
        this.closeModal(modal);
        
        // Update rental data
        const rental = this.rentals.find(r => r.id === rentalId);
        if (rental) {
            rental.endDate.setDate(rental.endDate.getDate() + days);
            this.filterAndDisplayRentals();
        }
    }

    handleReturnItem() {
        const modal = document.getElementById('return-modal');
        const rentalId = modal.dataset.rentalId;
        const returnCondition = document.getElementById('return-condition');
        const returnNotes = document.getElementById('return-notes');
        const condition = returnCondition ? returnCondition.value : 'excellent';
        const notes = returnNotes ? returnNotes.value : '';
        
        // Simulate API call
        this.showNotification('Return scheduled successfully!', 'success');
        this.closeModal(modal);
        
        // Update rental status
        const rental = this.rentals.find(r => r.id === rentalId);
        if (rental) {
            rental.status = 'completed';
            rental.progress = 100;
            this.updateStats();
            this.filterAndDisplayRentals();
        }
    }

    handleSubmitReview() {
        const modal = document.getElementById('review-modal');
        const rentalId = modal.dataset.rentalId;
        const reviewText = document.getElementById('review-text');
        const reviewTextValue = reviewText ? reviewText.value : '';
        
        if (this.selectedRating === 0) {
            this.showNotification('Please select a rating', 'error');
            return;
        }
        
        // Update rental with review
        const rental = this.rentals.find(r => r.id === rentalId);
        if (rental) {
            rental.rating = this.selectedRating;
            rental.review = reviewTextValue;
            this.filterAndDisplayRentals();
        }
        
        this.showNotification('Review submitted successfully!', 'success');
        this.closeModal(modal);
    }

    // Action Handlers
    cancelRental(rentalId) {
        if (confirm('Are you sure you want to cancel this rental?')) {
            const rentalIndex = this.rentals.findIndex(r => r.id === rentalId);
            if (rentalIndex !== -1) {
                this.rentals.splice(rentalIndex, 1);
                this.updateStats();
                this.filterAndDisplayRentals();
                this.showNotification('Rental cancelled successfully', 'success');
            }
        }
    }

    modifyRental(rentalId) {
        this.showNotification('Modification feature coming soon!', 'info');
    }

    rentAgain(rentalId) {
        const rental = this.rentals.find(r => r.id === rentalId);
        if (rental) {
            // Redirect to product details or inventory
            window.location.href = `inventory.html?search=${encodeURIComponent(rental.itemName)}`;
        }
    }

    refreshData() {
        const loadingState = document.getElementById('loading-state');
        if (loadingState) {
            loadingState.style.display = 'block';
        }
        
        // Simulate API call
        setTimeout(() => {
            this.loadSampleData();
            this.updateStats();
            this.filterAndDisplayRentals();
            this.showNotification('Data refreshed successfully!', 'success');
        }, 1000);
    }

    exportData() {
        const data = this.filteredRentals.map(rental => ({
            'Rental ID': rental.id,
            'Item Name': rental.itemName,
            'Category': rental.category,
            'Status': rental.status,
            'Start Date': this.formatDate(rental.startDate),
            'End Date': this.formatDate(rental.endDate),
            'Total Paid': rental.totalPaid,
            'Rating': rental.rating || 'Not Rated'
        }));
        
        const csv = this.convertToCSV(data);
        this.downloadCSV(csv, 'rental-status.csv');
        this.showNotification('Data exported successfully!', 'success');
    }

    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
        ].join('\n');
        
        return csvContent;
    }

    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.close-notification');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.remove();
            });
        }
    }
}

// Initialize the rental status manager when DOM is loaded
let rentalManager;
document.addEventListener('DOMContentLoaded', () => {
    rentalManager = new RentalStatusManager();
});

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .close-notification {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
    }
`;
document.head.appendChild(notificationStyles);

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.stat-card, .rental-card, .filter-section').forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// Parallax effect for header
function initParallaxEffect() {
    const header = document.querySelector('.status-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        header.style.transform = `translateY(${rate}px)`;
    });
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-content h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (counter.textContent.includes('₹')) {
                counter.textContent = `₹${Math.floor(current)}`;
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 20);
    });
}

// Enhanced button interactions
function initButtonAnimations() {
    document.querySelectorAll('.btn, .action-btn, .filter-tab').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Smooth scroll to top
function addScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        transform: scale(0);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(215, 109, 119, 0.3);
    `;
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.transform = 'scale(1)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.transform = 'scale(0)';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'scale(1.1)';
        scrollBtn.style.boxShadow = '0 6px 25px rgba(215, 109, 119, 0.4)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'scale(1)';
        scrollBtn.style.boxShadow = '0 4px 20px rgba(215, 109, 119, 0.3)';
    });
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // ... existing initialization code ...
    
    // Initialize new animations
    setTimeout(() => {
        initScrollAnimations();
        initParallaxEffect();
        animateCounters();
        initButtonAnimations();
        addScrollToTop();
    }, 100);
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);