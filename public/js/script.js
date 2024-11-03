function togglePassword() {
    const passwordInput = document.getElementById('password');
    const checkbox = document.getElementById('showPassword');
    
    passwordInput.type = checkbox.checked ? 'text' : 'password';
}

function validateInput(input, pattern, errorMessage) {
    const errorElement = document.getElementById(`${input.id}-error`);
    if (!input.value) {
        errorElement.textContent = 'This field is required';
        input.classList.add('error');
        return false;
    }
    if (!pattern.test(input.value)) {
        errorElement.textContent = errorMessage;
        input.classList.add('error');
        return false;
    }
    errorElement.textContent = '';
    input.classList.remove('error');
    return true;
}

function validateForm(event) {
    event.preventDefault();
    
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    
    const usernameValid = validateInput(
        username, 
        /^\d{10}$/, 
        'Username must be exactly 10 digits'
    );
    
    const passwordValid = validateInput(
        password, 
        /^\d{13}$/, 
        'Password must be exactly 13 digits'
    );

    if (usernameValid && passwordValid) {
        // Proceed with API call
        submitLogin(username.value, password.value);
        return false;
    }

    return false;
}

function submitLogin(username, password) {
    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-key': 'TUbb6fcaa8f4cbc9e0535d13d7afd727a9cb41ae3b68a6eaa4a152e83de1be51a7a6fb9a8239b5dd82ba1901f90213695d'
        },
        body: JSON.stringify({ 
            "UserName": username, 
            "PassWord": password 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            // Login successful
            window.location.href = '/dashboard'; // Redirect to dashboard
        } else {
            // Show error message
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = 'Invalid username or password';
            errorMessage.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'An error occurred during login';
        errorMessage.style.display = 'block';
    });
}

// Clear error messages when user starts typing
document.getElementById('username').addEventListener('input', function() {
    this.classList.remove('error');
    document.getElementById('username-error').textContent = '';
    document.getElementById('error-message').style.display = 'none';
});

document.getElementById('password').addEventListener('input', function() {
    this.classList.remove('error');
    document.getElementById('password-error').textContent = '';
    document.getElementById('error-message').style.display = 'none';
});