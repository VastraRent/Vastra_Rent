// Simple User Management System with CSV Backend
class SimpleUserSystem {
    constructor() {
        this.users = [];
        this.currentUser = null;
        this.init();
    }

    async init() {
        console.log('🔐 Simple User System initialized');
        await this.loadUsers();
        this.checkSession();
    }

    // Load users from CSV (simulated with localStorage)
    async loadUsers() {
        try {
            const savedUsers = localStorage.getItem('userCSV');
            if (savedUsers) {
                this.users = JSON.parse(savedUsers);
            } else {
                // Initialize with demo users from CSV
                this.users = [
                    {
                        id: 1,
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john@example.com',
                        password: 'password123',
                        gender: 'male',
                        joinDate: '2024-01-15'
                    },
                    {
                        id: 2,
                        firstName: 'Jane',
                        lastName: 'Smith',
                        email: 'jane@example.com',
                        password: 'password123',
                        gender: 'female',
                        joinDate: '2024-01-16'
                    },
                    {
                        id: 3,
                        firstName: 'Admin',
                        lastName: 'User',
                        email: 'admin@example.com',
                        password: 'admin123',
                        gender: 'other',
                        joinDate: '2024-01-17'
                    }
                ];
                this.saveUsersToCSV();
            }
            console.log('✅ Users loaded:', this.users.length);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    // Save users to CSV (simulated with localStorage)
    saveUsersToCSV() {
        try {
            localStorage.setItem('userCSV', JSON.stringify(this.users));
            console.log('✅ Users saved to CSV backend');
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }

    // Check existing session
    checkSession() {
        const userData = localStorage.getItem('currentUser');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (isLoggedIn && userData) {
            try {
                this.currentUser = JSON.parse(userData);
                console.log('✅ Session restored for:', this.currentUser.firstName);
                // Redirect to home if already logged in
                window.location.href = 'home.html';
            } catch (error) {
                console.error('Error restoring session:', error);
                this.logout();
            }
        }
    }

    // Sign up new user
    async signup(userData) {
        try {
            console.log('📝 Starting signup for:', userData.email);

            // Validate input
            if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
                throw new Error('All fields are required');
            }

            if (userData.password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            // Check if email already exists
            const existingUser = this.users.find(user =>
                user.email.toLowerCase() === userData.email.toLowerCase()
            );

            if (existingUser) {
                throw new Error('Email already exists. Please use a different email.');
            }

            // Create new user
            const newUser = {
                id: Date.now(),
                firstName: userData.firstName.trim(),
                lastName: userData.lastName.trim(),
                email: userData.email.toLowerCase().trim(),
                password: userData.password,
                gender: userData.gender || '',
                joinDate: new Date().toISOString().split('T')[0]
            };

            // Add to users array
            this.users.push(newUser);

            // Save to CSV backend
            this.saveUsersToCSV();

            // Set current user and session
            this.currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            localStorage.setItem('isLoggedIn', 'true');

            console.log('✅ Signup successful for:', userData.email);
            return { success: true, user: newUser, message: 'Account created successfully!' };

        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, message: error.message };
        }
    }

    // Login user
    async login(email, password) {
        try {
            console.log('🔑 Attempting login for:', email);

            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            // Find user in CSV data
            const user = this.users.find(u =>
                u.email.toLowerCase() === email.toLowerCase() &&
                u.password === password
            );

            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Set current user and session
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');

            console.log('✅ Login successful for:', email);
            return { success: true, user: user, message: 'Login successful!' };

        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: error.message };
        }
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        console.log('✅ User logged out');
    }
}

// Initialize system
let userSystem = null;

// Tab switching functionality
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    const tabIndicator = document.querySelector('.tab-indicator');

    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Remove active class from all tabs and forms
            tabBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));

            // Add active class to clicked tab and corresponding form
            btn.classList.add('active');
            document.getElementById(targetTab === 'login' ? 'loginForm' : 'registerForm').classList.add('active');

            // Move tab indicator
            if (tabIndicator) {
                tabIndicator.style.transform = `translateX(${index * 100}%)`;
            }
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
    switch (type) {
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

// Simple login handler
async function handleLogin(event) {
    event.preventDefault();

    const submitBtn = event.target.querySelector('.submit-btn');
    submitBtn.classList.add('loading');

    // Get form data - using loginId as email for login
    const email = document.getElementById('loginId').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Basic validation
    if (!email || !password) {
        submitBtn.classList.remove('loading');
        showNotification('Please enter both email and password', 'error');
        return;
    }

    try {
        // Wait for user system to be ready
        if (!userSystem) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Attempt login
        const result = await userSystem.login(email, password);

        if (result.success) {
            // Store remember me preference
            if (rememberMe) {
                localStorage.setItem('rememberedUser', JSON.stringify({
                    email: email,
                    rememberMe: true
                }));
            } else {
                // Clear remembered user if not checking remember me
                localStorage.removeItem('rememberedUser');
            }

            // Show success animation
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            showNotification(result.message, 'success');

            // Redirect after short delay
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);

        } else {
            submitBtn.classList.remove('loading');
            showNotification(result.message, 'error');
        }

    } catch (error) {
        console.error('Login error:', error);
        submitBtn.classList.remove('loading');
        showNotification('Login failed. Please try again.', 'error');
    }
}

