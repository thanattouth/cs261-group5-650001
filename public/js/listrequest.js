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
                <td>${student.id}</td>
                <td>${student.full_name}</td>
                <td>
                    <button class="modify" onclick="redirectToEditPage1('${student.id}')">แก้ไข</button>
                    <button class="delete" onclick="deleteStudent1('${student.id}')">ยกเลิก</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data for table 1:', error);
    }
}

// ฟังก์ชันสำหรับลบข้อมูล
// ฟังก์ชันสำหรับลบข้อมูล
async function deleteStudent1(id) {
    Swal.fire({
        title: "คุณต้องการลบ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3000/api/form/delayedReg/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    await Swal.fire({
                        title: "การลบสำเร็จ",
                        icon: "success"
                    });
                    fetchFormData1(); // รีเฟรชข้อมูลหลังจากลบ
                } else {
                    await Swal.fire({
                        title: "การลบล้มเหลว",
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                await Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: error.message,
                    icon: "error"
                });
            }
        }
    });
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
                <td>${student.id}</td>
                <td>${student.full_name}</td>
                <td>
                    <button class="modify" onclick="redirectToEditPage2('${student.id}')">แก้ไข</button>
                    <button class="delete" onclick="deleteStudent2('${student.id}')">ยกเลิก</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data for table 2:', error);
        // alert('Failed to fetch data. Please try again.');
    }
}

// ฟังก์ชันสำหรับลบข้อมูล
async function deleteStudent2(id) {
    Swal.fire({
        title: "คุณต้องการลบ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3000/api/form/rev/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    await Swal.fire({
                        title: "การลบสำเร็จ",
                        icon: "success"
                    });
                    fetchFormData2(); // รีเฟรชข้อมูลหลังจากลบ
                } else {
                    await Swal.fire({
                        title: "การลบล้มเหลว",
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                await Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: error.message,
                    icon: "error"
                });
            }
        }
    });
}

async function fetchFormData3() {
    try {
        const response = await fetch('http://localhost:3000/api/form/missing');
        const formData = await response.json();
        const tableBody = document.querySelector('#studentTable3 tbody');
        tableBody.innerHTML = '';
        formData.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.full_name}</td>
                <td>
                    <button class="modify" onclick="redirectToEditPage3('${student.id}')">แก้ไข</button>
                    <button class="delete" onclick="deleteStudent3('${student.id}')">ยกเลิก</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data for table 3:', error);
        // alert('Failed to fetch data. Please try again.');
    }
}

// ฟังก์ชันสำหรับลบข้อมูล
async function deleteStudent3(id) {
    Swal.fire({
        title: "คุณต้องการลบ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3000/api/form/missing/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    await Swal.fire({
                        title: "การลบสำเร็จ",
                        icon: "success"
                    });
                    fetchFormData3(); // รีเฟรชข้อมูลหลังจากลบ
                } else {
                    await Swal.fire({
                        title: "การลบล้มเหลว",
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                await Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: error.message,
                    icon: "error"
                });
            }
        }
    });
}


async function fetchFormData4() {
    try {
        const response = await fetch('http://localhost:3000/api/form/absence');
        const formData = await response.json();
        const tableBody = document.querySelector('#studentTable4 tbody');
        tableBody.innerHTML = '';
        formData.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.full_name}</td>
                <td>
                    <button class="modify" onclick="redirectToEditPage4('${student.id}')">แก้ไข</button>
                    <button class="delete" onclick="deleteStudent4('${student.id}')">ยกเลิก</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data for table 4:', error);
        // alert('Failed to fetch data. Please try again.');
    }
}

// ฟังก์ชันสำหรับลบข้อมูล
async function deleteStudent4(id) {
    Swal.fire({
        title: "คุณต้องการลบ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3000/api/form/absence/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    await Swal.fire({
                        title: "การลบสำเร็จ",
                        icon: "success"
                    });
                    fetchFormData4(); // รีเฟรชข้อมูลหลังจากลบ
                } else {
                    await Swal.fire({
                        title: "การลบล้มเหลว",
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                await Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: error.message,
                    icon: "error"
                });
            }
        }
    });
}

// เรียกใช้ฟังก์ชันทุกครั้งเมื่อโหลดหน้าสำเร็จ
document.addEventListener('DOMContentLoaded', function() {
    fetchFormData1();  // เรียกใช้ฟังก์ชันดึงข้อมูลสำหรับตาราง 1
    fetchFormData2();  // เรียกใช้ฟังก์ชันดึงข้อมูลสำหรับตาราง 2
    fetchFormData3();  // เรียกใช้ฟังก์ชันดึงข้อมูลสำหรับตาราง 3
    fetchFormData4();  // เรียกใช้ฟังก์ชันดึงข้อมูลสำหรับตาราง 4
});

function redirectToEditPage1(id) {
    // เปลี่ยนเส้นทางไปยังหน้า edit.html พร้อมส่ง id เป็น query parameter
    window.location.href = `editrequest1.html?id=${id}`;
}
function redirectToEditPage2(id) {
    // เปลี่ยนเส้นทางไปยังหน้า edit.html พร้อมส่ง id เป็น query parameter
    window.location.href = `editrequest2.html?id=${id}`;
}
function redirectToEditPage3(id) {
    // เปลี่ยนเส้นทางไปยังหน้า edit.html พร้อมส่ง id เป็น query parameter
    window.location.href = `editrequest3.html?id=${id}`;
}
function redirectToEditPage4(id) {
    // เปลี่ยนเส้นทางไปยังหน้า edit.html พร้อมส่ง id เป็น query parameter
    window.location.href = `editrequest4.html?id=${id}`;
}