// Enhanced Avatar Upload Fix - Single Instance Handler
// This script ensures avatar upload functionality works properly on the profile page

(function() {
    'use strict';
    
    console.log('🖼️ Avatar fix script loading...');
    
    // Global flag to prevent multiple initializations
    if (window.avatarUploadInitialized) {
        console.log('⚠️ Avatar upload already initialized, skipping...');
        return;
    }
    window.avatarUploadInitialized = true;
    
    // Global flag to prevent multiple file dialogs
    let isUploadInProgress = false;
    
    // Wait for DOM to be ready
    function initAvatarFix() {
        console.log('🚀 Initializing enhanced avatar fix...');
        
        // Enhanced avatar upload function with debouncing
        function uploadAvatar() {
            // Prevent multiple simultaneous uploads
            if (isUploadInProgress) {
                console.log('⚠️ Upload already in progress, ignoring...');
                return;
            }
            
            isUploadInProgress = true;
            console.log('📁 Avatar upload triggered');
            
            // Create a fresh file input each time to avoid conflicts
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp';
            fileInput.style.display = 'none';
            fileInput.multiple = false;
            
            // Handle file selection
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) {
                    console.log('❌ No file selected');
                    isUploadInProgress = false;
                    return;
                }
                
                console.log('📷 File selected:', file.name, file.type, file.size);
                
                // Validate file type
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
                if (!validTypes.includes(file.type.toLowerCase())) {
                    alert('Please select a valid image file (JPEG, PNG, GIF, WebP, or BMP)');
                    isUploadInProgress = false;
                    return;
                }
                
                // Validate file size (10MB limit)
                if (file.size > 10 * 1024 * 1024) {
                    alert('File size must be less than 10MB');
                    isUploadInProgress = false;
                    return;
                }
                
                // Show loading state
                showLoadingState();
                
                // Read file
                const reader = new FileReader();
                reader.onload = function(event) {
                    try {
                        const avatarData = event.target.result;
                        console.log('✅ File read successfully');
                        
                        // Update all avatar images on the page
                        updateAvatarImages(avatarData);
                        
                        // Save to localStorage
                        saveAvatarData(avatarData);
                        
                        // Hide loading state
                        hideLoadingState();
                        
                        // Show success message
                        showSuccessMessage();
                        
                    } catch (error) {
                        console.error('❌ Error processing file:', error);
                        hideLoadingState();
                        alert('Error processing image. Please try again.');
                    } finally {
                        isUploadInProgress = false;
                    }
                };
                
                reader.onerror = function() {
                    console.error('❌ Error reading file');
                    hideLoadingState();
                    alert('Error reading file. Please try again.');
                    isUploadInProgress = false;
                };
                
                reader.readAsDataURL(file);
            });
            
            // Handle cancellation (when user closes file dialog without selecting)
            fileInput.addEventListener('cancel', function() {
                isUploadInProgress = false;
            });
            
            // Add to DOM, trigger, and clean up
            document.body.appendChild(fileInput);
            fileInput.click();
            
            // Clean up after a delay (in case user cancels)
            setTimeout(() => {
                if (fileInput.parentNode) {
                    document.body.removeChild(fileInput);
                }
                if (isUploadInProgress && !fileInput.files.length) {
                    isUploadInProgress = false;
                }
            }, 1000);
        }
        
        // Set global upload function
        window.singleAvatarUpload = uploadAvatar;
        
        // Show loading state
        function showLoadingState() {
            const avatarImg = document.getElementById('profile-avatar');
            const editBtn = document.getElementById('avatar-edit-btn');
            
            if (avatarImg) {
                avatarImg.style.opacity = '0.5';
                avatarImg.style.filter = 'blur(2px)';
            }
            
            if (editBtn) {
                editBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                editBtn.disabled = true;
            }
        }
        
        // Hide loading state
        function hideLoadingState() {
            const avatarImg = document.getElementById('profile-avatar');
            const editBtn = document.getElementById('avatar-edit-btn');
            
            if (avatarImg) {
                avatarImg.style.opacity = '1';
                avatarImg.style.filter = 'none';
            }
            
            if (editBtn) {
                editBtn.innerHTML = '<i class="fas fa-camera"></i>';
                editBtn.disabled = false;
            }
        }
        
        // Update all avatar images
        function updateAvatarImages(avatarData) {
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
                        
                        // Add animation effect
                        element.style.transform = 'scale(1.1)';
                        setTimeout(() => {
                            element.style.transform = 'scale(1)';
                        }, 300);
                    }
                });
            });
            
            console.log(`✅ Updated ${updatedCount} avatar images`);
        }
        
        // Save avatar data to localStorage
        function saveAvatarData(avatarData) {
            try {
                // Update currentUser
                let currentUser = {};
                try {
                    currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
                } catch (e) {
                    console.warn('Error parsing currentUser, creating new object');
                }
                currentUser.avatar = avatarData;
                currentUser.lastAvatarUpdate = new Date().toISOString();
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Update userData
                let userData = {};
                try {
                    userData = JSON.parse(localStorage.getItem('userData')) || {};
                } catch (e) {
                    console.warn('Error parsing userData, creating new object');
                }
                userData.avatar = avatarData;
                userData.lastAvatarUpdate = new Date().toISOString();
                localStorage.setItem('userData', JSON.stringify(userData));
                
                console.log('✅ Avatar saved to localStorage');
                
            } catch (error) {
                console.error('❌ Error saving avatar:', error);
                alert('Avatar updated but failed to save. Please try again.');
            }
        }
        
        // Show success message
        function showSuccessMessage() {
            if (typeof showNotification === 'function') {
                showNotification('Profile photo updated successfully!', 'success');
            } else {
                // Create custom notification
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #4CAF50;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                `;
                notification.innerHTML = '✅ Profile photo updated successfully!';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.remove();
                }, 3000);
            }
        }
        
        // Setup avatar buttons with conflict prevention
        function setupAvatarButtons() {
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
                    if (button && !button.dataset.avatarHandlerAttached) {
                        // Mark as handled to prevent duplicate handlers
                        button.dataset.avatarHandlerAttached = 'true';
                        
                        // Remove ALL existing event listeners by cloning the element
                        const newButton = button.cloneNode(true);
                        button.parentNode.replaceChild(newButton, button);
                        
                        // Add single event listener with debouncing
                        newButton.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(`🎯 Button clicked: ${selector}`);
                            uploadAvatar();
                        }, { once: false });
                        
                        // Add visual feedback
                        newButton.style.cursor = 'pointer';
                        newButton.title = 'Change profile photo';
                        
                        buttonsFound++;
                        console.log(`✅ Setup button: ${selector}`);
                    }
                });
            });
            
            // Make avatar images clickable with conflict prevention
            const avatarImages = document.querySelectorAll('#profile-avatar, #profile-form-avatar');
            avatarImages.forEach(img => {
                if (img && !img.dataset.avatarHandlerAttached) {
                    img.dataset.avatarHandlerAttached = 'true';
                    
                    // Remove existing handlers by cloning
                    const newImg = img.cloneNode(true);
                    img.parentNode.replaceChild(newImg, img);
                    
                    newImg.style.cursor = 'pointer';
                    newImg.title = 'Click to change profile photo';
                    
                    newImg.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🎯 Avatar image clicked');
                        uploadAvatar();
                    }, { once: false });
                    
                    buttonsFound++;
                    console.log('✅ Made avatar image clickable');
                }
            });
            
            console.log(`✅ Avatar fix initialized - ${buttonsFound} interactive elements found`);
            return buttonsFound;
        }
        
        // Initial setup
        setupAvatarButtons();
        
        // Add global functions for testing and external access
        window.testAvatarUpload = uploadAvatar;
        window.avatarUpload = uploadAvatar;
        window.singleAvatarUpload = uploadAvatar;
        
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
    

    
    console.log('✅ Avatar fix script loaded');
})();