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

const apiUrl = 'http://localhost:3000/api/form/delayedReg';

// ฟังก์ชันสำหรับดึงข้อมูลจาก API
async function fetchFormData() {
    const response = await fetch(apiUrl);
    const formData = await response.json();

    // ตรวจสอบข้อมูลที่ได้จาก API
    console.log(formData);

    const tableBody = document.querySelector('#studentTable tbody');
    tableBody.innerHTML = '';  // ลบข้อมูลเก่าออกก่อน

    formData.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.studentid}</td>
            <td contenteditable="true" data-field="full_name">${student.full_name}</td>
            <td contenteditable="true" data-field="address">${student.address}</td>
            <td contenteditable="true" data-field="paren-tel">${student.parent_number}</td>
            <td contenteditable="true" data-field="reason">${student.reason}</td>
            <td>
                <button class="modify" onclick="updateStudent('${student.studentid}', this)">Update</button>
                <button class="delete" onclick="deleteStudent('${student.studentid}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ฟังก์ชันสำหรับอัปเดตข้อมูล
async function updateStudent(studentid, button) {
    const row = button.closest('tr');
    const fullName = row.querySelector('[data-field="full_name"]').textContent;
    const address = row.querySelector('[data-field="address"]').textContent;
    const parent = row.querySelector('[data-field="parent"]').textContent;
    const reason = row.querySelector('[data-field="reason"]').textContent;

    const response = await fetch(`http://localhost:3000/api/form/delayedReg/${studentid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            full_name: fullName,
            address: address,
            parent_number: parent,
            reason: reason
        })
    });

    if (response.ok) {
        alert('Updated successfully!');
    } else {
        alert('Update failed!');
    }
}

// ฟังก์ชันสำหรับลบข้อมูล
async function deleteStudent(studentid) {
    const response = await fetch(`http://localhost:3000/api/form/delayedReg/${studentid}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Deleted successfully!');
        fetchFormData(); // รีเฟรชข้อมูลหลังจากลบ
    } else {
        alert('Delete failed!');
    }
}

//เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อโหลดหน้า
window.onload = fetchFormData;
