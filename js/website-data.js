// VastraRent Website Data for AI Chatbot
// Comprehensive data about inventory, categories, payment methods, and company information

window.VASTA_RENT_DATA = {
    // Company Information
    company: {
        name: "Vastra Rent",
        tagline: "Premium Clothing Rental Service",
        description: "Vastra Rent is a premium fashion rental service offering designer clothing for all occasions. We provide high-quality, stylish outfits for weddings, parties, business events, and special occasions.",
        founded: "2023",
        mission: "To make premium fashion accessible to everyone through affordable rental services.",
        vision: "To become the leading fashion rental platform in India."
    },

    // Contact Information
    contact: {
        phone: "+91 9898471702",
        email: "project172305@gmail.com",
        address: "Vadodara, Gujarat, IN 390019",
        hours: {
            monday: "10:00 AM - 8:00 PM",
            tuesday: "10:00 AM - 8:00 PM",
            wednesday: "10:00 AM - 8:00 PM",
            thursday: "10:00 AM - 8:00 PM",
            friday: "10:00 AM - 8:00 PM",
            saturday: "10:00 AM - 8:00 PM",
            sunday: "10:00 AM - 8:00 PM"
        },
        workingHours: "Monday - Sunday: 10:00 AM - 8:00 PM"
    },

    // Pricing Information
    pricing: {
        rentalRange: "₹600 - ₹3500 per day",
        depositRange: "₹2000 - ₹5000",
        delivery: {
            withinCity: "Free delivery within Vadodara city limits",
            outsideCity: "Additional charges apply for delivery outside city",
            sameDay: "Same-day delivery available (additional charges)",
            express: "Express delivery available"
        },
        specialOffers: {
            newCustomer: "10% discount for first-time customers",
            groupBooking: "15% discount for group bookings (5+ outfits)",
            advanceBooking: "5% discount for bookings made 7+ days in advance",
            weeklyRental: "20% discount for weekly rentals"
        }
    },

    // Inventory Categories
    categories: {
        women: {
            name: "Women's Collection",
            description: "Elegant and stylish outfits for women",
            subcategories: {
                anarkali: {
                    name: "Anarkali Suits",
                    description: "Traditional and modern Anarkali suits perfect for weddings and festive occasions",
                    priceRange: "₹800 - ₹2500 per day",
                    occasions: ["Weddings", "Festivals", "Parties", "Cultural Events"],
                    features: ["Embroidered", "Silk", "Georgette", "Designer", "Bridal"],
                    count: 15
                },
                lehnga: {
                    name: "Lehnga Collection",
                    description: "Stunning bridal and party lehngas with intricate work",
                    priceRange: "₹1200 - ₹3500 per day",
                    occasions: ["Bridal", "Weddings", "Receptions", "Special Events"],
                    features: ["Bridal", "Embroidered", "Heavy Work", "Designer", "Silk"],
                    count: 12
                },
                gown: {
                    name: "Gowns",
                    description: "Elegant gowns for cocktail parties and formal events",
                    priceRange: "₹1000 - ₹2800 per day",
                    occasions: ["Cocktail Parties", "Formal Events", "Corporate Functions", "Award Ceremonies"],
                    features: ["Cocktail", "Evening", "Designer", "Sequined", "Silk"],
                    count: 10
                },
                sharara: {
                    name: "Sharara Suits",
                    description: "Modern and trendy sharara suits for contemporary events",
                    priceRange: "₹900 - ₹2200 per day",
                    occasions: ["Weddings", "Parties", "Festivals", "Modern Events"],
                    features: ["Contemporary", "Trendy", "Embroidered", "Silk", "Designer"],
                    count: 8
                }
            }
        },
        men: {
            name: "Men's Collection",
            description: "Sophisticated and stylish outfits for men",
            subcategories: {
                sherwani: {
                    name: "Sherwani",
                    description: "Traditional and modern sherwanis for weddings and special occasions",
                    priceRange: "₹1500 - ₹3500 per day",
                    occasions: ["Weddings", "Receptions", "Cultural Events", "Special Occasions"],
                    features: ["Bridal", "Embroidered", "Silk", "Designer", "Traditional"],
                    count: 8
                },
                jodhpuri: {
                    name: "Jodhpuri Suits",
                    description: "Classic Jodhpuri suits for formal and semi-formal events",
                    priceRange: "₹1200 - ₹2800 per day",
                    occasions: ["Weddings", "Parties", "Business Events", "Formal Functions"],
                    features: ["Classic", "Embroidered", "Silk", "Designer", "Formal"],
                    count: 10
                },
                blazer: {
                    name: "Blazers",
                    description: "Modern blazers for business and formal events",
                    priceRange: "₹800 - ₹2000 per day",
                    occasions: ["Business Meetings", "Corporate Events", "Formal Functions", "Interviews"],
                    features: ["Business", "Formal", "Designer", "Wool", "Cotton"],
                    count: 12
                },
                kurta: {
                    name: "Kurta Sets",
                    description: "Comfortable and stylish kurta sets for casual and semi-formal events",
                    priceRange: "₹600 - ₹1800 per day",
                    occasions: ["Casual Events", "Festivals", "Parties", "Daily Wear"],
                    features: ["Casual", "Comfortable", "Cotton", "Designer", "Modern"],
                    count: 15
                },
                tuxedo: {
                    name: "Tuxedos",
                    description: "Elegant tuxedos for black-tie events and formal occasions",
                    priceRange: "₹2000 - ₹3500 per day",
                    occasions: ["Black Tie Events", "Award Ceremonies", "Formal Dinners", "Corporate Galas"],
                    features: ["Formal", "Black Tie", "Designer", "Wool", "Silk"],
                    count: 6
                },
                suits: {
                    name: "Business Suits",
                    description: "Professional business suits for corporate events and meetings",
                    priceRange: "₹1000 - ₹2500 per day",
                    occasions: ["Business Meetings", "Corporate Events", "Interviews", "Formal Functions"],
                    features: ["Professional", "Business", "Designer", "Wool", "Formal"],
                    count: 18
                }
            }
        }
    },

    // Payment Methods
    paymentMethods: {
        online: {
            creditCard: "Visa, MasterCard, American Express",
            debitCard: "All major debit cards accepted",
            upi: "Google Pay, PhonePe, Paytm, BHIM UPI",
            netBanking: "All major banks supported",
            digitalWallets: "Paytm, Google Pay, PhonePe, Amazon Pay"
        },
        offline: {
            cash: "Cash payment accepted at store",
            card: "Card payment at store",
            bankTransfer: "Direct bank transfer"
        },
        security: {
            ssl: "SSL encrypted secure payments",
            pci: "PCI DSS compliant",
            secure: "All transactions are secure and encrypted"
        }
    },

    // Services
    services: {
        rental: {
            name: "Clothing Rental",
            description: "Premium designer clothing rental for all occasions",
            duration: "Daily, weekly, and monthly rentals available",
            process: "Browse, select, book, and get delivery"
        },
        alteration: {
            name: "Free Alterations",
            description: "Free basic alterations for perfect fit",
            included: ["Hemming", "Waist adjustment", "Sleeve length", "Basic fitting"],
            timing: "Completed within 24 hours"
        },
        consultation: {
            name: "Style Consultation",
            description: "Free personal styling consultation",
            services: ["Occasion-based recommendations", "Color analysis", "Size guidance", "Accessory suggestions"],
            duration: "30-45 minutes session"
        },
        delivery: {
            name: "Delivery Service",
            description: "Convenient delivery and pickup service",
            areas: ["Free delivery within Vadodara city", "Additional charges for outside city"],
            timing: ["Same-day delivery", "Next-day delivery", "Scheduled delivery"]
        },
        cleaning: {
            name: "Professional Cleaning",
            description: "All garments are professionally cleaned after each use",
            process: ["Dry cleaning", "Steam pressing", "Quality inspection", "Sanitization"]
        }
    },

    // Size Guide
    sizeGuide: {
        women: {
            xs: { chest: "32-34", waist: "26-28", hips: "34-36" },
            s: { chest: "34-36", waist: "28-30", hips: "36-38" },
            m: { chest: "36-38", waist: "30-32", hips: "38-40" },
            l: { chest: "38-40", waist: "32-34", hips: "40-42" },
            xl: { chest: "40-42", waist: "34-36", hips: "42-44" },
            xxl: { chest: "42-44", waist: "36-38", hips: "44-46" }
        },
        men: {
            s: { chest: "36-38", waist: "30-32", length: "28-30" },
            m: { chest: "38-40", waist: "32-34", length: "30-32" },
            l: { chest: "40-42", waist: "34-36", length: "32-34" },
            xl: { chest: "42-44", waist: "36-38", length: "34-36" },
            xxl: { chest: "44-46", waist: "38-40", length: "36-38" },
            xxxl: { chest: "46-48", waist: "40-42", length: "38-40" }
        }
    },

    // Occasions
    occasions: {
        wedding: {
            name: "Wedding",
            description: "Bridal and wedding party outfits",
            recommendations: ["Bridal Lehnga", "Anarkali Suits", "Sherwani", "Jodhpuri Suits"],
            priceRange: "₹1200 - ₹3500 per day"
        },
        party: {
            name: "Party",
            description: "Cocktail and party wear",
            recommendations: ["Gowns", "Sharara Suits", "Blazers", "Kurta Sets"],
            priceRange: "₹800 - ₹2500 per day"
        },
        business: {
            name: "Business",
            description: "Professional business attire",
            recommendations: ["Business Suits", "Blazers", "Formal Kurta Sets"],
            priceRange: "₹800 - ₹2000 per day"
        },
        festival: {
            name: "Festival",
            description: "Traditional festival wear",
            recommendations: ["Anarkali Suits", "Kurta Sets", "Sharara Suits"],
            priceRange: "₹600 - ₹1800 per day"
        },
        casual: {
            name: "Casual",
            description: "Casual and daily wear",
            recommendations: ["Kurta Sets", "Casual Suits", "Light Anarkali"],
            priceRange: "₹600 - ₹1500 per day"
        }
    },

    // Policies
    policies: {
        cancellation: {
            name: "Cancellation Policy",
            description: "Flexible cancellation options",
            rules: [
                "Free cancellation up to 24 hours before delivery",
                "50% refund for cancellations within 24 hours",
                "No refund for same-day cancellations"
            ]
        },
        return: {
            name: "Return Policy",
            description: "Easy return process",
            rules: [
                "Free returns within 24 hours of delivery",
                "Garment must be in original condition",
                "No returns for damaged or altered items"
            ]
        },
        damage: {
            name: "Damage Policy",
            description: "Fair damage assessment",
            rules: [
                "Minor wear and tear is acceptable",
                "Major damage may incur additional charges",
                "Assessment done by our quality team"
            ]
        }
    },

    // Team Information
    team: {
        ceo: {
            name: "Vinit Prajapati",
            title: "Founder & CEO",
            description: "Leading the company vision and strategy. We're transforming how businesses handle inventory efficiently and effortlessly.",
            image: "img/CEO.jpg",
            social: {
                linkedin: "#",
                twitter: "#"
            }
        },
        cfo: {
            name: "Shreyash Vekariya",
            title: "Co-founder & CFO",
            description: "Logistics expert ensuring our clothing items are always in perfect condition and delivered on time.",
            image: "img/CFO.jpg",
            social: {
                linkedin: "#",
                twitter: "#"
            }
        },
        cto: {
            name: "Krinal Thummar",
            title: "Fashion Director & CTO",
            description: "Former fashion editor with an eye for trends and quality, curating our ever-evolving collection.",
            image: "img/CTO.jpg",
            social: {
                linkedin: "#",
                instagram: "#"
            }
        }
    },

    // Awards and Recognition
    awards: [
        "Best Fashion Rental Service 2023",
        "Customer Choice Award",
        "Innovation in Fashion Technology",
        "Excellence in Customer Service"
    ],

    // Testimonials
    testimonials: [
        {
            name: "Priya Sharma",
            occasion: "Wedding",
            review: "Amazing collection and perfect fit! Made my wedding day special.",
            rating: 5
        },
        {
            name: "Rahul Patel",
            occasion: "Business Meeting",
            review: "Professional suits and excellent service. Highly recommended!",
            rating: 5
        },
        {
            name: "Anjali Desai",
            occasion: "Party",
            review: "Beautiful gowns and great styling advice. Will definitely use again!",
            rating: 5
        }
    ]
}; 