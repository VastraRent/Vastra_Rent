// Inventory Management JavaScript - Clean Version

document.addEventListener('DOMContentLoaded', function () {
    try {
        console.log('DOM Content Loaded - Starting inventory initialization');
        
        // Check if inventory grid exists
        const inventoryGrid = document.querySelector('.inventory-grid');

        if (!inventoryGrid) {
            console.error('Inventory grid not found! Cannot initialize inventory.');
            return;
        }

        console.log('Inventory grid found:', inventoryGrid);
        console.log('Inventory data length:', inventoryData ? inventoryData.length : 'undefined');

        // Initialize inventory first
        initializeInventory();
        setupEventListeners();
        
        try {
            setupModalHandlers();
        } catch (error) {
            console.warn('Error setting up modal handlers:', error);
        }
        
        // Show rental status notification if user has active rentals
        checkAndShowRentalStatusNotification();

        // Then check for URL parameters and apply filters
        setTimeout(() => {
            handleURLParameters();
            handleItemPreSelection();
            
            // Apply filters if any were set from URL parameters
            if (currentFilters.category !== 'all' || currentFilters.gender !== 'all' || currentFilters.search !== '') {
                applyFilters();
            } else {
                createInventoryItems(true);
            }
        }, 200);

        console.log('Inventory initialization complete');
    } catch (error) {
        console.error('Error during inventory initialization:', error);
        handleInventoryError(error, 'page initialization');
    }
});



// Handle item pre-selection from rental status page
function handleItemPreSelection() {
    try {
        // Check for item parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('item');
        
        // Check for pre-selection data in localStorage
        const preSelectData = localStorage.getItem('preSelectItem');
        
        if (itemId || preSelectData) {
            let targetItemId = itemId;
            
            if (preSelectData) {
                const itemInfo = JSON.parse(preSelectData);
                targetItemId = itemInfo.id;
                localStorage.removeItem('preSelectItem'); // Clean up
                
                // Show notification about pre-selection
                setTimeout(() => {
                    showNotification(`Found "${itemInfo.name}" for you! Click "Rent Now" to rent it again.`, 'info');
                }, 1000);
            }
            
            if (targetItemId) {
                // Scroll to and highlight the item
                setTimeout(() => {
                    highlightAndScrollToItem(parseInt(targetItemId));
                }, 500);
            }
        }
        
        // Listen for inventory updates from rental status page
        document.addEventListener('inventoryUpdated', (e) => {
            const { itemId, isAvailable } = e.detail;
            updateItemDisplayAvailability(itemId, isAvailable);
        });
        
    } catch (error) {
        console.warn('Error handling item pre-selection:', error);
    }
}

// Highlight and scroll to specific item
function highlightAndScrollToItem(itemId) {
    const itemCard = document.querySelector(`[data-id="${itemId}"]`);
    if (itemCard) {
        // Scroll to item
        itemCard.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Add highlight effect
        itemCard.style.border = '3px solid #007bff';
        itemCard.style.boxShadow = '0 0 20px rgba(0, 123, 255, 0.5)';
        itemCard.style.transform = 'scale(1.02)';
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
            itemCard.style.border = '';
            itemCard.style.boxShadow = '';
            itemCard.style.transform = '';
        }, 3000);
    }
}

// Update item display availability
function updateItemDisplayAvailability(itemId, isAvailable) {
    const itemCard = document.querySelector(`[data-id="${itemId}"]`);
    if (itemCard) {
        const statusElement = itemCard.querySelector('.item-status span');
        const rentButton = itemCard.querySelector('.rent-btn');
        
        if (statusElement) {
            statusElement.className = isAvailable ? 'available' : 'unavailable';
            statusElement.innerHTML = `
                <i class="fas fa-${isAvailable ? 'check-circle' : 'times-circle'}"></i>
                ${isAvailable ? 'Available' : 'Currently Unavailable'}
            `;
        }
        
        if (rentButton) {
            rentButton.disabled = !isAvailable;
            rentButton.className = `rent-btn ${!isAvailable ? 'disabled' : ''}`;
            rentButton.querySelector('span').textContent = isAvailable ? 'Rent Now' : 'Unavailable';
        }
    }
}

