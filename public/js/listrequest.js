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
    try {
        const response = await fetch(apiUrl); // ดึงข้อมูลจาก API
        const formData = await response.json();

        // ตรวจสอบข้อมูลที่ได้จาก API (ใช้สำหรับ debug)
        console.log(formData);

        const tableBody = document.querySelector('#studentTable tbody');
        tableBody.innerHTML = ''; // ลบข้อมูลเก่าออกก่อน

        formData.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.studentid}</td>
                <td>${student.full_name}</td>
                <td>
                    <button class="modify" onclick="redirectToEditPage('${student.studentid}')">แก้ไข</button>
                    <button class="delete" onclick="deleteStudent('${student.studentid}')">ยกเลิก</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching form data:', error);
        alert('Failed to fetch data. Please try again.');
    }
}

// ฟังก์ชันสำหรับลบข้อมูล
async function deleteStudent(studentid) {
    const response = await fetch(`http://localhost:3000/api/form/delayedReg/${studentid}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        Swal.fire({
            title: "คุณต้องการลบ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก"  // เพิ่มข้อความสำหรับปุ่มยกเลิก
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "การลบสำเร็จ",
                icon: "success"
              });
              fetchFormData(); // รีเฟรชข้อมูลหลังจากลบ
            }
          });
    } else {
        alert('Delete failed!');
    }
}

//เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อโหลดหน้า
window.onload = fetchFormData;

function redirectToEditPage(studentid) {
    // เปลี่ยนเส้นทางไปยังหน้า edit.html พร้อมส่ง studentid เป็น query parameter
    window.location.href = `editrequest1.html?studentid=${studentid}`;
}