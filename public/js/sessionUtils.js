class SessionManager {
    constructor() {
        this.TIMEOUT_DURATION = 30 * 60 * 1000; // 30 นาที
        this.timeoutId = null;
        this.initLogoutModal();
        
        // เพิ่ม event listener สำหรับ popstate
        window.addEventListener('popstate', () => {
            if (sessionStorage.getItem('isLoggedOut') === 'true') {
                this.redirectToLogin();
            }
        });
    }

    // สร้าง Modal HTML
    initLogoutModal() {
        const modalHTML = `
            <div id="logoutModal" class="modal-overlay" style="display: none;">
                <div class="modal-container" style="
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    position: relative;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                ">
                    <h3 style="margin-bottom: 20px;">ยืนยันการออกจากระบบ</h3>
                    <p style="margin-bottom: 20px;">คุณต้องการออกจากระบบหรือไม่?</p>
                    <div style="display: flex; justify-content: center; gap: 10px;">
                        <button id="confirmLogout" style="
                            padding: 8px 20px;
                            border: none;
                            border-radius: 4px;
                            background-color: #dc3545;
                            color: white;
                            cursor: pointer;
                        ">ใช่</button>
                        <button id="cancelLogout" style="
                            padding: 8px 20px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            background-color: white;
                            cursor: pointer;
                        ">ไม่</button>
                    </div>
                </div>
            </div>
        `;

        // เพิ่ม Modal เข้าไปใน body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // เพิ่ม style สำหรับ modal-overlay
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .modal-container button:hover {
                opacity: 0.9;
            }
        `;
        document.head.appendChild(styleSheet);
    }

    // แสดง Modal
    showLogoutModal() {
        const modal = document.getElementById('logoutModal');
        modal.style.display = 'flex';
    }

    // ซ่อน Modal
    hideLogoutModal() {
        const modal = document.getElementById('logoutModal');
        modal.style.display = 'none';
    }

    // ตรวจสอบ session
    checkSession() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            this.redirectToLogin();
            return false;
        }
        return true;
    }

    redirectToLogin() {
        // เพิ่มการป้องกันการย้อนกลับโดยแทนที่ history
        window.history.replaceState(null, '', './index.html');
        window.location.replace('./index.html');
    }

    // จัดการ logout
    logout() {
        // ลบข้อมูลทั้งหมดที่ได้จาก TU API
        localStorage.removeItem('userData');
        sessionStorage.clear();
        
        // เพิ่ม flag สำหรับป้องกันการกด back
        sessionStorage.setItem('isLoggedOut', 'true');
        
        // ลบข้อมูลที่แสดงในหน้า home (ถ้ามี)
        const welcomeMessage = document.getElementById('welcome-message-name');
        if (welcomeMessage) {
            welcomeMessage.innerHTML = '';
        }

        // แทนที่ history ด้วย login page
        window.history.replaceState(null, '', './index.html');
        
        // เพิ่ม state ใหม่เพื่อป้องกันการย้อนกลับ
        window.history.pushState(null, '', './index.html');
        
        // redirect ไปหน้า login
        this.redirectToLogin();
    }

    preventBackAfterLogout() {
        if (sessionStorage.getItem('isLoggedOut') === 'true') {
            // ล้าง flag
            sessionStorage.removeItem('isLoggedOut');
            
            // แทนที่ history ทั้งหมดด้วยหน้า login
            window.history.replaceState(null, '', './index.html');
            this.redirectToLogin();
        }
    }

    // ตั้งค่าหน้า login
    setupLoginPage() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            window.location.replace('./home.html');
            return;
        }
        sessionStorage.removeItem('isLoggedOut');
    }

    // ตั้งค่า session timeout
    setupSessionTimeout() {
        const resetTimeout = () => {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                alert('Your session has expired. Please login again.');
                this.logout();
            }, this.TIMEOUT_DURATION);
        };

        ['mousemove', 'keypress', 'click', 'scroll'].forEach(event => {
            document.addEventListener(event, resetTimeout);
        });

        resetTimeout();
    }

    // ตั้งค่าการป้องกันในหน้าที่ต้องล็อกอิน
    setupProtectedPage() {
        if (this.checkSession()) {
            this.preventBackAfterLogout();
            this.setupSessionTimeout();
            
            // แสดงข้อมูลผู้ใช้ในหน้า home
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData && userData.displayname_th) {
                const welcomeMessage = document.getElementById('welcome-message-name');
                if (welcomeMessage) {
                    welcomeMessage.innerHTML = `
                    <div><strong>ชื่อ :</strong> ${userData.displayname_th}</div>
                    <div><strong>ID :</strong> ${userData.username}</div>
                    <div><strong>คณะ :</strong> ${userData.faculty}</div>
                    <div><strong>สาขา :</strong> ${userData.department}</div>`;
                }
            }
        }
    }
}

// สร้าง instance ของ SessionManager
const sessionManager = new SessionManager();