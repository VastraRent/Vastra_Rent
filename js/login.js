// Tab switching functionality
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            document.getElementById(targetTab === 'login' ? 'loginForm' : 'registerForm').classList.add('active');
        });
    });
}

// Password toggle functionality
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.getElementById('passwordIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.classList.remove('fa-eye');
        passwordIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        passwordIcon.classList.remove('fa-eye-slash');
        passwordIcon.classList.add('fa-eye');
    }
}

function toggleRegPassword() {
    const passwordInput = document.getElementById('regPassword');
    const passwordIcon = document.getElementById('regPasswordIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.classList.remove('fa-eye');
        passwordIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        passwordIcon.classList.remove('fa-eye-slash');
        passwordIcon.classList.add('fa-eye');
    }
}

function toggleConfirmPassword() {
    const passwordInput = document.getElementById('confirmPassword');
    const passwordIcon = document.getElementById('confirmPasswordIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.classList.remove('fa-eye');
        passwordIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        passwordIcon.classList.remove('fa-eye-slash');
        passwordIcon.classList.add('fa-eye');
    }
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const icon = notification.querySelector('.notification-icon');
    const messageEl = notification.querySelector('.notification-message');
    
    // Set icon based on type
    icon.className = 'notification-icon ';
    switch(type) {
        case 'success':
            icon.classList.add('fas', 'fa-check-circle');
            break;
        case 'error':
            icon.classList.add('fas', 'fa-times-circle');
            break;
        case 'warning':
            icon.classList.add('fas', 'fa-exclamation-triangle');
            break;
    }
    
    // Set message and type
    messageEl.textContent = message;
    notification.className = `notification ${type}`;
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide notification after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Form validation
function validateForm(formData) {
    const errors = [];
    
    // Check required fields
    Object.keys(formData).forEach(key => {
        if (!formData[key] && key !== 'rememberMe') {
            errors.push(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
        }
    });
    
    // Email validation
    if (formData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            errors.push('Please enter a valid email address');
        }
    }
    
    // Password validation for registration
    if (formData.regPassword) {
        if (formData.regPassword.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }
        if (formData.regPassword !== formData.confirmPassword) {
            errors.push('Passwords do not match');
        }
    }
    
    return errors;
}

// Enhanced login handler
function handleLogin(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('.auth-btn');
    submitBtn.classList.add('loading');
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        gender: document.getElementById('gender').value,
        loginId: document.getElementById('loginId').value.trim(),
        password: document.getElementById('password').value,
        rememberMe: document.getElementById('rememberMe').checked
    };
    
    // Validate form
    const errors = validateForm(formData);
    if (errors.length > 0) {
        submitBtn.classList.remove('loading');
        showNotification(errors[0], 'error');
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        try {
            // Create user data
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                fullName: `${formData.firstName} ${formData.lastName}`,
                gender: formData.gender,
                loginId: formData.loginId,
                email: `${formData.loginId}@vastrarent.com`,
                phone: '+1 (555) 123-4567',
                joinDate: new Date().toISOString().split('T')[0],
                membershipType: 'Gold',
                isLoggedIn: true,
                rememberMe: formData.rememberMe
            };
            
            // Store user data
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            
            if (formData.rememberMe) {
                localStorage.setItem('rememberedUser', JSON.stringify({
                    loginId: formData.loginId,
                    firstName: formData.firstName,
                    lastName: formData.lastName
                }));
            }
            
            submitBtn.classList.remove('loading');
            showNotification('Login successful! Redirecting...', 'success');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);
            
        } catch (error) {
            submitBtn.classList.remove('loading');
            showNotification('Login failed. Please try again.', 'error');
        }
    }, 1500);
}

// Registration handler
function handleRegister(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('.auth-btn');
    submitBtn.classList.add('loading');
    
    // Get form data
    const formData = {
        firstName: document.getElementById('regFirstName').value.trim(),
        lastName: document.getElementById('regLastName').value.trim(),
        email: document.getElementById('regEmail').value.trim(),
        gender: document.getElementById('regGender').value,
        regPassword: document.getElementById('regPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        agreeTerms: document.getElementById('agreeTerms').checked
    };
    
    // Validate form
    const errors = validateForm(formData);
    if (errors.length > 0) {
        submitBtn.classList.remove('loading');
        showNotification(errors[0], 'error');
        return;
    }
    
    if (!formData.agreeTerms) {
        submitBtn.classList.remove('loading');
        showNotification('Please agree to the terms and conditions', 'error');
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        try {
            // Create user data
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                fullName: `${formData.firstName} ${formData.lastName}`,
                gender: formData.gender,
                loginId: formData.email.split('@')[0],
                email: formData.email,
                phone: '+1 (555) 123-4567',
                joinDate: new Date().toISOString().split('T')[0],
                membershipType: 'Silver',
                isLoggedIn: true
            };
            
            // Store user data
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            
            submitBtn.classList.remove('loading');
            showNotification('Account created successfully! Redirecting...', 'success');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);
            
        } catch (error) {
            submitBtn.classList.remove('loading');
            showNotification('Registration failed. Please try again.', 'error');
        }
    }, 1500);
}

