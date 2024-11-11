class SessionManager {
    constructor() {
        this.TIMEOUT_DURATION = 30 * 60 * 1000; // 30 นาที
        this.timeoutId = null;
        this.SESSION_KEY = 'tuSession';
        this.LAST_ACTIVITY_KEY = 'lastActivity';
        this.initLogoutModal();

        // เพิ่มการตรวจสอบ session timeout
        this.initSessionTimeout();

        // ตรวจสอบการย้อนกลับหลัง logout
        window.addEventListener('popstate', this.handlePopState.bind(this));
        window.addEventListener('load', this.checkSessionValidity.bind(this));
        
        // ติดตามกิจกรรมของผู้ใช้
        ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
            document.addEventListener(event, () => this.updateLastActivity());
        });
        
        // ตรวจสอบ session ระหว่าง tabs
        window.addEventListener('storage', this.handleStorageChange.bind(this));
    }

    initSessionTimeout() {
        setInterval(() => {
            const lastActivity = parseInt(localStorage.getItem(this.LAST_ACTIVITY_KEY) || '0');
            if (Date.now() - lastActivity > this.TIMEOUT_DURATION) {
                this.handleSessionTimeout();
            }
        }, 1000); // ตรวจสอบทุกๆ 1 วินาที
    }

    updateLastActivity() {
        localStorage.setItem(this.LAST_ACTIVITY_KEY, Date.now().toString());
    }

    handleSessionTimeout() {
        if (this.getSessionData()) {
            alert('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
            this.logout();
        }
    }

    handleStorageChange(e) {
        if (e.key === this.SESSION_KEY && !e.newValue) {
            // Session ถูกลบในแท็บอื่น
            this.redirectToLogin();
        }
    }

    handlePopState(e) {
        if (!this.getSessionData() || sessionStorage.getItem('isLoggedOut') === 'true') {
            this.redirectToLogin();
        }
    }

    async login(userData) {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // สำคัญสำหรับ session cookie
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            if (data.session) {
                sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(data.session));
                this.updateLastActivity();
                this.redirectToHome();
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    }

    async logout() {
        try {
            await fetch('/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            
            // ล้างข้อมูล session ทั้งหมด
            sessionStorage.clear();
            localStorage.removeItem(this.LAST_ACTIVITY_KEY);
            sessionStorage.setItem('isLoggedOut', 'true');
            
            // ทำลาย history stack เดิมและสร้างใหม่
            window.location.replace('./index.html');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    checkSessionValidity() {
        const sessionData = this.getSessionData();
        const lastActivity = parseInt(localStorage.getItem(this.LAST_ACTIVITY_KEY) || '0');
        
        if (sessionData && Date.now() - lastActivity > this.TIMEOUT_DURATION) {
            this.handleSessionTimeout();
            return false;
        }
        return !!sessionData;
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

    getSessionData() {
        const sessionStr = sessionStorage.getItem(this.SESSION_KEY);
        return sessionStr ? JSON.parse(sessionStr) : null;
    }

    redirectToLogin() {
        if (window.location.pathname !== './index.html') {
            window.location.replace('./index.html');
        }
    }
    
    // จัดการ logout
    logout() {
        const sessionData = this.getSessionData();
        console.log('Logging out. Session data before clearing:', sessionData);
    
        // Clear session and user data
        sessionStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem('userData');
        sessionStorage.setItem('isLoggedOut', 'true');
    
        console.log('Session cleared. All storage data removed.');
    
        // Clear welcome message in home if exists
        const welcomeMessage = document.getElementById('welcome-message-name');
        if (welcomeMessage) {
            welcomeMessage.innerHTML = '';
        }
    
        // Redirect to login page without redundant history manipulation
        window.location.replace('./index.html');
    }

    preventBackAfterLogout() {
        if (sessionStorage.getItem('isLoggedOut') === 'true') {
          sessionStorage.removeItem('isLoggedOut');
          this.redirectToLogin();
        }
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
}

const sessionManager = new SessionManager();