// Handle URL parameters for direct filtering
function handleURLParameters() {
    try {
        const urlParams = new URLSearchParams(window.location.search);

        // Check for category parameter
        const category = urlParams.get('category');

        if (category && category !== 'all') {
            currentFilters.category = category;

            // Update category filter dropdown
            const categoryFilter = document.getElementById('category-select');

            if (categoryFilter) {
                // First, make sure the category option exists in the dropdown
                let optionExists = false;
                for (let option of categoryFilter.options) {
                    if (option.value === category) {
                        optionExists = true;
                        break;
                    }
                }

                // If option doesn't exist, add it
                if (!optionExists) {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    categoryFilter.appendChild(option);
                }

                categoryFilter.value = category;

                // Trigger change event to ensure any listeners are notified
                categoryFilter.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        // Check for gender parameter
        const gender = urlParams.get('gender');
        if (gender && gender !== 'all') {
            currentFilters.gender = gender;

            // Update gender select dropdown
            const genderSelect = document.getElementById('gender-select');
            if (genderSelect) {
                genderSelect.value = gender;
            }
        }

        // Check for search parameter
        const search = urlParams.get('search');
        if (search) {
            currentFilters.search = search.toLowerCase();

            // Update search input
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = search;
            }
        }
    } catch (error) {
        console.error('Error processing URL parameters:', error);
    }
}

// Current filters state
let currentFilters = {
    gender: 'all',
    category: 'all',
    search: ''
};

// Category mappings
const categoryMappings = {
    men: ['Jodhpuri', 'Kurta', 'Indowastern', 'Tuxedo', 'Suit', 'Blazer', 'Sherwani'],
    women: ['Anarkali', 'Gown', 'Lehnga','Sharara'],
    all: ['Jodhpuri', 'Kurta', 'Indowastern', 'Tuxedo', 'Suit', 'Blazer', 'Sherwani', 'Anarkali', 'Gown', 'Lehnga','Sharara']
};

// Function to update category options based on selected gender
function updateCategoryOptions(selectedGender) {
    const categorySelect = document.getElementById('category-select');
    if (!categorySelect) return;

    // Store current category selection
    const currentCategory = currentFilters.category;

    // Clear existing options
    categorySelect.innerHTML = '<option value="all">All Categories</option>';

    // Get categories for selected gender
    const categories = categoryMappings[selectedGender] || categoryMappings.all;

    // Add category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    // Restore category filter if it's still valid for the selected gender
    if (currentCategory !== 'all' && categories.includes(currentCategory)) {
        currentFilters.category = currentCategory;
        categorySelect.value = currentCategory;
    } else {
        // Reset category filter only if current category is not valid for selected gender
        currentFilters.category = 'all';
        categorySelect.value = 'all';
    }
}

// Pagination state
let paginationState = {
    itemsPerPage: 9,
    currentPage: 1,
    totalItems: 0,
    filteredItems: []
};

// Pricing structure for different categories (Indian Rupees)
const categoryPricing = {
    // Men's Clothing
    'Tuxedo': { daily: 2500, weekly: 6500 },
    'Suit': { daily: 2000, weekly: 5500 },
    'Sherwani': { daily: 3500, weekly: 9000 },
    'Blazer': { daily: 2200, weekly: 6000 },
    'Kurta': { daily: 1800, weekly: 4800 },
    'Jodhpuri': { daily: 2800, weekly: 7200 },
    'Indowastern': { daily: 2500, weekly: 6500 },
    
    // Women's Clothing
    'Gown': { daily: 2800, weekly: 7500 },
    'Anarkali': { daily: 3200, weekly: 8500 },
    'Lehnga': { daily: 4500, weekly: 12000 },
    'Sharara': { daily: 2800, weekly: 7500 }
};

// Enhanced inventory data with updated Indian Rupees pricing
const inventoryData = [
    {
        id: 1,
        name: 'White classic open jacket Jodhpuri',
        image: 'img/men/Jodhpuri suits/image_22.jpg',
        price: 2800,
        weeklyPrice: 7200,
        description: 'Elegant white Jodhpuri suit perfect for formal events and traditional occasions.',
        category: 'Jodhpuri',
        size: 'm',
        gender: 'men',
        available: true
    },
    {
        id: 2,
        name: 'Black embroidered booti Jodhpuri',
        image: 'img/men/Jodhpuri suits/image_1.jpg',
        price: 2800,
        weeklyPrice: 7200,
        description: 'Professional navy blue suit, perfect for business meetings and interviews.',
        category: 'Jodhpuri',
        size: 'l',
        gender: 'men',
        available: true
    },
    {
        id: 3,
        name: 'Purple mirror Jodhpuri',
        image: 'img/men/Jodhpuri suits/image_15.jpg',
        price: 2800,
        weeklyPrice: 7200,
        description: 'Comfortable and stylish casual outfit for weekend outings.',
        category: 'Jodhpuri',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 4,
        name: 'Grey collar embroidered Jodhpuri',
        image: 'img/men/Jodhpuri suits/image_10.jpg',
        price: 2800,
        weeklyPrice: 7200,
        description: 'Dazzling sequin dress that will make you stand out at any party.',
        category: 'Jodhpuri',
        size: 'xs',
        gender: 'men',
        available: true
    },
    {
        id: 5,
        name: 'Navy blue floral Jodhpuri',
        image: 'img/men/Jodhpuri suits/image_13.jpg',
        price: 2800,
        weeklyPrice: 7200,
        description: 'Premium winter coat to keep you warm and stylish during cold months.',
        category: 'Jodhpuri',
        size: 'xl',
        gender: 'men',
        available: true
    },
    {
        id: 6,
        name: 'Yellow embroidered classy jodhpuri',
        image: 'img/men/Jodhpuri suits/image_18.jpg',
        price: 2800,
        weeklyPrice: 7200,
        description: 'Stunning red gown designed for special occasions and red carpet events.',
        category: 'Jodhpuri',
        size: 'm',
        gender: 'men',
        available: true
    },
    // Additional items with updated pricing
    {
        id: 7,
        name: 'Violet designer attached dupatta Jodhpuri',
        image: 'img/men/Jodhpuri suits/image_27.jpg',
        price: 2800,
        weeklyPrice: 7200,
        description: 'Timeless black tuxedo for weddings and formal events.',
        category: 'Jodhpuri',
        size: 'l',
        gender: 'men',
        available: true
    },
    {
        id: 8,
        name: 'Blue mirror work Kurta with pyjama',
        image: 'img/men/Kurta Sets/image_1.jpg',
        price: 1800,
        weeklyPrice: 4800,
        description: 'Flowy bohemian dress perfect for summer festivals.',
        category: 'Kurta',
        size: 'm',
        gender: 'men',
        available: true
    },
    {
        id: 9,
        name: 'Green heavy embroidered Kurta set',
        image: 'img/men/Kurta Sets/image_5.jpg',
        price: 1800,
        weeklyPrice: 4800,
        description: 'Professional blazer and trouser set for business women.',
        category: 'Kurta',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 10,
        name: 'Pink Kurta-set',
        image: 'img/men/Kurta Sets/image_28.jpg',
        price: 1800,
        weeklyPrice: 4800,
        description: 'Retro-inspired cocktail dress with modern flair.',
        category: 'Kurta',
        size: 'm',
        gender: 'men',
        available: true
    },
    // Add more items as needed...
    {
        id: 11,
        name: 'White collar embroidered Kurta-set',
        image: 'img/men/Kurta Sets/image_31.jpg',
        price: 1800,
        weeklyPrice: 4800,
        description: 'Classic denim jacket for everyday casual wear.',
        category: 'Kurta',
        size: 'l',
        gender: 'men',
        available: true
    },
    {
        id: 12,
        name: 'Pista green embroidered Kurta-set',
        image: 'img/men/Kurta Sets/image_29.jpg',
        price: 1800,
        weeklyPrice: 4800,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Kurta',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 13,
        name: 'Maroon Kurta-set',
        image: 'img/men/Kurta Sets/image_15.jpg',
        price: 1800,
        weeklyPrice: 4800,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Kurta',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 14,
        name: 'Black Tuxedo',
        image: 'img/men/Tuxedos/image_1.jpeg',
        price: 2500,
        weeklyPrice: 6500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Tuxedo',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 15,
        name: 'Dark Blue Tuxedo',
        image: 'img/men/Tuxedos/image_4.jpeg',
        price: 2500,
        weeklyPrice: 6500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Tuxedo',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 16,
        name: 'Grey Tuxedo',
        image: 'img/men/Tuxedos/image_5.jpeg',
        price: 2500,
        weeklyPrice: 6500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Tuxedo',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 17,
        name: 'Navy Blue Tuxedo',
        image: 'img/men/Tuxedos/image_11.jpeg',
        price: 2500,
        weeklyPrice: 6500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Tuxedo',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 18,
        name: 'Black 3-piece Tuxedo',
        image: 'img/men/Tuxedos/image_6.jpeg',
        price: 2500,
        weeklyPrice: 6500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Tuxedo',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 19,
        name: 'Dark Grey Tuxedo',
        image: 'img/men/Tuxedos/image_15.jpeg',
        price: 2500,
        weeklyPrice: 6500,
        description: 'Elegant dark grey tuxedo perfect for formal events.',
        category: 'Tuxedo',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 20,
        name: ' Black Blazer',
        image: 'img/men/Blazer/image_1.jpg',
        price: 2200,
        weeklyPrice: 6000,
        description: 'Classic black blazer perfect for business and formal occasions.',
        category: 'Blazer',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 21,
        name: 'Celebrity Lehnga',
        image: 'img/women/lehnga/image_1.webp',
        price: 4500,
        weeklyPrice: 12000,
        description: 'Stunning celebrity-style lehnga perfect for weddings and special occasions.',
        category: 'Lehnga',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 22,
        name: 'Maroon Lehnga',
        image: 'img/women/lehnga/image_5.webp',
        price: 4500,
        weeklyPrice: 12000,
        description: 'Elegant maroon lehnga perfect for traditional celebrations.',
        category: 'Lehnga',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 23,
        name: 'Red Lehnga',
        image: 'img/women/lehnga/image_12.webp',
        price: 4500,
        weeklyPrice: 12000,
        description: 'Beautiful red lehnga perfect for bridal occasions and festivals.',
        category: 'Lehnga',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 24,
        name: 'Dark Blue Lehnga',
        image: 'img/women/lehnga/image_6.webp',
        price: 4500,
        weeklyPrice: 12000,
        description: 'Elegant dark blue lehnga perfect for traditional celebrations.',
        category: 'Lehnga',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 25,
        name: 'Light Pink Lehnga',
        image: 'img/women/lehnga/image_11.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Lehnga',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 26,
        name: 'Purple Lehnga',
        image: 'img/women/lehnga/image_8.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Lehnga',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 27,
        name: 'Black Lehnga',
        image: 'img/women/lehnga/image_4.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Lehnga',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 28,
        name: 'Brown Lehnga',
        image: 'img/women/lehnga/image_13.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Lehnga',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 29,
        name: 'Blue Lehnga',
        image: 'img/women/lehnga/image_21.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Lehnga',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 30,
        name: 'Dark Blue Gown',
        image: 'img/women/gown/image_1.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Gown',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 31,
        name: 'Red Gown',
        image: 'img/women/gown/image_13.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Gown',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 32,
        name: 'Maroon Gown',
        image: 'img/women/gown/image_5.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Gown',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 33,
        name: 'Beige Gown',
        image: 'img/women/gown/image_22.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Gown',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 34,
        name: 'Off-white Indowastern',
        image: 'img/men/indowastern/image_1.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Indowastern',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 35,
        name: 'Black indowastern',
        image: 'img/men/indowastern/image_9.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Indowastern',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 36,
        name: 'Green indowastern',
        image: 'img/men/indowastern/image_19.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Indowastern',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 37,
        name: 'Maroon indowastern',
        image: 'img/men/indowastern/image_27.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Indowastern',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 38,
        name: 'Blue indowastern',
        image: 'img/men/indowastern/image_29.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Indowastern',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 39,
        name: 'Pink indowastern',
        image: 'img/men/indowastern/image_35.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Indowastern',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 40,
        name: 'Peach indowastern',
        image: 'img/men/indowastern/image_33.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Indowastern',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 41,
        name: 'Red Anarkali',
        image: 'img/women/Anarkali/image_1.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Anarkali',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 42,
        name: 'White Anarkali',
        image: 'img/women/Anarkali/image_22.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Anarkali',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 43,
        name: 'Pink Anarkali',
        image: 'img/women/Anarkali/image_7.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Anarkali',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 44,
        name: 'Golden Anarkali',
        image: 'img/women/Anarkali/image_4.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Anarkali',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 45,
        name: 'White Sherwani',
        image: 'img/men/Sherwani/image_3.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Sherwani',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 46,
        name: 'Golden Sherwani',
        image: 'img/men/Sherwani/image_4.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Sherwani',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 47,
        name: 'Green Sherwani',
        image: 'img/men/Sherwani/image_7.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Sherwani',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 48,
        name: 'Peach Sherwani',
        image: 'img/men/Sherwani/image_9.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Sherwani',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 49,
        name: 'Cream Sherwani',
        image: 'img/men/Sherwani/image_1.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Sherwani',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 50,
        name: 'Black Suit',
        image: 'img/men/suits/image_33.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Suit',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 51,
        name: 'Black 3-piece suit',
        image: 'img/men/suits/image_3.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Suit',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 52,
        name: 'Blue Checks 3-piece suit',
        image: 'img/men/suits/image_9.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Suit',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 53,
        name: 'Brick Brown suit',
        image: 'img/men/suits/image_25.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Suit',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 54,
        name: 'Green suit',
        image: 'img/men/suits/image_35.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Suit',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 55,
        name: 'Dark Green suit',
        image: 'img/men/suits/image_31.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Suit',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 56,
        name: 'Red suit',
        image: 'img/men/suits/image_87.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Suit',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 57,
        name: 'Peach suit',
        image: 'img/men/suits/image_81.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Suit',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 58,
        name: 'Maroon suit',
        image: 'img/men/suits/image_62.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Suit',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 59,
        name: 'Grey suit',
        image: 'img/men/suits/image_53.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Suit',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 60,
        name: 'Green Blazer',
        image: 'img/men/Blazer/image_7.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Blazer',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 61,
        name: 'Maroon Blazer',
        image: 'img/men/Blazer/image_16.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Blazer',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 62,
        name: 'Peach Blazer',
        image: 'img/men/Blazer/image_21.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Blazer',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 63,
        name: 'Dark Blue Blazer',
        image: 'img/men/Blazer/image_26.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Blazer',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 64,
        name: 'Sky Blue Blazer',
        image: 'img/men/Blazer/image_28.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Blazer',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 65,
        name: 'Grey Blazer',
        image: 'img/men/Blazer/image_12.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Blazer',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 66,
        name: 'White Blazer',
        image: 'img/men/Blazer/image_30.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Blazer',
        size: 's',
        gender: 'men',
        available: true
    },
    {
        id: 67,
        name: 'Royal Purple Anarkali',
        image: 'img/women/Anarkali/image_15.jpg',
        price: 45,
        weeklyPrice: 120,
        description: 'Stunning royal purple Anarkali with intricate embroidery perfect for special occasions.',
        category: 'Anarkali',
        size: 'm',
        gender: 'women',
        available: true
    },
    {
        id: 68,
        name: 'Elegance Pista Green Gown',
        image: 'img/women/gown/image_25.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Gown',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 69,
        name: 'Mustard Gown',
        image: 'img/women/gown/image_24.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Gown',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 70,
        name: 'Purple Gown',
        image: 'img/women/gown/image_23.jpg',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Gown',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 71,
        name: 'Rose pink Anarkali',
        image: 'img/women/Anarkali/image_23.jpg',
        price: 45,
        weeklyPrice: 120,
        description: 'Stunning royal purple Anarkali with intricate embroidery perfect for special occasions.',
        category: 'Anarkali',
        size: 'm',
        gender: 'women',
        available: true,
    },
    {
        id: 72,
        name: 'Light Green Anarkali',
        image: 'img/women/Anarkali/image_25.jpg',
        price: 45,
        weeklyPrice: 120,
        description: 'Stunning royal purple Anarkali with intricate embroidery perfect for special occasions.',
        category: 'Anarkali',
        size: 'm',
        gender: 'women',
        available: true
    },
    {
        id: 73,
        name: 'White Embroidered Anarkali',
        image: 'img/women/Anarkali/image_24.jpg',
        price: 45,
        weeklyPrice: 120,
        description: 'Stunning royal purple Anarkali with intricate embroidery perfect for special occasions.',
        category: 'Anarkali',
        size: 'm',
        gender: 'women',
        available: true
    },
    {
        id: 74,
        name: 'Pink embroidered with dupatta Anarkali',
        image: 'img/women/Anarkali/image_26.webp',
        price: 45,
        weeklyPrice: 120,
        description: 'Stunning royal purple Anarkali with intricate embroidery perfect for special occasions.',
        category: 'Anarkali',
        size: 'm',
        gender: 'women',
        available: true
    },
    {
        id: 75,
        name: 'Elegant Black Anarkali with Jacket',
        image: 'img/women/Anarkali/image_27.webp',
        price: 45,
        weeklyPrice: 120,
        description: 'Stunning royal purple Anarkali with intricate embroidery perfect for special occasions.',
        category: 'Anarkali',
        size: 'm',
        gender: 'women',
        available: true
    },
    {
        id: 76,
        name: 'Yellow diamond net embroidered Anarkali',
        image: 'img/women/Anarkali/image_28.webp',
        price: 45,
        weeklyPrice: 120,
        description: 'Stunning royal purple Anarkali with intricate embroidery perfect for special occasions.',
        category: 'Anarkali',
        size: 'm',
        gender: 'women',
        available: true
    },
    {
        id: 77,
        name: 'Lavender Silk Anarkali',
        image: 'img/women/Anarkali/image_29.webp',
        price: 45,
        weeklyPrice: 120,
        description: 'Stunning royal purple Anarkali with intricate embroidery perfect for special occasions.',
        category: 'Anarkali',
        size: 'm',
        gender: 'women',
        available: true
    },
    {
        id: 78,
        name: 'Black Lehnga with net dupatta',
        image: 'img/women/lehnga/image_16.webp',
        price: 2800,  
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Lehnga',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 79,
        name: 'Beige gorgette Lehnga',
        image: 'img/women/lehnga/image_17.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Lehnga',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 80,
        name: 'Exquisite Cream Lehnga',
        image: 'img/women/lehnga/image_18.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Lehnga',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 81,
        name: 'Stunnig Yellow Gown',
        image: 'img/women/gown/image_17.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Gown',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 82,
        name: 'Light Blue indowestern Gown',
        image: 'img/women/gown/image_18.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Gown',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 83,
        name: 'Pestel Green long Gown',
        image: 'img/women/gown/image_19.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Gown',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 84,
        name: 'Graceful Rose Pink Sharara',
        image: 'img/women/sharara/image_1.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Sharara',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 85,
        name: 'Elegent Green Embroidered Sharara',
        image: 'img/women/sharara/image_2.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Sharara',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 86,
        name: 'Royal Peach Sharara with Dupatta',
        image: 'img/women/sharara/image_3.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Sharara',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 87,
        name: 'Dark Green Silk Sharara',
        image: 'img/women/sharara/image_4.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Sharara',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 88,
        name: 'Ocean Blue Sharara',
        image: 'img/women/sharara/image_5.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Sharara',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 89,
        name: 'Timeless Maroon Sharara',
        image: 'img/women/sharara/image_6.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Sharara',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 90,
        name: 'Mustard Floral Embroidered Sharara',
        image: 'img/women/sharara/image_7.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Sharara',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 91,
        name: 'Royal Grey Sharara',
        image: 'img/women/sharara/image_8.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Sharara',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 92,
        name: 'Purple Sharara with long Dupatta',
        image: 'img/women/sharara/image_9.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Sharara',
        size: 's',
        gender: 'women',
        available: true
    },
    {
        id: 93,
        name: 'Pastel Red Sharara',
        image: 'img/women/sharara/image_10.webp',
        price: 2800,
        weeklyPrice: 7500,
        description: 'Elegant traditional wear perfect for special occasions and celebrations.',
        category: 'Sharara',
        size: 's',
        gender: 'women',
        available: true
    }
];





// Make inventory data globally available
window.inventoryData = inventoryData;

// Enhanced function to get available sizes dynamically
function getAvailableSizes() {
    const sizes = new Set();
    inventoryData.forEach(item => {
        if (item.size) {
            sizes.add(item.size.toLowerCase());
        }
    });
    return Array.from(sizes).sort((a, b) => {
        const sizeOrder = ['xs', 's', 'm', 'l', 'xl', 'xxl'];
        return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
    });
}

// Function to update size filter options dynamically
function updateSizeFilterOptions() {
    const sizeFilter = document.getElementById('size-filter');
    if (!sizeFilter) return;

    const availableSizes = getAvailableSizes();
    const currentValue = sizeFilter.value;

    // Clear existing options except "All Sizes"
    sizeFilter.innerHTML = '<option value="all">All Sizes</option>';

    // Add available sizes
    availableSizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size.toUpperCase();
        sizeFilter.appendChild(option);
    });

    // Restore previous selection if still valid
    if (availableSizes.includes(currentValue)) {
        sizeFilter.value = currentValue;
    }
}

