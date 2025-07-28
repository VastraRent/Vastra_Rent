// Shared Inventory Data - Used across all pages
// This file contains the complete inventory data that is shared between inventory.js, product-details.js, perfect-for-you.js, and other pages

// Function to get inventory data
function getSharedInventoryData() {
    // Try to get from localStorage first (most up-to-date)
    const storedData = localStorage.getItem('inventoryData');
    if (storedData) {
        try {
            return JSON.parse(storedData);
        } catch (e) {
            console.warn('Error parsing stored inventory data:', e);
        }
    }
    
    // Fallback to default data if localStorage is empty
    return getDefaultInventoryData();
}

// Function to save inventory data to localStorage
function saveSharedInventoryData(data) {
    try {
        localStorage.setItem('inventoryData', JSON.stringify(data));
        console.log('Inventory data saved to localStorage:', data.length, 'items');
    } catch (e) {
        console.error('Error saving inventory data:', e);
    }
}

// Function to get default inventory data (fallback)
function getDefaultInventoryData() {
    return [
        // This will be populated from inventory.js
        // For now, return empty array as fallback
    ];
}

// Function to find item by ID
function findInventoryItemById(id) {
    const inventory = getSharedInventoryData();
    return inventory.find(item => item.id.toString() === id.toString());
}

// Function to get items by category
function getInventoryItemsByCategory(category) {
    const inventory = getSharedInventoryData();
    if (category === 'all') {
        return inventory;
    }
    return inventory.filter(item => item.category === category);
}

// Function to get items by gender
function getInventoryItemsByGender(gender) {
    const inventory = getSharedInventoryData();
    if (gender === 'all') {
        return inventory;
    }
    return inventory.filter(item => item.gender === gender);
}

// Function to search inventory
function searchInventoryItems(query) {
    const inventory = getSharedInventoryData();
    const searchTerm = query.toLowerCase();
    return inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
}

// Function to get random items for recommendations
function getRandomInventoryItems(count = 6, excludeId = null) {
    const inventory = getSharedInventoryData();
    let availableItems = inventory.filter(item => 
        item.available && 
        (excludeId ? item.id !== excludeId : true)
    );
    
    // Shuffle array and return requested count
    for (let i = availableItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableItems[i], availableItems[j]] = [availableItems[j], availableItems[i]];
    }
    
    return availableItems.slice(0, count);
}

// Make functions globally available
window.getSharedInventoryData = getSharedInventoryData;
window.saveSharedInventoryData = saveSharedInventoryData;
window.findInventoryItemById = findInventoryItemById;
window.getInventoryItemsByCategory = getInventoryItemsByCategory;
window.getInventoryItemsByGender = getInventoryItemsByGender;
window.searchInventoryItems = searchInventoryItems;
window.getRandomInventoryItems = getRandomInventoryItems;

// Initialize shared inventory data when this script loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Shared inventory system initialized');
    const inventory = getSharedInventoryData();
    console.log('Available inventory items:', inventory.length);
});