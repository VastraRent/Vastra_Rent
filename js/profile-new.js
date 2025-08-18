// Profile Page New Design - Basic JavaScript Functionality
// Handles navigation and basic interactions

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Profile page new design initialized');
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize form handling
    initializeFormHandling();
    
    // Handle URL parameters
    handleURLParameters();
    
    console.log('✅ Profile page initialization complete');
});

// Navigation System
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            if (!targetSection) return;
            
            // Update active navigation
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            showSection(targetSection);
            
            // Update URL without page reload
            const url = new URL(window.location);
            url.searchParams.set('section', targetSection);
            window.history.pushState({}, '', url);
        });
    });
    
    console.log('✅ Navigation system initialized');
}

// Show specific section
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    const targetSection = document.getElementById(sectionId);
    
    if (!targetSection) {
        console.error('Section not found:', sectionId);
        return;
    }
    
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section with animation
    targetSection.classList.add('active');
    
    // Scroll to top of content
    const profileContent = document.querySelector('.profile-content');
    if (profileContent) {
        profileContent.scrollTop = 0;
    }
    
    console.log('✅ Section displayed:', sectionId);
}

// Form Handling
function initializeFormHandling() {
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileForm = document.getElementById('profile-form');
    const formActions = document.getElementById('form-actions');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            enableFormEditing();
        });
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            disableFormEditing();
            resetFormValues();
        });
    }
    
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfileChanges();
        });
    }
    
    console.log('✅ Form handling initialized');
}

// Enable form editing
function enableFormEditing() {
    const formInputs = document.querySelectorAll('#profile-form input, #profile-form select, #profile-form textarea');
    const formActions = document.getElementById('form-actions');
    
    formInputs.forEach(input => {
        input.disabled = false;
        input.classList.add('editing');
    });
    
    if (formActions) {
        formActions.style.display = 'flex';
    }
    
    // Update button text
    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
        editBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        editBtn.classList.remove('secondary');
        editBtn.classList.add('primary');
    }
    
    console.log('✅ Form editing enabled');
}

// Disable form editing
function disableFormEditing() {
    const formInputs = document.querySelectorAll('#profile-form input, #profile-form select, #profile-form textarea');
    const formActions = document.getElementById('form-actions');
    
    formInputs.forEach(input => {
        input.disabled = true;
        input.classList.remove('editing');
    });
    
    if (formActions) {
        formActions.style.display = 'none';
    }
    
    // Reset button
    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
        editBtn.classList.remove('primary');
        editBtn.classList.add('secondary');
    }
    
    console.log('✅ Form editing disabled');
}

// Save profile changes
function saveProfileChanges() {
    const formData = new FormData(document.getElementById('profile-form'));
    const profileData = {};
    
    // Collect form data
    for (let [key, value] of formData.entries()) {
        profileData[key] = value;
    }
    
    // Save to localStorage
    try {
        localStorage.setItem('userProfileData', JSON.stringify(profileData));
        console.log('✅ Profile data saved:', profileData);
        
        // Show success message
        showNotification('Profile updated successfully!', 'success');
        
        // Disable editing
        disableFormEditing();
        
        // Update profile display
        updateProfileDisplay(profileData);
        
    } catch (error) {
        console.error('❌ Error saving profile:', error);
        showNotification('Error saving profile. Please try again.', 'error');
    }
}

// Reset form values
function resetFormValues() {
    // Load saved data or use defaults
    const savedData = JSON.parse(localStorage.getItem('userProfileData')) || {};
    
    const fields = {
        'first-name': savedData['first-name'] || 'John',
        'last-name': savedData['last-name'] || 'Doe',
        'email': savedData['email'] || 'john.doe@email.com',
        'phone': savedData['phone'] || '+1 (555) 123-4567',
        'birth-date': savedData['birth-date'] || '',
        'gender': savedData['gender'] || 'female',
        'bio': savedData['bio'] || 'Fashion enthusiast who loves trying new styles without the commitment of buying.'
    };
    
    Object.keys(fields).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = fields[fieldId];
        }
    });
    
    console.log('✅ Form values reset');
}

// Update profile display
function updateProfileDisplay(profileData) {
    // Update hero section
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    
    if (profileName && profileData['first-name'] && profileData['last-name']) {
        profileName.textContent = `${profileData['first-name']} ${profileData['last-name']}`;
    }
    
    if (profileEmail && profileData['email']) {
        profileEmail.textContent = profileData['email'];
    }
    
    console.log('✅ Profile display updated');
}

// Handle URL Parameters
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    
    if (section) {
        // Find and activate the corresponding nav link
        const navLink = document.querySelector(`[data-section="${section}"]`);
        if (navLink) {
            navLink.click();
        }
    }
}

// Notification System
function showNotification(message, type = 'info') {
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
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
        font-family: 'Poppins', sans-serif;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none; border: none; color: white; margin-left: auto; 
                cursor: pointer; opacity: 0.8; font-size: 1.2rem;
            ">
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

// Add CSS for animations and form styling
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
    
    .editing {
        background: var(--primary-light) !important;
        border-color: var(--primary-color) !important;
    }
`;

document.head.appendChild(style);
