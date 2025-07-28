// Currency Consistency Fix for VASTRA RENT
// Ensures all currency displays use Indian Rupees (₹) instead of Dollars ($)

class CurrencyFixer {
    constructor() {
        this.init();
    }

    init() {
        console.log('💰 Initializing currency fixer...');
        this.fixExistingCurrency();
        this.setupCurrencyObserver();
        this.addGlobalFunctions();
    }

    // Fix any existing dollar signs on the page
    fixExistingCurrency() {
        // Find all text nodes containing dollar signs
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes('$')) {
                textNodes.push(node);
            }
        }

        // Replace dollar signs with rupee symbols
        textNodes.forEach(textNode => {
            const originalText = textNode.textContent;
            const fixedText = originalText.replace(/\$(\d+(?:\.\d{2})?)/g, '₹$1');
            if (originalText !== fixedText) {
                textNode.textContent = fixedText;
                console.log(`💱 Fixed currency: "${originalText}" → "${fixedText}"`);
            }
        });

        // Fix any elements with dollar signs in innerHTML
        const elementsWithDollar = document.querySelectorAll('*');
        elementsWithDollar.forEach(element => {
            if (element.innerHTML && element.innerHTML.includes('$') && !element.innerHTML.includes('<')) {
                const originalHTML = element.innerHTML;
                const fixedHTML = originalHTML.replace(/\$(\d+(?:\.\d{2})?)/g, '₹$1');
                if (originalHTML !== fixedHTML) {
                    element.innerHTML = fixedHTML;
                    console.log(`💱 Fixed element currency: "${originalHTML}" → "${fixedHTML}"`);
                }
            }
        });
    }

    // Set up observer to catch dynamically added content
    setupCurrencyObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.fixCurrencyInElement(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Fix currency in a specific element
    fixCurrencyInElement(element) {
        // Fix text content
        if (element.textContent && element.textContent.includes('$')) {
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let node;
            while (node = walker.nextNode()) {
                if (node.textContent.includes('$')) {
                    const originalText = node.textContent;
                    const fixedText = originalText.replace(/\$(\d+(?:\.\d{2})?)/g, '₹$1');
                    if (originalText !== fixedText) {
                        node.textContent = fixedText;
                        console.log(`💱 Fixed dynamic currency: "${originalText}" → "${fixedText}"`);
                    }
                }
            }
        }
    }

    // Add global utility functions
    addGlobalFunctions() {
        // Global currency formatting function
        window.formatRupees = (amount) => {
            const numAmount = parseFloat(amount) || 0;
            return `₹${numAmount.toFixed(2)}`;
        };

        // Convert dollar amount to rupees (assuming 1 USD = 83 INR approximately)
        window.convertDollarToRupees = (dollarAmount, exchangeRate = 83) => {
            const numAmount = parseFloat(dollarAmount) || 0;
            const rupeeAmount = numAmount * exchangeRate;
            return `₹${rupeeAmount.toFixed(2)}`;
        };

        // Fix all currency on page manually
        window.fixAllCurrency = () => {
            console.log('🔧 Manually fixing all currency on page...');
            this.fixExistingCurrency();
            console.log('✅ Currency fix complete');
        };

        // Check for any remaining dollar signs
        window.checkCurrencyConsistency = () => {
            console.log('🔍 Checking currency consistency...');
            
            const bodyText = document.body.textContent;
            const dollarMatches = bodyText.match(/\$\d+(?:\.\d{2})?/g);
            const rupeeMatches = bodyText.match(/₹\d+(?:\.\d{2})?/g);
            
            console.log('Dollar signs found:', dollarMatches ? dollarMatches.length : 0);
            console.log('Rupee signs found:', rupeeMatches ? rupeeMatches.length : 0);
            
            if (dollarMatches) {
                console.log('⚠️ Dollar signs still present:', dollarMatches);
                return false;
            } else {
                console.log('✅ All currency appears to be in rupees');
                return true;
            }
        };

        // Override common currency formatting functions
        if (typeof window.formatCurrency === 'undefined') {
            window.formatCurrency = (amount) => {
                const numAmount = parseFloat(amount) || 0;
                return `₹${numAmount.toFixed(2)}`;
            };
        }
    }
}

// Initialize currency fixer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.currencyFixer = new CurrencyFixer();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    window.currencyFixer = new CurrencyFixer();
}

// Fix currency after a short delay to catch any dynamically loaded content
setTimeout(() => {
    if (window.currencyFixer) {
        window.currencyFixer.fixExistingCurrency();
    }
}, 2000);

console.log('💰 Currency fixer script loaded');