//โค้ดสำหรับส่งฟอร์มไปเซฟในbackend ปิดไว้อยู่
//document.getElementById("confirmBtn").addEventListener("click", async function () {
    console.log("sending form3 to backend");

    const formData = new FormData();

    // ดึงข้อมูลจากฟอร์ม form3 และเพิ่มไปใน formData
    formData.append("date", document.getElementById("date").value);
    formData.append("fullName", document.getElementById("name").value);
    formData.append("studentID", document.getElementById("id").value);
    formData.append("department", document.getElementById("faculty").value);
    formData.append("year", parseInt(document.getElementById("year").value));
    formData.append("advisor", document.getElementById("advisor").value);
    formData.append("courseID", document.getElementById("courseCode").value);
    formData.append("courseName", document.getElementById("courseName").value);
    formData.append("examDate", document.getElementById("examday").value);
    formData.append("teacher", document.getElementById("Instructor").value);  // เพิ่มค่านี้
    formData.append("reasonMissing", document.getElementById("reason").value);  // เพิ่มค่านี้
    formData.append("reason", document.getElementById("then").value);  // เพิ่มค่านี้

    // ดึงค่าจาก checkbox ที่ถูกเลือก
    const documents = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        documents.push(checkbox.value);
    });
    formData.append("typeDocument", JSON.stringify(documents)); 

    // เพิ่มไฟล์จาก DataTransfer ไปยัง formData
    const attachmentFiles = Array.from(document.getElementById("attachment").files);
    attachmentFiles.forEach(file => formData.append("files", file));

    // ส่งข้อมูลไปที่ backend API ผ่าน HTTP POST request
    try {
        const response = await fetch("http://localhost:8080/api/form/missing/upload", {
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
