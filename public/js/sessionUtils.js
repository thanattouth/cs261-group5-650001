class SessionManager {
    constructor() {
        this.TIMEOUT_DURATION = 30 * 60 * 1000; // 30 นาที
        this.timeoutId = null;
        this.SESSION_KEY = 'tuSession';
        this.initLogoutModal();
        
        window.addEventListener('popstate', () => {
            if (sessionStorage.getItem('isLoggedOut') === 'true') {
                this.redirectToLogin();
            }
        });

        // เพิ่ม event listener สำหรับตรวจสอบการเปลี่ยนแปลงของ session storage
        window.addEventListener('storage', (e) => {
            if (e.key === this.SESSION_KEY) {
                console.log('Session state changed:', e.newValue ? 'active' : 'inactive');
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

    createSession(userData) {
        const sessionData = {
            userId: userData.username,
            loginTime: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            expiresAt: new Date(Date.now() + this.TIMEOUT_DURATION).toISOString()
        };

        // เก็บข้อมูล session ใน sessionStorage
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
        
        // เก็บข้อมูลผู้ใช้ใน localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        console.log('Session created:', sessionData);
        this.setupSessionTimeout();
    }

    // ตรวจสอบ session
    checkSession() {
        const sessionData = this.getSessionData();
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (!sessionData || !userData) {
            console.log('Session check failed: No session data or user data found');
            this.redirectToLogin();
            return false;
        }

        // ตรวจสอบว่า session หมดอายุหรือยัง
        if (new Date(sessionData.expiresAt) < new Date()) {
            console.log('Session expired');
            this.logout();
            return false;
        }

        // อัพเดท lastActivity
        this.updateSessionActivity();
        console.log('Session valid:', sessionData);
        return true;
    }

    updateSessionActivity() {
        const sessionData = this.getSessionData();
        if (sessionData) {
            sessionData.lastActivity = new Date().toISOString();
            sessionData.expiresAt = new Date(Date.now() + this.TIMEOUT_DURATION).toISOString();
            sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
        }
    }

    getSessionData() {
        const sessionStr = sessionStorage.getItem(this.SESSION_KEY);
        return sessionStr ? JSON.parse(sessionStr) : null;
    }

    redirectToLogin() {
        // เพิ่มการป้องกันการย้อนกลับโดยแทนที่ history
        window.history.replaceState(null, '', './index.html');
        window.location.replace('./index.html');
    }

    // จัดการ logout
    logout() {
        // Log session state before clearing
        const sessionData = this.getSessionData();
        console.log('Logging out. Session data before clearing:', sessionData);

        // ลบข้อมูล session
        sessionStorage.removeItem(this.SESSION_KEY);
        
        // ลบข้อมูลผู้ใช้
        localStorage.removeItem('userData');
        sessionStorage.clear();
        
        // เพิ่ม flag สำหรับป้องกันการกด back
        sessionStorage.setItem('isLoggedOut', 'true');
        
        console.log('Session cleared. All storage data removed.');

        // ลบข้อมูลที่แสดงในหน้า home (ถ้ามี)
        const welcomeMessage = document.getElementById('welcome-message-name');
        if (welcomeMessage) {
            welcomeMessage.innerHTML = '';
        }

        // จัดการ history
        window.history.replaceState(null, '', './index.html');
        window.history.pushState(null, '', './index.html');
        
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

    setupSessionTimeout() {
        const resetTimeout = () => {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                console.log('Session timeout triggered');
                alert('Your session has expired. Please login again.');
                this.logout();
            }, this.TIMEOUT_DURATION);

            // อัพเดท lastActivity เมื่อมีการทำกิจกรรม
            this.updateSessionActivity();
        };

        // เพิ่ม event listeners สำหรับการตรวจจับกิจกรรมของผู้ใช้
        ['mousemove', 'keypress', 'click', 'scroll'].forEach(event => {
            document.addEventListener(event, resetTimeout);
        });

        resetTimeout();
    }

    setupLoginPage() {
        console.log('Setting up login page');
        const sessionData = this.getSessionData();
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        console.log('Current session data:', sessionData);
        console.log('Current user data:', userData);

        if (userData && sessionData) {
            console.log('Active session found, redirecting to home');
            window.location.replace('./home.html');
            return;
        }
        sessionStorage.removeItem('isLoggedOut');
    }

    // แสดงสถานะ session ปัจจุบัน (สำหรับการตรวจสอบ)
    debugSession() {
        const sessionData = this.getSessionData();
        const userData = JSON.parse(localStorage.getItem('userData'));
        const isLoggedOut = sessionStorage.getItem('isLoggedOut');

        console.log('=== Session Debug Info ===');
        console.log('Session Data:', sessionData);
        console.log('User Data:', userData);
        console.log('Logged Out Flag:', isLoggedOut);
        console.log('Session Storage Keys:', Object.keys(sessionStorage));
        console.log('Local Storage Keys:', Object.keys(localStorage));
        console.log('========================');
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