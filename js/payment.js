// Payment Processing JavaScript - Updated with Rental Integration

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const paymentForm = document.getElementById('payment-form');
    const orderSummary = document.getElementById('order-summary');
    const itemDetails = document.getElementById('item-details');
    const rentalDetails = document.getElementById('rental-details');
    const costBreakdown = document.getElementById('cost-breakdown');
    const totalAmount = document.getElementById('total-amount');
    const confirmationModal = document.getElementById('payment-confirmation-modal');
    const confirmationDetails = document.getElementById('confirmation-details');
    const confirmationId = document.getElementById('confirmation-id');
    const confirmationTotal = document.getElementById('confirmation-total');
    const confirmationDate = document.getElementById('confirmation-date');

    // Initialize payment page enhancements
    initializePaymentEnhancements();

    // Get rental data from localStorage (from product details or cart)
    let rentalData = JSON.parse(localStorage.getItem('currentRental'));
    let cartData = JSON.parse(localStorage.getItem('checkoutCart'));
    let selectedItem = JSON.parse(localStorage.getItem('selectedItem'));
    let isCartCheckout = false;

    // Enhanced data retrieval - check multiple sources
    if (!rentalData && selectedItem) {
        // If no rental data but we have selected item, create rental data from it
        rentalData = createRentalDataFromSelectedItem(selectedItem);
        console.log('Created rental data from selected item:', rentalData);
    }

    // Check if this is a cart checkout
    if (!rentalData && cartData && cartData.length > 0) {
        isCartCheckout = true;
        // For cart checkout, we'll process multiple items
        displayCartCheckout(cartData);
    } else if (rentalData) {
        // Single item checkout
        displaySingleItemCheckout(rentalData);
    } else {
        // No rental data found, redirect to inventory
        console.log('No rental data found, redirecting to inventory');
        showNotification('No item selected for rental. Redirecting to inventory...', 'error');
        setTimeout(() => {
            window.location.href = 'inventory.html';
        }, 2000);
        return;
    }

    // Function to create rental data from selected inventory item
    function createRentalDataFromSelectedItem(item) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date(tomorrow);
        dayAfter.setDate(dayAfter.getDate() + 1);

        return {
            productId: item.id,
            productName: item.name,
            productImage: item.image,
            category: item.category,
            size: item.size || 'M',
            startDate: tomorrow.toISOString().split('T')[0],
            endDate: dayAfter.toISOString().split('T')[0],
            quantity: 1,
            rentalFee: item.price,
            totalCost: calculateEstimatedTotal(item.price),
            days: 1,
            specialRequests: '',
            description: item.description,
            gender: item.gender,
            weeklyPrice: item.weeklyPrice || item.price * 6.2,
            available: item.available
        };
    }

    // Function to calculate estimated total cost
    function calculateEstimatedTotal(dailyPrice) {
        const damageProtection = Math.round(dailyPrice * 0.15);
        const deliveryFee = dailyPrice >= 100 ? 0 : 10;
        const tax = Math.round((dailyPrice + damageProtection + deliveryFee) * 0.08);
        return dailyPrice + damageProtection + deliveryFee + tax;
    }

    // Handle payment form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (isCartCheckout) {
                processCartPayment(cartData);
            } else {
                processSinglePayment(rentalData);
            }
        });
    }

    // Function to display single item checkout
    function displaySingleItemCheckout(rental) {
        displayRentalDetails(rental);
    }

    // Enhanced Payment Page Initialization
    function initializePaymentEnhancements() {
        console.log('Initializing payment page enhancements...');

        // Auto-import user data and payment methods
        autoImportUserData();
        autoImportPaymentMethods();

        // Add interactive form enhancements
        addFormInteractivity();

        // Initialize payment method selector
        initializePaymentMethodSelector();

        // Add form validation
        addFormValidation();

        console.log('Payment page enhancements initialized');
    }

    // Auto-import user data from profile (simplified)
    function autoImportUserData() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
            const userData = JSON.parse(localStorage.getItem('userData')) || {};

            // Merge user data
            const user = { ...userData, ...currentUser };

            console.log('Auto-importing user data:', user);

            // Since we removed the form fields, we'll store user data for later use
            window.currentUserData = user;

            showNotification('User information loaded from profile', 'success');
        } catch (error) {
            console.error('Error importing user data:', error);
        }
    }

    // Auto-import payment methods from profile
    function autoImportPaymentMethods() {
        try {
            const paymentMethods = JSON.parse(localStorage.getItem('userPaymentMethods')) || [];

            if (paymentMethods.length > 0) {
                console.log('Found saved payment methods:', paymentMethods);

                // Find default payment method
                const defaultMethod = paymentMethods.find(method => method.isDefault) || paymentMethods[0];

                if (defaultMethod) {
                    // Show payment method selector
                    createPaymentMethodSelector(paymentMethods, defaultMethod);

                    showNotification(`Payment method "${defaultMethod.type}" imported from profile`, 'info');
                }
            } else {
                console.log('No saved payment methods found');
                // Create payment type selector even without saved methods
                createPaymentTypeSelector();
            }
        } catch (error) {
            console.error('Error importing payment methods:', error);
        }
    }

    // Create enhanced payment method selector with UPI support
    function createPaymentMethodSelector(paymentMethods, defaultMethod) {
        const cardSection = document.querySelector('.form-section h3');
        if (!cardSection) return;

        // Create selector container
        const selectorContainer = document.createElement('div');
        selectorContainer.className = 'payment-method-selector';
        selectorContainer.innerHTML = `
            <div class="saved-methods">
                <h4><i class="fas fa-credit-card"></i> Saved Payment Methods</h4>
                <div class="method-options">
                    ${paymentMethods.map(method => `
                        <div class="method-option ${method.isDefault ? 'selected' : ''}" data-method-id="${method.id}" data-method-type="${method.type}">
                            <div class="method-info">
                                <div class="method-type">
                                    ${getPaymentMethodIcon(method.type)}
                                    ${method.type}
                                </div>
                                <div class="method-details">
                                    ${method.type === 'UPI' ? method.upiId || method.cardNumber : method.cardNumber}
                                    ${method.type !== 'UPI' ? `<span class="expiry">Exp: ${method.expiryDate}</span>` : ''}
                                </div>
                            </div>
                            <div class="method-actions">
                                <button type="button" class="btn-select ${method.isDefault ? 'selected' : ''}">
                                    ${method.isDefault ? 'Selected' : 'Select'}
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="method-actions-footer">
                    <button type="button" class="btn secondary" id="use-new-payment">
                        <i class="fas fa-plus"></i> Use New Payment Method
                    </button>
                    <button type="button" class="btn primary" id="manage-methods" onclick="window.open('profile.html?section=payment-methods', '_blank')">
                        <i class="fas fa-cog"></i> Manage Methods
                    </button>
                </div>
            </div>
        `;

        // Insert before card details section
        cardSection.parentNode.insertBefore(selectorContainer, cardSection);

        // Create payment type selector
        createPaymentTypeSelector();

        // Add event listeners
        setupPaymentMethodSelector();
    }

    // Get payment method icon
    function getPaymentMethodIcon(type) {
        switch (type) {
            case 'Credit Card':
                return '<i class="fab fa-cc-visa"></i>';
            case 'Debit Card':
                return '<i class="fab fa-cc-mastercard"></i>';
            case 'UPI':
                return '<i class="fas fa-mobile-alt"></i>';
            default:
                return '<i class="fas fa-credit-card"></i>';
        }
    }

    // Create payment type selector
    function createPaymentTypeSelector() {
        const additionalSection = document.querySelector('.form-section h3');
        if (!additionalSection) return;

        // Create payment type selector
        const typeSelector = document.createElement('div');
        typeSelector.className = 'payment-type-selector';
        typeSelector.innerHTML = `
            <div class="payment-types">
                <h4><i class="fas fa-payment"></i> Choose Payment Method</h4>
                <div class="type-options">
                    <div class="type-option active" data-type="card">
                        <div class="type-icon">
                            <i class="fas fa-credit-card"></i>
                        </div>
                        <div class="type-info">
                            <h5>Card Payment</h5>
                            <p>Credit or Debit Card</p>
                        </div>
                    </div>
                    <div class="type-option" data-type="upi">
                        <div class="type-icon">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <div class="type-info">
                            <h5>UPI Payment</h5>
                            <p>Pay using UPI ID</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert before additional information section
        additionalSection.parentNode.insertBefore(typeSelector, additionalSection.parentNode.firstChild);

        // Setup type selector
        setupPaymentTypeSelector();
    }

    // Setup payment type selector
    function setupPaymentTypeSelector() {
        const typeOptions = document.querySelectorAll('.type-option');
        const cardFields = document.querySelector('.card-fields') || createCardFields();
        const upiFields = createUpiFields();

        typeOptions.forEach(option => {
            option.addEventListener('click', function () {
                // Remove active class from all options
                typeOptions.forEach(opt => opt.classList.remove('active'));

                // Add active class to selected option
                this.classList.add('active');

                const selectedType = this.dataset.type;

                if (selectedType === 'card') {
                    cardFields.style.display = 'block';
                    upiFields.style.display = 'none';
                    showNotification('Card payment selected', 'info');
                } else if (selectedType === 'upi') {
                    cardFields.style.display = 'none';
                    upiFields.style.display = 'block';
                    showNotification('UPI payment selected', 'info');
                }
            });
        });
    }

    // Create card fields container
    function createCardFields() {
        const existingCardFields = document.querySelector('.card-fields');
        if (existingCardFields) return existingCardFields;

        const cardFields = document.createElement('div');
        cardFields.className = 'card-fields payment-fields';
        cardFields.innerHTML = `
            <div class="form-group">
                <label for="card-name">
                    <i class="fas fa-user"></i>
                    Name on Card
                </label>
                <input type="text" id="card-name" placeholder="John Doe" required>
            </div>
            <div class="form-group">
                <label for="card-number">
                    <i class="fas fa-credit-card"></i>
                    Card Number
                </label>
                <div class="card-input-container">
                    <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required>
                    <div class="card-icons">
                        <i class="fab fa-cc-visa"></i>
                        <i class="fab fa-cc-mastercard"></i>
                        <i class="fab fa-cc-amex"></i>
                        <i class="fab fa-cc-discover"></i>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="expiry-date">
                        <i class="fas fa-calendar"></i>
                        Expiry Date
                    </label>
                    <input type="text" id="expiry-date" placeholder="MM/YY" required>
                </div>
                <div class="form-group">
                    <label for="cvv">
                        <i class="fas fa-lock"></i>
                        CVV
                    </label>
                    <input type="text" id="cvv" placeholder="123" required>
                </div>
            </div>
        `;

        // Insert into form before additional information
        const additionalSection = document.querySelector('.form-section');
        if (additionalSection) {
            additionalSection.parentNode.insertBefore(cardFields, additionalSection);
        }

        return cardFields;
    }

    // Create UPI fields
    function createUpiFields() {
        const existingUpiFields = document.querySelector('.upi-fields');
        if (existingUpiFields) return existingUpiFields;

        const upiFields = document.createElement('div');
        upiFields.className = 'upi-fields payment-fields';
        upiFields.style.display = 'none';
        upiFields.innerHTML = `
            <div class="form-group">
                <label for="upi-id">
                    <i class="fas fa-mobile-alt"></i>
                    UPI ID
                </label>
                <input type="text" id="upi-id" placeholder="yourname@paytm" required>
                <small class="form-help">Enter your UPI ID (e.g., 9876543210@paytm)</small>
            </div>
            
            <div class="upi-options">
                <h5>Popular UPI Apps</h5>
                <div class="upi-apps">
                    <button type="button" class="upi-app" data-suffix="@paytm">
                        <img src="https://via.placeholder.com/40x40?text=PT" alt="Paytm">
                        <span>Paytm</span>
                    </button>
                    <button type="button" class="upi-app" data-suffix="@ybl">
                        <img src="https://via.placeholder.com/40x40?text=PY" alt="PhonePe">
                        <span>PhonePe</span>
                    </button>
                    <button type="button" class="upi-app" data-suffix="@okaxis">
                        <img src="https://via.placeholder.com/40x40?text=GP" alt="Google Pay">
                        <span>Google Pay</span>
                    </button>
                    <button type="button" class="upi-app" data-suffix="@ibl">
                        <img src="https://via.placeholder.com/40x40?text=AP" alt="Amazon Pay">
                        <span>Amazon Pay</span>
                    </button>
                </div>
            </div>
            
            <div class="upi-qr-section" style="display: none;">
                <h5>Scan QR Code</h5>
                <div class="qr-code-container">
                    <div class="qr-code" id="upi-qr-code">
                        <i class="fas fa-qrcode"></i>
                        <p>QR Code will appear here</p>
                    </div>
                    <div class="qr-info">
                        <p><strong>Amount:</strong> ₹<span id="qr-amount">0.00</span></p>
                        <p><strong>Merchant:</strong> VASTRA RENT</p>
                        <p><strong>UPI ID:</strong> <span id="qr-upi-id">-</span></p>
                    </div>
                </div>
                <button type="button" class="btn secondary" id="generate-qr">
                    <i class="fas fa-qrcode"></i>
                    Generate QR Code
                </button>
            </div>
        `;

        // Insert into form before additional information
        const additionalSection = document.querySelector('.form-section');
        if (additionalSection) {
            additionalSection.parentNode.insertBefore(upiFields, additionalSection);
        }

        // Setup UPI functionality
        setupUpiFields();

        return upiFields;
    }

    // Setup UPI fields functionality
    function setupUpiFields() {
        const upiIdInput = document.getElementById('upi-id');
        const upiApps = document.querySelectorAll('.upi-app');
        const generateQrBtn = document.getElementById('generate-qr');
        const qrSection = document.querySelector('.upi-qr-section');

        // UPI app selection
        upiApps.forEach(app => {
            app.addEventListener('click', function () {
                const suffix = this.dataset.suffix;
                const currentValue = upiIdInput.value;

                // Remove existing suffix if any
                const cleanValue = currentValue.split('@')[0];

                // Add new suffix
                upiIdInput.value = cleanValue + suffix;

                // Visual feedback
                upiApps.forEach(a => a.classList.remove('selected'));
                this.classList.add('selected');

                showNotification(`${this.querySelector('span').textContent} selected`, 'success');
            });
        });

        // UPI ID validation
        upiIdInput.addEventListener('input', function () {
            const value = this.value;
            const isValid = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(value);

            if (value && !isValid) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }

            // Show/hide QR section
            if (isValid) {
                qrSection.style.display = 'block';
                document.getElementById('qr-upi-id').textContent = value;
            } else {
                qrSection.style.display = 'none';
            }
        });

        // Generate QR code
        if (generateQrBtn) {
            generateQrBtn.addEventListener('click', function () {
                const upiId = upiIdInput.value;
                const amount = window.checkoutTotal || 0;

                if (!upiId) {
                    showNotification('Please enter UPI ID first', 'error');
                    return;
                }

                generateUpiQrCode(upiId, amount);
            });
        }
    }

    // Generate UPI QR Code
    function generateUpiQrCode(upiId, amount) {
        const qrContainer = document.getElementById('upi-qr-code');
        const qrAmountSpan = document.getElementById('qr-amount');

        // Update amount
        qrAmountSpan.textContent = amount.toFixed(2);

        // Create UPI payment string
        const upiString = `upi://pay?pa=${upiId}&pn=VASTRA RENT&am=${amount}&cu=INR&tn=Rental Payment`;

        // Generate QR code (using a simple QR code representation)
        qrContainer.innerHTML = `
            <div class="qr-code-display">
                <div class="qr-pattern">
                    <div class="qr-squares">
                        ${Array.from({ length: 25 }, (_, i) => `
                            <div class="qr-square ${Math.random() > 0.5 ? 'filled' : ''}"></div>
                        `).join('')}
                    </div>
                </div>
                <p>Scan with any UPI app</p>
                <div class="qr-actions">
                    <button type="button" class="btn outline" onclick="copyUpiString('${upiString}')">
                        <i class="fas fa-copy"></i> Copy UPI Link
                    </button>
                </div>
            </div>
        `;

        showNotification('QR Code generated successfully!', 'success');
    }

    // Copy UPI string to clipboard
    window.copyUpiString = function (upiString) {
        navigator.clipboard.writeText(upiString).then(() => {
            showNotification('UPI link copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy UPI link', 'error');
        });
    };

    // Setup enhanced payment method selector functionality
    function setupPaymentMethodSelector() {
        const methodOptions = document.querySelectorAll('.method-option');
        const useNewPaymentBtn = document.getElementById('use-new-payment');
        const cardFields = document.querySelector('.card-fields');
        const upiFields = document.querySelector('.upi-fields');
        const typeOptions = document.querySelectorAll('.type-option');

        // Method selection
        methodOptions.forEach(option => {
            option.addEventListener('click', function () {
                // Remove previous selections
                methodOptions.forEach(opt => {
                    opt.classList.remove('selected');
                    opt.querySelector('.btn-select').textContent = 'Select';
                    opt.querySelector('.btn-select').classList.remove('selected');
                });

                // Select this method
                this.classList.add('selected');
                this.querySelector('.btn-select').textContent = 'Selected';
                this.querySelector('.btn-select').classList.add('selected');

                const methodType = this.dataset.methodType;

                // Hide payment type selector and fields
                const typeSelector = document.querySelector('.payment-type-selector');
                if (typeSelector) typeSelector.style.display = 'none';
                if (cardFields) cardFields.style.display = 'none';
                if (upiFields) upiFields.style.display = 'none';

                // Update form validation
                updateFormValidation(false);

                // Show selection feedback
                showNotification(`${methodType} selected from saved methods`, 'success');
            });
        });

        // Use new payment method button
        if (useNewPaymentBtn) {
            useNewPaymentBtn.addEventListener('click', function () {
                // Remove all selections
                methodOptions.forEach(opt => {
                    opt.classList.remove('selected');
                    opt.querySelector('.btn-select').textContent = 'Select';
                    opt.querySelector('.btn-select').classList.remove('selected');
                });

                // Show payment type selector
                const typeSelector = document.querySelector('.payment-type-selector');
                if (typeSelector) typeSelector.style.display = 'block';

                // Show default payment method (card)
                typeOptions.forEach(opt => opt.classList.remove('active'));
                const cardOption = document.querySelector('[data-type="card"]');
                if (cardOption) cardOption.classList.add('active');

                if (cardFields) cardFields.style.display = 'block';
                if (upiFields) upiFields.style.display = 'none';

                // Update form validation
                updateFormValidation(true);

                showNotification('Choose a new payment method below', 'info');
            });
        }
    }

    // Update form validation based on payment method
    function updateFormValidation(isNewPayment) {
        const cardInputs = document.querySelectorAll('.card-fields input');
        const upiInputs = document.querySelectorAll('.upi-fields input');

        if (!isNewPayment) {
            // Using saved method - disable validation
            cardInputs.forEach(input => input.required = false);
            upiInputs.forEach(input => input.required = false);
        } else {
            // New payment method - enable appropriate validation
            const activeType = document.querySelector('.type-option.active')?.dataset.type;

            if (activeType === 'card') {
                cardInputs.forEach(input => input.required = true);
                upiInputs.forEach(input => input.required = false);
            } else if (activeType === 'upi') {
                cardInputs.forEach(input => input.required = false);
                upiInputs.forEach(input => input.required = true);
            }
        }
    }

    // Add form interactivity
    function addFormInteractivity() {
        // Card number formatting
        const cardNumberInput = document.getElementById('card-number');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;

                // Detect card type
                detectCardType(value);
            });
        }

        // Expiry date formatting
        const expiryInput = document.getElementById('expiry-date');
        if (expiryInput) {
            expiryInput.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }

        // CVV input restriction
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', function (e) {
                e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
            });
        }
    }

    // Detect card type and show appropriate icon
    function detectCardType(cardNumber) {
        const cardIcons = document.querySelector('.card-icons');
        if (!cardIcons) return;

        // Remove all active classes
        cardIcons.querySelectorAll('i').forEach(icon => icon.classList.remove('active'));

        // Detect card type
        if (cardNumber.startsWith('4')) {
            cardIcons.querySelector('.fa-cc-visa')?.classList.add('active');
        } else if (cardNumber.startsWith('5') || cardNumber.startsWith('2')) {
            cardIcons.querySelector('.fa-cc-mastercard')?.classList.add('active');
        } else if (cardNumber.startsWith('3')) {
            cardIcons.querySelector('.fa-cc-amex')?.classList.add('active');
        } else if (cardNumber.startsWith('6')) {
            cardIcons.querySelector('.fa-cc-discover')?.classList.add('active');
        }
    }

    // Initialize payment method selector
    function initializePaymentMethodSelector() {
        // Add CSS for payment method selector
        const style = document.createElement('style');
        style.textContent = `
            .payment-method-selector {
                margin-bottom: 30px;
                padding: 20px;
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border-radius: 12px;
                border: 1px solid #dee2e6;
            }
            
            .saved-methods h4 {
                margin: 0 0 20px 0;
                color: #495057;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .method-options {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 20px;
            }
            
            .method-option {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background: white;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .method-option:hover {
                border-color: #d76d77;
                box-shadow: 0 2px 8px rgba(215, 109, 119, 0.2);
            }
            
            .method-option.selected {
                border-color: #d76d77;
                background: linear-gradient(135deg, #fff5f5, #ffffff);
                box-shadow: 0 4px 12px rgba(215, 109, 119, 0.3);
            }
            
            .method-info {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            
            .method-type {
                font-weight: 600;
                color: #495057;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .method-details {
                font-size: 0.9rem;
                color: #6c757d;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .expiry {
                font-size: 0.8rem;
                background: #e9ecef;
                padding: 2px 6px;
                border-radius: 4px;
            }
            
            .btn-select {
                padding: 8px 16px;
                border: 1px solid #d76d77;
                background: transparent;
                color: #d76d77;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
            }
            
            .btn-select:hover {
                background: #d76d77;
                color: white;
            }
            
            .btn-select.selected {
                background: #d76d77;
                color: white;
            }
            
            .method-actions-footer {
                display: flex;
                gap: 12px;
                justify-content: center;
                padding-top: 15px;
                border-top: 1px solid #dee2e6;
            }
            
            .card-icons i.active {
                color: #d76d77;
                transform: scale(1.2);
            }
            
            @media (max-width: 768px) {
                .method-option {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }
                
                .method-actions-footer {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Function to display rental details (enhanced for inventory compatibility)
    function displayRentalDetails(rental) {
        console.log('Displaying rental details for:', rental);

        // Handle both old and new data structures with comprehensive fallbacks
        const itemName = rental.productName || rental.itemName || rental.name || 'Unknown Item';
        const itemImage = rental.productImage || rental.itemImage || rental.image || 'img/placeholder.jpg';
        const itemId = rental.productId || rental.id || 'N/A';
        const rentalFee = rental.rentalFee || rental.price || 0;
        const totalCost = rental.totalCost || calculateEstimatedTotal(rentalFee);
        const days = rental.days || 1;
        const description = rental.description || 'No description available';
        const category = getCategoryDisplayName(rental.category) || 'General';
        const gender = rental.gender ? (rental.gender === 'women' ? "Women's" : "Men's") : 'Unisex';
        const weeklyPrice = rental.weeklyPrice || (rentalFee * 6.2);
        const brand = rental.brand || 'Designer Collection';
        const material = rental.material || 'Premium Fabric';
        const color = rental.color || 'As Shown';
        const condition = rental.condition || 'Excellent';
        const size = (rental.size || 'M').toUpperCase();

        // Item details with enhanced information
        if (itemDetails) {
            itemDetails.innerHTML = `
                <div class="payment-item-display">
                    <div class="item-image-container">
                        <img src="${itemImage}" alt="${itemName}" class="item-main-image" onerror="this.src='img/placeholder.jpg'">
                        <div class="item-badge ${rental.available !== false ? 'available' : 'unavailable'}">
                            <i class="fas fa-${rental.available !== false ? 'check-circle' : 'times-circle'}"></i>
                            ${rental.available !== false ? 'Available' : 'Unavailable'}
                        </div>
                    </div>
                    <div class="item-details-info">
                        <h2 class="item-name">${itemName}</h2>
                        <p class="item-description">${description}</p>
                        
                        <div class="item-specifications">
                            <div class="spec-row">
                                <span class="spec-label"><i class="fas fa-tag"></i> Category:</span>
                                <span class="spec-value">${category}</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-label"><i class="fas fa-tshirt"></i> Size:</span>
                                <span class="spec-value">${size}</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-label"><i class="fas fa-${rental.gender === 'women' ? 'female' : 'male'}"></i> Gender:</span>
                                <span class="spec-value">${gender}</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-label"><i class="fas fa-palette"></i> Color:</span>
                                <span class="spec-value">${color}</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-label"><i class="fas fa-industry"></i> Brand:</span>
                                <span class="spec-value">${brand}</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-label"><i class="fas fa-leaf"></i> Material:</span>
                                <span class="spec-value">${material}</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-label"><i class="fas fa-star"></i> Condition:</span>
                                <span class="spec-value">${condition}</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-label"><i class="fas fa-barcode"></i> Item ID:</span>
                                <span class="spec-value">${itemId}</span>
                            </div>
                        </div>

                        <div class="pricing-info">
                            <div class="price-row">
                                <span class="price-label">Daily Rate:</span>
                                <span class="price-value">₹${rentalFee.toFixed(2)}</span>
                            </div>
                            <div class="price-row">
                                <span class="price-label">Weekly Rate:</span>
                                <span class="price-value">₹${weeklyPrice.toFixed(2)}</span>
                            </div>
                            ${rental.retailPrice ? `
                            <div class="price-row retail">
                                <span class="price-label">Retail Value:</span>
                                <span class="price-value">₹${rental.retailPrice.toFixed(2)}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }

        // Enhanced rental details
        if (rentalDetails) {
            const startDate = new Date(rental.startDate);
            const endDate = new Date(rental.endDate);
            const quantity = rental.quantity || 1;

            rentalDetails.innerHTML = `
                <div class="rental-period-details">
                    <h3><i class="fas fa-calendar-check"></i> Rental Information</h3>
                    
                    <div class="rental-info-grid">
                        <div class="rental-info-item">
                            <span class="info-label"><i class="fas fa-calendar-alt"></i> Start Date:</span>
                            <span class="info-value">${formatDate(rental.startDate)}</span>
                        </div>
                        <div class="rental-info-item">
                            <span class="info-label"><i class="fas fa-calendar-alt"></i> End Date:</span>
                            <span class="info-value">${formatDate(rental.endDate)}</span>
                        </div>
                        <div class="rental-info-item">
                            <span class="info-label"><i class="fas fa-clock"></i> Duration:</span>
                            <span class="info-value">${days} ${days === 1 ? 'day' : 'days'}</span>
                        </div>
                        <div class="rental-info-item">
                            <span class="info-label"><i class="fas fa-hashtag"></i> Quantity:</span>
                            <span class="info-value">${quantity} ${quantity === 1 ? 'item' : 'items'}</span>
                        </div>
                        ${rental.specialRequests ? `
                        <div class="rental-info-item full-width">
                            <span class="info-label"><i class="fas fa-comment"></i> Special Requests:</span>
                            <span class="info-value">${rental.specialRequests}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        // Enhanced cost breakdown
        const baseRentalFee = rentalFee * days * (rental.quantity || 1);
        const damageProtection = Math.round(baseRentalFee * 0.15);
        const deliveryFee = baseRentalFee >= 100 ? 0 : 10;
        const tax = Math.round((baseRentalFee + damageProtection + deliveryFee) * 0.08);
        const grandTotal = baseRentalFee + damageProtection + deliveryFee + tax;

        if (costBreakdown) {
            costBreakdown.innerHTML = `
                <div class="cost-breakdown-section">
                    <h3><i class="fas fa-calculator"></i> Cost Breakdown</h3>
                    
                    <div class="cost-items">
                        <div class="cost-item primary">
                            <span class="cost-label">
                                <i class="fas fa-tshirt"></i>
                                Rental Fee (${itemName})
                            </span>
                            <span class="cost-calculation">₹${rentalFee.toFixed(2)} × ${days} ${days === 1 ? 'day' : 'days'} × ${rental.quantity || 1}</span>
                            <span class="cost-value">₹${baseRentalFee.toFixed(2)}</span>
                        </div>
                        
                        <div class="cost-item">
                            <span class="cost-label">
                                <i class="fas fa-shield-alt"></i>
                                Damage Protection (15%)
                            </span>
                            <span class="cost-calculation">Protection coverage</span>
                            <span class="cost-value">₹${damageProtection.toFixed(2)}</span>
                        </div>
                        
                        <div class="cost-item">
                            <span class="cost-label">
                                <i class="fas fa-truck"></i>
                                Delivery Fee
                            </span>
                            <span class="cost-calculation">${baseRentalFee >= 2000 ? 'Free for orders ₹2000+' : 'Standard delivery'}</span>
                            <span class="cost-value">${deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee.toFixed(2)}</span>
                        </div>
                        
                        <div class="cost-item">
                            <span class="cost-label">
                                <i class="fas fa-receipt"></i>
                                Tax (8%)
                            </span>
                            <span class="cost-calculation">Sales tax</span>
                            <span class="cost-value">₹${tax.toFixed(2)}</span>
                        </div>
                        
                        <div class="cost-item total">
                            <span class="cost-label">
                                <i class="fas fa-credit-card"></i>
                                Total Amount
                            </span>
                            <span class="cost-calculation">Final total</span>
                            <span class="cost-value">₹${grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Update total amount
        if (totalAmount) {
            totalAmount.textContent = `₹${grandTotal.toFixed(2)}`;
        }

        // Store grand total for later use
        window.checkoutTotal = grandTotal;
    }

    // Function to display cart checkout
    function displayCartCheckout(cart) {
        if (!cart || cart.length === 0) return;

        // Calculate totals
        let subtotal = 0;
        let itemsHtml = '';

        cart.forEach(item => {
            const itemCost = parseFloat(item.totalCost) || 0;
            subtotal += itemCost;

            itemsHtml += `
                <div class="cart-checkout-item">
                    <img src="${item.productImage || item.image}" alt="${item.productName || item.name}">
                    <div class="item-info">
                        <h4>${item.productName || item.name}</h4>
                        <p>Size: ${item.size} | Qty: ${item.quantity}</p>
                        <p>${formatDateRange(item.startDate, item.endDate)}</p>
                        <p class="item-cost">₹${itemCost.toFixed(2)}</p>
                    </div>
                </div>
            `;
        });

        // Display items
        if (itemDetails) {
            itemDetails.innerHTML = `
                <div class="cart-items">
                    <h3>Items (${cart.length})</h3>
                    ${itemsHtml}
                </div>
            `;
        }

        // Display cost breakdown
        const protection = Math.round(subtotal * 0.15);
        const delivery = subtotal >= 100 ? 0 : 10;
        const tax = Math.round((subtotal + protection + delivery) * 0.08);
        const total = subtotal + protection + delivery + tax;

        if (costBreakdown) {
            costBreakdown.innerHTML = `
                <div class="cost-item">
                    <span>Subtotal</span>
                    <span>₹${subtotal.toFixed(2)}</span>
                </div>
                <div class="cost-item">
                    <span>Damage Protection</span>
                    <span>₹${protection.toFixed(2)}</span>
                </div>
                <div class="cost-item">
                    <span>Delivery Fee</span>
                    <span>${delivery === 0 ? 'FREE' : '₹' + delivery.toFixed(2)}</span>
                </div>
                <div class="cost-item">
                    <span>Tax</span>
                    <span>₹${tax.toFixed(2)}</span>
                </div>
            `;
        }

        if (totalAmount) {
            totalAmount.textContent = `₹${total.toFixed(2)}`;
        }

        // Store total for later use
        window.checkoutTotal = total;
    }



    // Update inventory availability after payment
    function updateInventoryAvailability(itemId, isAvailable) {
        try {
            // Update shared inventory data if available
            if (window.getSharedInventoryData && window.saveSharedInventoryData) {
                const inventory = window.getSharedInventoryData();
                const itemIndex = inventory.findIndex(item => item.id === itemId);

                if (itemIndex !== -1) {
                    inventory[itemIndex].available = isAvailable;
                    window.saveSharedInventoryData(inventory);

                    // Trigger inventory refresh event
                    document.dispatchEvent(new CustomEvent('inventoryUpdated', {
                        detail: { itemId, isAvailable }
                    }));
                }
            }
        } catch (error) {
            console.warn('Error updating inventory availability:', error);
        }
    }

    // Function to process payment
    function processPayment(rental) {
        // Get form values
        const name = document.getElementById('card-name').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zip = document.getElementById('zip').value;
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvv = document.getElementById('card-cvv').value;

        // Validate form (simple validation for demo)
        if (!name || !address || !city || !state || !zip || !cardNumber || !cardExpiry || !cardCvv) {
            alert('Please fill in all fields');
            return;
        }

        // In a real app, you would send payment info to a payment processor
        // For this demo, we'll simulate a successful payment
        simulatePayment(rental, { name, address, city, state, zip });
    }

    // Add form validation
    function addFormValidation() {
        const form = document.getElementById('payment-form');
        if (!form) return;

        // Real-time validation
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });

        // Form submission validation
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validateForm()) {
                if (isCartCheckout) {
                    processCartPayment(cartData);
                } else {
                    processSinglePayment(rentalData);
                }
            }
        });
    }

    // Validate individual field
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();

        // Remove existing error
        clearFieldError(e);

        let isValid = true;
        let errorMessage = '';

        // Field-specific validation
        switch (field.id) {
            case 'card-number':
                if (value && !isValidCardNumber(value.replace(/\s/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid card number';
                }
                break;
            case 'expiry-date':
                if (value && !isValidExpiryDate(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid expiry date (MM/YY)';
                }
                break;
            case 'cvv':
                if (value && (value.length < 3 || value.length > 4)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid CVV';
                }
                break;
            case 'phone':
                if (value && !isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
            case 'zip':
                if (value && !isValidZip(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid ZIP code';
                }
                break;
        }

        if (!isValid) {
            showFieldError(field, errorMessage);
        }

        return isValid;
    }

    // Clear field error
    function clearFieldError(e) {
        const field = e.target;
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('error');
    }

    // Show field error
    function showFieldError(field, message) {
        field.classList.add('error');

        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 4px;
            display: flex;
            align-items: center;
            gap: 4px;
        `;
        errorElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;

        field.parentNode.appendChild(errorElement);
    }

    // Validate entire form (simplified)
    function validateForm() {
        const form = document.getElementById('payment-form');
        const termsCheckbox = document.getElementById('terms');
        let isValid = true;

        // Check terms acceptance with better user feedback
        if (!termsCheckbox || !termsCheckbox.checked) {
            showNotification('Please accept the Terms and Conditions to proceed', 'error');
            if (termsCheckbox) {
                termsCheckbox.focus();
                termsCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Add visual highlight to the checkbox
                termsCheckbox.parentElement.style.border = '2px solid #ff4444';
                setTimeout(() => {
                    termsCheckbox.parentElement.style.border = '';
                }, 3000);
            }
            isValid = false;
        }

        // Validate payment method fields if they exist and are visible
        const activeType = document.querySelector('.type-option.active')?.dataset.type;
        const selectedMethod = document.querySelector('.method-option.selected');

        if (!selectedMethod) {
            if (activeType === 'card') {
                const cardFields = ['card-name', 'card-number', 'expiry-date', 'cvv'];
                cardFields.forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (field && field.style.display !== 'none' && field.required && !field.value.trim()) {
                        showFieldError(field, 'This field is required');
                        isValid = false;
                    }
                });
            } else if (activeType === 'upi') {
                const upiField = document.getElementById('upi-id');
                if (upiField && upiField.required && !upiField.value.trim()) {
                    showFieldError(upiField, 'UPI ID is required');
                    isValid = false;
                }
            }
        }

        return isValid;
    }

    // Validation helper functions
    function isValidCardNumber(cardNumber) {
        // Luhn algorithm
        let sum = 0;
        let isEven = false;

        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    }

    function isValidExpiryDate(expiry) {
        const [month, year] = expiry.split('/');
        if (!month || !year) return false;

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        const expMonth = parseInt(month);
        const expYear = parseInt(year);

        if (expMonth < 1 || expMonth > 12) return false;
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) return false;

        return true;
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    function isValidZip(zip) {
        const zipRegex = /^\d{5,6}$/;
        return zipRegex.test(zip);
    }

    // Enhanced payment processing with better integration
    function processSinglePayment(rentalData) {
        const paymentInfo = getPaymentFormData();
        if (!paymentInfo) return;

        // Show enhanced loading state
        const submitBtn = paymentForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
        submitBtn.disabled = true;

        // Add loading overlay
        showLoadingOverlay('Processing your payment...');

        // Simulate payment processing with realistic delay
        setTimeout(() => {
            try {
                // Create rental record
                const rental = createRentalRecord(rentalData, paymentInfo);

                // Save to rental history
                saveRentalToHistory(rental);

                // Update inventory availability
                updateInventoryAvailability(rental.productId, false);

                // Clear checkout data
                localStorage.removeItem('currentRental');
                localStorage.removeItem('checkoutCart');
                localStorage.removeItem('pendingRental');

                // Hide loading overlay
                hideLoadingOverlay();

                // Show success confirmation
                showEnhancedSuccessModal(rental, paymentInfo);

            } catch (error) {
                console.error('Payment processing error:', error);
                hideLoadingOverlay();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showNotification('Payment processing failed. Please try again.', 'error');
            }
        }, 3000); // Realistic processing time
    }

    // Function to process cart payment
    function processCartPayment(cartData) {
        const paymentInfo = getPaymentFormData();
        if (!paymentInfo) return;

        // Show enhanced loading state
        const submitBtn = paymentForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
        submitBtn.disabled = true;

        // Add loading overlay
        showLoadingOverlay('Processing your cart payment...');

        // Simulate payment processing
        setTimeout(() => {
            try {
                const rentals = [];
                let totalAmount = 0;

                // Create rental for each cart item
                cartData.forEach(item => {
                    const rental = createRentalRecord(item, paymentInfo);
                    rentals.push(rental);
                    totalAmount += rental.totalCost;

                    // Save individual rental to history
                    saveRentalToHistory(rental);

                    // Update inventory availability
                    updateInventoryAvailability(rental.productId, false);
                });

                // Clear cart data
                localStorage.removeItem('checkoutCart');
                localStorage.removeItem('rentalCart');
                localStorage.removeItem('currentRental');

                // Hide loading overlay
                hideLoadingOverlay();

                // Show cart success confirmation
                showCartSuccessModal(rentals, totalAmount, paymentInfo);

            } catch (error) {
                console.error('Cart payment processing error:', error);
                hideLoadingOverlay();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showNotification('Payment processing failed. Please try again.', 'error');
            }
        }, 3000);
    }

    // Show cart success modal
    function showCartSuccessModal(rentals, totalAmount, paymentInfo) {
        const modal = document.createElement('div');
        modal.id = 'cart-success-modal';
        modal.innerHTML = `
            <div class="success-modal-content">
                <div class="success-header">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Payment Successful!</h2>
                    <p>All ${rentals.length} items have been confirmed</p>
                </div>
                
                <div class="success-details">
                    <div class="rental-summary">
                        <h3>Confirmed Rentals:</h3>
                        <div class="rental-items">
                            ${rentals.map(rental => `
                                <div class="rental-item">
                                    <img src="${rental.productImage}" alt="${rental.productName}">
                                    <div class="item-info">
                                        <h4>${rental.productName}</h4>
                                        <p>ID: ${rental.confirmationId}</p>
                                        <p>Size: ${rental.size} | Qty: ${rental.quantity}</p>
                                        <p class="rental-period">
                                            <i class="fas fa-calendar"></i>
                                            ${formatDateRange(rental.startDate, rental.endDate)}
                                        </p>
                                    </div>
                                    <div class="item-cost">₹${rental.totalCost.toFixed(2)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="confirmation-info">
                        <div class="info-row">
                            <span class="label">Total Items:</span>
                            <span class="value">${rentals.length}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Total Paid:</span>
                            <span class="value">₹${totalAmount.toFixed(2)}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Payment Date:</span>
                            <span class="value">${formatDate(new Date().toISOString())}</span>
                        </div>
                    </div>
                </div>
                
                <div class="success-actions">
                    <button class="btn primary" id="view-all-rentals">
                        <i class="fas fa-eye"></i>
                        View All Rentals
                    </button>
                    <button class="btn secondary" id="continue-shopping-cart">
                        <i class="fas fa-shopping-bag"></i>
                        Continue Shopping
                    </button>
                </div>
                
                <div class="success-footer">
                    <p><i class="fas fa-envelope"></i> Confirmation emails have been sent for all items</p>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            backdrop-filter: blur(5px);
            animation: modalFadeIn 0.3s ease;
        `;

        document.body.appendChild(modal);

        // Add event listeners
        document.getElementById('view-all-rentals').addEventListener('click', () => {
            window.location.href = 'rental-status.html';
        });

        document.getElementById('continue-shopping-cart').addEventListener('click', () => {
            window.location.href = 'inventory.html';
        });

        // Add specific CSS for cart modal
        const style = document.createElement('style');
        style.textContent = `
            .rental-items {
                display: flex;
                flex-direction: column;
                gap: 15px;
                max-height: 300px;
                overflow-y: auto;
                padding: 10px;
            }
            
            .rental-item {
                display: flex;
                gap: 15px;
                align-items: center;
                padding: 15px;
                background: white;
                border-radius: 8px;
                border: 1px solid #eee;
            }
            
            .rental-item img {
                width: 60px;
                height: 60px;
                object-fit: cover;
                border-radius: 6px;
            }
            
            .item-info {
                flex: 1;
            }
            
            .item-info h4 {
                margin: 0 0 5px 0;
                font-size: 1rem;
                color: #333;
            }
            
            .item-info p {
                margin: 0 0 3px 0;
                font-size: 0.8rem;
                color: #666;
            }
            
            .item-cost {
                font-weight: 600;
                color: #d76d77;
                font-size: 1.1rem;
            }
        `;
        document.head.appendChild(style);
    }

    // Function to get payment form data (simplified)
    function getPaymentFormData() {
        const specialInstructions = document.getElementById('special-instructions')?.value || '';
        const termsAccepted = document.getElementById('terms')?.checked;

        // Validate terms acceptance
        if (!termsAccepted) {
            showNotification('Please accept the Terms and Conditions', 'error');
            // Focus on the terms checkbox to help user
            const termsCheckbox = document.getElementById('terms');
            if (termsCheckbox) {
                termsCheckbox.focus();
                termsCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return null;
        }

        // Get user data from stored profile information
        const userData = window.currentUserData || {};
        const userAddresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
        const defaultAddress = userAddresses.find(addr => addr.isDefault) || userAddresses[0];

        return {
            name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Customer',
            address: defaultAddress?.address || 'Address on file',
            city: defaultAddress?.city || 'City on file',
            state: defaultAddress?.state || 'State on file',
            zip: defaultAddress?.zip || '000000',
            phone: userData.phone || '+91 98765 43210',
            specialInstructions: specialInstructions
        };
    }

    // Function to show single item confirmation
    function showSingleConfirmation(rental, paymentInfo) {
        if (!confirmationModal) return;

        const confirmationId = `CONF-${Date.now()}`;

        if (confirmationDetails) {
            confirmationDetails.innerHTML = `
                <div class="confirmation-item">
                    <img src="${rental.productImage}" alt="${rental.productName}">
                    <div>
                        <h4>${rental.productName}</h4>
                        <p>Rental ID: ${rental.id}</p>
                        <p>Period: ${formatDateRange(rental.startDate, rental.endDate)}</p>
                        <p>Size: ${rental.size}</p>
                    </div>
                </div>
                <p class="confirmation-message">Your rental has been confirmed! You will receive a confirmation email shortly.</p>
            `;
        }

        updateConfirmationModal(confirmationId, rental.totalCost);
        showModal();
    }

    // Function to show cart confirmation
    function showCartConfirmation(rentals, paymentInfo) {
        if (!confirmationModal || !rentals.length) return;

        const confirmationId = `CONF-${Date.now()}`;
        let itemsHtml = '';
        let totalCost = 0;

        rentals.forEach(rental => {
            totalCost += rental.totalCost;
            itemsHtml += `
                <div class="confirmation-item">
                    <img src="${rental.productImage}" alt="${rental.productName}">
                    <div>
                        <h4>${rental.productName}</h4>
                        <p>Rental ID: ${rental.id}</p>
                        <p>Period: ${formatDateRange(rental.startDate, rental.endDate)}</p>
                        <p>Size: ${rental.size}</p>
                    </div>
                </div>
            `;
        });

        if (confirmationDetails) {
            confirmationDetails.innerHTML = `
                <div class="confirmation-items">
                    <h4>Confirmed Rentals (${rentals.length} items):</h4>
                    ${itemsHtml}
                </div>
                <p class="confirmation-message">All your rentals have been confirmed! You will receive confirmation emails shortly.</p>
            `;
        }

        updateConfirmationModal(confirmationId, totalCost);
        showModal();
    }

    // Function to update confirmation modal
    function updateConfirmationModal(confId, total) {
        if (confirmationId) {
            confirmationId.textContent = confId;
        }

        if (confirmationTotal) {
            confirmationTotal.textContent = `₹${total.toFixed(2)}`;
        }

        if (confirmationDate) {
            confirmationDate.textContent = formatDate(new Date().toISOString());
        }
    }

    // Function to show modal
    function showModal() {
        if (confirmationModal) {
            confirmationModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        // Add event listeners to modal buttons
        const viewRentalsBtn = document.getElementById('view-rentals-btn');
        const continueShoppingBtn = document.getElementById('continue-shopping-btn');

        if (viewRentalsBtn) {
            viewRentalsBtn.onclick = () => window.location.href = 'rental-status.html';
        }

        if (continueShoppingBtn) {
            continueShoppingBtn.onclick = () => window.location.href = 'inventory.html';
        }
    }

    // Function to simulate payment processing (fallback)
    function simulatePayment(rental, shippingInfo) {
        // This is the fallback method if integration system is not available
        rental.status = 'active';
        rental.paymentDate = new Date().toISOString();
        rental.shippingInfo = shippingInfo;
        rental.confirmationId = 'CONF-' + Math.floor(10000 + Math.random() * 90000);

        showSingleConfirmation(rental, shippingInfo);
    }

    // Function to update rental in localStorage
    function updateRental(updatedRental) {
        // Get existing rentals
        let rentals = JSON.parse(localStorage.getItem('rentals')) || [];

        // Find and update the rental
        const index = rentals.findIndex(r => r.rentalId === updatedRental.rentalId);
        if (index !== -1) {
            rentals[index] = updatedRental;
        }

        // Save back to localStorage
        localStorage.setItem('rentals', JSON.stringify(rentals));
    }

    // Function to show payment confirmation
    function showConfirmation(rental) {
        if (!confirmationModal) return;

        // Update confirmation details
        if (confirmationDetails) {
            confirmationDetails.innerHTML = `
                <p><strong>${rental.itemName}</strong> has been successfully rented.</p>
                <p>Your rental period is from <strong>${formatDate(rental.startDate)}</strong> to <strong>${formatDate(rental.endDate)}</strong>.</p>
                <p>A confirmation email has been sent to your registered email address.</p>
            `;
        }

        if (confirmationId) {
            confirmationId.textContent = rental.confirmationId;
        }

        if (confirmationTotal) {
            confirmationTotal.textContent = formatCurrency(rental.grandTotal);
        }

        if (confirmationDate) {
            confirmationDate.textContent = formatDate(rental.paymentDate);
        }

        // Show modal
        openModal('payment-confirmation-modal');

        // Add event listener to view rentals button
        const viewRentalsBtn = document.getElementById('view-rentals-btn');
        if (viewRentalsBtn) {
            viewRentalsBtn.addEventListener('click', function () {
                window.location.href = 'rental-status.html';
            });
        }
    }

    // Credit card input formatting
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function (e) {
            // Remove non-digits
            let value = this.value.replace(/\D/g, '');

            // Add spaces after every 4 digits
            value = value.replace(/(.{4})/g, '$1 ').trim();

            // Limit to 19 characters (16 digits + 3 spaces)
            value = value.substring(0, 19);

            // Update input value
            this.value = value;
        });
    }

    // Expiry date formatting
    const expiryInput = document.getElementById('card-expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function (e) {
            // Remove non-digits
            let value = this.value.replace(/\D/g, '');

            // Add slash after first 2 digits
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }

            // Limit to 5 characters (MM/YY)
            value = value.substring(0, 5);

            // Update input value
            this.value = value;
        });
    }

    // CVV input formatting
    const cvvInput = document.getElementById('card-cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function (e) {
            // Remove non-digits
            let value = this.value.replace(/\D/g, '');

            // Limit to 3 or 4 digits
            value = value.substring(0, 4);

            // Update input value
            this.value = value;
        });
    }

    // Utility functions
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function formatDateRange(startDate, endDate) {
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }

    // Enhanced currency formatting function for Indian Rupees
    function formatCurrency(amount) {
        const numAmount = parseFloat(amount) || 0;
        return `₹${numAmount.toFixed(2)}`;
    }
    
    // Format currency with Indian number system (lakhs, crores)
    function formatCurrencyIndian(amount) {
        const numAmount = parseFloat(amount) || 0;
        
        // For amounts less than 1000, show as is
        if (numAmount < 1000) {
            return `₹${numAmount.toFixed(2)}`;
        }
        
        // For amounts 1000 and above, use Indian number formatting
        const formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        return formatter.format(numAmount);
    }
    
    // Utility function to ensure all prices are in rupees
    function ensureRupeeFormat(priceString) {
        if (typeof priceString === 'string') {
            // Remove any existing currency symbols and convert to rupees
            const cleanPrice = priceString.replace(/[$₹,]/g, '');
            const numPrice = parseFloat(cleanPrice) || 0;
            return formatCurrency(numPrice);
        }
        return formatCurrency(priceString);
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            min-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; margin-left: auto; opacity: 0.8;">
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

    // Helper function to get category display names
    function getCategoryDisplayName(category) {
        const categoryNames = {
            'formal': 'Formal Wear',
            'casual': 'Casual Wear',
            'business': 'Business Attire',
            'party': 'Party Wear',
            'seasonal': 'Seasonal Wear'
        };
        return categoryNames[category] || (category ? category.charAt(0).toUpperCase() + category.slice(1) : 'General');
    }

    // Add enhanced CSS styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        /* Enhanced Payment Item Display */
        .payment-item-display {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
            border: 1px solid #e9ecef;
        }
        
        .item-image-container {
            position: relative;
            flex-shrink: 0;
        }
        
        .item-main-image {
            width: 150px;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .item-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            color: white;
        }
        
        .item-badge.available {
            background: #28a745;
        }
        
        .item-badge.unavailable {
            background: #dc3545;
        }
        
        .item-details-info {
            flex: 1;
        }
        
        .item-name {
            margin: 0 0 10px 0;
            color: #2c3e50;
            font-size: 1.5rem;
            font-weight: 600;
        }
        
        .item-description {
            color: #6c757d;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        
        .item-specifications {
            margin-bottom: 20px;
        }
        
        .spec-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .spec-row:last-child {
            border-bottom: none;
        }
        
        .spec-label {
            color: #495057;
            font-weight: 500;
        }
        
        .spec-label i {
            margin-right: 8px;
            color: var(--primary-color);
            width: 16px;
        }
        
        .spec-value {
            color: #2c3e50;
            font-weight: 600;
        }
        
        .pricing-info {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        
        .price-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0;
        }
        
        .price-label {
            color: #495057;
            font-weight: 500;
        }
        
        .price-value {
            color: var(--primary-color);
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        /* Enhanced Rental Details */
        .rental-period-details {
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
            border: 1px solid #e9ecef;
        }
        
        .rental-period-details h3 {
            margin: 0 0 20px 0;
            color: #2c3e50;
            font-size: 1.2rem;
        }
        
        .rental-period-details h3 i {
            margin-right: 10px;
            color: var(--primary-color);
        }
        
        .rental-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .rental-info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e9ecef;
        }
        
        .rental-info-item.full-width {
            grid-column: 1 / -1;
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
        }
        
        .info-label {
            color: #495057;
            font-weight: 500;
            font-size: 0.9rem;
        }
        
        .info-label i {
            margin-right: 6px;
            color: var(--primary-color);
            width: 14px;
        }
        
        .info-value {
            color: #2c3e50;
            font-weight: 600;
        }
        
        /* Enhanced Cost Breakdown */
        .cost-breakdown-section {
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
            border: 1px solid #e9ecef;
        }
        
        .cost-breakdown-section h3 {
            margin: 0 0 20px 0;
            color: #2c3e50;
            font-size: 1.2rem;
        }
        
        .cost-breakdown-section h3 i {
            margin-right: 10px;
            color: var(--primary-color);
        }
        
        .cost-items {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e9ecef;
        }
        
        .cost-item {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 15px;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .cost-item:last-child {
            border-bottom: none;
        }
        
        .cost-item.primary {
            background: rgba(var(--primary-color-rgb), 0.05);
        }
        
        .cost-item.total {
            background: #2c3e50;
            color: white;
            font-weight: 600;
        }
        
        .cost-item.total .cost-label,
        .cost-item.total .cost-calculation,
        .cost-item.total .cost-value {
            color: white;
        }
        
        .cost-label {
            color: #2c3e50;
            font-weight: 500;
        }
        
        .cost-label i {
            margin-right: 8px;
            color: var(--primary-color);
            width: 16px;
        }
        
        .cost-calculation {
            color: #6c757d;
            font-size: 0.9rem;
            text-align: center;
        }
        
        .cost-value {
            color: var(--primary-color);
            font-weight: 600;
            text-align: right;
            font-size: 1.1rem;
        }
        
        .cost-item.total .cost-value {
            font-size: 1.3rem;
        }
        
        /* Existing styles */
        .confirmation-item {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 8px;
        }
        .confirmation-item img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 4px;
        }
        .confirmation-message {
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            text-align: center;
        }
        .cart-checkout-item {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
            padding: 15px;
            border: 1px solid #eee;
            border-radius: 8px;
        }
        .cart-checkout-item img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 4px;
        }
        .cart-checkout-item .item-cost {
            font-weight: bold;
            color: var(--primary-color);
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .payment-item-display {
                flex-direction: column;
                gap: 15px;
            }
            
            .item-main-image {
                width: 100%;
                max-width: 200px;
                margin: 0 auto;
            }
            
            .rental-info-grid {
                grid-template-columns: 1fr;
            }
            
            .cost-item {
                grid-template-columns: 1fr;
                gap: 10px;
                text-align: center;
            }
            
            .cost-calculation {
                text-align: center;
            }
            
            .cost-value {
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);
});
// Create rental record
function createRentalRecord(rentalData, paymentInfo) {
    const rentalId = 'RNT-' + Date.now();
    const currentDate = new Date().toISOString();

    return {
        id: rentalId,
        productId: rentalData.productId || rentalData.id,
        productName: rentalData.productName || rentalData.name,
        productImage: rentalData.productImage || rentalData.image,
        category: rentalData.category,
        size: rentalData.size,
        startDate: rentalData.startDate,
        endDate: rentalData.endDate,
        quantity: rentalData.quantity || 1,
        days: rentalData.days || 1,
        rentalFee: rentalData.rentalFee || rentalData.price,
        totalCost: rentalData.totalCost,
        status: 'active',
        paymentDate: currentDate,
        paymentMethod: getSelectedPaymentMethod(),
        deliveryAddress: {
            name: paymentInfo.name,
            address: paymentInfo.address,
            city: paymentInfo.city,
            state: paymentInfo.state,
            zip: paymentInfo.zip
        },
        specialRequests: rentalData.specialRequests || '',
        confirmationId: 'CONF-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };
}

// Get selected payment method
function getSelectedPaymentMethod() {
    const selectedMethod = document.querySelector('.method-option.selected');
    if (selectedMethod) {
        const methodType = selectedMethod.querySelector('.method-type').textContent.trim();
        const methodDetails = selectedMethod.querySelector('.method-details').textContent.trim();
        return `${methodType} - ${methodDetails}`;
    }

    // Check if using new payment method
    const activeType = document.querySelector('.type-option.active')?.dataset.type;
    if (activeType === 'upi') {
        const upiId = document.getElementById('upi-id')?.value;
        return upiId ? `UPI - ${upiId}` : 'UPI Payment';
    }

    return 'New Card';
}

// Enhanced payment processing with UPI support
function processPaymentWithMethod(rentalData, paymentInfo) {
    const selectedMethod = document.querySelector('.method-option.selected');
    const activeType = document.querySelector('.type-option.active')?.dataset.type;

    if (selectedMethod) {
        // Using saved payment method
        return processWithSavedMethod(rentalData, paymentInfo, selectedMethod);
    } else if (activeType === 'upi') {
        // Using new UPI payment
        return processUpiPayment(rentalData, paymentInfo);
    } else {
        // Using new card payment
        return processCardPayment(rentalData, paymentInfo);
    }
}

// Process UPI payment
function processUpiPayment(rentalData, paymentInfo) {
    const upiId = document.getElementById('upi-id')?.value;

    if (!upiId) {
        showNotification('Please enter UPI ID', 'error');
        return false;
    }

    // Validate UPI ID format
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(upiId)) {
        showNotification('Please enter a valid UPI ID', 'error');
        return false;
    }

    // Show UPI payment processing
    showUpiPaymentModal(rentalData, paymentInfo, upiId);
    return true;
}

// Show UPI payment modal
function showUpiPaymentModal(rentalData, paymentInfo, upiId) {
    const modal = document.createElement('div');
    modal.id = 'upi-payment-modal';
    modal.innerHTML = `
            <div class="upi-modal-content">
                <div class="upi-header">
                    <h3><i class="fas fa-mobile-alt"></i> UPI Payment</h3>
                    <p>Complete your payment using UPI</p>
                </div>
                
                <div class="upi-payment-details">
                    <div class="payment-amount">
                        <h2>₹${rentalData.totalCost.toFixed(2)}</h2>
                        <p>Amount to pay</p>
                    </div>
                    
                    <div class="upi-info">
                        <div class="info-row">
                            <span>UPI ID:</span>
                            <span>${upiId}</span>
                        </div>
                        <div class="info-row">
                            <span>Merchant:</span>
                            <span>VASTRA RENT</span>
                        </div>
                        <div class="info-row">
                            <span>Item:</span>
                            <span>${rentalData.productName}</span>
                        </div>
                    </div>
                    
                    <div class="upi-qr-display">
                        <div class="qr-code-large">
                            <div class="qr-pattern-large">
                                ${generateQrPattern()}
                            </div>
                            <p>Scan with any UPI app</p>
                        </div>
                    </div>
                    
                    <div class="upi-apps-list">
                        <p>Or pay directly with:</p>
                        <div class="upi-app-buttons">
                            <button class="upi-app-btn" onclick="openUpiApp('paytm', '${upiId}', ${rentalData.totalCost})">
                                <i class="fas fa-mobile"></i> Paytm
                            </button>
                            <button class="upi-app-btn" onclick="openUpiApp('phonepe', '${upiId}', ${rentalData.totalCost})">
                                <i class="fas fa-mobile"></i> PhonePe
                            </button>
                            <button class="upi-app-btn" onclick="openUpiApp('gpay', '${upiId}', ${rentalData.totalCost})">
                                <i class="fas fa-mobile"></i> Google Pay
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="upi-actions">
                    <button class="btn secondary" id="upi-cancel">Cancel</button>
                    <button class="btn primary" id="upi-confirm">I have paid</button>
                </div>
                
                <div class="upi-timer">
                    <p>This payment request will expire in <span id="timer">10:00</span></p>
                </div>
            </div>
        `;

    modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            backdrop-filter: blur(5px);
        `;

    document.body.appendChild(modal);

    // Setup UPI modal functionality
    setupUpiModal(modal, rentalData, paymentInfo, upiId);

    // Start timer
    startUpiTimer();
}

// Generate QR pattern for display
function generateQrPattern() {
    return Array.from({ length: 100 }, (_, i) => `
            <div class="qr-pixel ${Math.random() > 0.6 ? 'filled' : ''}"></div>
        `).join('');
}

// Setup UPI modal functionality
function setupUpiModal(modal, rentalData, paymentInfo, upiId) {
    const cancelBtn = modal.querySelector('#upi-cancel');
    const confirmBtn = modal.querySelector('#upi-confirm');

    cancelBtn.addEventListener('click', () => {
        modal.remove();
        // Reset payment form
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.innerHTML = 'Complete Payment';
        submitBtn.disabled = false;
    });

    confirmBtn.addEventListener('click', () => {
        // Simulate payment verification
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        confirmBtn.disabled = true;

        setTimeout(() => {
            modal.remove();

            // Create rental record with UPI payment
            const rental = createRentalRecord(rentalData, paymentInfo);
            rental.paymentMethod = `UPI - ${upiId}`;

            // Save and show success
            saveRentalToHistory(rental);
            updateInventoryAvailability(rental.productId, false);

            // Clear checkout data
            localStorage.removeItem('currentRental');
            localStorage.removeItem('checkoutCart');

            showEnhancedSuccessModal(rental, paymentInfo);
        }, 2000);
    });

    // Add UPI modal styles
    addUpiModalStyles();
}

// Start UPI payment timer
function startUpiTimer() {
    let timeLeft = 600; // 10 minutes
    const timerElement = document.getElementById('timer');

    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        if (timerElement) {
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            const modal = document.getElementById('upi-payment-modal');
            if (modal) {
                modal.remove();
                showNotification('UPI payment request expired', 'error');
            }
        }
    }, 1000);
}

// Open UPI app
window.openUpiApp = function (app, upiId, amount) {
    const upiString = `upi://pay?pa=${upiId}&pn=VASTRA RENT&am=${amount}&cu=INR&tn=Rental Payment`;

    // Try to open UPI app
    window.location.href = upiString;

    showNotification(`Opening ${app}...`, 'info');
};

// Process with saved payment method
function processWithSavedMethod(rentalData, paymentInfo, selectedMethod) {
    const methodType = selectedMethod.dataset.methodType;

    if (methodType === 'UPI') {
        // Show UPI confirmation for saved UPI method
        const upiId = selectedMethod.querySelector('.method-details').textContent.trim();
        showUpiPaymentModal(rentalData, paymentInfo, upiId);
    } else {
        // Process card payment with saved method
        return processCardPayment(rentalData, paymentInfo);
    }

    return true;
}

// Process card payment
function processCardPayment(rentalData, paymentInfo) {
    // Standard card payment processing
    return true;
}

// Save rental to history
function saveRentalToHistory(rental) {
    try {
        // Get existing rentals
        let rentals = JSON.parse(localStorage.getItem('rentalHistory')) || [];

        // Add new rental
        rentals.unshift(rental); // Add to beginning

        // Save back to localStorage
        localStorage.setItem('rentalHistory', JSON.stringify(rentals));

        // Also save to rental integration system if available
        if (window.rentalIntegration) {
            window.rentalIntegration.addRental(rental);
        }

        console.log('Rental saved to history:', rental);
    } catch (error) {
        console.error('Error saving rental to history:', error);
    }
}

// Show loading overlay
function showLoadingOverlay(message) {
    const overlay = document.createElement('div');
    overlay.id = 'payment-loading-overlay';
    overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <h3>${message}</h3>
                <p>Please do not close this window...</p>
                <div class="loading-steps">
                    <div class="step active">
                        <i class="fas fa-credit-card"></i>
                        <span>Verifying Payment</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-check-circle"></i>
                        <span>Confirming Rental</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-envelope"></i>
                        <span>Sending Confirmation</span>
                    </div>
                </div>
            </div>
        `;

    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;

    document.body.appendChild(overlay);

    // Animate loading steps
    setTimeout(() => {
        const steps = overlay.querySelectorAll('.step');
        steps[1].classList.add('active');
    }, 1000);

    setTimeout(() => {
        const steps = overlay.querySelectorAll('.step');
        steps[2].classList.add('active');
    }, 2000);

    // Add CSS for loading animation
    const style = document.createElement('style');
    style.textContent = `
            .loading-content {
                background: white;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 400px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            
            .loading-spinner {
                position: relative;
                width: 80px;
                height: 80px;
                margin: 0 auto 30px;
            }
            
            .spinner-ring {
                position: absolute;
                width: 100%;
                height: 100%;
                border: 4px solid transparent;
                border-top: 4px solid #d76d77;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            .spinner-ring:nth-child(2) {
                width: 60px;
                height: 60px;
                top: 10px;
                left: 10px;
                border-top-color: #6c63ff;
                animation-duration: 0.8s;
                animation-direction: reverse;
            }
            
            .spinner-ring:nth-child(3) {
                width: 40px;
                height: 40px;
                top: 20px;
                left: 20px;
                border-top-color: #ff6b9d;
                animation-duration: 0.6s;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-content h3 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 1.5rem;
            }
            
            .loading-content p {
                margin: 0 0 30px 0;
                color: #666;
            }
            
            .loading-steps {
                display: flex;
                flex-direction: column;
                gap: 15px;
                text-align: left;
            }
            
            .step {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px;
                border-radius: 8px;
                background: #f8f9fa;
                opacity: 0.5;
                transition: all 0.3s ease;
            }
            
            .step.active {
                opacity: 1;
                background: linear-gradient(135deg, #d76d77, #c55a64);
                color: white;
                transform: translateX(5px);
            }
            
            .step i {
                font-size: 1.2rem;
                width: 20px;
            }
        `;
    document.head.appendChild(style);
}

// Hide loading overlay
function hideLoadingOverlay() {
    const overlay = document.getElementById('payment-loading-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
    }
}

// Show enhanced success modal
function showEnhancedSuccessModal(rental, paymentInfo) {
    // Create success modal
    const modal = document.createElement('div');
    modal.id = 'payment-success-modal';
    modal.innerHTML = `
            <div class="success-modal-content">
                <div class="success-header">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Payment Successful!</h2>
                    <p>Your rental has been confirmed</p>
                </div>
                
                <div class="success-details">
                    <div class="rental-summary">
                        <div class="rental-item">
                            <img src="${rental.productImage}" alt="${rental.productName}">
                            <div class="item-info">
                                <h3>${rental.productName}</h3>
                                <p>Size: ${rental.size} | Quantity: ${rental.quantity}</p>
                                <p class="rental-period">
                                    <i class="fas fa-calendar"></i>
                                    ${formatDateRange(rental.startDate, rental.endDate)}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="confirmation-info">
                        <div class="info-row">
                            <span class="label">Confirmation ID:</span>
                            <span class="value">${rental.confirmationId}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Total Paid:</span>
                            <span class="value">₹${rental.totalCost.toFixed(2)}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Payment Date:</span>
                            <span class="value">${formatDate(rental.paymentDate)}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Delivery Address:</span>
                            <span class="value">${rental.deliveryAddress.address}, ${rental.deliveryAddress.city}</span>
                        </div>
                    </div>
                </div>
                
                <div class="success-actions">
                    <button class="btn primary" id="view-rental-status" 
                            title="View your rental details and tracking information"
                            aria-label="View rental status page">
                        <i class="fas fa-eye"></i>
                        View Rental Status
                    </button>
                    <button class="btn secondary" id="continue-shopping" 
                            title="Browse more items in our collection"
                            aria-label="Continue shopping in inventory">
                        <i class="fas fa-shopping-bag"></i>
                        Continue Shopping
                    </button>
                    <button class="btn outline" id="download-receipt" 
                            title="Download your payment receipt as a text file"
                            aria-label="Download receipt file">
                        <i class="fas fa-download"></i>
                        Download Receipt
                    </button>
                </div>
                
                <div class="success-footer">
                    <p><i class="fas fa-envelope"></i> A confirmation email has been sent to your registered email address</p>
                    <p><i class="fas fa-phone"></i> For any queries, contact us at +91 98765 43210</p>
                </div>
            </div>
        `;

    modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            backdrop-filter: blur(5px);
            animation: modalFadeIn 0.3s ease;
        `;

    document.body.appendChild(modal);

    // Ensure modal is properly displayed before setting up buttons
    document.body.appendChild(modal);

    // Force reflow to ensure modal is rendered
    modal.offsetHeight;

    // Wait for DOM to be ready and then add event listeners with multiple attempts
    setTimeout(() => {
        setupSuccessModalButtons(modal, rental, paymentInfo);
    }, 100);

    // Backup setup after longer delay
    setTimeout(() => {
        if (!modal.querySelector('#view-rental-status')?.onclick) {
            console.log('Backup button setup triggered');
            setupSuccessModalButtons(modal, rental, paymentInfo);
        }
    }, 500);

    // Add CSS for success modal
    const style = document.createElement('style');
    style.textContent = `
            @keyframes modalFadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
            
            .success-modal-content {
                background: white;
                border-radius: 20px;
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
                animation: modalSlideIn 0.4s ease;
            }
            
            @keyframes modalSlideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .success-header {
                text-align: center;
                padding: 40px 40px 20px;
                background: linear-gradient(135deg, #d76d77, #c55a64);
                color: white;
                border-radius: 20px 20px 0 0;
            }
            
            .success-icon {
                width: 80px;
                height: 80px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                animation: successPulse 2s ease-in-out infinite;
            }
            
            .success-icon i {
                font-size: 2.5rem;
            }
            
            @keyframes successPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .success-header h2 {
                margin: 0 0 10px 0;
                font-size: 2rem;
            }
            
            .success-header p {
                margin: 0;
                opacity: 0.9;
            }
            
            .success-details {
                padding: 30px 40px;
            }
            
            .rental-summary {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 25px;
            }
            
            .rental-item {
                display: flex;
                gap: 15px;
                align-items: center;
            }
            
            .rental-item img {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 8px;
            }
            
            .item-info h3 {
                margin: 0 0 8px 0;
                color: #333;
            }
            
            .item-info p {
                margin: 0 0 5px 0;
                color: #666;
                font-size: 0.9rem;
            }
            
            .rental-period {
                color: #d76d77 !important;
                font-weight: 500;
            }
            
            .confirmation-info {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }
            
            .info-row:last-child {
                border-bottom: none;
            }
            
            .label {
                color: #666;
                font-weight: 500;
            }
            
            .value {
                color: #333;
                font-weight: 600;
            }
            
            .success-actions {
                padding: 0 40px 30px;
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .success-actions .btn {
                flex: 1;
                min-width: 150px;
                padding: 14px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                text-decoration: none;
                border: none;
                font-size: 0.95rem;
                position: relative;
                overflow: hidden;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
                outline: none;
                z-index: 1;
            }
            
            /* Ensure buttons are always clickable */
            .success-actions .btn {
                pointer-events: auto !important;
            }
            
            /* Add ripple effect */
            .success-actions .btn::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transition: width 0.6s, height 0.6s;
                transform: translate(-50%, -50%);
                z-index: -1;
            }
            
            .success-actions .btn:active::before {
                width: 300px;
                height: 300px;
            }
            
            .btn.primary {
                background: #d76d77;
                color: white;
            }
            
            .btn.primary:hover {
                background: #c55a64;
                transform: translateY(-2px);
            }
            
            .btn.secondary {
                background: #6c757d;
                color: white;
            }
            
            .btn.secondary:hover {
                background: #5a6268;
                transform: translateY(-2px);
            }
            
            .btn.outline {
                background: transparent;
                color: #d76d77;
                border: 2px solid #d76d77;
            }
            
            .btn.outline:hover {
                background: #d76d77;
                color: white;
                transform: translateY(-2px);
            }
            
            .btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
                transform: none !important;
            }
            
            .btn:active {
                transform: translateY(0) scale(0.98) !important;
            }
            
            /* Button loading states */
            .btn .fa-spinner {
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Success state for download button */
            .btn.success-state {
                background: #28a745 !important;
                border-color: #28a745 !important;
            }
            
            /* Enhanced button hover effects */
            .btn:hover:not(:disabled) {
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            }
            
            .btn.primary:hover:not(:disabled) {
                background: linear-gradient(135deg, #c55a64, #b84c56);
            }
            
            .btn.secondary:hover:not(:disabled) {
                background: #5a6268;
            }
            
            /* Pulse animation for primary button */
            .btn.primary {
                animation: primaryPulse 2s ease-in-out infinite;
            }
            
            @keyframes primaryPulse {
                0%, 100% { box-shadow: 0 4px 15px rgba(215, 109, 119, 0.3); }
                50% { box-shadow: 0 6px 25px rgba(215, 109, 119, 0.5); }
            }
            
            /* Tooltip for buttons */
            .btn[title]:hover::after {
                content: attr(title);
                position: absolute;
                bottom: -35px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 1000;
            }
            
            .success-footer {
                background: #f8f9fa;
                padding: 20px 40px;
                border-radius: 0 0 20px 20px;
                text-align: center;
            }
            
            .success-footer p {
                margin: 0 0 8px 0;
                color: #666;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .success-footer p:last-child {
                margin-bottom: 0;
            }
            
            @media (max-width: 768px) {
                .success-modal-content {
                    width: 95%;
                    margin: 20px;
                }
                
                .success-header,
                .success-details,
                .success-actions,
                .success-footer {
                    padding-left: 20px;
                    padding-right: 20px;
                }
                
                .rental-item {
                    flex-direction: column;
                    text-align: center;
                }
                
                .success-actions {
                    flex-direction: column;
                }
                
                .success-actions .btn {
                    min-width: unset;
                }
            }
        `;
    document.head.appendChild(style);

    // Add modal close functionality
    const closeModal = () => {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 300);
    };

    // Add close button functionality
    const addCloseButton = () => {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
                position: absolute;
                top: 15px;
                right: 20px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            `;

        closeBtn.addEventListener('click', closeModal);
        closeBtn.addEventListener('mouseenter', function () {
            this.style.background = 'rgba(255, 255, 255, 0.3)';
            this.style.transform = 'scale(1.1)';
        });
        closeBtn.addEventListener('mouseleave', function () {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
            this.style.transform = 'scale(1)';
        });

        const header = modal.querySelector('.success-header');
        if (header) {
            header.style.position = 'relative';
            header.appendChild(closeBtn);
        }
    };

    addCloseButton();

    // Click outside to close
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Auto-close after 60 seconds with countdown
    let autoCloseTimer = 60;
    const timerElement = document.createElement('div');
    timerElement.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            opacity: 0.8;
        `;
    timerElement.textContent = `Auto-close in ${autoCloseTimer}s`;
    modal.appendChild(timerElement);

    const countdown = setInterval(() => {
        autoCloseTimer--;
        timerElement.textContent = `Auto-close in ${autoCloseTimer}s`;

        if (autoCloseTimer <= 0) {
            clearInterval(countdown);
            if (document.getElementById('payment-success-modal')) {
                continueShoppingBtn?.click();
            }
        }
    }, 1000);

    // Clear timer if user interacts with modal
    modal.addEventListener('click', () => {
        if (autoCloseTimer > 10) {
            autoCloseTimer = 10;
            timerElement.textContent = `Auto-close in ${autoCloseTimer}s`;
        }
    });
}

// Enhanced receipt generation and download function
function generateAndDownloadReceipt(rental, paymentInfo) {
    try {
        console.log('Generating receipt for rental:', rental);

        // Ensure we have valid rental data
        if (!rental) {
            throw new Error('No rental data provided for receipt generation');
        }

        const receiptData = {
            confirmationId: rental.confirmationId || rental.id,
            date: rental.paymentDate || new Date().toISOString(),
            customerName: window.currentUserData?.name || 'Customer',
            customerEmail: window.currentUserData?.email || 'customer@example.com',
            customerPhone: window.currentUserData?.phone || 'N/A',
            item: {
                name: rental.productName,
                size: rental.size,
                quantity: rental.quantity || 1,
                dailyRate: rental.rentalFee,
                days: rental.days || 1
            },
            rental: {
                startDate: rental.startDate,
                endDate: rental.endDate,
                totalDays: rental.days || 1
            },
            costs: {
                rentalFee: rental.rentalFee,
                damageProtection: Math.round(rental.rentalFee * 0.15),
                deliveryFee: rental.rentalFee >= 100 ? 0 : 10,
                tax: Math.round((rental.rentalFee + Math.round(rental.rentalFee * 0.15) + (rental.rentalFee >= 100 ? 0 : 10)) * 0.08),
                total: rental.totalCost
            },
            payment: {
                method: paymentInfo?.method || 'Card',
                status: 'Completed',
                transactionId: rental.confirmationId || generateId()
            },
            delivery: {
                address: rental.deliveryAddress?.address || 'N/A',
                city: rental.deliveryAddress?.city || 'N/A',
                pincode: rental.deliveryAddress?.pincode || 'N/A'
            }
        };

        const receiptContent = generateReceiptContent(receiptData);
        downloadTextFile(receiptContent, `VASTRA_RENT_Receipt_${receiptData.confirmationId}.txt`);

        console.log('Receipt downloaded successfully');
        showNotification('Receipt downloaded successfully!', 'success');

    } catch (error) {
        console.error('Error generating receipt:', error);
        showNotification('Error generating receipt. Please try again.', 'error');
        throw error;
    }
}

// Generate receipt content
function generateReceiptContent(data) {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return `
═══════════════════════════════════════════════════════════════
                           VASTRA RENT
                      Fashion Rental Service
═══════════════════════════════════════════════════════════════

PAYMENT RECEIPT

Receipt Date: ${formatDate(data.date)} at ${formatTime(data.date)}
Confirmation ID: ${data.confirmationId}
Transaction ID: ${data.payment.transactionId}

───────────────────────────────────────────────────────────────
CUSTOMER INFORMATION
───────────────────────────────────────────────────────────────
Name: ${data.customerName}
Email: ${data.customerEmail}
Phone: ${data.customerPhone}

───────────────────────────────────────────────────────────────
RENTAL DETAILS
───────────────────────────────────────────────────────────────
Item: ${data.item.name}
Size: ${data.item.size}
Quantity: ${data.item.quantity}
Daily Rate: ₹${data.item.dailyRate.toFixed(2)}

Rental Period:
  Start Date: ${formatDate(data.rental.startDate)}
  End Date: ${formatDate(data.rental.endDate)}
  Total Days: ${data.rental.totalDays}

───────────────────────────────────────────────────────────────
DELIVERY ADDRESS
───────────────────────────────────────────────────────────────
${data.delivery.address}
${data.delivery.city} - ${data.delivery.pincode}

───────────────────────────────────────────────────────────────
COST BREAKDOWN
───────────────────────────────────────────────────────────────
Rental Fee (${data.rental.totalDays} days):        ₹${data.costs.rentalFee.toFixed(2)}
Damage Protection (15%):       ₹${data.costs.damageProtection.toFixed(2)}
Delivery Fee:                  ₹${data.costs.deliveryFee.toFixed(2)}
Tax (8%):                      ₹${data.costs.tax.toFixed(2)}
                              ─────────────
TOTAL AMOUNT PAID:             ₹${data.costs.total.toFixed(2)}

───────────────────────────────────────────────────────────────
PAYMENT INFORMATION
───────────────────────────────────────────────────────────────
Payment Method: ${data.payment.method}
Payment Status: ${data.payment.status}
Payment Date: ${formatDate(data.date)}

───────────────────────────────────────────────────────────────
TERMS & CONDITIONS
───────────────────────────────────────────────────────────────
• Items must be returned in original condition
• Late returns will incur additional charges
• Damage protection covers accidental damage only
• For support, contact: +91 98765 43210
• Email: support@vastrarent.com

───────────────────────────────────────────────────────────────
Thank you for choosing VASTRA RENT!
Visit us at: www.vastrarent.com
───────────────────────────────────────────────────────────────

Generated on: ${new Date().toLocaleString('en-IN')}
`;
}

// Download text file function
function downloadTextFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// Generate unique ID function
function generateId() {
    return 'VR' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Legacy download receipt function for backward compatibility
function downloadReceipt(rental) {
    try {
        const currentDate = new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const receiptContent = `
╔══════════════════════════════════════════════════════════════╗
║                    VASTRA RENT - RENTAL RECEIPT              ║
╚══════════════════════════════════════════════════════════════╝

Receipt Generated: ${currentDate}
Confirmation ID: ${rental.confirmationId || 'N/A'}
Payment Date: ${formatDate(rental.paymentDate) || currentDate}

┌──────────────────────────────────────────────────────────────┐
│                        RENTAL DETAILS                        │
└──────────────────────────────────────────────────────────────┘

Item Name: ${rental.productName || 'N/A'}
Category: ${rental.category || 'N/A'}
Size: ${rental.size || 'N/A'}
Quantity: ${rental.quantity || 1}
Rental Period: ${formatDateRange(rental.startDate, rental.endDate)}
Duration: ${rental.days || 1} day(s)

┌──────────────────────────────────────────────────────────────┐
│                       PAYMENT DETAILS                        │
└──────────────────────────────────────────────────────────────┘

Rental Fee: ₹${(rental.rentalFee || 0).toFixed(2)}
Damage Protection: ₹${Math.round((rental.rentalFee || 0) * 0.15).toFixed(2)}
Delivery Fee: ${(rental.rentalFee || 0) >= 2000 ? 'FREE' : '₹10.00'}
Tax (8%): ₹${Math.round(((rental.totalCost || 0) * 0.08)).toFixed(2)}
─────────────────────────────────────────────────────────────
TOTAL AMOUNT PAID: ₹${(rental.totalCost || 0).toFixed(2)}

Payment Method: ${rental.paymentMethod || 'Card Payment'}
Payment Status: SUCCESSFUL ✓

┌──────────────────────────────────────────────────────────────┐
│                      DELIVERY ADDRESS                        │
└──────────────────────────────────────────────────────────────┘

${rental.deliveryAddress?.name || 'Customer Name'}
${rental.deliveryAddress?.address || 'Address on file'}
${rental.deliveryAddress?.city || 'City'}, ${rental.deliveryAddress?.state || 'State'} ${rental.deliveryAddress?.zip || 'ZIP'}
Phone: ${rental.deliveryAddress?.phone || '+91 98765 43210'}

┌──────────────────────────────────────────────────────────────┐
│                    TERMS & CONDITIONS                        │
└──────────────────────────────────────────────────────────────┘

• Please keep this receipt for your records
• Items must be returned in original condition
• Late returns may incur additional charges
• Damage protection covers accidental damage only
• For any queries, contact customer support

┌──────────────────────────────────────────────────────────────┐
│                      CONTACT SUPPORT                         │
└──────────────────────────────────────────────────────────────┘

📞 Phone: +91 98765 43210
📧 Email: support@vastrarent.com
🌐 Website: www.vastrarent.com
📍 Address: 123 Fashion Street, Style City

Thank you for choosing VASTRA RENT!
Your style, our responsibility. 👗✨

═══════════════════════════════════════════════════════════════
            `;

        // Create and download the file
        const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = `VASTRA_RENT_Receipt_${rental.confirmationId || Date.now()}.txt`;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Also offer PDF download option
        setTimeout(() => {
            if (confirm('Would you like to download a PDF version as well?')) {
                downloadReceiptPDF(rental);
            }
        }, 1000);

        showNotification('Receipt downloaded successfully!', 'success');

    } catch (error) {
        console.error('Error downloading receipt:', error);
        showNotification('Error downloading receipt. Please try again.', 'error');
    }
}

// Download PDF receipt (simplified HTML to PDF)
function downloadReceiptPDF(rental) {
    try {
        const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <title>VASTRA RENT - Receipt</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; background: #d76d77; color: white; padding: 20px; border-radius: 10px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .row { display: flex; justify-content: space-between; margin: 5px 0; }
        .total { font-weight: bold; font-size: 1.2em; color: #d76d77; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>VASTRA RENT</h1>
        <h2>Rental Receipt</h2>
        <p>Confirmation ID: ${rental.confirmationId}</p>
    </div>
    
    <div class="section">
        <h3>Rental Details</h3>
        <div class="row"><span>Item:</span><span>${rental.productName}</span></div>
        <div class="row"><span>Size:</span><span>${rental.size}</span></div>
        <div class="row"><span>Quantity:</span><span>${rental.quantity}</span></div>
        <div class="row"><span>Period:</span><span>${formatDateRange(rental.startDate, rental.endDate)}</span></div>
    </div>
    
    <div class="section">
        <h3>Payment Summary</h3>
        <div class="row"><span>Rental Fee:</span><span>₹${(rental.rentalFee || 0).toFixed(2)}</span></div>
        <div class="row"><span>Damage Protection:</span><span>₹${Math.round((rental.rentalFee || 0) * 0.15).toFixed(2)}</span></div>
        <div class="row"><span>Delivery Fee:</span><span>${(rental.rentalFee || 0) >= 2000 ? 'FREE' : '₹10.00'}</span></div>
        <div class="row total"><span>Total Paid:</span><span>₹${(rental.totalCost || 0).toFixed(2)}</span></div>
    </div>
    
    <div class="footer">
        <p>Thank you for choosing VASTRA RENT!</p>
        <p>Support: +91 98765 43210 | support@vastrarent.com</p>
    </div>
</body>
</html>
            `;

        const blob = new Blob([pdfContent], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = `VASTRA_RENT_Receipt_${rental.confirmationId || Date.now()}.html`;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        showNotification('PDF receipt downloaded!', 'success');

    } catch (error) {
        console.error('Error downloading PDF receipt:', error);
        showNotification('Error downloading PDF receipt', 'error');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10002;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            animation: notificationSlideIn 0.3s ease;
            max-width: 400px;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'notificationSlideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);

    // Add CSS for notification animations
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
                @keyframes notificationSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes notificationSlideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                
                input.error {
                    border-color: #dc3545 !important;
                    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
                }
            `;
        document.head.appendChild(style);
    }
}

// Format date helper
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format date range helper
function formatDateRange(startDate, endDate) {
    const start = new Date(startDate).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
    });
    const end = new Date(endDate).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
    });
    return `${start} - ${end}`;
}
// Add UPI modal styles
function addUpiModalStyles() {
    if (document.getElementById('upi-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'upi-modal-styles';
    style.textContent = `
            .payment-type-selector {
                margin-bottom: 25px;
                padding: 20px;
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border-radius: 12px;
                border: 1px solid #dee2e6;
            }
            
            .payment-types h4 {
                margin: 0 0 15px 0;
                color: #495057;
                font-size: 1.1rem;
            }
            
            .type-options {
                display: flex;
                gap: 15px;
            }
            
            .type-option {
                flex: 1;
                padding: 20px;
                background: white;
                border: 2px solid #e9ecef;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .type-option:hover {
                border-color: #d76d77;
                box-shadow: 0 2px 8px rgba(215, 109, 119, 0.2);
            }
            
            .type-option.active {
                border-color: #d76d77;
                background: linear-gradient(135deg, #fff5f5, #ffffff);
                box-shadow: 0 4px 12px rgba(215, 109, 119, 0.3);
            }
            
            .type-icon {
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #d76d77, #c55a64);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
            }
            
            .type-info h5 {
                margin: 0 0 5px 0;
                color: #333;
                font-size: 1.1rem;
            }
            
            .type-info p {
                margin: 0;
                color: #666;
                font-size: 0.9rem;
            }
            
            .upi-fields {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                border: 1px solid #dee2e6;
            }
            
            .upi-options {
                margin-top: 20px;
            }
            
            .upi-options h5 {
                margin: 0 0 15px 0;
                color: #495057;
            }
            
            .upi-apps {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            .upi-app {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                padding: 15px;
                background: white;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 80px;
            }
            
            .upi-app:hover {
                border-color: #d76d77;
                transform: translateY(-2px);
            }
            
            .upi-app.selected {
                border-color: #d76d77;
                background: #fff5f5;
            }
            
            .upi-app img {
                width: 40px;
                height: 40px;
                border-radius: 8px;
            }
            
            .upi-app span {
                font-size: 0.8rem;
                font-weight: 500;
                color: #333;
            }
            
            .upi-qr-section {
                margin-top: 25px;
                padding: 20px;
                background: white;
                border-radius: 10px;
                border: 1px solid #dee2e6;
            }
            
            .qr-code-container {
                display: flex;
                gap: 20px;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .qr-code {
                width: 120px;
                height: 120px;
                background: #f8f9fa;
                border: 2px dashed #dee2e6;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #6c757d;
            }
            
            .qr-code i {
                font-size: 2rem;
                margin-bottom: 10px;
            }
            
            .qr-info p {
                margin: 0 0 5px 0;
                color: #495057;
            }
            
            .upi-modal-content {
                background: white;
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
            }
            
            .upi-header {
                text-align: center;
                padding: 30px 30px 20px;
                background: linear-gradient(135deg, #d76d77, #c55a64);
                color: white;
                border-radius: 20px 20px 0 0;
            }
            
            .upi-header h3 {
                margin: 0 0 10px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .upi-payment-details {
                padding: 30px;
            }
            
            .payment-amount {
                text-align: center;
                margin-bottom: 25px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 10px;
            }
            
            .payment-amount h2 {
                margin: 0 0 5px 0;
                color: #d76d77;
                font-size: 2.5rem;
            }
            
            .payment-amount p {
                margin: 0;
                color: #666;
            }
            
            .upi-info {
                margin-bottom: 25px;
            }
            
            .info-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #eee;
            }
            
            .info-row:last-child {
                border-bottom: none;
            }
            
            .upi-qr-display {
                text-align: center;
                margin-bottom: 25px;
            }
            
            .qr-code-large {
                display: inline-block;
                padding: 20px;
                background: white;
                border: 2px solid #dee2e6;
                border-radius: 10px;
            }
            
            .qr-pattern-large {
                width: 150px;
                height: 150px;
                display: grid;
                grid-template-columns: repeat(10, 1fr);
                gap: 1px;
                margin-bottom: 15px;
            }
            
            .qr-pixel {
                background: #f8f9fa;
                aspect-ratio: 1;
            }
            
            .qr-pixel.filled {
                background: #333;
            }
            
            .upi-apps-list {
                text-align: center;
                margin-bottom: 25px;
            }
            
            .upi-app-buttons {
                display: flex;
                gap: 10px;
                justify-content: center;
                margin-top: 15px;
            }
            
            .upi-app-btn {
                padding: 10px 15px;
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.9rem;
            }
            
            .upi-app-btn:hover {
                background: #d76d77;
                color: white;
                border-color: #d76d77;
            }
            
            .upi-actions {
                padding: 20px 30px;
                border-top: 1px solid #eee;
                display: flex;
                gap: 15px;
                justify-content: center;
            }
            
            .upi-timer {
                text-align: center;
                padding: 15px 30px;
                background: #fff3cd;
                border-radius: 0 0 20px 20px;
                color: #856404;
                font-size: 0.9rem;
            }
            
            .qr-squares {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 2px;
                width: 60px;
                height: 60px;
            }
            
            .qr-square {
                background: #f8f9fa;
                aspect-ratio: 1;
            }
            
            .qr-square.filled {
                background: #333;
            }
            
            @media (max-width: 768px) {
                .type-options {
                    flex-direction: column;
                }
                
                .upi-apps {
                    justify-content: center;
                }
                
                .qr-code-container {
                    flex-direction: column;
                    text-align: center;
                }
                
                .upi-app-buttons {
                    flex-direction: column;
                }
                
                .upi-modal-content {
                    width: 95%;
                    margin: 20px;
                }
            }
        `;
    document.head.appendChild(style);
}

// Update the main payment processing function
function processSinglePayment(rentalData) {
    const paymentInfo = getPaymentFormData();
    if (!paymentInfo) return;

    // Check if using UPI or card
    const selectedMethod = document.querySelector('.method-option.selected');
    const activeType = document.querySelector('.type-option.active')?.dataset.type;

    if (!selectedMethod && activeType === 'upi') {
        // Process UPI payment
        if (processUpiPayment(rentalData, paymentInfo)) {
            return; // UPI modal will handle the rest
        }
    }

    // Standard card payment processing
    const submitBtn = paymentForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
    submitBtn.disabled = true;

    showLoadingOverlay('Processing your payment...');

    setTimeout(() => {
        try {
            const rental = createRentalRecord(rentalData, paymentInfo);
            saveRentalToHistory(rental);
            updateInventoryAvailability(rental.productId, false);

            localStorage.removeItem('currentRental');
            localStorage.removeItem('checkoutCart');
            localStorage.removeItem('pendingRental');

            hideLoadingOverlay();
            showEnhancedSuccessModal(rental, paymentInfo);

        } catch (error) {
            console.error('Payment processing error:', error);
            hideLoadingOverlay();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showNotification('Payment processing failed. Please try again.', 'error');
        }
    }, 3000);
}
// Setup success modal buttons with robust event handling
function setupSuccessModalButtons(modal, rental, paymentInfo) {
    console.log('Setting up success modal buttons with rental data:', rental);

    // Ensure rental data has required properties
    if (!rental || !rental.id) {
        console.error('Invalid rental data provided to setupSuccessModalButtons:', rental);
        return;
    }

    // Find buttons within the modal with multiple attempts
    let attempts = 0;
    const maxAttempts = 10;

    function findAndSetupButtons() {
        attempts++;
        console.log(`Button setup attempt ${attempts}/${maxAttempts}`);

        const viewRentalBtn = modal.querySelector('#view-rental-status');
        const continueShoppingBtn = modal.querySelector('#continue-shopping');
        const downloadReceiptBtn = modal.querySelector('#download-receipt');

        console.log('Buttons found:', {
            viewRental: !!viewRentalBtn,
            continueShopping: !!continueShoppingBtn,
            downloadReceipt: !!downloadReceiptBtn
        });

        if (!viewRentalBtn || !continueShoppingBtn || !downloadReceiptBtn) {
            if (attempts < maxAttempts) {
                console.log('Buttons not found, retrying in 100ms...');
                setTimeout(findAndSetupButtons, 100);
                return;
            } else {
                console.error('Failed to find buttons after maximum attempts');
            }
        }

        // View Rental Status Button - Enhanced with immediate data saving
        if (viewRentalBtn) {
            // Remove any existing listeners
            const newViewBtn = viewRentalBtn.cloneNode(true);
            viewRentalBtn.parentNode.replaceChild(newViewBtn, viewRentalBtn);

            newViewBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                console.log('View Rental Status clicked with rental:', rental);

                // Add loading state
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.disabled = true;

                try {
                    // Ensure rental data is properly structured and saved
                    const rentalToSave = {
                        id: rental.id || rental.confirmationId || generateId(),
                        confirmationId: rental.confirmationId || rental.id,
                        productId: rental.productId,
                        productName: rental.productName,
                        productImage: rental.productImage,
                        category: rental.category,
                        size: rental.size,
                        quantity: rental.quantity || 1,
                        startDate: rental.startDate,
                        endDate: rental.endDate,
                        totalCost: rental.totalCost,
                        rentalFee: rental.rentalFee,
                        status: 'confirmed',
                        paymentDate: rental.paymentDate || new Date().toISOString(),
                        deliveryAddress: rental.deliveryAddress,
                        paymentMethod: paymentInfo?.method || 'Card',
                        days: rental.days || 1
                    };

                    console.log('Saving rental to history:', rentalToSave);

                    // Save to rental history
                    let rentalHistory = JSON.parse(localStorage.getItem('rentalHistory')) || [];

                    // Remove any existing rental with same ID
                    rentalHistory = rentalHistory.filter(r => r.id !== rentalToSave.id);

                    // Add new rental at the beginning
                    rentalHistory.unshift(rentalToSave);
                    localStorage.setItem('rentalHistory', JSON.stringify(rentalHistory));

                    // Store rental ID for highlighting in rental status page
                    localStorage.setItem('highlightRental', rentalToSave.id);
                    localStorage.setItem('newRental', JSON.stringify(rentalToSave));

                    console.log('Rental data saved successfully. Redirecting to rental-status.html');

                    // Force immediate redirect
                    window.location.replace('rental-status.html');

                } catch (error) {
                    console.error('Error in View Rental Status:', error);
                    this.innerHTML = originalHTML;
                    this.disabled = false;
                    showNotification('Error opening rental status page. Please try again.', 'error');
                }
            });

            console.log('View Rental Status button event listener added');
        }

        // Continue Shopping Button - Enhanced with proper cleanup
        if (continueShoppingBtn) {
            // Remove any existing listeners
            const newShoppingBtn = continueShoppingBtn.cloneNode(true);
            continueShoppingBtn.parentNode.replaceChild(newShoppingBtn, continueShoppingBtn);

            newShoppingBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                console.log('Continue Shopping clicked');

                // Add loading state
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.disabled = true;

                try {
                    // Clear all checkout-related data
                    const keysToRemove = [
                        'currentRental',
                        'checkoutCart',
                        'selectedItem',
                        'pendingRental',
                        'checkoutData',
                        'paymentData'
                    ];

                    keysToRemove.forEach(key => {
                        localStorage.removeItem(key);
                        console.log(`Removed ${key} from localStorage`);
                    });

                    console.log('Checkout data cleared. Redirecting to inventory.html');

                    // Force immediate redirect
                    window.location.replace('inventory.html');

                } catch (error) {
                    console.error('Error in Continue Shopping:', error);
                    this.innerHTML = originalHTML;
                    this.disabled = false;
                    showNotification('Error opening inventory page. Please try again.', 'error');
                }
            });

            console.log('Continue Shopping button event listener added');
        }

        // Download Receipt Button - Enhanced with better receipt generation
        if (downloadReceiptBtn) {
            // Remove any existing listeners
            const newReceiptBtn = downloadReceiptBtn.cloneNode(true);
            downloadReceiptBtn.parentNode.replaceChild(newReceiptBtn, downloadReceiptBtn);

            newReceiptBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                console.log('Download Receipt clicked with rental:', rental);

                // Add loading state
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
                this.disabled = true;

                try {
                    // Generate and download receipt
                    generateAndDownloadReceipt(rental, paymentInfo);

                    // Show success feedback
                    this.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
                    this.style.background = '#28a745';
                    this.style.borderColor = '#28a745';
                    this.style.color = 'white';

                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.style.background = '';
                        this.style.borderColor = '';
                        this.style.color = '';
                        this.disabled = false;
                    }, 2000);

                } catch (error) {
                    console.error('Error downloading receipt:', error);
                    this.innerHTML = originalHTML;
                    this.disabled = false;
                    showNotification('Error downloading receipt. Please try again.', 'error');
                }
            });

            console.log('Download Receipt button event listener added');
        }

        // Add keyboard navigation
        modal.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                continueShoppingBtn?.click();
            } else if (e.key === 'Enter') {
                viewRentalBtn?.click();
            }
        });

        // Focus on the first button
        setTimeout(() => {
            const firstBtn = modal.querySelector('#view-rental-status');
            if (firstBtn) {
                firstBtn.focus();
            }
        }, 200);

        console.log('Success modal buttons setup complete');
    }

    // Start the button setup process
    findAndSetupButtons();
}

