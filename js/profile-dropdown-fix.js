// Profile Dropdown Fix for Home Page
// Ensures the profile dropdown works properly

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Profile dropdown fix initialized');
    
    // Get profile dropdown elements
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileTrigger = document.querySelector('.profile-trigger');
    
    if (profileDropdown && profileTrigger) {
        console.log('✅ Profile dropdown elements found');
        
        // Remove existing event listeners by cloning elements
        const newProfileTrigger = profileTrigger.cloneNode(true);
        profileTrigger.parentNode.replaceChild(newProfileTrigger, profileTrigger);
        
        // Add click event to the new profile trigger
        newProfileTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔧 Profile trigger clicked');
            
            // Toggle active class
            profileDropdown.classList.toggle('active');
            
            // Log the state
            if (profileDropdown.classList.contains('active')) {
                console.log('✅ Profile dropdown opened');
            } else {
                console.log('✅ Profile dropdown closed');
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('active');
                console.log('✅ Profile dropdown closed (clicked outside)');
            }
        });
        
        // Close dropdown when pressing ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                profileDropdown.classList.remove('active');
                console.log('✅ Profile dropdown closed (ESC key)');
            }
        });
        
        // Test the dropdown functionality
        console.log('✅ Profile dropdown event listeners added');
        
        // Add some visual feedback
        newProfileTrigger.style.cursor = 'pointer';
        newProfileTrigger.title = 'Click to open profile menu';
        
    } else {
        console.error('❌ Profile dropdown elements not found');
        console.log('Profile dropdown:', profileDropdown);
        console.log('Profile trigger:', profileTrigger);
    }
    
    // Test profile menu items
    const profileMenuItems = document.querySelectorAll('.profile-menu-item');
    console.log('Profile menu items found:', profileMenuItems.length);
    
    profileMenuItems.forEach((item, index) => {
        console.log(`Menu item ${index + 1}:`, item.textContent.trim());
        
        // Add click event to each menu item
        item.addEventListener('click', function(e) {
            console.log('✅ Menu item clicked:', this.textContent.trim());
            
        
        });
    });
    
    // Update profile information
    updateProfileInfo();
    
    console.log('✅ Profile dropdown fix complete');
});

// Function to update profile information
function updateProfileInfo() {
    try {
        // Get user data from localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
        const storedUserData = JSON.parse(localStorage.getItem('userData')) || {};
        
        // Merge data from both sources
        const userData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            avatar: null,
            ...storedUserData,
            ...currentUser
        };
        
        // Update profile name and email
        const profileName = document.querySelector('.profile-name-small');
        const profileEmail = document.querySelector('.profile-email-small');
        const profileAvatar = document.querySelector('.profile-avatar-small');
        
        if (profileName) {
            profileName.textContent = `${userData.firstName || 'John'} ${userData.lastName || 'Doe'}`;
        }
        
        if (profileEmail) {
            profileEmail.textContent = userData.email || 'john.doe@email.com';
        }
        
        if (profileAvatar && userData.avatar) {
            profileAvatar.src = userData.avatar;
        }
        
        console.log('✅ Profile information updated:', userData);
        
    } catch (error) {
        console.error('❌ Error updating profile info:', error);
    }
}

// Function to test profile dropdown
window.testProfileDropdown = function() {
    console.log('🧪 Testing profile dropdown...');
    
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileTrigger = document.querySelector('.profile-trigger');
    
    if (profileDropdown && profileTrigger) {
        console.log('✅ Elements found');
        console.log('Dropdown classes:', profileDropdown.className);
        console.log('Trigger classes:', profileTrigger.className);
        
        // Test click
        profileTrigger.click();
        
        setTimeout(() => {
            console.log('Dropdown active state:', profileDropdown.classList.contains('active'));
        }, 100);
        
    } else {
        console.error('❌ Elements not found');
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateProfileInfo,
        testProfileDropdown
    };
}
