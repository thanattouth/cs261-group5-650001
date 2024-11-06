function validateForm() {
    // Get form values
    const date = document.getElementById("date").value;
    const name = document.getElementById("name").value;
    const regNumber = document.getElementById("regNumber").value;
    const faculty = document.getElementById("faculty").value;
    const year = document.getElementById("year").value;
    const address = document.getElementById("address").value;
    const district = document.getElementById("district").value;
    const subdistrict = document.getElementById("subdistrict").value;
    const province = document.getElementById("province").value;
    const studentPhone = document.getElementById("studentPhone").value;
    const guardianPhone = document.getElementById("guardianPhone").value;
    const advisor = document.getElementById("advisor").value;
    const semester = document.getElementById("semester").value;
    const courseCode = document.getElementById("courseCode").value;
    const courseName = document.getElementById("courseName").value;
    const section = document.getElementById("section").value;
    const reason = document.getElementById("reason").value;

    
    
    
    
    
    
    
    
    // Validate date (dd/mm/yyyy)
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(date)) {
        alert("กรุณากรอกวันที่ให้ถูกต้อง (วัน/เดือน/ปี: วว/ดด/ปปปป)");
        return false;
    }

    // Validate year (1-8)
    if (year < 1 || year > 8 || isNaN(year) || year.length !== 1) {
        alert("กรุณากรอกชั้นปีเป็นตัวเลข 1-8");
        return false;
    }

    // Validate student phone (10 digits)
    if (studentPhone.length !== 10 || isNaN(studentPhone)) {
        alert("กรุณากรอกหมายเลขโทรศัพท์นักศึกษาให้ครบ 10 หลัก");
        return false;
    }

    
    // Validate guardian phone (10 digits)
    if (guardianPhone.length !== 10 || isNaN(guardianPhone)) {
        alert("กรุณากรอกหมายเลขโทรศัพท์ผู้ปกครองให้ครบ 10 หลัก");
        return false;
    }


    function formatSemester(input) {
        // กำหนดให้รับเฉพาะตัวเลข
        let value = input.value.replace(/[^0-9]/g, ''); // ลบตัวอักษรที่ไม่ใช่ตัวเลข
    
        // แทรกเครื่องหมาย '/' เมื่อกรอกตัวเลขครบ 1 ตัวสำหรับภาคเรียน และ 4 ตัวสำหรับปีการศึกษา
        if (value.length >= 2) {
            // หากมีตัวเลขครบ 2 ตัวแรก (ภาคเรียน) และตัวเลขต่อไปเป็นปีการศึกษา
            value = value.substring(0, 1) + '/' + value.substring(1, 5);
        }
    
        // จำกัดจำนวนตัวอักษรที่สามารถกรอกได้ (สูงสุด 7 ตัว)
        if (value.length > 7) {
            value = value.substring(0, 7);
        }
    
        // อัปเดตค่าของ input
        input.value = value;
    }


    // Validate semester (1 or 2 / yyyy)
    const semesterRegex = /^[12]\/\d{4}$/;
    if (!semesterRegex.test(semester)) {
        alert("กรุณากรอกภาคเรียนให้ถูกต้อง (1/ปีการศึกษา หรือ 2/ปีการศึกษา)");
        return false;
    
    }

    // Validate that all fields are filled
    if (
        !name || !regNumber || !faculty || !address || !district || !subdistrict || !province || !advisor || !courseCode || !courseName || !section || !reason
    ) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return false;
    }

    return true;
}