// Enhanced backup button functionality using event delegation
document.addEventListener('click', function (e) {
    // Backup for View Rental Status
    if (e.target.id === 'view-rental-status' || e.target.closest('#view-rental-status')) {
        console.log('Backup: View Rental Status clicked');

        try {
            // Get rental data from the most recent transaction
            const rentalHistory = JSON.parse(localStorage.getItem('rentalHistory')) || [];
            if (rentalHistory.length > 0) {
                const latestRental = rentalHistory[0];
                localStorage.setItem('highlightRental', latestRental.id);
                localStorage.setItem('newRental', JSON.stringify(latestRental));
                console.log('Backup: Rental data prepared for status page');
            }

            console.log('Backup: Redirecting to rental-status.html');
            window.location.replace('rental-status.html');

        } catch (error) {
            console.error('Backup: Error in View Rental Status:', error);
            showNotification('Error opening rental status page', 'error');
        }
    }

    // Backup for Continue Shopping
    if (e.target.id === 'continue-shopping' || e.target.closest('#continue-shopping')) {
        console.log('Backup: Continue Shopping clicked');

        try {
            // Clear all checkout-related data
            const keysToRemove = [
                'currentRental',
                'checkoutCart',
                'selectedItem',
                'pendingRental',
                'checkoutData',
                'paymentData'
            ];

            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });

            console.log('Backup: Checkout data cleared, redirecting to inventory.html');
            window.location.replace('inventory.html');

        } catch (error) {
            console.error('Backup: Error in Continue Shopping:', error);
            showNotification('Error opening inventory page', 'error');
        }
    }

    // Backup for Download Receipt
    if (e.target.id === 'download-receipt' || e.target.closest('#download-receipt')) {
        console.log('Backup: Download Receipt clicked');

        try {
            // Get the most recent rental for receipt
            const rentalHistory = JSON.parse(localStorage.getItem('rentalHistory')) || [];
            if (rentalHistory.length > 0) {
                const latestRental = rentalHistory[0];
                generateAndDownloadReceipt(latestRental, { method: 'Card' });
            } else {
                showNotification('No rental data found for receipt generation', 'error');
            }

        } catch (error) {
            console.error('Backup: Error downloading receipt:', error);
            showNotification('Error downloading receipt', 'error');
        }
    }
});

