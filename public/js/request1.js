function validateForm() {
    // Get form values
    const date = document.getElementById("date").value;
    const name = document.getElementById("name").value;
    const id = document.getElementById("id").value;
    const faculty = document.getElementById("faculty").value;
    const year = document.getElementById("year").value;
    const address = document.getElementById("address").value;
    const district = document.getElementById("district").value;
    const subdistrict = document.getElementById("subdistrict").value;
    const province = document.getElementById("province").value;
    const studentPhone = document.getElementById("student-tel").value;
    const guardianPhone = document.getElementById("parent-tel").value;
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

    // Validate that all fields are filled
    if (
        !name || !id || !date || !faculty || !address || !district || !subdistrict || !province || !advisor || !courseCode || !courseName || !section || !reason
    ) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return false;
    }

    return true;
}

document.addEventListener("DOMContentLoaded", function() {
    // แสดง modal เมื่อกดปุ่ม "ส่งคำร้อง"
    document.getElementById("submitButton").onclick = function() {
        if (validateForm()) {
          document.getElementById("myModal").style.display = "block";
        }
    };

    // ซ่อน modal เมื่อกดปุ่ม "ยกเลิก"
    document.getElementById("cancelBtn").onclick = function() {
        document.getElementById("myModal").style.display = "none";
    };

    // ดำเนินการยืนยันการส่งคำร้อง
    document.getElementById("confirmBtn").onclick = function() {
        if (validateForm()) {
            document.getElementById("myModal").style.display = "none";
            alert("ส่งคำร้องเรียบร้อยแล้ว");
        }
    };
});

document.addEventListener('DOMContentLoaded', function() {
    // Check if the current page is the home page
    const currentPage = window.location.pathname.split('/').pop(); // Gets the current file name

    // Assuming this file is named "home.html"
    if (currentPage === 'request1.html') {
        document.getElementById('req1-nav').classList.add('active'); // Add the active class
    }

    sessionManager.setupProtectedPage();
});

// Retrieve form data from localStorage
function getFormDataFromLocalStorage() {
    return {
      date: localStorage.getItem('date'),
      name: localStorage.getItem('name'),
      id: localStorage.getItem('id'),
      faculty: localStorage.getItem('faculty'),
      year: localStorage.getItem('year'),
      address: localStorage.getItem('address'),
      district: localStorage.getItem('district'),
      subdistrict: localStorage.getItem('subdistrict'),
      province: localStorage.getItem('province'),
      studentPhone: localStorage.getItem('student-tel'),
      guardianPhone: localStorage.getItem('parent-tel'),
      advisor: localStorage.getItem('advisor'),
      semester: localStorage.getItem('semester'),
      courseCode: localStorage.getItem('courseCode'),
      courseName: localStorage.getItem('courseName'),
      section: localStorage.getItem('section'),
      reason: localStorage.getItem('reason'),
    };
}

// Save form data to localStorage
function saveFormDataToLocalStorage() {
    const date = document.getElementById('date').value;
    const name = document.getElementById('name').value;
    const id = document.getElementById('id').value;
    const faculty = document.getElementById('faculty').value;
    const year = document.getElementById('year').value;
    const address = document.getElementById('address').value;
    const district = document.getElementById('district').value;
    const subdistrict = document.getElementById('subdistrict').value;
    const province = document.getElementById('province').value;
    const studentPhone = document.getElementById('student-tel').value;
    const guardianPhone = document.getElementById('parent-tel').value;
    const advisor = document.getElementById('advisor').value;
    const semester = document.getElementById('semester').value;
    const courseCode = document.getElementById('courseCode').value;
    const courseName = document.getElementById('courseName').value;
    const section = document.getElementById('section').value;
    const reason = document.getElementById('reason').value;
  
    localStorage.setItem('date', date);
    localStorage.setItem('name', name);
    localStorage.setItem('id', id);
    localStorage.setItem('faculty', faculty);
    localStorage.setItem('year', year);
    localStorage.setItem('address', address);
    localStorage.setItem('district', district);
    localStorage.setItem('subdistrict', subdistrict);
    localStorage.setItem('province', province);
    localStorage.setItem('student-tel', studentPhone);
    localStorage.setItem('parent-tel', guardianPhone);
    localStorage.setItem('advisor', advisor);
    localStorage.setItem('semester', semester);
    localStorage.setItem('courseCode', courseCode);
    localStorage.setItem('courseName', courseName);
    localStorage.setItem('section', section);
    localStorage.setItem('reason', reason);
}

// Load form data from localStorage when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const formData = getFormDataFromLocalStorage();
  
    document.getElementById('date').value = formData.date;
    document.getElementById('name').value = formData.name;
    document.getElementById('id').value = formData.id;
    document.getElementById('faculty').value = formData.faculty;
    document.getElementById('year').value = formData.year;
    document.getElementById('address').value = formData.address;
    document.getElementById('district').value = formData.district;
    document.getElementById('subdistrict').value = formData.subdistrict;
    document.getElementById('province').value = formData.province;
    document.getElementById('student-tel').value = formData.studentPhone;
    document.getElementById('parent-tel').value = formData.guardianPhone;
    document.getElementById('advisor').value = formData.advisor;
    document.getElementById('semester').value = formData.semester;
    document.getElementById('courseCode').value = formData.courseCode;
    document.getElementById('courseName').value = formData.courseName;
    document.getElementById('section').value = formData.section;
    document.getElementById('reason').value = formData.reason;
});
  
// Save form data to localStorage when the user interacts with the form
document.querySelectorAll('input, textarea, select').forEach(function(element) {
    element.addEventListener('input', saveFormDataToLocalStorage);
});