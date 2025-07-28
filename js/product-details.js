// Product Details JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Try to get selected item from localStorage first (priority order)
    let selectedItem = JSON.parse(localStorage.getItem('selectedItem')) || 
                      JSON.parse(sessionStorage.getItem('selectedItem'));
    
    // If no selected item but we have a current item ID, try to find it in inventory
    if (!selectedItem && localStorage.getItem('currentItemId')) {
        const currentId = localStorage.getItem('currentItemId');
        
        // Try to use shared inventory system first
        if (window.findInventoryItemById) {
            selectedItem = window.findInventoryItemById(currentId);
        } else {
            // Fallback to localStorage
            const inventoryData = JSON.parse(localStorage.getItem('inventoryData')) || [];
            selectedItem = inventoryData.find(item => item.id.toString() === currentId);
        }
    }

    console.log('Product Details - Selected Item:', selectedItem);
    console.log('Product Details - Product ID from URL:', productId);

    // Sample product data (in a real app, this would come from a database)
    const productData = {
        '1': {
            id: '1',
            name: 'Designer Evening Gown',
            category: 'Formal Wear',
            size: 'M',
            color: 'Black',
            material: 'Silk & Chiffon',
            brand: 'Elegance Collection',
            condition: 'Excellent',
            rentalPrice: 45,
            retailPrice: 299,
            description: 'Elegant black evening gown perfect for formal events and galas. This stunning piece features delicate embroidery and a flattering silhouette that will make you stand out at any special occasion.',
            images: ['img/dress1.jpg', 'img/dress1-2.jpg', 'img/dress1-3.jpg'],
            available: true,
            rating: 4.8,
            reviewCount: 24,
            gender: 'women'
        },
        '2': {
            id: '2',
            name: 'Premium Business Suit',
            category: 'Business Attire',
            size: 'L',
            color: 'Navy Blue',
            material: 'Wool Blend',
            brand: 'Executive Line',
            condition: 'Excellent',
            rentalPrice: 50,
            retailPrice: 350,
            description: 'Professional navy blue suit, perfect for business meetings and interviews. Tailored for comfort and style, this suit projects confidence and sophistication in any professional setting.',
            images: ['img/suit1.jpg', 'img/suit1-2.jpg', 'img/suit1-3.jpg'],
            available: true,
            rating: 4.6,
            reviewCount: 18,
            gender: 'men'
        },
        '3': {
            id: '3',
            name: 'Casual Weekend Set',
            category: 'Casual Wear',
            size: 'S',
            color: 'Multi-color',
            material: 'Cotton Blend',
            brand: 'Urban Comfort',
            condition: 'Very Good',
            rentalPrice: 30,
            retailPrice: 120,
            description: 'Comfortable and stylish casual outfit for weekend outings. This versatile set can be mixed and matched for different looks, perfect for casual gatherings or relaxed days out.',
            images: ['img/casual1.jpg', 'img/casual1-2.jpg', 'img/casual1-3.jpg'],
            available: true,
            rating: 4.5,
            reviewCount: 32,
            gender: 'women'
        },
        '4': {
            id: '4',
            name: 'Sequin Party Dress',
            category: 'Party Wear',
            size: 'XS',
            color: 'Gold',
            material: 'Sequined Fabric',
            brand: 'Glitz & Glamour',
            condition: 'Excellent',
            rentalPrice: 40,
            retailPrice: 180,
            description: 'Dazzling sequin dress that will make you stand out at any party. This eye-catching piece catches and reflects light beautifully, ensuring all eyes will be on you at your next celebration.',
            images: ['img/party1.jpg', 'img/party1-2.jpg', 'img/party1-3.jpg'],
            available: true,
            rating: 4.9,
            reviewCount: 27,
            gender: 'women'
        },
        '5': {
            id: '5',
            name: 'Winter Coat Collection',
            category: 'Seasonal',
            size: 'XL',
            color: 'Charcoal Gray',
            material: 'Wool & Cashmere',
            brand: 'Nordic Warmth',
            condition: 'Excellent',
            rentalPrice: 35,
            retailPrice: 250,
            description: 'Premium winter coat to keep you warm and stylish during cold months. This luxurious coat combines functionality with fashion, featuring deep pockets, quality insulation, and a timeless design.',
            images: ['img/winter1.jpg', 'img/winter1-2.jpg', 'img/winter1-3.jpg'],
            available: true,
            rating: 4.7,
            reviewCount: 21,
            gender: 'men'
        },
        '6': {
            id: '6',
            name: 'Red Carpet Gown',
            category: 'Formal Wear',
            size: 'M',
            color: 'Red',
            material: 'Satin & Lace',
            brand: 'Celebrity Collection',
            condition: 'Excellent',
            rentalPrice: 55,
            retailPrice: 399,
            description: 'Stunning red gown designed for special occasions and red carpet events. This show-stopping dress features a dramatic silhouette, intricate detailing, and premium fabric that drapes beautifully.',
            images: ['img/dress2.jpg', 'img/dress2-2.jpg', 'img/dress2-3.jpg'],
            available: false,
            rating: 5.0,
            reviewCount: 15,
            gender: 'women'
        }
    };

    // Load product data
    if (selectedItem) {
        console.log('Loading product from selected item:', selectedItem);
        // Use data from inventory selection
        loadProductDataFromInventory(selectedItem);
    } else if (productId) {
        console.log('Looking for product ID:', productId);
        // Try to find product in inventory data first
        const inventoryItem = findInventoryItem(productId);
        console.log('Found inventory item:', inventoryItem);
        
        if (inventoryItem) {
            loadProductDataFromInventory(inventoryItem);
        } else if (productData[productId]) {
            console.log('Using fallback product data');
            loadProductData(productData[productId]);
        } else {
            console.log('Product not found, redirecting to inventory');
            // Show error message before redirecting
            showNotification('Product not found. Redirecting to inventory...', 'error');
            setTimeout(() => {
                window.location.href = 'inventory.html';
            }, 2000);
            return;
        }
    } else {
        console.log('No product ID specified, redirecting to inventory');
        // Redirect to inventory if no product specified
        window.location.href = 'inventory.html';
        return;
    }

    function loadProductDataFromInventory(item) {
        // Convert inventory item to product format
        const product = {
            id: item.id.toString(),
            name: item.name,
            category: getCategoryName(item.category),
            size: item.size.toUpperCase(),
            color: getDefaultColor(item.category),
            material: getDefaultMaterial(item.category),
            brand: getBrandName(item.category),
            condition: 'Excellent',
            rentalPrice: item.price,
            retailPrice: item.price * 6, // Estimate retail price
            description: item.description,
            images: [item.image, item.image, item.image], // Use same image 3 times for thumbnails
            available: item.available,
            rating: generateRandomRating(),
            reviewCount: Math.floor(Math.random() * 30) + 10,
            gender: item.gender,
            weeklyPrice: item.weeklyPrice || item.price * 6.2
        };

        loadProductData(product);
    }

    // Function to find inventory item by ID
    function findInventoryItem(productId) {
        // First try to get from window object (if inventory.js was loaded)
        if (window.inventoryData) {
            return window.inventoryData.find(item => item.id.toString() === productId.toString());
        }
        
        // Fallback: try to get from localStorage if inventory was loaded before
        const storedInventory = localStorage.getItem('inventoryData');
        if (storedInventory) {
            try {
                const inventory = JSON.parse(storedInventory);
                return inventory.find(item => item.id.toString() === productId.toString());
            } catch (error) {
                console.error('Error parsing inventory data from localStorage:', error);
            }
        }
        
        return null;
    }

    function getCategoryName(category) {
        const categoryNames = {
            'formal': 'Formal Wear',
            'casual': 'Casual Wear',
            'business': 'Business Attire',
            'party': 'Party Wear',
            'seasonal': 'Seasonal'
        };
        return categoryNames[category] || category;
    }

    function getDefaultColor(category) {
        const colors = {
            'formal': 'Black',
            'casual': 'Multi-color',
            'business': 'Navy Blue',
            'party': 'Gold',
            'seasonal': 'Charcoal Gray'
        };
        return colors[category] || 'Black';
    }

    function getDefaultMaterial(category) {
        const materials = {
            'formal': 'Silk & Chiffon',
            'casual': 'Cotton Blend',
            'business': 'Wool Blend',
            'party': 'Sequined Fabric',
            'seasonal': 'Wool & Cashmere'
        };
        return materials[category] || 'Premium Fabric';
    }

    function getBrandName(category) {
        const brands = {
            'formal': 'Elegance Collection',
            'casual': 'Urban Comfort',
            'business': 'Executive Line',
            'party': 'Glitz & Glamour',
            'seasonal': 'Nordic Warmth'
        };
        return brands[category] || 'Designer Collection';
    }

    function generateRandomRating() {
        // Generate rating between 4.0 and 5.0
        return Math.round((4.0 + Math.random() * 1.0) * 10) / 10;
    }

    function loadProductData(product) {
        // Update page title and breadcrumb
        document.title = `VASTRA RENT - ${product.name}`;
        document.getElementById('breadcrumb-product-name').textContent = product.name;

        // Store product data for calculations
        window.currentProduct = product;

        // Update product details
        document.getElementById('product-title').textContent = product.name;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-price').textContent = `₹${product.rentalPrice}`;
        document.getElementById('product-retail-price').textContent = `₹${product.retailPrice}`;

        // Update product specifications
        document.getElementById('product-category').textContent = product.category;
        document.getElementById('product-size').textContent = product.size;
        document.getElementById('product-color').textContent = product.color;
        document.getElementById('product-material').textContent = product.material;
        document.getElementById('product-brand').textContent = product.brand;
        document.getElementById('product-condition').textContent = product.condition;

        // Update availability
        const availabilityElement = document.getElementById('product-availability');
        if (product.available) {
            availabilityElement.textContent = 'Available for Rent';
            availabilityElement.parentElement.className = 'status-indicator available';
            document.getElementById('rent-now-btn').disabled = false;
            document.getElementById('rent-now-btn').textContent = 'Rent Now';
        } else {
            availabilityElement.textContent = 'Currently Unavailable';
            availabilityElement.parentElement.className = 'status-indicator unavailable';
            document.getElementById('rent-now-btn').disabled = true;
            document.getElementById('rent-now-btn').textContent = 'Unavailable';
        }

        // Update main product image
        const mainImage = document.getElementById('main-product-image');
        mainImage.src = product.images[0];
        mainImage.alt = product.name;

        // Update thumbnail images
        const thumbnailContainer = document.getElementById('product-thumbnails');
        thumbnailContainer.innerHTML = '';

        product.images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail' + (index === 0 ? ' active' : '');
            thumbnail.style.backgroundImage = `url('${image}')`;
            thumbnail.setAttribute('data-image', image);
            thumbnail.addEventListener('click', function () {
                // Update main image
                mainImage.src = this.getAttribute('data-image');

                // Update active thumbnail
                document.querySelectorAll('.thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                this.classList.add('active');
            });
            thumbnailContainer.appendChild(thumbnail);
        });

        // Update star rating display
        updateStarRating(product.rating);

        // Initialize rental form
        initializeRentalForm();

        // Initialize reviews
        loadProductReviews();

        // Initialize related products
        loadRelatedProducts(product.category, product.id);

        // Initialize wishlist button
        initializeWishlistButton(product);

        // Initialize share buttons
        initializeShareButtons(product);

        // Initialize zoom functionality
        initializeImageZoom();

        // Initialize tabs
        initializeTabs();
    }

    function updateStarRating(rating) {
        const starsContainer = document.getElementById('star-rating');
        const reviewsText = document.getElementById('product-reviews');

        starsContainer.innerHTML = '';

        // Create 5 stars
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');

            // Full star, half star, or empty star
            if (i <= Math.floor(rating)) {
                star.className = 'fas fa-star';
            } else if (i - 0.5 <= rating) {
                star.className = 'fas fa-star-half-alt';
            } else {
                star.className = 'far fa-star';
            }

            starsContainer.appendChild(star);
        }

        // Update reviews text
        reviewsText.textContent = `(${rating}/5 - ${window.currentProduct.reviewCount} reviews)`;
    }

    function initializeRentalForm() {
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        const durationSelect = document.getElementById('duration-select');
        const sizeSelect = document.getElementById('size-select');
        const quantityInput = document.getElementById('quantity');
        const rentNowBtn = document.getElementById('rent-now-btn');
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        const addToWishlistBtn = document.getElementById('add-to-wishlist-btn');

        // Set minimum date to today
        const today = new Date();
        startDateInput.min = today.toISOString().split('T')[0];
        startDateInput.value = today.toISOString().split('T')[0];

        // Calculate end date based on duration
        function updateEndDate() {
            const startDate = new Date(startDateInput.value);
            const duration = parseInt(durationSelect.value);

            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + duration);

            endDateInput.value = endDate.toISOString().split('T')[0];

            calculateTotalCost();
        }

        // Initialize end date
        updateEndDate();

        // Update end date when start date or duration changes
        startDateInput.addEventListener('change', updateEndDate);

        durationSelect.addEventListener('change', function () {
            updateEndDate();
            calculateTotalCost();
        });

        endDateInput.addEventListener('change', calculateTotalCost);

        // Update quantity
        quantityInput.addEventListener('change', function () {
            if (this.value < 1) this.value = 1;
            calculateTotalCost();
        });

        // Rent Now button
        rentNowBtn.addEventListener('click', function () {
            if (this.disabled) return;

            if (!window.currentProduct || !window.currentProduct.available) {
                showNotification('This item is currently not available for rent.', 'error');
                return;
            }

            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            this.disabled = true;

            // Prepare rental data
            const rentalData = prepareRentalData();

            if (!rentalData) {
                // Reset button if data preparation failed
                this.innerHTML = '<i class="fas fa-calendar-check"></i> Rent Now';
                this.disabled = false;
                showNotification('Error preparing rental data. Please check all fields.', 'error');
                return;
            }

            try {
                // Enhanced rental data with all product information
                const enhancedRentalData = {
                    ...rentalData,
                    // Ensure all product details are included
                    productName: window.currentProduct.name,
                    productImage: window.currentProduct.images[0],
                    category: window.currentProduct.category,
                    gender: window.currentProduct.gender,
                    description: window.currentProduct.description,
                    brand: window.currentProduct.brand,
                    material: window.currentProduct.material,
                    color: window.currentProduct.color,
                    condition: window.currentProduct.condition,
                    retailPrice: window.currentProduct.retailPrice,
                    weeklyPrice: window.currentProduct.weeklyPrice,
                    available: window.currentProduct.available,
                    rating: window.currentProduct.rating,
                    reviewCount: window.currentProduct.reviewCount,
                    // Add timestamp and source tracking
                    createdAt: new Date().toISOString(),
                    source: 'product-details',
                    paymentStatus: 'pending'
                };

                // Store rental data for payment page (multiple storage methods for reliability)
                localStorage.setItem('currentRental', JSON.stringify(enhancedRentalData));
                sessionStorage.setItem('currentRental', JSON.stringify(enhancedRentalData));

                // Also update selected item with rental details
                const selectedItem = JSON.parse(localStorage.getItem('selectedItem')) || {};
                const updatedSelectedItem = {
                    ...selectedItem,
                    ...enhancedRentalData,
                    lastUpdated: new Date().toISOString()
                };
                localStorage.setItem('selectedItem', JSON.stringify(updatedSelectedItem));

                // Create rental in integration system (will be updated after payment)
                if (window.rentalIntegration) {
                    localStorage.setItem('pendingRental', JSON.stringify(enhancedRentalData));
                }

                console.log('Rental data prepared for payment:', enhancedRentalData);

                // Redirect to payment page after a short delay
                setTimeout(() => {
                    window.location.href = 'payment.html';
                }, 1000);
            } catch (error) {
                console.error('Error processing rental:', error);
                this.innerHTML = '<i class="fas fa-calendar-check"></i> Rent Now';
                this.disabled = false;
                showNotification('Error processing rental. Please try again.', 'error');
            }
        });

        // Add to Cart button
        addToCartBtn.addEventListener('click', function () {
            if (!window.currentProduct || !window.currentProduct.available) {
                showNotification('This item is currently not available for rent.', 'error');
                return;
            }

            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            this.disabled = true;

            // Prepare rental data
            const rentalData = prepareRentalData();

            if (!rentalData) {
                // Reset button if data preparation failed
                this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                this.disabled = false;
                showNotification('Error preparing rental data. Please try again.', 'error');
                return;
            }

            try {
                // Add to cart in localStorage
                addToCart(rentalData);

                // Reset button after a short delay
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                    this.disabled = false;
                    showNotification('Added to cart successfully!', 'success');
                    updateCartCount();
                }, 800);
            } catch (error) {
                console.error('Error adding to cart:', error);
                this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                this.disabled = false;
                showNotification('Error adding to cart. Please try again.', 'error');
            }
        });

        // Populate duration select
        populateDurationOptions();

        // Populate size select based on product
        populateSizeOptions();
    }

    function populateDurationOptions() {
        const durationSelect = document.getElementById('duration-select');
        const product = window.currentProduct;
        const basePrice = product.rentalPrice;
        const weeklyPrice = product.weeklyPrice || basePrice * 6.2;

        durationSelect.innerHTML = '';

        const options = [
            { days: 1, label: '1 Day', price: basePrice },
            { days: 2, label: '2 Days', price: basePrice * 1.9 },
            { days: 3, label: '3 Days', price: basePrice * 2.7 },
            { days: 7, label: '1 Week', price: weeklyPrice },
            { days: 14, label: '2 Weeks', price: weeklyPrice * 1.8 },
            { days: 30, label: '1 Month', price: weeklyPrice * 3.5 }
        ];

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.days;
            optionElement.textContent = `${option.label} - ₹${Math.round(option.price)}`;
            durationSelect.appendChild(optionElement);
        });
    }

    function populateSizeOptions() {
        const sizeSelect = document.getElementById('size-select');
        const product = window.currentProduct;

        // Clear existing options
        sizeSelect.innerHTML = '';

        // Define available sizes based on product category and gender
        let sizes = [];

        if (product.gender === 'women') {
            sizes = ['XS', 'S', 'M', 'L', 'XL'];
        } else {
            sizes = ['S', 'M', 'L', 'XL', 'XXL'];
        }

        // Add size options
        sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;

            // Set the product's size as selected
            if (size === product.size) {
                option.selected = true;
            }

            sizeSelect.appendChild(option);
        });
    }

    function calculateTotalCost() {
        if (!window.currentProduct) return 0;

        const startDateEl = document.getElementById('start-date');
        const endDateEl = document.getElementById('end-date');
        const quantityEl = document.getElementById('quantity');

        if (!startDateEl || !endDateEl || !quantityEl) {
            console.error('Required elements not found for cost calculation');
            return 0;
        }

        const startDate = new Date(startDateEl.value);
        const endDate = new Date(endDateEl.value);
        const quantity = parseInt(quantityEl.value) || 1;

        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return 0;
        }

        // Calculate days difference
        const timeDiff = endDate - startDate;
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (days < 1) {
            // Auto-correct end date if it's before start date
            const correctedEndDate = new Date(startDate);
            correctedEndDate.setDate(correctedEndDate.getDate() + 1);
            endDateEl.value = correctedEndDate.toISOString().split('T')[0];
            return calculateTotalCost();
        }

        const basePrice = window.currentProduct.rentalPrice || 0;
        const weeklyPrice = window.currentProduct.weeklyPrice || basePrice * 6.2;
        let rentalFee;

        // Calculate rental fee with discounts for longer periods
        if (days === 1) rentalFee = basePrice;
        else if (days === 2) rentalFee = basePrice * 1.9;
        else if (days === 3) rentalFee = basePrice * 2.7;
        else if (days <= 7) rentalFee = weeklyPrice;
        else if (days <= 14) rentalFee = weeklyPrice * 1.8;
        else rentalFee = weeklyPrice * 3.5;

        // Ensure rentalFee is a valid number
        if (isNaN(rentalFee) || rentalFee <= 0) {
            rentalFee = basePrice;
        }

        // Calculate additional fees
        const damageProtection = Math.round(rentalFee * 0.15);
        const deliveryFee = rentalFee >= 100 ? 0 : 10;

        // Calculate total cost
        const totalCost = (rentalFee + damageProtection + deliveryFee) * quantity;

        // Calculate savings compared to retail
        const retailPrice = window.currentProduct.retailPrice || rentalFee * 6;
        const savings = Math.max(0, retailPrice - rentalFee);
        const savingsPercentage = retailPrice > 0 ? Math.round((savings / retailPrice) * 100) : 0;

        // Update display elements safely
        const elements = {
            'rental-days': days.toString(),
            'rental-fee': `$${rentalFee.toFixed(2)}`,
            'damage-protection': `₹${damageProtection.toFixed(2)}`,
            'delivery-fee': deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`,
            'total-cost': `₹${totalCost.toFixed(2)}`,
            'savings-amount': `₹${savings.toFixed(2)} (${savingsPercentage}%)`
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];

                // Add pulse animation to updated cost elements
                if (id === 'rental-fee' || id === 'total-cost' || id === 'savings-amount') {
                    element.style.transform = 'scale(1.05)';
                    element.style.color = 'var(--primary-color)';
                    element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

                    setTimeout(() => {
                        element.style.transform = 'scale(1)';
                        element.style.color = '';
                    }, 300);
                }
            }
        });

        return totalCost;
    }

    function validateRentalForm() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const size = document.getElementById('size-select').value;
        const quantity = document.getElementById('quantity').value;

        if (!startDate) {
            showNotification('Please select a start date', 'error');
            return false;
        }

        if (!endDate) {
            showNotification('Please select an end date', 'error');
            return false;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            showNotification('End date must be after start date', 'error');
            return false;
        }

        if (!size) {
            showNotification('Please select a size', 'error');
            return false;
        }

        if (!quantity || quantity < 1) {
            showNotification('Please enter a valid quantity', 'error');
            return false;
        }

        return true;
    }

    function prepareRentalData() {
        const product = window.currentProduct;
        if (!product) {
            console.error('No product data available');
            return null;
        }

        // Validate form first
        if (!validateRentalForm()) {
            return null;
        }

        const startDateEl = document.getElementById('start-date');
        const endDateEl = document.getElementById('end-date');
        const sizeSelectEl = document.getElementById('size-select');
        const quantityEl = document.getElementById('quantity');
        const specialRequestsEl = document.getElementById('special-requests');
        const rentalFeeEl = document.getElementById('rental-fee');
        const rentalDaysEl = document.getElementById('rental-days');

        if (!startDateEl || !endDateEl || !sizeSelectEl || !quantityEl || !rentalFeeEl || !rentalDaysEl) {
            console.error('Required form elements not found');
            return null;
        }

        const startDate = startDateEl.value;
        const endDate = endDateEl.value;
        const size = sizeSelectEl.value;
        const quantity = parseInt(quantityEl.value) || 1;
        const specialRequests = specialRequestsEl ? specialRequestsEl.value : '';

        // Calculate total cost
        const totalCost = calculateTotalCost();

        if (!totalCost || totalCost <= 0) {
            console.error('Invalid total cost calculated');
            return null;
        }

        // Get additional cost breakdown for payment page
        const rentalFee = parseFloat(rentalFeeEl.textContent.replace('$', ''));
        const days = parseInt(rentalDaysEl.textContent);
        const damageProtection = parseFloat(document.getElementById('damage-protection')?.textContent.replace('$', '') || '0');
        const deliveryFee = document.getElementById('delivery-fee')?.textContent === 'FREE' ? 0 : 
                           parseFloat(document.getElementById('delivery-fee')?.textContent.replace('$', '') || '0');

        return {
            // Core product information
            productId: product.id,
            productName: product.name,
            productImage: product.images[0],
            category: product.category,
            size: size,
            
            // Rental details
            startDate: startDate,
            endDate: endDate,
            quantity: quantity,
            days: days,
            specialRequests: specialRequests,
            
            // Pricing information
            rentalFee: rentalFee,
            totalCost: totalCost,
            damageProtection: damageProtection,
            deliveryFee: deliveryFee,
            
            // Additional product details for payment page
            description: product.description,
            brand: product.brand,
            material: product.material,
            color: product.color,
            condition: product.condition,
            retailPrice: product.retailPrice,
            weeklyPrice: product.weeklyPrice,
            gender: product.gender,
            rating: product.rating,
            reviewCount: product.reviewCount,
            available: product.available,
            
            // Metadata
            createdAt: new Date().toISOString(),
            source: 'product-details'
        };
    }

    function addToCart(rentalData) {
        if (!rentalData) {
            throw new Error('Invalid rental data');
        }

        try {
            // Get existing cart or initialize new one
            const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];

            // Add unique ID to the rental item
            rentalData.cartItemId = Date.now().toString();
            rentalData.addedAt = new Date().toISOString();

            // Check if item already exists in cart (same product, dates, size)
            const existingIndex = cart.findIndex(item =>
                item.productId === rentalData.productId &&
                item.startDate === rentalData.startDate &&
                item.endDate === rentalData.endDate &&
                item.size === rentalData.size
            );

            if (existingIndex >= 0) {
                // Update existing item quantity
                cart[existingIndex].quantity += rentalData.quantity;
                cart[existingIndex].totalCost = cart[existingIndex].rentalFee * cart[existingIndex].quantity;
            } else {
                // Add new item to cart
                cart.push(rentalData);
            }

            // Save to localStorage
            localStorage.setItem('rentalCart', JSON.stringify(cart));
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }

    function updateCartCount() {
        try {
            const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
            const cartCountElement = document.getElementById('header-cart-count');

            if (cartCountElement) {
                cartCountElement.textContent = cart.length;
                cartCountElement.style.display = cart.length > 0 ? 'inline' : 'none';
            }

            // Also call the main updateHeaderCounts function if it exists
            if (typeof updateHeaderCounts === 'function') {
                updateHeaderCounts();
            }
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    }

    function initializeWishlistButton(product) {
        const wishlistBtn = document.getElementById('add-to-wishlist-btn');

        if (!wishlistBtn) return;

        // Check if product is already in wishlist
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const isInWishlist = wishlist.some(item => item.id === product.id);

        if (isInWishlist) {
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> In Wishlist';
            wishlistBtn.classList.add('in-wishlist');
        }

        wishlistBtn.addEventListener('click', function () {
            // Toggle wishlist status
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const existingIndex = wishlist.findIndex(item => item.id === product.id);

            if (existingIndex >= 0) {
                // Remove from wishlist
                wishlist.splice(existingIndex, 1);
                this.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
                this.classList.remove('in-wishlist');
                showNotification('Removed from wishlist', 'info');
            } else {
                // Add to wishlist with comprehensive data
                wishlist.push({
                    id: product.id,
                    name: product.name,
                    image: product.images[0],
                    price: product.rentalPrice,
                    weeklyPrice: product.weeklyPrice,
                    description: product.description,
                    category: product.category,
                    size: product.size,
                    gender: product.gender,
                    brand: product.brand,
                    material: product.material,
                    color: product.color,
                    condition: product.condition,
                    retailPrice: product.retailPrice,
                    available: product.available,
                    rating: product.rating,
                    reviewCount: product.reviewCount,
                    addedAt: new Date().toISOString()
                });
                this.innerHTML = '<i class="fas fa-heart"></i> In Wishlist';
                this.classList.add('in-wishlist');
                showNotification('Added to wishlist', 'success');
            }

            // Save to localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));

            // Update wishlist count
            updateWishlistCount();
        });
    }

    function updateWishlistCount() {
        try {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const wishlistCountElement = document.getElementById('header-wishlist-count');

            if (wishlistCountElement) {
                wishlistCountElement.textContent = wishlist.length;
                wishlistCountElement.style.display = wishlist.length > 0 ? 'inline' : 'none';
            }

            // Also call the main updateHeaderCounts function if it exists
            if (typeof updateHeaderCounts === 'function') {
                updateHeaderCounts();
            }
        } catch (error) {
            console.error('Error updating wishlist count:', error);
        }
    }

    function initializeShareButtons(product) {
        const shareButtons = document.querySelectorAll('.share-btn');

        shareButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();

                const platform = this.getAttribute('data-platform');
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(`Check out this ${product.name} on VASTRA RENT`);
                const image = encodeURIComponent(product.images[0]);

                let shareUrl;

                switch (platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                        break;
                    case 'pinterest':
                        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${title}`;
                        break;
                    case 'email':
                        shareUrl = `mailto:?subject=${title}&body=Check out this product: ${url}`;
                        break;
                }

                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                    showNotification(`Shared on ${platform}!`, 'success');
                }
            });
        });
    }

    function initializeImageZoom() {
        const mainImage = document.getElementById('main-product-image');
        const zoomContainer = document.getElementById('image-zoom-container');

        if (!mainImage || !zoomContainer) return;

        mainImage.addEventListener('mousemove', function (e) {
            // Get cursor position relative to the image
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate position as percentage
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            // Apply zoom effect
            zoomContainer.style.backgroundImage = `url('${this.src}')`;
            zoomContainer.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
            zoomContainer.style.display = 'block';
        });

        mainImage.addEventListener('mouseleave', function () {
            zoomContainer.style.display = 'none';
        });
    }

    function initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', function () {
                const targetTab = this.dataset.tab;

                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active class to clicked button and corresponding content
                this.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }

    function loadProductReviews() {
        // Initialize review form
        initializeReviewForm();

        // Add event listeners to helpful buttons
        document.querySelectorAll('.review-helpful-btn').forEach(button => {
            button.addEventListener('click', function () {
                const helpfulCount = parseInt(this.textContent.match(/\d+/)[0]) + 1;

                this.innerHTML = `<i class="fas fa-thumbs-up"></i> Helpful (${helpfulCount})`;
                this.disabled = true;
                this.classList.add('marked-helpful');

                showNotification('Thank you for your feedback!', 'success');
            });
        });

        // Add event listeners to reply buttons
        document.querySelectorAll('.review-reply-btn').forEach(button => {
            button.addEventListener('click', function () {
                const reviewId = this.getAttribute('data-review-id');
                showReplyForm(reviewId, this);
            });
        });
    }

    function initializeReviewForm() {
        const reviewForm = document.getElementById('review-form');
        const ratingStars = document.querySelectorAll('.rating-star');
        const ratingValue = document.getElementById('rating-value');

        if (!reviewForm || !ratingStars.length || !ratingValue) return;

        // Initialize star rating
        ratingStars.forEach((star, index) => {
            star.addEventListener('click', function () {
                const rating = index + 1;
                ratingValue.value = rating;

                // Update star display
                ratingStars.forEach((s, i) => {
                    if (i < rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });

            star.addEventListener('mouseover', function () {
                const rating = index + 1;

                // Update star display on hover
                ratingStars.forEach((s, i) => {
                    if (i < rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
        });

        // Reset stars on mouse leave
        document.querySelector('.rating-stars').addEventListener('mouseleave', function () {
            const rating = parseInt(ratingValue.value) || 0;

            ratingStars.forEach((s, i) => {
                if (i < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });

        // Handle form submission
        reviewForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const rating = parseInt(ratingValue.value) || 0;
            const title = document.getElementById('review-title').value;
            const comment = document.getElementById('review-comment').value;

            if (rating === 0) {
                showNotification('Please select a rating', 'error');
                return;
            }

            if (!title || !comment) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Show success message
            showNotification('Review submitted successfully!', 'success');

            // Reset form
            this.reset();
            ratingValue.value = 0;
            ratingStars.forEach(s => {
                s.classList.remove('fas');
                s.classList.add('far');
            });

            // Close review form
            document.getElementById('write-review-btn').classList.remove('active');
            reviewForm.style.display = 'none';
        });

        // Toggle review form
        document.getElementById('write-review-btn').addEventListener('click', function () {
            this.classList.toggle('active');
            reviewForm.style.display = reviewForm.style.display === 'block' ? 'none' : 'block';
        });
    }

    function showReplyForm(reviewId, button) {
        // Remove any existing reply forms
        document.querySelectorAll('.review-reply-form').forEach(form => {
            form.remove();
        });

        // Create reply form
        const replyForm = document.createElement('form');
        replyForm.className = 'review-reply-form';
        replyForm.innerHTML = `
            <textarea placeholder="Write your reply..." required></textarea>
            <div class="form-actions">
                <button type="button" class="cancel-reply-btn">Cancel</button>
                <button type="submit" class="submit-reply-btn">Submit Reply</button>
            </div>
        `;

        // Insert after the button's parent (review-footer)
        button.closest('.review-footer').after(replyForm);

        // Focus on textarea
        replyForm.querySelector('textarea').focus();

        // Handle cancel button
        replyForm.querySelector('.cancel-reply-btn').addEventListener('click', function () {
            replyForm.remove();
        });

        // Handle form submission
        replyForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const replyText = this.querySelector('textarea').value;

            if (!replyText) return;

            // Create reply element
            const replyElement = document.createElement('div');
            replyElement.className = 'review-reply';
            replyElement.innerHTML = `
                <div class="reply-header">
                    <img src="https://via.placeholder.com/30x30?text=You" alt="Your Avatar" class="reply-avatar">
                    <div>
                        <h5>You</h5>
                        <p class="reply-date">Just now</p>
                    </div>
                </div>
                <div class="reply-content">
                    <p>${replyText}</p>
                </div>
            `;

            // Insert reply after the form
            this.after(replyElement);

            // Remove form
            this.remove();

            // Show success message
            showNotification('Reply submitted successfully!', 'success');
        });
    }

    function loadRelatedProducts(category, currentProductId) {
        const relatedContainer = document.getElementById('related-products');

        if (!relatedContainer) return;

        // Get all products with the same category
        const relatedProducts = Object.values(productData).filter(product =>
            product.category === category && product.id !== currentProductId
        );

        // Limit to 3 products
        const displayProducts = relatedProducts.slice(0, 3);

        // Clear container
        relatedContainer.innerHTML = '';

        // Add products
        displayProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'related-product';

            productElement.innerHTML = `
                <a href="product-details.html?id=${product.id}">
                    <div class="related-product-image" style="background-image: url('${product.images[0]}');"></div>
                    <h4>${product.name}</h4>
                    <p class="related-product-price">₹${product.rentalPrice}/day</p>
                    <div class="related-product-rating">
                        ${generateStarRating(product.rating)}
                        <span>(${product.reviewCount})</span>
                    </div>
                </a>
                <button class="quick-view-btn" data-product-id="${product.id}">Quick View</button>
            `;

            relatedContainer.appendChild(productElement);
        });

        // Add event listeners to quick view buttons
        document.querySelectorAll('.quick-view-btn').forEach(button => {
            button.addEventListener('click', function () {
                const productId = this.getAttribute('data-product-id');
                showQuickViewModal(productId);
            });
        });
    }

    function generateStarRating(rating) {
        let stars = '';

        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }

        return stars;
    }

    function showQuickViewModal(productId) {
        const product = productData[productId];

        if (!product) return;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal quick-view-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="quick-view-container">
                    <div class="quick-view-image">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </div>
                    <div class="quick-view-details">
                        <h3>${product.name}</h3>
                        <div class="quick-view-rating">
                            ${generateStarRating(product.rating)}
                            <span>(${product.reviewCount} reviews)</span>
                        </div>
                        <p class="quick-view-price">₹${product.rentalPrice}/day</p>
                        <p class="quick-view-description">${product.description}</p>
                        <div class="quick-view-specs">
                            <p><strong>Category:</strong> ${product.category}</p>
                            <p><strong>Size:</strong> ${product.size}</p>
                            <p><strong>Color:</strong> ${product.color}</p>
                        </div>
                        <div class="quick-view-actions">
                            <a href="product-details.html?id=${product.id}" class="btn primary">View Details</a>
                            <button class="btn secondary quick-add-to-cart" data-product-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i> Quick Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add to document
        document.body.appendChild(modal);

        // Show modal
        setTimeout(() => {
            modal.style.display = 'block';
        }, 10);

        // Close modal when clicking on X
        modal.querySelector('.close-modal').addEventListener('click', function () {
            modal.style.display = 'none';
            setTimeout(() => {
                modal.remove();
            }, 300);
        });

        // Close modal when clicking outside
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });

        // Quick add to cart
        modal.querySelector('.quick-add-to-cart').addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            const product = productData[productId];

            if (!product) return;

            // Create simple rental data
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const rentalData = {
                productId: product.id,
                productName: product.name,
                productImage: product.images[0],
                category: product.category,
                size: product.size,
                startDate: today.toISOString().split('T')[0],
                endDate: tomorrow.toISOString().split('T')[0],
                quantity: 1,
                specialRequests: '',
                totalCost: product.rentalPrice,
                rentalFee: product.rentalPrice,
                days: 1
            };

            // Add to cart
            addToCart(rentalData);

            // Update cart count
            updateCartCount();

            // Show success message
            showNotification('Added to cart successfully!', 'success');

            // Close modal
            modal.style.display = 'none';
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
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

    // Initialize cost calculation
    calculateTotalCost();

    // Initialize cart and wishlist counts on page load
    updateCartCount();
    updateWishlistCount();

    // Smooth Scrolling Animations
    function initializeScrollAnimations() {
        // Add animation classes to elements
        addAnimationClasses();

        // Create intersection observer for scroll-triggered animations
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

        // Observe all elements with animation classes
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
        animatedElements.forEach(el => observer.observe(el));

        // Add smooth scroll behavior to internal links
        addSmoothScrollToLinks();

        // Add staggered animations to related products
        staggerRelatedProductAnimations();
    }

    function addAnimationClasses() {
        // Add fade-in animation to main sections
        const sections = [
            '.product-pricing',
            '.product-details',
            '.product-description',
            '.size-guide',
            '.availability-status',
            '.rental-options',
            '.action-buttons'
        ];

        sections.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.add('fade-in');
                element.style.animationDelay = `${index * 0.1}s`;
            }
        });

        // Add slide animations to review items
        const reviewItems = document.querySelectorAll('.review-item');
        reviewItems.forEach((item, index) => {
            item.classList.add('slide-in-left');
            item.style.animationDelay = `${index * 0.2}s`;
        });

        // Add scale animation to thumbnails
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.add('scale-in');
            thumb.style.animationDelay = `${index * 0.1}s`;
        });
    }

    function addSmoothScrollToLinks() {
        // Add smooth scrolling to breadcrumb links
        const breadcrumbLinks = document.querySelectorAll('.breadcrumb a');
        breadcrumbLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Add smooth scrolling to tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                setTimeout(() => {
                    const activeTab = document.querySelector('.tab-content.active');
                    if (activeTab) {
                        activeTab.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }
                }, 100);
            });
        });
    }

    function staggerRelatedProductAnimations() {
        const relatedProducts = document.querySelectorAll('.related-product');
        relatedProducts.forEach((product, index) => {
            product.style.animationDelay = `${index * 0.15}s`;

            // Add hover animation enhancement
            product.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });

            product.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Enhanced image transitions
    function enhanceImageTransitions() {
        const mainImage = document.getElementById('main-product-image');
        const thumbnails = document.querySelectorAll('.thumbnail');

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function () {
                // Add fade transition to main image
                mainImage.style.opacity = '0';
                mainImage.style.transform = 'scale(0.95)';

                setTimeout(() => {
                    mainImage.src = this.getAttribute('data-image');
                    mainImage.style.opacity = '1';
                    mainImage.style.transform = 'scale(1)';
                }, 200);
            });
        });

        // Add transition styles to main image
        mainImage.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    // Smooth form interactions
    function enhanceFormAnimations() {
        const formInputs = document.querySelectorAll('input, select, textarea');

        formInputs.forEach(input => {
            input.addEventListener('focus', function () {
                this.style.transform = 'scale(1.02)';
                this.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.15)';
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });

            input.addEventListener('blur', function () {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });
        });
    }

    // Animated counter for cost calculation
    function animateCounter(element, targetValue, duration = 800) {
        const startValue = parseFloat(element.textContent.replace(/[^0-9.]/g, '')) || 0;
        const increment = (targetValue - startValue) / (duration / 16);
        let currentValue = startValue;

        const counter = setInterval(() => {
            currentValue += increment;

            if ((increment > 0 && currentValue >= targetValue) ||
                (increment < 0 && currentValue <= targetValue)) {
                currentValue = targetValue;
                clearInterval(counter);
            }

            // Format the value based on the element
            if (element.id === 'total-cost' || element.id === 'rental-fee') {
                element.textContent = `$${currentValue.toFixed(2)}`;
            } else if (element.id === 'rental-days') {
                element.textContent = Math.round(currentValue).toString();
            }
        }, 16);
    }

    // Enhanced tab switching with animations
    function enhanceTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', function () {
                const targetTab = this.getAttribute('data-tab');

                // Animate out current tab
                const currentTab = document.querySelector('.tab-content.active');
                if (currentTab) {
                    currentTab.style.opacity = '0';
                    currentTab.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        currentTab.classList.remove('active');

                        // Animate in new tab
                        const newTab = document.getElementById(targetTab);
                        if (newTab) {
                            newTab.classList.add('active');
                            newTab.style.opacity = '0';
                            newTab.style.transform = 'translateY(20px)';

                            setTimeout(() => {
                                newTab.style.opacity = '1';
                                newTab.style.transform = 'translateY(0)';
                            }, 50);
                        }
                    }, 200);
                }
            });
        });

        // Add transition styles to tab contents
        tabContents.forEach(content => {
            content.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    }

    // Initialize all enhancements
    setTimeout(() => {
        enhanceImageTransitions();
        enhanceFormAnimations();
        enhanceTabSwitching();
    }, 500);

    // Parallax effect for product images (subtle)
    function addParallaxEffect() {
        const productImages = document.querySelector('.product-images');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.1;

            if (productImages) {
                productImages.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // Add parallax effect on larger screens
    if (window.innerWidth > 768) {
        addParallaxEffect();
    }

    // Smooth reveal animation for cost summary updates
    function animateCostUpdate() {
        const costElements = [
            'rental-fee',
            'damage-protection',
            'delivery-fee',
            'total-cost',
            'savings-amount'
        ];

        costElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
    }

    // Initialize cost animation
    animateCostUpdate();

    // Initialize smooth scrolling animations
    setTimeout(() => {
        initializeScrollAnimations();
    }, 100);
});