// Enhanced global functions for manual testing and debugging
window.testViewRentalStatus = function () {
    console.log('Manual test: View Rental Status');
    try {
        const rentalHistory = JSON.parse(localStorage.getItem('rentalHistory')) || [];
        if (rentalHistory.length > 0) {
            const latestRental = rentalHistory[0];
            localStorage.setItem('highlightRental', latestRental.id);
            localStorage.setItem('newRental', JSON.stringify(latestRental));
        }
        window.location.replace('rental-status.html');
    } catch (error) {
        console.error('Test error:', error);
        alert('Error: ' + error.message);
    }
};

window.testContinueShopping = function () {
    console.log('Manual test: Continue Shopping');
    try {
        // Clear checkout data
        ['currentRental', 'checkoutCart', 'selectedItem', 'pendingRental'].forEach(key => {
            localStorage.removeItem(key);
        });
        window.location.replace('inventory.html');
    } catch (error) {
        console.error('Test error:', error);
        alert('Error: ' + error.message);
    }
};

window.testDownloadReceipt = function () {
    console.log('Manual test: Download Receipt');
    try {
        const rentalHistory = JSON.parse(localStorage.getItem('rentalHistory')) || [];
        if (rentalHistory.length > 0) {
            generateAndDownloadReceipt(rentalHistory[0], { method: 'Test' });
            console.log('Receipt download test completed');
        } else {
            console.log('No rental data found for receipt test');
            alert('No rental data found. Please complete a payment first.');
        }
    } catch (error) {
        console.error('Test error:', error);
        alert('Error: ' + error.message);
    }
};

