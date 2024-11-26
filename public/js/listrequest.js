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

// ฟังก์ชันดึงข้อมูลจาก API สำหรับแต่ละตาราง
async function fetchFormData1() {
    try {
        const response = await fetch('http://localhost:3000/api/form/delayedReg');
        const formData = await response.json();
        const tableBody = document.querySelector('#studentTable1 tbody');
        tableBody.innerHTML = '';
        formData.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.studentid}</td>
                <td>${student.full_name}</td>
                <td>
                    <button class="modify" onclick="redirectToEditPage1('${student.studentid}')">แก้ไข</button>
                    <button class="delete" onclick="deleteStudent('${student.studentid}')">ยกเลิก</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data for table 1:', error);
    }
}

// ฟังก์ชันสำหรับลบข้อมูล
async function deleteStudent1(studentid) {
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
              fetchFormData1(); // รีเฟรชข้อมูลหลังจากลบ
            }
          });
    } else {
        alert('Delete failed!');
    }
}

async function fetchFormData2() {
    try {
        const response = await fetch('http://localhost:3000/api/form/rev');
        const formData = await response.json();
        const tableBody = document.querySelector('#studentTable2 tbody');
        tableBody.innerHTML = '';
        formData.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.studentid}</td>
                <td>${student.full_name}</td>
                <td>
                    <button class="modify" onclick="redirectToEditPage2('${student.studentid}')">แก้ไข</button>
                    <button class="delete" onclick="deleteStudent('${student.studentid}')">ยกเลิก</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data for table 2:', error);
        alert('Failed to fetch data. Please try again.');
    }
}

// ฟังก์ชันสำหรับลบข้อมูล
async function deleteStudent2(studentid) {
    const response = await fetch(`http://localhost:3000/api/form/rev/${studentid}`, {
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
              fetchFormData2(); // รีเฟรชข้อมูลหลังจากลบ
            }
          });
    } else {
        alert('Delete failed!');
    }
}

// เรียกใช้ฟังก์ชันทุกครั้งเมื่อโหลดหน้าสำเร็จ
document.addEventListener('DOMContentLoaded', function() {
    fetchFormData1();  // เรียกใช้ฟังก์ชันดึงข้อมูลสำหรับตาราง 1
    fetchFormData2();  // เรียกใช้ฟังก์ชันดึงข้อมูลสำหรับตาราง 2
    // fetchFormData3();  // เรียกใช้ฟังก์ชันดึงข้อมูลสำหรับตาราง 3
    // fetchFormData4();  // เรียกใช้ฟังก์ชันดึงข้อมูลสำหรับตาราง 4
});

function redirectToEditPage1(studentid) {
    // เปลี่ยนเส้นทางไปยังหน้า edit.html พร้อมส่ง studentid เป็น query parameter
    window.location.href = `editrequest1.html?studentid=${studentid}`;
}
function redirectToEditPage2(studentid) {
    // เปลี่ยนเส้นทางไปยังหน้า edit.html พร้อมส่ง studentid เป็น query parameter
    window.location.href = `editrequest2.html?studentid=${studentid}`;
}