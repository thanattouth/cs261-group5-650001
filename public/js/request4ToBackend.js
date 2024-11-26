//โค้ดสำหรับส่งฟอร์มไปเซฟในbackend ปิดไว้อยู่
//document.getElementById("confirmBtn").addEventListener("click", async function () {
    console.log("sending form4 to backend");

    const formData = new FormData();

    // ดึงข้อมูลจากฟอร์ม form3 และเพิ่มไปใน formData
    formData.append('date', document.getElementById('date').value);
    formData.append('absenceType', document.querySelector('input[name="document1"]:checked') ? document.querySelector('input[name="document1"]:checked').value : '');
    formData.append('fullName', document.getElementById('name').value);
    formData.append('studentID', document.getElementById('id').value);
    formData.append('department', document.getElementById('faculty').value);
    formData.append('year', document.getElementById('year').value);
    formData.append('reason', document.getElementById('reason').value);
    formData.append('startDate', document.getElementById('start-date').value);
    formData.append('endDate', document.getElementById('end-date').value);
    formData.append('address', document.getElementById('address').value);
    formData.append('moo', document.getElementById('moo').value);
    formData.append('soy', document.getElementById('soy').value);
    formData.append('road', document.getElementById('tanont').value);
    formData.append('district', document.getElementById('district').value);
    formData.append('subdistrict', document.getElementById('subdistrict').value);
    formData.append('province', document.getElementById('province').value);
    formData.append('studentTel', document.getElementById('student-tel').value);
    formData.append('advisor', document.getElementById('Instructor').value);
    formData.append('email', document.getElementById('emaildome').value);
    formData.append('courseID', document.getElementById('courseCode').value);
    formData.append('courseName', document.getElementById('courseName').value);
    formData.append('section', document.getElementById('section').value);

    // เพิ่มไฟล์จาก DataTransfer ไปยัง formData
    const attachmentFiles = Array.from(document.getElementById("attachment").files);
    attachmentFiles.forEach(file => formData.append("files", file));

    // ส่งข้อมูลไปที่ backend API ผ่าน HTTP POST request
    try {
        const response = await fetch("http://localhost:8080/api/form/absence/upload", {
            method: "POST",
            body: formData
        });

        // ตรวจสอบการตอบกลับ
        if (response.ok) {
            console.log("sending sucess");

        } else {
        console.log("sending fail");

        }
    } catch (error) {
        console.error("Error:", error);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
 });