// Debug function to check button functionality
window.debugPaymentButtons = function () {
    console.log('=== PAYMENT BUTTONS DEBUG ===');

    const modal = document.getElementById('payment-success-modal');
    console.log('Success modal exists:', !!modal);

    if (modal) {
        const viewBtn = modal.querySelector('#view-rental-status');
        const shopBtn = modal.querySelector('#continue-shopping');
        const receiptBtn = modal.querySelector('#download-receipt');

        console.log('Buttons found:', {
            viewRental: !!viewBtn,
            continueShopping: !!shopBtn,
            downloadReceipt: !!receiptBtn
        });

        if (viewBtn) console.log('View button text:', viewBtn.textContent.trim());
        if (shopBtn) console.log('Shop button text:', shopBtn.textContent.trim());
        if (receiptBtn) console.log('Receipt button text:', receiptBtn.textContent.trim());
    }

    const rentalHistory = JSON.parse(localStorage.getItem('rentalHistory')) || [];
    console.log('Rental history count:', rentalHistory.length);

    if (rentalHistory.length > 0) {
        console.log('Latest rental:', rentalHistory[0]);
    }

    console.log('=== DEBUG COMPLETE ===');
};

// Force functions for emergency use
window.forceViewRentalStatus = function () {
    console.log('FORCE: Redirecting to rental status');
    window.location.replace('rental-status.html');
};

