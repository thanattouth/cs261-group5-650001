// ดึงข้อมูลจาก localStorage
const userData = JSON.parse(localStorage.getItem('userData'));

// ตรวจสอบว่าข้อมูลมีอยู่หรือไม่
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