// Simple registration handler
async function handleRegister(event) {
    event.preventDefault();

    const submitBtn = event.target.querySelector('.submit-btn');
    submitBtn.classList.add('loading');

    // Get form data
    const formData = {
        firstName: document.getElementById('regFirstName').value.trim(),
        lastName: document.getElementById('regLastName').value.trim(),
        email: document.getElementById('regEmail').value.trim(),
        gender: document.getElementById('regGender').value,
        password: document.getElementById('regPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        agreeTerms: document.getElementById('agreeTerms').checked
    };

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        submitBtn.classList.remove('loading');
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        submitBtn.classList.remove('loading');
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (!formData.agreeTerms) {
        submitBtn.classList.remove('loading');
        showNotification('Please agree to the terms and conditions', 'error');
        return;
    }

    try {
        // Wait for user system to be ready
        if (!userSystem) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Attempt signup
        const result = await userSystem.signup(formData);

        if (result.success) {
            // Show success animation
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            showNotification(result.message, 'success');

            // Redirect after short delay
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);

        } else {
            submitBtn.classList.remove('loading');
            showNotification(result.message, 'error');
        }

    } catch (error) {
        console.error('Registration error:', error);
        submitBtn.classList.remove('loading');
        showNotification('Registration failed. Please try again.', 'error');
    }
}

