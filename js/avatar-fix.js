// Simple Avatar Upload Fix
// This script ensures avatar upload functionality works on the profile page

(function() {
    'use strict';
    
    console.log('🖼️ Avatar fix script loading...');
    
    // Wait for DOM to be ready
    function initAvatarFix() {
        console.log('🚀 Initializing avatar fix...');
        
        // Simple avatar upload function
        function uploadAvatar() {
            console.log('📁 Avatar upload triggered');
            
            // Create file input
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.style.display = 'none';
            
            // Handle file selection
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (!file) {
                    console.log('❌ No file selected');
                    return;
                }
                
                console.log('📷 File selected:', file.name, file.type, file.size);
                
                // Validate file
                if (!file.type.startsWith('image/')) {
                    alert('Please select an image file');
                    return;
                }
                
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB');
                    return;
                }
                
                // Read file
                const reader = new FileReader();
                reader.onload = function(event) {
                    const avatarData = event.target.result;
                    console.log('✅ File read successfully');
                    
                    // Update all avatar images on the page
                    const avatarSelectors = [
                        '#profile-avatar',
                        '#profile-form-avatar',
                        '.profile-avatar-small',
                        '.profile-avatar img',
                        'img[alt*="Profile"]',
                        'img[alt*="Avatar"]'
                    ];
                    
                    let updatedCount = 0;
                    avatarSelectors.forEach(selector => {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(element => {
                            if (element && element.tagName === 'IMG') {
                                element.src = avatarData;
                                updatedCount++;
                                console.log(`✅ Updated avatar: ${selector}`);
                            }
                        });
                    });
                    
                    console.log(`✅ Updated ${updatedCount} avatar images`);
                    
                    // Save to localStorage
                    try {
                        // Update currentUser
                        let currentUser = {};
                        try {
                            currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
                        } catch (e) {
                            console.warn('Error parsing currentUser, creating new object');
                        }
                        currentUser.avatar = avatarData;
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        
                        // Update userData
                        let userData = {};
                        try {
                            userData = JSON.parse(localStorage.getItem('userData')) || {};
                        } catch (e) {
                            console.warn('Error parsing userData, creating new object');
                        }
                        userData.avatar = avatarData;
                        localStorage.setItem('userData', JSON.stringify(userData));
                        
                        console.log('✅ Avatar saved to localStorage');
                        
                        // Show success message
                        if (typeof showNotification === 'function') {
                            showNotification('Profile photo updated successfully!', 'success');
                        } else {
                            alert('Profile photo updated successfully!');
                        }
                        
                    } catch (error) {
                        console.error('❌ Error saving avatar:', error);
                        alert('Avatar updated but failed to save. Please try again.');
                    }
                };
                
                reader.onerror = function() {
                    console.error('❌ Error reading file');
                    alert('Error reading file. Please try again.');
                };
                
                reader.readAsDataURL(file);
            };
            
            // Trigger file selection
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        }
        
        // Find and setup avatar buttons
        const buttonSelectors = [
            '#avatar-edit-btn',
            '#change-photo-btn',
            '.avatar-edit-btn',
            '.change-photo-btn'
        ];
        
        let buttonsFound = 0;
        buttonSelectors.forEach(selector => {
            const buttons = document.querySelectorAll(selector);
            buttons.forEach(button => {
                if (button) {
                    // Remove existing event listeners
                    button.onclick = null;
                    
                    // Add new event listener
                    button.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(`🎯 Button clicked: ${selector}`);
                        uploadAvatar();
                    });
                    
                    buttonsFound++;
                    console.log(`✅ Setup button: ${selector}`);
                }
            });
        });
        
        // Make avatar images clickable
        const avatarImages = document.querySelectorAll('#profile-avatar, #profile-form-avatar');
        avatarImages.forEach(img => {
            if (img) {
                img.style.cursor = 'pointer';
                img.title = 'Click to change profile photo';
                img.onclick = null;
                img.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🎯 Avatar image clicked');
                    uploadAvatar();
                });
                buttonsFound++;
                console.log('✅ Made avatar image clickable');
            }
        });
        
        console.log(`✅ Avatar fix initialized - ${buttonsFound} interactive elements found`);
        
        // Add global function for manual testing
        window.testAvatarUpload = uploadAvatar;
        window.avatarUpload = uploadAvatar;
        
        // Load existing avatar if available
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
            if (currentUser.avatar) {
                const avatars = document.querySelectorAll('#profile-avatar, #profile-form-avatar, .profile-avatar-small');
                avatars.forEach(avatar => {
                    if (avatar && avatar.tagName === 'IMG') {
                        avatar.src = currentUser.avatar;
                    }
                });
                console.log('✅ Loaded existing avatar from storage');
            }
        } catch (error) {
            console.warn('⚠️ Could not load existing avatar:', error);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAvatarFix);
    } else {
        initAvatarFix();
    }
    
    // Also try after a delay to catch dynamically loaded content
    setTimeout(initAvatarFix, 2000);
    
    console.log('✅ Avatar fix script loaded');
})();