// Enhanced initialization function
function initializeInventory() {
    try {
        // Store in localStorage for other pages using shared system
        if (window.saveSharedInventoryData) {
            window.saveSharedInventoryData(inventoryData);
        } else {
            // Fallback to direct localStorage
            localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
        }

        // Initialize category options
        updateCategoryOptions('all');

        // Setup additional features
        try {
            addInventoryAnimations();
        } catch (error) {
            console.warn('Error adding animations:', error);
        }

        try {
            setupSearchButton();
        } catch (error) {
            console.warn('Error setting up search button:', error);
        }

    } catch (error) {
        console.error('Error in inventory initialization:', error);
        handleInventoryError(error, 'inventory initialization');
    }
}

// Create and display inventory items
function createInventoryItems(resetPagination = true) {
    console.log('createInventoryItems called with resetPagination:', resetPagination);
    
    const inventoryGrid = document.querySelector('.inventory-grid');
    if (!inventoryGrid) {
        console.error('Inventory grid not found!');
        return;
    }

    console.log('Inventory grid found, proceeding with item creation');

    // Reset pagination if needed
    if (resetPagination) {
        paginationState.currentPage = 1;
        inventoryGrid.innerHTML = '';
    }

    // Get filtered items
    const filteredItems = getFilteredItems();
    console.log('Filtered items count:', filteredItems.length);
    paginationState.filteredItems = filteredItems;
    paginationState.totalItems = filteredItems.length;

    // Determine items to show
    let itemsToShow;
    let animationStartIndex = 0;

    if (resetPagination) {
        // Initial load - show first page
        inventoryGrid.innerHTML = '';
        const startIndex = 0;
        const endIndex = paginationState.itemsPerPage;
        itemsToShow = filteredItems.slice(startIndex, endIndex);
    } else {
        // Load more - append new items
        const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
        const endIndex = paginationState.currentPage * paginationState.itemsPerPage;
        itemsToShow = filteredItems.slice(startIndex, endIndex);
        animationStartIndex = startIndex;
    }

    // Handle empty state
    if (itemsToShow.length === 0 && resetPagination) {
        inventoryGrid.innerHTML = `
            <div class="empty-state" style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
                color: var(--gray-color);
            ">
                <i class="fas fa-search" style="font-size: 4rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3 style="margin-bottom: 10px; color: var(--dark-color);">No items found</h3>
                <p style="margin-bottom: 20px;">Try adjusting your filters or search terms</p>
                <button onclick="resetFilters()" style="
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1rem;
                ">Reset Filters</button>
            </div>
        `;
        return;
    }

    // Create items to show
    console.log('Items to show:', itemsToShow.length);
    console.log('Sample item:', itemsToShow[0]);

    if (itemsToShow.length === 0) {
        console.warn('No items to show after filtering!');
        return;
    }

    itemsToShow.forEach((item, index) => {
        console.log(`Creating item ${index + 1}:`, item.name);
        // Skip if item already exists (safety check)
        if (document.querySelector(`[data-id="${item.id}"]`)) return;

        const itemElement = document.createElement('div');
        itemElement.className = resetPagination ? 'inventory-item' : 'inventory-item newly-loaded';
        itemElement.dataset.id = item.id;
        itemElement.dataset.gender = item.gender;
        itemElement.dataset.category = item.category;
        itemElement.dataset.size = item.size;

        // Add animation delay
        itemElement.style.animationDelay = `${(animationStartIndex + index) * 0.1}s`;

        // Add clickable styling and cursor
        itemElement.style.cursor = 'pointer';
        itemElement.title = 'Click to view details';

        itemElement.innerHTML = `
            <div class="item-image" style="background-image: url('${item.image}');">
                <img src="${item.image}" alt="${item.name}" loading="lazy" style="opacity: 0;">
                <div class="item-overlay" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.1);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 0.9rem;
                ">
                    <i class="fas fa-eye" style="margin-right: 5px;"></i>
                    View Details
                </div>
            </div>
            <div class="item-basic-info">
                <div class="item-content">
                    <div class="item-header">
                        <h3>${item.name}</h3>
                        <button class="wishlist-btn" data-id="${item.id}" title="Add to Wishlist">
                            <i class="far fa-heart"></i>
                            <div class="wishlist-ripple"></div>
                        </button>
                    </div>
                    <p class="item-description">${item.description}</p>
                    <div class="item-meta">
                        <span class="item-category">
                            <i class="fas fa-tag"></i>
                            ${getCategoryName(item.category)}
                        </span>
                        <span class="item-size">
                            <i class="fas fa-tshirt"></i>
                            Size ${item.size.toUpperCase()}
                        </span>
                        <span class="item-gender">
                            <i class="fas fa-${item.gender === 'women' ? 'female' : 'male'}"></i>
                            ${item.gender === 'women' ? "Women's" : "Men's"}
                        </span>
                    </div>
                    <div class="item-availability">
                        <span class="${item.available ? 'available' : 'unavailable'}">
                            <i class="fas fa-${item.available ? 'check-circle' : 'times-circle'}"></i>
                            ${item.available ? 'Available' : 'Currently Unavailable'}
                        </span>
                    </div>
                </div>
                <div class="item-pricing">
                    <p class="price">₹${item.price}/day</p>
                    <p class="weekly-price">₹${item.weeklyPrice}/week</p>
                </div>
                <button class="rent-btn ${!item.available ? 'disabled' : ''}" 
                        data-id="${item.id}" 
                        ${!item.available ? 'disabled' : ''}>
                    <span>${item.available ? 'Rent Now' : 'Unavailable'}</span>
                </button>
            </div>
        `;

        inventoryGrid.appendChild(itemElement);
        console.log(`Item ${item.name} added to grid`);
    });

    console.log('All items added to grid. Grid children count:', inventoryGrid.children.length);

    // Update pagination controls
    updatePaginationControls();

    // Initialize wishlist buttons
    setTimeout(() => {
        initializeWishlistButtons();
    }, 100);
}

