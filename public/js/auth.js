// auth.js
async function checkAuthentication() {
    try {
        // ตรวจสอบ session กับ server
        const response = await fetch('/api/check-auth');
        const data = await response.json();
        
        if (!data.authenticated) {
            window.location.href = './index.html';
            return false;
        }
        
        // ตรวจสอบ localStorage เพิ่มเติม
        const userData = localStorage.getItem('userData');
        if (!userData) {
            window.location.href = './index.html';
            return false;
        }

        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = './index.html';
        return false;
    }
}

async function logout() {
    try {
        // ทำ logout ที่ server
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'same-origin'
        });
        
        // ลบข้อมูลใน localStorage
        localStorage.removeItem('userData');
        
        // redirect ไปหน้า login
        window.location.href = './index.html';
        sessionManager.showLogoutModal();
    } catch (error) {
        console.error('Logout failed:', error);
        // ถ้า logout ไม่สำเร็จ ก็ให้ redirect ไปหน้า login อยู่ดี
        window.location.href = './index.html';
    }
}

// Update submitLogin function in your script.js
async function submitLogin(username, userData) {
    try {
        // บันทึก session ที่ server
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, userData })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        // บันทึกข้อมูลใน localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // แสดง welcome message และ redirect
        showWelcomeMessage(userData);
    } catch (error) {
        console.error('Login failed:', error);
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Login failed. Please try again.';
        errorMessage.style.display = 'block';
    }
}

// เพิ่ม event listeners เมื่อ DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', function() {
    // ตรวจสอบการ authentication
    checkAuthentication();

    const logoutButton = document.getElementById('logout-nav');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            sessionManager.showLogoutModal();
            clearUserFormData();
        });
    }

    // Event listeners สำหรับปุ่มใน Modal
    document.getElementById('confirmLogout').addEventListener('click', function() {
        sessionManager.logout();
    });

    document.getElementById('cancelLogout').addEventListener('click', function() {
        sessionManager.hideLogoutModal();
    });

    // ปิด Modal เมื่อคลิกพื้นหลัง
    document.getElementById('logoutModal').addEventListener('click', function(e) {
        if (e.target === this) {
            sessionManager.hideLogoutModal();
        }
    });

    // ตรวจสอบหน้าปัจจุบันและเพิ่ม active class
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === './home.html') {
        const homeNav = document.getElementById('home-nav');
        if (homeNav) {
            homeNav.classList.add('active');
        }
    }
});