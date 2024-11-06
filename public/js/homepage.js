// ดึงข้อมูลจาก localStorage
const userData = JSON.parse(localStorage.getItem('userData'));

document.addEventListener('DOMContentLoaded', function() {
    // Check if the current page is the home page
    const currentPage = window.location.pathname.split('/').pop(); // Gets the current file name

    // Assuming this file is named "home.html"
    if (currentPage === 'home.html') {
        document.getElementById('home-nav').classList.add('active'); // Add the active class
    }
});