// Enhanced filtering function
function getFilteredItems() {
    console.log('getFilteredItems called');
    console.log('inventoryData exists:', !!inventoryData);
    console.log('inventoryData length:', inventoryData ? inventoryData.length : 'undefined');
    
    if (!inventoryData || inventoryData.length === 0) {
        console.error('No inventory data available!');
        return [];
    }

    let filteredItems = [...inventoryData];

    // Gender filter
    if (currentFilters.gender !== 'all') {
        filteredItems = filteredItems.filter(item => item.gender === currentFilters.gender);
    }

    // Category filter
    if (currentFilters.category !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === currentFilters.category);
    }

    // Search filter
    if (currentFilters.search !== '') {
        filteredItems = filteredItems.filter(item =>
            item.name.toLowerCase().includes(currentFilters.search) ||
            item.description.toLowerCase().includes(currentFilters.search) ||
            item.category.toLowerCase().includes(currentFilters.search)
        );
    }

    return filteredItems;
}

// Apply sorting to items
function applySortingToItems(items) {
    return items.sort((a, b) => {
        switch (currentFilters.sort) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'newest':
                return b.id - a.id;
            default: // popularity
                return a.id - b.id;
        }
    });
}

// Update pagination controls
function updatePaginationControls() {
    const inventoryGrid = document.querySelector('.inventory-grid');
    if (!inventoryGrid) return;

    // Remove existing controls
    const existingControls = document.querySelector('.pagination-controls');
    if (existingControls) {
        existingControls.remove();
    }

    // Update header count
    updateInventoryHeader();

    // Check if more items are available
    const currentlyShown = Math.min(paginationState.currentPage * paginationState.itemsPerPage, paginationState.totalItems);
    const hasMoreItems = currentlyShown < paginationState.totalItems;

    if (hasMoreItems) {
        // Create pagination controls
        const paginationControls = document.createElement('div');
        paginationControls.className = 'pagination-controls';

        const remainingItems = paginationState.totalItems - currentlyShown;
        const nextBatchSize = Math.min(paginationState.itemsPerPage, remainingItems);

        paginationControls.innerHTML = `
            <div class="pagination-info">
                <p>Showing ${currentlyShown} of ${paginationState.totalItems} items</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(currentlyShown / paginationState.totalItems) * 100}%"></div>
                </div>
            </div>
            <button class="load-more-btn">
                Load More
            </button>
        `;

        inventoryGrid.parentNode.insertBefore(paginationControls, inventoryGrid.nextSibling);

        // Add load more event
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMoreItems);
        }
    } else if (paginationState.totalItems > 0) {
        // Show completion message
        const paginationControls = document.createElement('div');
        paginationControls.className = 'pagination-controls';
        paginationControls.innerHTML = `
            <div class="pagination-complete">
                <p><i class="fas fa-check-circle"></i> All items loaded</p>
                <button class="back-to-top-btn" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
                    <i class="fas fa-arrow-up"></i> Back to Top
                </button>
            </div>
        `;
        inventoryGrid.parentNode.insertBefore(paginationControls, inventoryGrid.nextSibling);
    }
}

