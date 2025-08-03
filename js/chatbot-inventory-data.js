// Comprehensive Inventory Data for Chatbot
// This file contains detailed inventory information for the AI chatbot

const CHATBOT_INVENTORY_DATA = {
    categories: {
        men: {
            'Jodhpuri': {
                basePrice: 2800,
                weeklyPrice: 7200,
                items: [
                    { id: 1, name: 'White classic open jacket Jodhpuri', size: 'M', available: true, image: 'img/men/Jodhpuri suits/image_22.jpg' },
                    { id: 2, name: 'Black embroidered booti Jodhpuri', size: 'L', available: true, image: 'img/men/Jodhpuri suits/image_1.jpg' },
                    { id: 3, name: 'Purple mirror Jodhpuri', size: 'S', available: true, image: 'img/men/Jodhpuri suits/image_15.jpg' },
                    { id: 4, name: 'Grey collar embroidered Jodhpuri', size: 'XS', available: true, image: 'img/men/Jodhpuri suits/image_10.jpg' },
                    { id: 5, name: 'Navy blue floral Jodhpuri', size: 'XL', available: true, image: 'img/men/Jodhpuri suits/image_13.jpg' },
                    { id: 6, name: 'Yellow embroidered classy jodhpuri', size: 'M', available: true, image: 'img/men/Jodhpuri suits/image_18.jpg' },
                    { id: 7, name: 'Violet designer attached dupatta Jodhpuri', size: 'L', available: true, image: 'img/men/Jodhpuri suits/image_27.jpg' }
                ]
            },
            'Kurta': {
                basePrice: 1800,
                weeklyPrice: 4800,
                items: [
                    { id: 8, name: 'Blue mirror work Kurta with pyjama', size: 'M', available: true, image: 'img/men/Kurta Sets/image_1.jpg' },
                    { id: 9, name: 'Green heavy embroidered Kurta set', size: 'S', available: true, image: 'img/men/Kurta Sets/image_5.jpg' },
                    { id: 10, name: 'Pink Kurta-set', size: 'M', available: true, image: 'img/men/Kurta Sets/image_28.jpg' },
                    { id: 11, name: 'White collar embroidered Kurta-set', size: 'L', available: true, image: 'img/men/Kurta Sets/image_31.jpg' },
                    { id: 12, name: 'Pista green embroidered Kurta-set', size: 'S', available: true, image: 'img/men/Kurta Sets/image_29.jpg' },
                    { id: 13, name: 'Maroon Kurta-set', size: 'S', available: true, image: 'img/men/Kurta Sets/image_15.jpg' }
                ]
            },
            'Tuxedo': {
                basePrice: 2500,
                weeklyPrice: 6500,
                items: [
                    { id: 14, name: 'Black Tuxedo', size: 'S', available: true, image: 'img/men/Tuxedos/image_1.jpeg' },
                    { id: 15, name: 'Dark Blue Tuxedo', size: 'S', available: true, image: 'img/men/Tuxedos/image_4.jpeg' },
                    { id: 16, name: 'Grey Tuxedo', size: 'S', available: true, image: 'img/men/Tuxedos/image_5.jpeg' },
                    { id: 17, name: 'Navy Blue Tuxedo', size: 'S', available: true, image: 'img/men/Tuxedos/image_11.jpeg' },
                    { id: 18, name: 'Black 3-piece Tuxedo', size: 'S', available: true, image: 'img/men/Tuxedos/image_6.jpeg' },
                    { id: 19, name: 'Dark Grey Tuxedo', size: 'S', available: true, image: 'img/men/Tuxedos/image_15.jpeg' }
                ]
            },
            'Blazer': {
                basePrice: 2200,
                weeklyPrice: 6000,
                items: [
                    { id: 20, name: 'Black Blazer', size: 'S', available: true, image: 'img/men/Blazer/image_1.jpg' }
                ]
            },
            'Sherwani': {
                basePrice: 3500,
                weeklyPrice: 9000,
                items: [
                    { id: 45, name: 'White Sherwani', size: 'S', available: true, image: 'img/men/Sherwani/image_3.jpg' },
                    { id: 46, name: 'Golden Sherwani', size: 'S', available: true, image: 'img/men/Sherwani/image_4.jpg' },
                    { id: 47, name: 'Green Sherwani', size: 'S', available: true, image: 'img/men/Sherwani/image_7.jpg' },
                    { id: 48, name: 'Peach Sherwani', size: 'S', available: true, image: 'img/men/Sherwani/image_9.jpg' },
                    { id: 49, name: 'Cream Sherwani', size: 'S', available: true, image: 'img/men/Sherwani/image_1.jpg' }
                ]
            },
            'Suit': {
                basePrice: 2000,
                weeklyPrice: 5500,
                items: [
                    { id: 50, name: 'Black Suit', size: 'S', available: true, image: 'img/men/suits/image_33.jpg' },
                    { id: 51, name: 'Black 3-piece suit', size: 'S', available: true, image: 'img/men/suits/image_3.jpg' },
                    { id: 52, name: 'Blue Checks 3-piece suit', size: 'S', available: true, image: 'img/men/suits/image_9.jpg' },
                    { id: 53, name: 'Brick Brown suit', size: 'S', available: true, image: 'img/men/suits/image_25.jpg' },
                    { id: 54, name: 'Green suit', size: 'S', available: true, image: 'img/men/suits/image_35.jpg' },
                    { id: 55, name: 'Dark Green suit', size: 'S', available: true, image: 'img/men/suits/image_31.jpg' }
                ]
            },
            'Indowastern': {
                basePrice: 2500,
                weeklyPrice: 6500,
                items: [
                    { id: 34, name: 'Off-white Indowastern', size: 'S', available: true, image: 'img/men/indowastern/image_1.jpg' },
                    { id: 35, name: 'Black indowastern', size: 'S', available: true, image: 'img/men/indowastern/image_9.jpg' },
                    { id: 36, name: 'Green indowastern', size: 'S', available: true, image: 'img/men/indowastern/image_19.jpg' },
                    { id: 37, name: 'Maroon indowastern', size: 'S', available: true, image: 'img/men/indowastern/image_27.jpg' },
                    { id: 38, name: 'Blue indowastern', size: 'S', available: true, image: 'img/men/indowastern/image_29.jpg' },
                    { id: 39, name: 'Pink indowastern', size: 'S', available: true, image: 'img/men/indowastern/image_35.jpg' },
                    { id: 40, name: 'Peach indowastern', size: 'S', available: true, image: 'img/men/indowastern/image_33.jpg' }
                ]
            }
        },
        women: {
            'Lehnga': {
                basePrice: 4500,
                weeklyPrice: 12000,
                items: [
                    { id: 21, name: 'Celebrity Lehnga', size: 'S', available: true, image: 'img/women/lehnga/image_1.webp' },
                    { id: 22, name: 'Maroon Lehnga', size: 'S', available: true, image: 'img/women/lehnga/image_5.webp' },
                    { id: 23, name: 'Red Lehnga', size: 'S', available: true, image: 'img/women/lehnga/image_12.webp' },
                    { id: 24, name: 'Dark Blue Lehnga', size: 'S', available: true, image: 'img/women/lehnga/image_6.webp' },
                    { id: 25, name: 'Light Pink Lehnga', size: 'S', available: true, image: 'img/women/lehnga/image_11.webp' },
                    { id: 26, name: 'Purple Lehnga', size: 'S', available: true, image: 'img/women/lehnga/image_8.webp' },
                    { id: 27, name: 'Black Lehnga', size: 'S', available: true, image: 'img/women/lehnga/image_4.webp' },
                    { id: 28, name: 'Brown Lehnga', size: 'S', available: true, image: 'img/women/lehnga/image_13.webp' },
                    { id: 29, name: 'Blue Lehnga', size: 'S', available: true, image: 'img/women/lehnga/image_21.webp' }
                ]
            },
            'Gown': {
                basePrice: 2800,
                weeklyPrice: 7500,
                items: [
                    { id: 30, name: 'Dark Blue Gown', size: 'S', available: true, image: 'img/women/gown/image_1.jpg' },
                    { id: 31, name: 'Red Gown', size: 'S', available: true, image: 'img/women/gown/image_13.jpg' },
                    { id: 32, name: 'Maroon Gown', size: 'S', available: true, image: 'img/women/gown/image_5.jpg' },
                    { id: 33, name: 'Beige Gown', size: 'S', available: true, image: 'img/women/gown/image_22.jpg' }
                ]
            },
            'Anarkali': {
                basePrice: 3200,
                weeklyPrice: 8500,
                items: [
                    { id: 41, name: 'Red Anarkali', size: 'S', available: true, image: 'img/women/Anarkali/image_1.jpg' },
                    { id: 42, name: 'White Anarkali', size: 'S', available: true, image: 'img/women/Anarkali/image_22.jpg' },
                    { id: 43, name: 'Pink Anarkali', size: 'S', available: true, image: 'img/women/Anarkali/image_7.jpg' },
                    { id: 44, name: 'Golden Anarkali', size: 'S', available: true, image: 'img/women/Anarkali/image_4.jpg' }
                ]
            },
            'Sharara': {
                basePrice: 2800,
                weeklyPrice: 7500,
                items: [
                    // Add Sharara items when available
                ]
            }
        }
    },
    
    // Occasion-based recommendations
    occasions: {
        wedding: {
            men: ['Sherwani', 'Jodhpuri', 'Indowastern'],
            women: ['Lehnga', 'Anarkali']
        },
        party: {
            men: ['Tuxedo', 'Suit', 'Blazer'],
            women: ['Gown', 'Anarkali']
        },
        festival: {
            men: ['Kurta', 'Jodhpuri', 'Indowastern'],
            women: ['Anarkali', 'Lehnga']
        },
        business: {
            men: ['Suit', 'Blazer'],
            women: ['Gown']
        }
    },
    
    // Size guide
    sizeGuide: {
        men: {
            'XS': 'Chest: 34-36", Waist: 28-30"',
            'S': 'Chest: 36-38", Waist: 30-32"',
            'M': 'Chest: 38-40", Waist: 32-34"',
            'L': 'Chest: 40-42", Waist: 34-36"',
            'XL': 'Chest: 42-44", Waist: 36-38"'
        },
        women: {
            'XS': 'Bust: 32-34", Waist: 24-26", Hip: 34-36"',
            'S': 'Bust: 34-36", Waist: 26-28", Hip: 36-38"',
            'M': 'Bust: 36-38", Waist: 28-30", Hip: 38-40"',
            'L': 'Bust: 38-40", Waist: 30-32", Hip: 40-42"',
            'XL': 'Bust: 40-42", Waist: 32-34", Hip: 42-44"'
        }
    },
    
    // Styling tips
    stylingTips: {
        'Jodhpuri': 'Perfect for weddings and formal events. Pair with traditional mojaris or formal shoes.',
        'Kurta': 'Ideal for festivals and casual traditional events. Comfortable and versatile.',
        'Tuxedo': 'Classic choice for black-tie events, galas, and formal parties.',
        'Sherwani': 'Traditional wedding wear for grooms and wedding guests.',
        'Lehnga': 'Perfect for weddings, especially bridal occasions. Choose colors based on the event time.',
        'Gown': 'Elegant choice for cocktail parties, receptions, and formal events.',
        'Anarkali': 'Versatile traditional wear suitable for various occasions from casual to formal.'
    }
};

// Make data globally available
if (typeof window !== 'undefined') {
    window.CHATBOT_INVENTORY_DATA = CHATBOT_INVENTORY_DATA;
}