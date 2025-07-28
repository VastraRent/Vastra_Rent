function handleLogin(event) {
    event.preventDefault();

    // Get form data
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const gender = document.getElementById('gender').value;
    const loginId = document.getElementById('loginId').value;
    const password = document.getElementById('password').value;

    // Since all login/password combinations are correct, just store the user data
    const userData = {
        firstName: firstName,
        lastName: lastName,
        fullName: firstName + ' ' + lastName,
        gender: gender,
        loginId: loginId,
        email: loginId + '@vastrarent.com', // Generate email from login ID
        phone: '+1 (555) 123-4567', // Default phone
        joinDate: new Date().toISOString().split('T')[0],
        membershipType: 'Gold',
        isLoggedIn: true
    };

    // Store user data in localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');

    // Redirect to home page
    window.location.href = 'home.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'home.html';
    }
});