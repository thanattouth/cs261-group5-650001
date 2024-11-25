
const userData = JSON.parse(localStorage.getItem('userData'));
if (userData && userData.displayname_th) {
    document.getElementById("welcome-message-name").innerHTML = `
        <div><strong>ชื่อ :</strong> ${userData.displayname_th}</div>
        <div><strong>ID :</strong> ${userData.username}</div>
        <div><strong>คณะ :</strong> ${userData.faculty}</div>
        <div><strong>สาขา :</strong> ${userData.department}</div>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    // Check if the current page is the home page
    const currentPage = window.location.pathname.split('/').pop(); // Gets the current file name

    // Assuming this file is named "home.html"
    if (currentPage === 'home.html') {
        document.getElementById('home-nav').classList.add('active'); // Add the active class
    }

    disableCurrentPageLink();
    updateDynamicLink();
});

// Function to disable current page link
function disableCurrentPageLink() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Disable home link if on home page
    if (currentPage === 'home.html') {
        const homeLink = document.querySelector('a[href="home.html"]');
        if (homeLink) {
            homeLink.style.pointerEvents = 'none';
            homeLink.style.cursor = 'default';
            document.getElementById('home-nav').classList.add('active');
        }
    }
    
    // Disable request link if on any request page
    if (currentPage.startsWith('request') && currentPage.endsWith('.html')) {
        const requestLink = document.getElementById('dynamicLink');
        if (requestLink) {
            requestLink.style.pointerEvents = 'none';
            requestLink.style.cursor = 'default';
            document.getElementById('req1-nav').classList.add('active');
        }
    }

    // Disable home link if on home page
    if (currentPage === 'listrequest.html') {
        const listLink = document.querySelector('a[href="listrequest.html"]');
        if (listLink) {
            listLink.style.pointerEvents = 'none';
            listLink.style.cursor = 'default';
            document.getElementById('list-nav').classList.add('active');
        }
    }
}

// Update the dynamic link based on selected request
function updateDynamicLink() {
    const requestLink = document.getElementById('dynamicLink');
    if (!requestLink) return;

    const selectedRequest = localStorage.getItem('selectedRequest');
    requestLink.href = selectedRequest ? `request${selectedRequest}.html` : 'request0.html';
}

// Add a function to clear user-specific form data when logging out
function clearUserFormData() {
    const userId = sessionStorage.getItem('userId') || 'defaultUser';
    const formFields = [
        'date', 'name', 'id', 'faculty', 'year', 'address', 'district', 
        'subdistrict', 'province', 'student-tel', 'parent-tel', 'advisor', 
        'semester', 'courseCode', 'courseName', 'section', 'reason'
    ];
    
    formFields.forEach(field => {
        localStorage.removeItem(getStorageKey(field, userId))
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const requestLink = document.getElementById("dynamicLink");

    // โหลดคำร้องที่เลือกจาก localStorage
    const selectedRequest = localStorage.getItem("selectedRequest");

    // ถ้ามีการเลือกคำร้องจากหน้าแรก
    if (selectedRequest) {
        requestLink.href = `request${selectedRequest}.html`;
    } else {
        // ถ้าไม่มีการเลือก ค่าปริยายไปยัง request0.html
        requestLink.href = "request0.html";
    }
});