window.forceContinueShopping = function () {
    console.log('FORCE: Redirecting to inventory');
    window.location.replace('inventory.html');
};
        // Debug function to test button functionality
window.debugPaymentButtons = function () {
    console.log('=== PAYMENT BUTTON DEBUG ===');

    const modal = document.getElementById('payment-success-modal');
    console.log('Modal found:', !!modal);

    if (modal) {
        const viewBtn = modal.querySelector('#view-rental-status');
        const shopBtn = modal.querySelector('#continue-shopping');
        const downloadBtn = modal.querySelector('#download-receipt');

        console.log('Buttons found:', {
            viewRental: !!viewBtn,
            continueShopping: !!shopBtn,
            downloadReceipt: !!downloadBtn
        });

        if (viewBtn) {
            console.log('View button HTML:', viewBtn.outerHTML);
            console.log('View button onclick:', viewBtn.onclick);
            console.log('View button event listeners:', getEventListeners ? getEventListeners(viewBtn) : 'DevTools required');
        }
    }

    // Check rental history
    const rentalHistory = JSON.parse(localStorage.getItem('rentalHistory')) || [];
    console.log('Rental history count:', rentalHistory.length);
    console.log('Latest rental:', rentalHistory[0]);

    console.log('=== END DEBUG ===');
};

