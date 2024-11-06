document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout-nav');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            sessionManager.showLogoutModal();
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
});