// Social login handler
function socialLogin(provider) {
    showNotification(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`, 'warning');
}

// Load remembered user data (only if remember me was checked)
function loadRememberedUser() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        try {
            const userData = JSON.parse(rememberedUser);
            // Only fill if the user had previously checked "remember me"
            if (userData.email && userData.rememberMe !== false) {
                document.getElementById('loginId').value = userData.email;
                document.getElementById('rememberMe').checked = true;
            }
        } catch (error) {
            // If there's an error parsing, clear the remembered user
            localStorage.removeItem('rememberedUser');
        }
    }
}

// Clear remembered user data
function clearRememberedUser() {
    localStorage.removeItem('rememberedUser');
    document.getElementById('loginId').value = '';
    document.getElementById('rememberMe').checked = false;
}

// Fill login form with demo user credentials
function fillLogin(email, password) {
    document.getElementById('loginId').value = email;
    document.getElementById('password').value = password;
}

// Social Login Configuration
// 🔧 SETUP INSTRUCTIONS:
// 1. Google: Get your Client ID from https://console.developers.google.com/
// 2. Facebook: Get your App ID from https://developers.facebook.com/
// 3. Apple: Get your Client ID from https://developer.apple.com/
// 4. Replace the demo values below with your actual credentials

const SOCIAL_CONFIG = {
    google: {
        clientId: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com', // 🔧 Replace with your Google Client ID
        enabled: true
    },
    facebook: {
        appId: '1234567890123456', // 🔧 Replace with your Facebook App ID
        version: 'v18.0',
        enabled: true
    },
    apple: {
        clientId: 'com.vastrarent.signin', // 🔧 Replace with your Apple Client ID
        redirectURI: window.location.origin + '/login.html',
        enabled: true
    }
};

// Initialize Social Login Systems
function initializeSocialLogins() {
    initializeGoogleSignIn();
    initializeFacebookSDK();
    initializeAppleSignIn();
}

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts && SOCIAL_CONFIG.google.enabled) {
        try {
            google.accounts.id.initialize({
                client_id: SOCIAL_CONFIG.google.clientId,
                callback: handleGoogleSignIn,
                auto_select: false,
                cancel_on_tap_outside: true
            });
            console.log('✅ Google Sign-In initialized');
        } catch (error) {
            console.error('Google Sign-In initialization error:', error);
        }
    } else {
        console.warn('Google Sign-In API not available');
    }
}

// Initialize Facebook SDK
function initializeFacebookSDK() {
    if (typeof FB === 'undefined') {
        window.fbAsyncInit = function() {
            FB.init({
                appId: SOCIAL_CONFIG.facebook.appId,
                cookie: true,
                xfbml: true,
                version: SOCIAL_CONFIG.facebook.version
            });
            console.log('✅ Facebook SDK initialized');
        };
    }
}

// Initialize Apple Sign-In
function initializeAppleSignIn() {
    if (typeof AppleID !== 'undefined' && SOCIAL_CONFIG.apple.enabled) {
        try {
            AppleID.auth.init({
                clientId: SOCIAL_CONFIG.apple.clientId,
                scope: 'name email',
                redirectURI: SOCIAL_CONFIG.apple.redirectURI,
                state: 'signin',
                usePopup: true
            });
            console.log('✅ Apple Sign-In initialized');
        } catch (error) {
            console.error('Apple Sign-In initialization error:', error);
        }
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
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('JWT Parse Error:', error);
        return null;
    }
}

// Enhanced social login handler with actual implementations
async function socialLogin(provider) {
    const button = document.querySelector(`.social-btn.${provider}`);
    
    // Add loading state
    button.classList.add('loading');
    
    try {
        switch (provider) {
            case 'google':
                await handleGoogleLogin();
                break;
            case 'facebook':
                await handleFacebookLogin();
                break;
            case 'apple':
                await handleAppleLogin();
                break;
            default:
                throw new Error('Unknown provider');
        }
    } catch (error) {
        console.error(`${provider} login error:`, error);
        showNotification(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed. Please try again.`, 'error');
    } finally {
        // Remove loading state
        setTimeout(() => {
            button.classList.remove('loading');
        }, 1000);
    }
}

// Google Login Handler
async function handleGoogleLogin() {
    return new Promise((resolve, reject) => {
        if (typeof google !== 'undefined' && google.accounts) {
            // Use the One Tap API
            google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    // Fallback to popup
                    google.accounts.oauth2.initTokenClient({
                        client_id: SOCIAL_CONFIG.google.clientId,
                        scope: 'email profile',
                        callback: async (response) => {
                            if (response.access_token) {
                                try {
                                    const userInfo = await fetchGoogleUserInfo(response.access_token);
                                    await processSocialLogin('google', userInfo);
                                    resolve();
                                } catch (error) {
                                    reject(error);
                                }
                            } else {
                                reject(new Error('No access token received'));
                            }
                        }
                    }).requestAccessToken();
                }
            });
        } else {
            // Simulate Google login for demo purposes
            showNotification('Demo Mode: Simulating Google login...', 'warning');
            setTimeout(async () => {
                const demoUser = {
                    id: 'google_demo_' + Date.now(),
                    firstName: 'Google',
                    lastName: 'User',
                    email: 'google.user@gmail.com',
                    profilePicture: 'https://via.placeholder.com/100x100?text=G',
                    provider: 'google'
                };
                await processSocialLogin('google', demoUser);
                resolve();
            }, 1000);
        }
    });
}