// Simple redirect functions for testing
window.forceViewRentalStatus = function () {
    console.log('Force redirecting to rental status...');
    window.location.href = 'rental-status.html';
};

window.forceContinueShopping = function () {
    console.log('Force redirecting to inventory...');
    window.location.href = 'inventory.html';
};

console.log('Payment.js loaded successfully. Debug functions available:');
console.log('- window.debugPaymentButtons()');
console.log('- window.forceViewRentalStatus()');
console.log('- window.forceContinueShopping()');
console.log('- window.testDownloadReceipt()');

// Initialize success modal functionality on page load
document.addEventListener('DOMContentLoaded', function () {
    console.log('Payment page loaded - Success modal functionality initialized');

    // Add global click handler for success modal buttons (immediate setup)
    document.addEventListener('click', function (e) {
        const target = e.target;
        const modal = document.getElementById('payment-success-modal');

        if (!modal) return;

        // Handle View Rental Status button clicks
        if (target.id === 'view-rental-status' || target.closest('#view-rental-status')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Global handler: View Rental Status clicked');

            try {
                const rentalHistory = JSON.parse(localStorage.getItem('rentalHistory')) || [];
                if (rentalHistory.length > 0) {
                    const latestRental = rentalHistory[0];
                    localStorage.setItem('highlightRental', latestRental.id);
                    localStorage.setItem('newRental', JSON.stringify(latestRental));
                }
                window.location.replace('rental-status.html');
            } catch (error) {
                console.error('Global handler error:', error);
                showNotification('Error opening rental status page', 'error');
            }
        }

        // Handle Continue Shopping button clicks
        if (target.id === 'continue-shopping' || target.closest('#continue-shopping')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Global handler: Continue Shopping clicked');

            try {
                ['currentRental', 'checkoutCart', 'selectedItem', 'pendingRental'].forEach(key => {
                    localStorage.removeItem(key);
                });
                window.location.replace('inventory.html');
            } catch (error) {
                console.error('Global handler error:', error);
                showNotification('Error opening inventory page', 'error');
            }
        }

        // Handle Download Receipt button clicks
        if (target.id === 'download-receipt' || target.closest('#download-receipt')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Global handler: Download Receipt clicked');

            try {
                const rentalHistory = JSON.parse(localStorage.getItem('rentalHistory')) || [];
                if (rentalHistory.length > 0) {
                    generateAndDownloadReceipt(rentalHistory[0], { method: 'Card' });
                } else {
                    showNotification('No rental data found for receipt', 'error');
                }
            } catch (error) {
                console.error('Global handler error:', error);
                showNotification('Error downloading receipt', 'error');
            }
        }
    }, true); // Use capture phase to ensure we catch the event first

    console.log('Global success modal button handlers registered');
});

// Utility function to ensure modal buttons work
window.ensureModalButtonsWork = function () {
    const modal = document.getElementById('payment-success-modal');
    if (!modal) {
        console.log('No success modal found');
        return;
    }

    const buttons = modal.querySelectorAll('.btn');
    console.log(`Found ${buttons.length} buttons in modal`);

    buttons.forEach((btn, index) => {
        console.log(`Button ${index + 1}: ${btn.id} - ${btn.textContent.trim()}`);

        // Ensure button is clickable
        btn.style.pointerEvents = 'auto';
        btn.style.cursor = 'pointer';

        // Add visual feedback on hover
        btn.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
        });

        btn.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    console.log('Modal buttons ensured to work');
};

console.log('Payment.js: Success modal enhancements loaded successfully');