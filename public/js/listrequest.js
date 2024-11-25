document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop(); // Gets the current file name

    if (currentPage === 'listrequest.html') {
        document.getElementById('list-nav').classList.add('active'); // Add the active class
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