// Update inventory header count
function updateInventoryHeader() {
    const header = document.querySelector('.inventory-header h1');
    if (header) {
        header.textContent = 'Inventory';
    }
}

// Load more items
function loadMoreItems() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        // Show loading state
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadMoreBtn.disabled = true;
    }

    // Simulate loading for better UX
    setTimeout(() => {
        const previousItemCount = document.querySelectorAll('.inventory-item').length;
        paginationState.currentPage++;
        createInventoryItems(false); // Don't reset pagination

        // Scroll to first new item
        setTimeout(() => {
            const allItems = document.querySelectorAll('.inventory-item');
            if (allItems.length > previousItemCount) {
                const firstNewItem = allItems[previousItemCount];
                if (firstNewItem) {
                    firstNewItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }, 200);
    }, 800);
}

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            currentFilters.search = this.value.toLowerCase();
            applyFilters();
        });
    }

    // Gender filter
    const genderSelect = document.getElementById('gender-select');
    if (genderSelect) {
        genderSelect.addEventListener('change', function () {
            currentFilters.gender = this.value;
            updateCategoryOptions(this.value);
            applyFilters();
        });
    }

    // Category filter
    const categorySelect = document.getElementById('category-select');
    if (categorySelect) {
        categorySelect.addEventListener('change', function () {
            currentFilters.category = this.value;
            applyFilters();
        });
    }

    // Rental duration change listener
    const rentalDuration = document.getElementById('rental-duration');
    if (rentalDuration) {
        rentalDuration.addEventListener('change', updateRentalSummary);
    }

    // Event delegation for dynamic buttons
    document.addEventListener('click', function (e) {
        // Handle rent button clicks
        if (e.target.classList.contains('rent-btn') && !e.target.disabled) {
            e.stopPropagation(); // Prevent card click
            const itemId = parseInt(e.target.dataset.id);
            handleRentClick(itemId, e.target);
            return;
        }

        // Handle wishlist button clicks
        if (e.target.classList.contains('wishlist-btn') || e.target.parentElement.classList.contains('wishlist-btn')) {
            e.stopPropagation(); // Prevent card click
            const button = e.target.classList.contains('wishlist-btn') ? e.target : e.target.parentElement;
            const itemId = parseInt(button.dataset.id);
            handleWishlistClick(itemId, button);
            return;
        }

        // Handle inventory card clicks (navigate to product details)
        const inventoryCard = e.target.closest('.inventory-item');
        if (inventoryCard && !e.target.closest('.rent-btn, .wishlist-btn')) {
            const itemId = parseInt(inventoryCard.dataset.id);
            handleCardClick(itemId);
        }
    });
}

