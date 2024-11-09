//โค้ดสำหรับส่งฟอร์มไปเซฟในbackend ปิดไว้อยู่
//document.getElementById("confirmBtn").addEventListener("click", async function () {
    console.log("sending form to backend");

    const formData = new FormData();

    // ดึงข้อมูลจากฟอร์มและเพิ่มไปใน formData
    formData.append("date", document.getElementById("date").value);
    formData.append("fullName", document.getElementById("name").value);
    formData.append("studentID", document.getElementById("id").value);
    formData.append("department", document.getElementById("faculty").value);
    formData.append("year", parseInt(document.getElementById("year").value));
    formData.append("address", document.getElementById("address").value);
    formData.append("district", document.getElementById("district").value);
    formData.append("subdistrict", document.getElementById("subdistrict").value);
    formData.append("province", document.getElementById("province").value);
    formData.append("studentTel", document.getElementById("student-tel").value);
    formData.append("parentTel", document.getElementById("parent-tel").value);
    formData.append("advisor", document.getElementById("advisor").value);
    formData.append("semester", document.getElementById("semester").value);
    formData.append("courseID", document.getElementById("courseCode").value);
    formData.append("courseName", document.getElementById("courseName").value);
    formData.append("section", document.getElementById("section").value);
    formData.append("reason", document.getElementById("reason").value);

    // เพิ่มไฟล์จาก DataTransfer ไปยัง formData
    const attachmentFiles = Array.from(document.getElementById("attachment").files);
    attachmentFiles.forEach(file => formData.append("files", file));

    // ส่งข้อมูลไปที่ backend API ผ่าน HTTP POST request
    try {
        const response = await fetch("http://localhost:8080/api/form/upload", {
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