// Facebook Login Handler
async function handleFacebookLogin() {
    return new Promise((resolve, reject) => {
        if (typeof FB !== 'undefined') {
            FB.login((response) => {
                if (response.authResponse) {
                    FB.api('/me', { fields: 'name,email,first_name,last_name,picture' }, async (userInfo) => {
                        try {
                            const userData = {
                                id: 'fb_' + userInfo.id,
                                firstName: userInfo.first_name,
                                lastName: userInfo.last_name,
                                email: userInfo.email,
                                profilePicture: userInfo.picture?.data?.url,
                                provider: 'facebook'
                            };
                            await processSocialLogin('facebook', userData);
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    });
                } else {
                    reject(new Error('Facebook login cancelled'));
                }
            }, { scope: 'email' });
        } else {
            // Simulate Facebook login for demo purposes
            showNotification('Demo Mode: Simulating Facebook login...', 'warning');
            setTimeout(async () => {
                const demoUser = {
                    id: 'facebook_demo_' + Date.now(),
                    firstName: 'Facebook',
                    lastName: 'User',
                    email: 'facebook.user@facebook.com',
                    profilePicture: 'https://via.placeholder.com/100x100?text=F',
                    provider: 'facebook'
                };
                await processSocialLogin('facebook', demoUser);
                resolve();
            }, 1000);
        }
    });
}

// Apple Login Handler
async function handleAppleLogin() {
    return new Promise((resolve, reject) => {
        if (typeof AppleID !== 'undefined') {
            AppleID.auth.signIn().then(async (response) => {
                try {
                    const userData = {
                        id: 'apple_' + response.user,
                        firstName: response.user?.firstName || 'Apple',
                        lastName: response.user?.lastName || 'User',
                        email: response.user?.email || 'apple.user@icloud.com',
                        profilePicture: 'https://via.placeholder.com/100x100?text=A',
                        provider: 'apple'
                    };
                    await processSocialLogin('apple', userData);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }).catch(reject);
        } else {
            // Simulate Apple login for demo purposes
            showNotification('Demo Mode: Simulating Apple login...', 'warning');
            setTimeout(async () => {
                const demoUser = {
                    id: 'apple_demo_' + Date.now(),
                    firstName: 'Apple',
                    lastName: 'User',
                    email: 'apple.user@icloud.com',
                    profilePicture: 'https://via.placeholder.com/100x100?text=A',
                    provider: 'apple'
                };
                await processSocialLogin('apple', demoUser);
                resolve();
            }, 1000);
        }
    });
}

// Fetch Google User Info
async function fetchGoogleUserInfo(accessToken) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user info');
    }
    const userInfo = await response.json();
    return {
        id: 'google_' + userInfo.id,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        email: userInfo.email,
        profilePicture: userInfo.picture,
        provider: 'google'
    };
}

// Process Social Login
async function processSocialLogin(provider, userData) {
    try {
        // Check if user already exists in our system
        let existingUser = userSystem.users.find(user => 
            user.email.toLowerCase() === userData.email.toLowerCase() ||
            user.socialId === userData.id
        );

        if (existingUser) {
            // Update existing user with social data
            existingUser.socialId = userData.id;
            existingUser.provider = provider;
            existingUser.profilePicture = userData.profilePicture;
            
            // Login existing user
            userSystem.currentUser = existingUser;
            localStorage.setItem('currentUser', JSON.stringify(existingUser));
            localStorage.setItem('isLoggedIn', 'true');
            
            showNotification(`Welcome back, ${existingUser.firstName}!`, 'success');
        } else {
            // Create new user
            const newUser = {
                id: Date.now(),
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                socialId: userData.id,
                provider: provider,
                profilePicture: userData.profilePicture,
                gender: '',
                joinDate: new Date().toISOString().split('T')[0],
                loginMethod: 'social'
            };

            // Add to users array
            userSystem.users.push(newUser);
            userSystem.saveUsersToCSV();

            // Login new user
            userSystem.currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            localStorage.setItem('isLoggedIn', 'true');

            showNotification(`Welcome to Vastra Rent, ${newUser.firstName}!`, 'success');
        }

        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);

    } catch (error) {
        console.error('Social login processing error:', error);
        throw error;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize user system
    userSystem = new SimpleUserSystem();

    // Initialize functionality
    initializeTabs();

    // Only load remembered user if it exists and was explicitly saved
    // Comment out this line to prevent auto-filling email
    // loadRememberedUser();

    // Initialize Social Logins after a short delay to ensure APIs are loaded
    setTimeout(() => {
        initializeSocialLogins();
    }, 1000);

    // Add input focus effects
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');
        });
    });

    // Clear any old remembered user data on page load to start fresh
    clearRememberedUser();
});