// Global function to test rent button functionality
window.testRentButton = function(itemId) {
    console.log('🧪 Testing rent button for item ID:', itemId);
    
    if (!itemId) {
        // Use first available item
        const firstItem = inventoryData.find(item => item.available);
        if (firstItem) {
            itemId = firstItem.id;
            console.log('Using first available item:', firstItem.name);
        } else {
            console.error('No available items found');
            return;
        }
    }
    
    const button = document.querySelector(`[data-id="${itemId}"].rent-btn`);
    if (button) {
        console.log('Found rent button, triggering click...');
        handleRentClick(itemId, button);
    } else {
        console.error('Rent button not found for item ID:', itemId);
    }
};

// Global function to debug rent button functionality
window.debugRentButtons = function() {
    console.log('🔍 Debugging rent button functionality...');
    
    const rentButtons = document.querySelectorAll('.rent-btn');
    console.log('Total rent buttons found:', rentButtons.length);
    
    rentButtons.forEach((button, index) => {
        const itemId = button.dataset.id;
        const isDisabled = button.disabled;
        const buttonText = button.textContent.trim();
        
        console.log(`Button ${index + 1}:`, {
            itemId,
            isDisabled,
            buttonText,
            element: button
        });
    });
    
    console.log('Available items:', inventoryData.filter(item => item.available).length);
    console.log('Total items:', inventoryData.length);
    
    return {
        totalButtons: rentButtons.length,
        availableItems: inventoryData.filter(item => item.available).length,
        totalItems: inventoryData.length
    };
};

// Add inventory animations
function addInventoryAnimations() {
    const inventoryItems = document.querySelectorAll('.inventory-item');

    inventoryItems.forEach(item => {
        const overlay = item.querySelector('.item-overlay');

        // Add hover effects
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            if (overlay) {
                overlay.style.opacity = '1';
            }
        });

        item.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
    });
}

// Apply filters function
function applyFilters() {
    console.log('Applying filters:', currentFilters);
    // Reset pagination and recreate items with current filters
    createInventoryItems(true);
}

// Get category display name
function getCategoryName(category) {
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
    return categoryNames[category] || category;
}

// Handle rent button click
function handleRentClick(itemId, button) {
    const item = inventoryData.find(i => i.id === itemId);
    if (!item || !item.available) {
        showNotification('This item is currently unavailable', 'error');
        return;
    }

    console.log('🎯 Rent Now button clicked for item:', item.name);

    // Add visual feedback to button
    button.style.transform = 'scale(0.95)';
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;

    // Store comprehensive item data for product details page
    const itemData = {
        ...item,
        selectedDate: new Date().toISOString().split('T')[0],
        rentalType: 'daily',
        source: 'rent-now-button',
        timestamp: new Date().toISOString()
    };

    // Store in multiple places for reliability
    localStorage.setItem('selectedItem', JSON.stringify(itemData));
    localStorage.setItem('currentItem', JSON.stringify(item));
    localStorage.setItem('productDetailsItem', JSON.stringify(itemData));

    console.log('💾 Item data stored for product details:', itemData);

    // Show loading notification
    showNotification('Opening product details...', 'info');

    // Navigate to product details page with slight delay for UX
    setTimeout(() => {
        console.log('🔄 Redirecting to product details page...');
        
        try {
            // Primary redirect to product details
            window.location.href = `product-details.html?id=${itemId}`;
        } catch (error) {
            console.error('❌ Error redirecting to product details:', error);
            
            // Fallback: Reset button and show modal
            button.style.transform = '';
            button.innerHTML = '<span>Rent Now</span>';
            button.disabled = false;
            
            showNotification('Opening rental options...', 'info');
            showRentalModal(item);
        }
    }, 500);
}

// Handle inventory card click - navigate to product details
function handleCardClick(itemId) {
    const item = inventoryData.find(i => i.id === itemId);
    if (!item) {
        showNotification('Item not found', 'error');
        return;
    }

    // Store comprehensive item data for product details page
    const itemData = {
        ...item,
        selectedDate: new Date().toISOString().split('T')[0],
        rentalType: 'daily'
    };

    // Store in multiple places for reliability
    localStorage.setItem('selectedItem', JSON.stringify(itemData));
    localStorage.setItem('currentItem', JSON.stringify(item));

    // Add visual feedback
    const card = document.querySelector(`[data-id="${itemId}"]`);
    if (card) {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }

    // Show loading notification
    showNotification('Loading product details...', 'info');

    // Navigate to product details page
    setTimeout(() => {
        window.location.href = `product-details.html?id=${itemId}`;
    }, 300);
}

