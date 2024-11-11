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
        // Call submitLogin with the form values
        submitLogin();
    }
}

function createModal() {
    // ลบ modal เก่าถ้ามีอยู่
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-container">
            <div class="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <div class="welcome-text">Welcome</div>
            <div class="user-name"></div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function showWelcomeMessage(data) {
    const modal = createModal();
    const userName = modal.querySelector('.user-name');
    userName.textContent = data.displayname_en || 'User';
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 100);

    // Redirect after welcome message
    setTimeout(() => {
        // ใช้ fetch เพื่อตรวจสอบว่า session ยังคงอยู่ก่อน redirect
        fetch('/api/check-auth')
            .then(response => response.json())
            .then(authData => {
                if (authData.authenticated) {
                    window.location.href = './home.html';
                } else {
                    // ถ้า session หมดอายุหรือมีปัญหา
                    localStorage.removeItem('userData');
                    window.location.href = '/';
                }
            })
            .catch(error => {
                console.error('Auth check failed:', error);
                window.location.href = '/';
            });
    }, 2000);
}


// script.js
function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

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
        console.log('API Response:', data);
        
        if (data && data.status === true) {
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';

             //ส่งข้อมูลไป save ใน databse
            //commentปิดไว้ให้ ถ้าจะเปิดลองให้ต้องมีdockerของdatabase กับ รันCRUDก่อน
            //const studentLoginLog = new StudentLoginLog();
           // studentLoginLog.fetchUserData(username);

            // Save user data in localStorage
            localStorage.setItem('userData', JSON.stringify(data));
            
            // Create session with server
            return fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    userData: data
                })
            });
        } else {
            throw new Error(data.message || 'Invalid username or password');
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Session creation failed');
        }
        return response.json();
    })
    .then(sessionResponse => {
        if (sessionResponse.success) {
            // Show welcome message and redirect
            showWelcomeMessage(JSON.parse(localStorage.getItem('userData')));
        } else {
            throw new Error('Session creation failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = error.message || 'An error occurred during login';
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