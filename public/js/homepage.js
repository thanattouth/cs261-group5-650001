
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
});

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