// Enhanced Wishlist functionality
function handleWishlistClick(itemId, button) {
    const item = inventoryData.find(i => i.id === itemId);
    if (!item) return;

    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const existingIndex = wishlist.findIndex(w => w.id === itemId);

    // Add click animation
    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);

    if (existingIndex !== -1) {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);

        button.classList.remove('in-wishlist');
        button.title = 'Add to Wishlist';

        showNotification(`${item.name} removed from wishlist`, 'info');
    } else {
        // Add to wishlist with animation
        const wishlistItem = {
            id: item.id,
            name: item.name,
            image: item.image,
            price: item.price,
            weeklyPrice: item.weeklyPrice,
            description: item.description,
            category: item.category,
            size: item.size,
            gender: item.gender,
            available: item.available,
            addedAt: new Date().toISOString()
        };

        wishlist.push(wishlistItem);

        button.classList.add('in-wishlist');
        button.title = 'Remove from Wishlist';

        // Create floating heart effect
        createFloatingHeart(button);

        showNotification(`${item.name} added to wishlist`, 'success');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

// Create floating heart animation
function createFloatingHeart(button) {
    const heart = document.createElement('div');
    heart.innerHTML = '<i class="fas fa-heart"></i>';
    heart.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #D76D77;
        font-size: 20px;
        pointer-events: none;
        z-index: 1000;
        animation: floatingHeartEffect 1.5s ease-out forwards;
    `;

    button.appendChild(heart);

    // Remove after animation
    setTimeout(() => {
        if (document.body.contains(heart)) {
            heart.remove();
        }
    }, 1500);
}

// Initialize wishlist buttons
function initializeWishlistButtons() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    document.querySelectorAll('.wishlist-btn').forEach(button => {
        const itemId = parseInt(button.dataset.id);
        const isInWishlist = wishlist.some(item => item.id === itemId);

        if (isInWishlist) {
            button.innerHTML = '<i class="fas fa-heart"></i><div class="wishlist-ripple"></div>';
            button.classList.add('in-wishlist');
            button.title = 'Remove from Wishlist';
        } else {
            button.innerHTML = '<i class="far fa-heart"></i><div class="wishlist-ripple"></div>';
            button.classList.remove('in-wishlist');
            button.title = 'Add to Wishlist';
        }
    });
}

// Update wishlist count in header
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistCount = document.querySelector('#header-wishlist-count');

    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.style.display = wishlist.length > 0 ? 'inline' : 'none';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#2ed573' : '#3742fa'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; margin-left: auto; cursor: pointer; opacity: 0.8;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

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

// Setup modal handlers
function setupModalHandlers() {
    try {
        const modal = document.getElementById('rental-modal');
        const closeBtn = document.querySelector('.close-modal');
        
        // Initialize rental integration system
        if (!window.rentalIntegration) {
            window.rentalIntegration = new RentalIntegrationSystem();
        }

        // Close modal handlers
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Click outside to close
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }

        // Handle rental form submission
        const rentalForm = document.getElementById('rental-form');
        if (rentalForm) {
            rentalForm.addEventListener('submit', handleRentalFormSubmit);
        }

    } catch (error) {
        console.error('Error setting up modal handlers:', error);
    }
}

function closeModal() {
    const modal = document.getElementById('rental-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function showRentalModal(item) {
    const modal = document.getElementById('rental-modal');
    const itemDetails = document.getElementById('rental-item-details');

    if (!modal || !itemDetails) return;

    // Populate item details
    itemDetails.innerHTML = `
        <div class="rental-item-display">
            <div class="rental-item-image" style="background-image: url('${item.image}');"></div>
            <div class="rental-item-info">
                <h3>${item.name}</h3>
                <p class="rental-item-description">${item.description}</p>
                <div class="rental-item-meta">
                    <span class="item-category">
                        <i class="fas fa-tag"></i>
                        ${getCategoryName(item.category)}
                    </span>
                    <span class="item-size">
                        <i class="fas fa-tshirt"></i>
                        Size ${item.size.toUpperCase()}
                    </span>
                    <span class="item-gender">
                        <i class="fas fa-${item.gender === 'women' ? 'female' : 'male'}"></i>
                        ${item.gender === 'women' ? "Women's" : "Men's"}
                    </span>
                </div>
                <div class="rental-item-pricing">
                    <p class="daily-price">₹${item.price}/day</p>
                    <p class="weekly-price">₹${item.weeklyPrice}/week</p>
                </div>
            </div>
        </div>
    `;

    // Set minimum date to today
    const startDateInput = document.getElementById('rental-start-date');
    if (startDateInput) {
        const today = new Date().toISOString().split('T')[0];
        startDateInput.min = today;
        startDateInput.value = today;
    }

    // Store current item for form submission
    modal.dataset.itemId = item.id;

    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Update rental summary
    updateRentalSummary();
}

function updateRentalSummary() {
    const modal = document.getElementById('rental-modal');
    const itemId = parseInt(modal.dataset.itemId);
    const item = inventoryData.find(i => i.id === itemId);

    if (!item) return;

    const duration = document.getElementById('rental-duration').value;
    const summaryItemName = document.getElementById('summary-item-name');
    const summaryDuration = document.getElementById('summary-duration');
    const summaryCost = document.getElementById('summary-cost');

    if (summaryItemName) summaryItemName.textContent = item.name;
    if (summaryDuration) summaryDuration.textContent = `${duration} day${duration > 1 ? 's' : ''}`;

    let totalCost;
    if (duration >= 7) {
        const weeks = Math.ceil(duration / 7);
        totalCost = weeks * item.weeklyPrice;
    } else {
        totalCost = duration * item.price;
    }

    if (summaryCost) summaryCost.textContent = `₹${totalCost}`;
}

function handleRentalFormSubmit(e) {
    e.preventDefault();

    const modal = document.getElementById('rental-modal');
    const itemId = parseInt(modal.dataset.itemId);
    const item = inventoryData.find(i => i.id === itemId);

    if (!item) return;

    const startDate = document.getElementById('rental-start-date').value;
    const duration = parseInt(document.getElementById('rental-duration').value);
    const notes = document.getElementById('rental-notes').value;
    const totalCostText = document.getElementById('summary-cost').textContent;
    const totalCost = parseFloat(totalCostText.replace('₹', ''));

    // Calculate end date
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);

    // Create rental data for integration system
    const rentalData = {
        productId: itemId,
        productName: item.name,
        productImage: item.image,
        category: item.category,
        size: item.size,
        startDate: startDate,
        endDate: endDate.toISOString().split('T')[0],
        days: duration,
        rentalFee: item.price,
        totalCost: totalCost,
        specialRequests: notes,
        quantity: 1
    };

    try {
        // Create rental using integration system
        if (window.rentalIntegration) {
            const rental = window.rentalIntegration.createRental(rentalData);
            
            // Don't update item availability yet - wait for payment completion
            // updateItemAvailability(itemId, false);
            
            // Store rental data for payment page
            localStorage.setItem('rentalData', JSON.stringify({
                rentalId: rental.id,
                ...rentalData
            }));

            // Close modal and show success
            closeModal();
            showNotification('Rental created successfully! Proceeding to payment...', 'success');

            // Add quick action to view rental status
            setTimeout(() => {
                showRentalSuccessActions(rental.id);
            }, 1500);

            setTimeout(() => {
                window.location.href = 'payment.html';
            }, 3000);
        } else {
            // Fallback to old system
            localStorage.setItem('rentalData', JSON.stringify(rentalData));
            closeModal();
            showNotification('Proceeding to payment...', 'success');
            setTimeout(() => {
                window.location.href = 'payment.html';
            }, 1000);
        }
    } catch (error) {
        console.error('Error creating rental:', error);
        showNotification('Error creating rental. Please try again.', 'error');
    }
}

// Update item availability in inventory
function updateItemAvailability(itemId, isAvailable) {
    const itemIndex = inventoryData.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        inventoryData[itemIndex].available = isAvailable;
        
        // Save updated inventory
        if (window.saveSharedInventoryData) {
            window.saveSharedInventoryData(inventoryData);
        }
        
        // Refresh the display
        createInventoryItems(true);
    }
}

// Show rental success actions
function showRentalSuccessActions(rentalId) {
    const actionsHtml = `
        <div class="rental-success-actions" style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            text-align: center;
            min-width: 300px;
        ">
            <h3 style="color: #28a745; margin-bottom: 15px;">
                <i class="fas fa-check-circle"></i> Rental Created!
            </h3>
            <p style="margin-bottom: 20px;">Rental ID: <strong>${rentalId}</strong></p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="window.location.href='rental-status.html'" class="btn" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                ">
                    <i class="fas fa-clock"></i> View Status
                </button>
                <button onclick="this.parentElement.parentElement.remove()" class="btn" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                ">
                    Continue
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', actionsHtml);
}

// Check and show rental status notification
function checkAndShowRentalStatusNotification() {
    try {
        if (window.rentalIntegration) {
            const activeRentals = window.rentalIntegration.getRentalsByCategory('active');
            const upcomingRentals = window.rentalIntegration.getRentalsByCategory('upcoming');
            
            const totalActiveRentals = activeRentals.length + upcomingRentals.length;
            
            if (totalActiveRentals > 0) {
                // Create rental status indicator
                const statusIndicator = document.createElement('div');
                statusIndicator.className = 'rental-status-indicator';
                statusIndicator.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
                    z-index: 1000;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    max-width: 250px;
                `;
                
                statusIndicator.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-clock" style="font-size: 20px;"></i>
                        <div>
                            <div style="font-weight: bold; font-size: 14px;">Active Rentals</div>
                            <div style="font-size: 12px; opacity: 0.9;">${totalActiveRentals} rental${totalActiveRentals !== 1 ? 's' : ''} in progress</div>
                        </div>
                        <i class="fas fa-chevron-right" style="margin-left: auto;"></i>
                    </div>
                `;
                
                statusIndicator.addEventListener('click', () => {
                    window.location.href = 'rental-status.html';
                });
                
                statusIndicator.addEventListener('mouseenter', () => {
                    statusIndicator.style.transform = 'translateY(-2px)';
                    statusIndicator.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.4)';
                });
                
                statusIndicator.addEventListener('mouseleave', () => {
                    statusIndicator.style.transform = 'translateY(0)';
                    statusIndicator.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.3)';
                });
                
                document.body.appendChild(statusIndicator);
                
                // Auto-hide after 10 seconds
                setTimeout(() => {
                    if (document.body.contains(statusIndicator)) {
                        statusIndicator.style.opacity = '0';
                        statusIndicator.style.transform = 'translateX(100%)';
                        setTimeout(() => {
                            if (document.body.contains(statusIndicator)) {
                                statusIndicator.remove();
                            }
                        }, 300);
                    }
                }, 10000);
            }
        }
    } catch (error) {
        console.warn('Error checking rental status:', error);
    }
}

