// Avatar Upload Conflict Resolver
// This script prevents multiple avatar upload handlers from conflicting

(function() {
    'use strict';
    
    console.log('🔧 Avatar conflict resolver loading...');
    
    // Override other avatar upload functions to prevent conflicts
    function preventConflicts() {
        // Disable other avatar upload functions
        const conflictingFunctions = [
            'initializeAvatarUpload',
            'forceInitializeAvatarUpload',
            'standaloneAvatarUpload',
            'testAvatarUploadNow'
        ];
        
        conflictingFunctions.forEach(funcName => {
            if (window[funcName]) {
                console.log(`🚫 Disabling conflicting function: ${funcName}`);
                window[funcName] = function() {
                    console.log(`⚠️ ${funcName} disabled to prevent conflicts. Use window.singleAvatarUpload instead.`);
                    if (window.singleAvatarUpload) {
                        window.singleAvatarUpload();
                    }
                };
            }
        });
        
        // Remove duplicate event listeners from elements
        const avatarElements = document.querySelectorAll('#avatar-edit-btn, #change-photo-btn, #profile-avatar, #profile-form-avatar');
        avatarElements.forEach(element => {
            if (element) {
                // Clone element to remove all event listeners
                const newElement = element.cloneNode(true);
                element.parentNode.replaceChild(newElement, element);
                console.log(`🧹 Cleaned event listeners from: ${element.id || element.className}`);
            }
        });
        
        console.log('✅ Conflict prevention complete');
    }
    
    // Run conflict prevention after other scripts load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(preventConflicts, 500);
        });
    } else {
        setTimeout(preventConflicts, 500);
    }
    
    // Also run after a longer delay to catch late-loading scripts
    setTimeout(preventConflicts, 2000);
    
    console.log('✅ Avatar conflict resolver loaded');
})();