// Social login handler
function socialLogin(provider) {
    showNotification(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`, 'warning');
}

// Load remembered user data
function loadRememberedUser() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        const userData = JSON.parse(rememberedUser);
        document.getElementById('firstName').value = userData.firstName || '';
        document.getElementById('lastName').value = userData.lastName || '';
        document.getElementById('loginId').value = userData.loginId || '';
        document.getElementById('rememberMe').checked = true;
    }
}

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual Google Client ID

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleSignIn,
            auto_select: false,
            cancel_on_tap_outside: true
        });
        
        // Render the Google Sign-In button
        google.accounts.id.renderButton(
            document.getElementById('googleSignInBtn'),
            {
                theme: 'outline',
                size: 'large',
                width: '100%',
                text: 'continue_with',
                shape: 'rectangular'
            }
        );
    } else {
        console.warn('Google Sign-In API not loaded');
        // Fallback to custom button
        document.getElementById('googleSignInBtn').onclick = () => {
            showNotification('Google Sign-In is currently unavailable. Please try again later.', 'error');
        };
    }
}

// Handle Google Sign-In Response
function handleGoogleSignIn(response) {
    try {
        // Decode the JWT token
        const payload = parseJwt(response.credential);
        
        if (payload) {
            // Extract user information
            const userData = {
                firstName: payload.given_name || '',
                lastName: payload.family_name || '',
                email: payload.email || '',
                profilePicture: payload.picture || '',
                googleId: payload.sub || '',
                emailVerified: payload.email_verified || false,
                loginMethod: 'google'
            };
            
            // Check if user already exists
            const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const existingUser = existingUsers.find(user => 
                user.email === userData.email || user.googleId === userData.googleId
            );
            
            if (existingUser) {
                // User exists, log them in
                loginUser(existingUser);
                showNotification(`Welcome back, ${userData.firstName}!`, 'success');
            } else {
                // New user, register them
                registerGoogleUser(userData);
            }
        }
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        showNotification('Google Sign-In failed. Please try again.', 'error');
    }
}

// Register new Google user
function registerGoogleUser(userData) {
    try {
        // Get existing users
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        // Create new user object
        const newUser = {
            id: Date.now().toString(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            gender: '', // Will be prompted to complete profile
            profilePicture: userData.profilePicture,
            googleId: userData.googleId,
            loginMethod: 'google',
            emailVerified: userData.emailVerified,
            registrationDate: new Date().toISOString(),
            profileComplete: false // Flag to prompt profile completion
        };
        
        // Add to users array
        existingUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
        
        // Log the user in
        loginUser(newUser);
        
        showNotification(`Welcome to Vastra Rent, ${userData.firstName}! Please complete your profile.`, 'success');
        
        // Redirect to profile completion or home
        setTimeout(() => {
            window.location.href = newUser.profileComplete ? 'home.html' : 'profile.html';
        }, 2000);
        
    } catch (error) {
        console.error('Google Registration Error:', error);
        showNotification('Registration failed. Please try again.', 'error');
    }
}

// Login user function
function loginUser(userData) {
    // Store user session
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userName', `${userData.firstName} ${userData.lastName}`);
    
    // Store additional Google-specific data if available
    if (userData.profilePicture) {
        localStorage.setItem('userProfilePicture', userData.profilePicture);
    }
}

// Parse JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('JWT Parse Error:', error);
        return null;
    }
}

// Enhanced social login handler with loading states
function socialLogin(provider) {
    const button = document.querySelector(`.social-btn.${provider}`);
    
    // Add loading state
    button.classList.add('loading');
    
    if (provider === 'google') {
        // Trigger Google Sign-In
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.prompt();
        } else {
            showNotification('Google Sign-In is not available. Please refresh the page and try again.', 'error');
        }
    } else {
        // Simulate loading for other providers
        setTimeout(() => {
            button.classList.remove('loading');
            showNotification(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`, 'warning');
        }, 1500);
    }
    
    // Remove loading state after timeout
    setTimeout(() => {
        button.classList.remove('loading');
    }, 3000);
}

// Add hover effects for social buttons
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'home.html';
        return;
    }
    
    // Initialize functionality
    initializeTabs();
    loadRememberedUser();
    
    // Initialize Google Sign-In after a short delay to ensure API is loaded
    setTimeout(() => {
        initializeGoogleSignIn();
    }, 1000);
    
    // Add input focus effects
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Add form submission prevention for demo
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    });
});