// Make resetFilters globally available
window.resetFilters = function () {
    // Reset all filters
    currentFilters = {
        gender: 'all',
        category: 'all',
        search: ''
    };

    // Reset UI elements
    const searchInput = document.getElementById('search-input');
    const genderSelect = document.getElementById('gender-select');
    const categorySelect = document.getElementById('category-select');

    if (searchInput) searchInput.value = '';
    if (genderSelect) genderSelect.value = 'all';
    if (categorySelect) {
        updateCategoryOptions('all');
        categorySelect.value = 'all';
    }

    // Apply filters
    applyFilters();

    // Show notification
    showNotification('Filters reset successfully', 'info');
};

// Add search button functionality
function setupSearchButton() {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function () {
            currentFilters.search = searchInput.value.toLowerCase();
            applyFilters();
        });

        // Also trigger search on Enter key
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                currentFilters.search = this.value.toLowerCase();
                applyFilters();
            }
        });
    }
}

// Enhanced error handling
function handleInventoryError(error, context = 'inventory') {
    console.error(`Error in ${context}:`, error);
    showNotification(`An error occurred while loading ${context}. Please refresh the page.`, 'error');
}

// Add loading state management
function setLoadingState(isLoading) {
    const inventoryGrid = document.querySelector('.inventory-grid');
    if (!inventoryGrid) return;

    if (isLoading) {
        inventoryGrid.style.opacity = '0.6';
        inventoryGrid.style.pointerEvents = 'none';
    } else {
        inventoryGrid.style.opacity = '1';
        inventoryGrid.style.pointerEvents = 'auto';
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }

    @keyframes floatingHeartEffect {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        50% {
            opacity: 0.8;
            transform: translateY(-30px) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translateY(-60px) scale(0.8);
        }
    }
`;

document.head.appendChild(style);

// Initialize wishlist count on page load
document.addEventListener('DOMContentLoaded', function () {
    updateWishlistCount();
});// Inventory verification function
function verifyInventoryIntegration() {
    console.log('=== INVENTORY INTEGRATION VERIFICATION ===');
    console.log('Total inventory items:', inventoryData.length);
    console.log('Expected: 67 items');
    console.log('Status:', inventoryData.length === 67 ? '✅ CORRECT' : '❌ INCORRECT');

    // Category breakdown
    const categories = {};
    const genders = {};

    inventoryData.forEach(item => {
        categories[item.category] = (categories[item.category] || 0) + 1;
        genders[item.gender] = (genders[item.gender] || 0) + 1;
    });

    console.log('Categories:', categories);
    console.log('Gender distribution:', genders);
    console.log('First item:', inventoryData[0]?.name);
    console.log('Last item:', inventoryData[inventoryData.length - 1]?.name);
    console.log('=== VERIFICATION COMPLETE ===');

    return {
        totalItems: inventoryData.length,
        isCorrect: inventoryData.length === 67,
        categories,
        genders,
        firstItem: inventoryData[0]?.name,
        lastItem: inventoryData[inventoryData.length - 1]?.name
    };
}

// Function to update all inventory prices based on category
function updateInventoryPricing() {
    inventoryData.forEach(item => {
        const pricing = categoryPricing[item.category];
        if (pricing) {
            item.price = pricing.daily;
            item.weeklyPrice = pricing.weekly;
        } else {
            console.warn(`No pricing found for category: ${item.category}`);
        }
    });
    
    // Save updated inventory
    if (window.saveSharedInventoryData) {
        window.saveSharedInventoryData(inventoryData);
    } else {
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
    }
    
    console.log('Inventory pricing updated successfully!');
    return inventoryData;
}

// Make functions globally available
window.verifyInventoryIntegration = verifyInventoryIntegration;
window.updateInventoryPricing = updateInventoryPricing;

// Auto-run pricing update when inventory initializes
document.addEventListener('DOMContentLoaded', function() {
    // Update pricing on page load
    setTimeout(() => {
        updateInventoryPricing();
        console.log('Inventory pricing automatically updated to new Indian Rupees structure');
    }, 500);
});

// Auto-run verification when inventory initializes
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(verifyInventoryIntegration, 1000);
});
