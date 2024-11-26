const apiUrl = 'http://localhost:3000/api/form/absence';

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
            <td>${student.id}</td>
            <td contenteditable="true" data-field="full_name">${student.full_name}</td>
            <td contenteditable="true" data-field="start_date">${student.start_date}</td>
            <td contenteditable="true" data-field="end_date">${student.end_date}</td>
            <td contenteditable="true" data-field="reason">${student.reason}</td>
            <td>
                <button class="modify" onclick="updateStudent('${student.id}', this)">แก้ไข</button>
                <button class="back">ย้อนกลับ</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // เพิ่ม event listener ให้กับปุ่ม "ย้อนกลับ" ทุกตัว
    const backButtons = document.querySelectorAll('.back');
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            window.history.back();
        });
    });
}

// ฟังก์ชันสำหรับอัปเดตข้อมูล
async function updateStudent(id, button) {
    const row = button.closest('tr');
    const fullName = row.querySelector('[data-field="full_name"]').textContent;
    const start_date = row.querySelector('[data-field="start_date"]').textContent;
    const end_date = row.querySelector('[data-field="end_date"]').textContent;
    const reason = row.querySelector('[data-field="reason"]').textContent;

    const response = await fetch(`http://localhost:3000/api/form/absence/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            full_name: fullName,
            start_date: start_date,
            end_date: end_date,
            reason: reason
        })
    });

    if (response.ok) {
        Swal.fire({
            title: "คุณต้องการแก้ไขคำร้อง",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก"  // เพิ่มข้อความสำหรับปุ่มยกเลิก
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "แก้ไขเรียบร้อย",
                    icon: "success"
                });
                window.location.href = 'listrequest.html';
            }
        });        
    } else {
        alert('Update failed!');
    }
}

window.onload = fetchFormData;