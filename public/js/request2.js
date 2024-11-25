// Java script หน้าเขียนคำร้องขอเพิกถอน

function validateForm() {
    // Get form values
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
    const courseCode = document.getElementById("courseCode").value;
    const courseName = document.getElementById("courseName").value;
    const section = document.getElementById("section").value;
    const reason = document.getElementById("reason").value;
    const semesterInput = document.getElementById("semester").value;

    if (year < 1 || year > 8 || isNaN(year) || year.length !== 1) {
        Swal.fire({
          icon: 'error',
          title: 'กรุณากรอกชั้นปีเป็นตัวเลข 1-8',
          text: '',
          confirmButtonText: 'ตกลง'
        });
        return false;
    }      

    // Validate student phone (10 digits)
    if (studentPhone.length !== 10 || isNaN(studentPhone)) {
        Swal.fire({
          icon: 'error', 
          title: 'กรุณากรอกหมายเลขโทรศัพท์นักศึกษาให้ครบ 10 หลัก',
          text: '',
          confirmButtonText: 'ตกลง'
        });
        return false;
    }

    
    // Validate guardian phone (10 digits)
    if (guardianPhone.length !== 10 || isNaN(guardianPhone)) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณากรอกหมายเลขโทรศัพท์ผู้ปกครองให้ครบ 10 หลัก', 
            text: '',
            confirmButtonText: 'ตกลง'
        });
        return false;
    }

    // Validate that all fields are filled
    if (
        !name || !id || !faculty || !address || !district || !subdistrict || !province || !advisor || !courseCode || !courseName || !section || !reason || !semesterInput
    ) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            text: '',
            confirmButtonText: 'ตกลง'
        });
        return false;
    }

    return true;
}

function validateSemester() {
    const semesterInput = document.getElementById("semester");
    const semesterPattern = /^[0-9]{1}\/[0-9]{4}$/;
    const errorElement = document.getElementById("semester-error");
    // ถ้าฟิลด์ว่าง ให้ซ่อนข้อความเตือน
    if (semesterInput.value === "") {
        errorElement.style.display = "none";
        semesterInput.classList.remove("error");
        return;
    }
    // ตรวจสอบว่าข้อมูลตรงตามรูปแบบหรือไม่
    if (!semesterPattern.test(semesterInput.value)) {
        errorElement.style.display = "inline"; // แสดงข้อความเตือนเมื่อรูปแบบไม่ถูกต้อง
    } else {
        errorElement.style.display = "none"; // ซ่อนข้อความเตือนเมื่อรูปแบบถูกต้อง
        semesterInput.classList.remove("error");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Check if the current page is the home page
    const currentPage = window.location.pathname.split('/').pop(); // Gets the current file name

    // Assuming this file is named "home.html"
    if (currentPage === 'request2.html') {
        document.getElementById('req1-nav').classList.add('active'); // Add the active class
    }
});

function getStorageKey(fieldName, userId) {
    return `form_${userId}_${fieldName}`;
}

// Function to get data from localStorage
function getFormDataFromLocalStorage() {
    const userId = sessionStorage.getItem('userId') || 'defaultUser';
    const fields = ['name', 'id', 'faculty', 'year', 'address', 'district', 'subdistrict', 'province', 'student-tel', 'parent-tel', 'advisor', 'semester', 'courseCode', 'courseName', 'section', 'reason'];
    
    fields.forEach(field => {
        const value = localStorage.getItem(getStorageKey(field, userId));
        if (value) document.getElementById(field).value = value;
    });
}

function saveFormDataToLocalStorage() {
    const userId = sessionStorage.getItem('userId') || 'defaultUser'; // Fallback if no userId
    const fields = ['name', 'id', 'faculty', 'year', 'address', 'district', 'subdistrict', 'province', 'student-tel', 'parent-tel', 'advisor', 'semester', 'courseCode', 'courseName', 'section', 'reason'];
    
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        localStorage.setItem(getStorageKey(field, userId), value);
    });
}

// Add a function to clear user-specific form data when logging out
function clearUserFormData() {
    const userId = sessionStorage.getItem('userId') || 'defaultUser';
    const formFields = [
        'date', 'name', 'id', 'faculty', 'year', 'address', 'district', 
        'subdistrict', 'province', 'student-tel', 'parent-tel', 'advisor', 
        'semester', 'courseCode', 'courseName', 'section', 'reason'
    ];
    
    formFields.forEach(field => {
        localStorage.removeItem(getStorageKey(field, userId))
    });
}
  
// Save form data to localStorage when the user interacts with the form
document.querySelectorAll('input, textarea, select').forEach(function(element) {
    element.addEventListener('input', saveFormDataToLocalStorage);
});

document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');

    getFormDataFromLocalStorage();

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        // Populate each field and make it readonly if data exists
        function setFieldReadOnly(fieldId, value) {
            const field = document.getElementById(fieldId);
            field.value = value || "";
            field.setAttribute("readonly", true);
            field.style.backgroundColor = '#f0f0f0';  // Optional: make it visually clear
            field.style.cursor = 'not-allowed';       // Optional: change cursor to indicate uneditable
        }
    // Populate fields and make them readonly
        setFieldReadOnly("name", userData.displayname_th);
        setFieldReadOnly("id", userData.username);
        setFieldReadOnly("faculty", userData.department);
    }

    // Save data to localStorage when the form fields change
    document.querySelectorAll('input, textarea, select').forEach(element => {
        element.addEventListener('input', saveFormDataToLocalStorage);
    });
    
    // Get current date in YYYY-MM-DD format for the input value
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Set the value and make it readonly
    dateInput.value = formattedDate;
    dateInput.setAttribute('readonly', true);
    
    // Optional: Add some styling to make it look readonly
    dateInput.style.backgroundColor = '#f0f0f0';
    dateInput.style.cursor = 'not-allowed';
});

function clearNonReadOnlyFields() {
    const fields = [
        'year', 'address', 'district', 'subdistrict', 'province', 
        'student-tel', 'parent-tel', 'advisor', 'semester', 
        'courseCode', 'courseName', 'section', 'reason'
    ];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.hasAttribute("readonly")) {
            field.value = "";  // Clear only non-read-only fields
        }
    });
}

document.getElementById("request").addEventListener("change", function () {
    const selectedValue = this.value;

    if (selectedValue == "1") {
        // บันทึกค่าที่เลือกไว้ใน localStorage
        localStorage.setItem("selectedRequest", selectedValue);

        // เปลี่ยนหน้าไปยัง request1.html
        window.location.href = "request1.html";
    }
    else if (selectedValue == "2") {
        // บันทึกค่าที่เลือกไว้ใน localStorage
        localStorage.setItem("selectedRequest", selectedValue);

        // เปลี่ยนหน้าไปยัง request1.html
        window.location.href = "request2.html";
    }
    else if (selectedValue == "3") {
        // บันทึกค่าที่เลือกไว้ใน localStorage
        localStorage.setItem("selectedRequest", selectedValue);

        // เปลี่ยนหน้าไปยัง request1.html
        window.location.href = "request3.html";
    }
    else if (selectedValue == "4") {
        // บันทึกค่าที่เลือกไว้ใน localStorage
        localStorage.setItem("selectedRequest", selectedValue);

        // เปลี่ยนหน้าไปยัง request1.html
        window.location.href = "request4.html";
    }
    else if (selectedValue == "0") {
        // บันทึกค่าที่เลือกไว้ใน localStorage
        localStorage.setItem("selectedRequest", selectedValue);

        // เปลี่ยนหน้าไปยัง request1.html
        window.location.href = "request0.html";
    }
});