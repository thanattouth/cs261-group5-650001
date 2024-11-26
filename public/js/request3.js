
// Java script หน้าเขียนคำร้องขอเพิกถอน

function validateForm() {
    
   
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));

    let isValid = true;
    const errorMessages = [];

    // Validate dropdown selection
    const requestSelect = document.getElementById('request');
    if (requestSelect.value === '0') {
        requestSelect.classList.add('error');
        errorMessages.push('กรุณาเลือกหัวข้อคำร้อง');
        isValid = false;
    }

    // Validate date
    const dateInput = document.getElementById('date');
    if (!dateInput.value) {
        dateInput.classList.add('error');
        errorMessages.push('กรุณากรอกวันที่');
        isValid = false;
    }

    // Validate personal information fields
    const personalFields = [
        { id: 'name', message: 'กรุณากรอกชื่อ-นามสกุล' },
        { id: 'id', message: 'กรุณากรอกเลขทะเบียน' },
        { id: 'faculty', message: 'กรุณากรอกสาขา' },
        { id: 'year', message: 'กรุณากรอกชั้นปี' },
        { id: 'advisor', message: 'กรุณากรอกชื่ออาจารย์ที่ปรึกษา' }
    ];

    personalFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input.value.trim()) {
            input.classList.add('error');
            errorMessages.push(field.message);
            isValid = false;
        }
    });

    // Validate course information
    const courseFields = [
        { id: 'courseCode', message: 'กรุณากรอกรหัสวิชา' },
        { id: 'courseName', message: 'กรุณากรอกชื่อวิชา' },
        { id: 'examday' , message: 'กรุณากรอกวันที่สอบ' },
        { id: 'Instructor', message: 'กรุณากรอกชื่ออาจารย์ผู้สอน' },
        { id: 'reason', message: 'กรุณากรอกเหตุผลการขาดสอบ' }
    ];

    courseFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input.value.trim()) {
            input.classList.add('error');
            errorMessages.push(field.message);
            isValid = false;
        }
    });
    
    
    // Validate checkbox (at least one must be checked)
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedCheckboxes = Array.from(checkboxes).filter(cb => cb.checked);
    if (checkedCheckboxes.length === 0) {
        checkboxes.forEach(cb => cb.parentElement.classList.add('error'));
        errorMessages.push('กรุณาเลือกอย่างน้อยหนึ่งเอกสาร');
        isValid = false;
    }


    // Validate textarea
    const thenTextarea = document.getElementById('then');
    if (!thenTextarea.value.trim()) {
        thenTextarea.classList.add('error');
        errorMessages.push('กรุณากรอกข้อความ');
        isValid = false;
    }

    // Validate file attachments
    const attachmentInput = document.getElementById('attachment');
    if (attachmentInput.files.length === 0) {
        attachmentInput.classList.add('error');
        errorMessages.push('กรุณาแนบไฟล์');
        isValid = false;
    }

    

    // Display error messages
    if (!isValid) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณาตรวจสอบข้อมูล',
            html: errorMessages.map(msg => `<p>${msg}</p>`).join(''),
            confirmButtonText: 'ตกลง'
        });
    }

    return isValid;

}

function validateExamday() {
    const examdayInput = document.getElementById("examday");
    const examdayPattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/[0-9]{4}$/;
    const errorElement = document.getElementById("examday-error");
    
    // ถ้าฟิลด์ว่าง ให้ซ่อนข้อความเตือน
    if (examdayInput.value === "") {
        errorElement.style.display = "none";
        examdayInput.classList.remove("error");
        return;
    }
    
    // ตรวจสอบว่าข้อมูลตรงตามรูปแบบหรือไม่
    if (!examdayPattern.test(examdayInput.value)) {
        errorElement.style.display = "inline"; // แสดงข้อความเตือนเมื่อรูปแบบไม่ถูกต้อง
    } else {
        errorElement.style.display = "none"; // ซ่อนข้อความเตือนเมื่อรูปแบบถูกต้อง
        examdayInput.classList.remove("error");
    }
}




//เอาข้อมูลผู้ใช้มา
document.addEventListener('DOMContentLoaded', function() {
    // Check if the current page is the home page
    const currentPage = window.location.pathname.split('/').pop(); // Gets the current file name

    // Assuming this file is named "home.html"
    if (currentPage === 'request3.html') {
        document.getElementById('req1-nav').classList.add('active'); // Add the active class
    }
});

function getStorageKey(fieldName, userId) {
    return `form_${userId}_${fieldName}`;
}

// Function to get data from localStorage
function getFormDataFromLocalStorage() {
    const userId = sessionStorage.getItem('userId') || 'defaultUser';
    const fields = ['name', 'id', 'faculty', 'year', 'examday', 'Instructor', 
                    'reciept', 'doctor', 'personal', 'then', 
                    'advisor', 'courseCode', 'courseName', 
                    'reason'];
    
    fields.forEach(field => {
        const value = localStorage.getItem(getStorageKey(field, userId));
        if (value) document.getElementById(field).value = value;
    });
}

function saveFormDataToLocalStorage() {
    const userId = sessionStorage.getItem('userId') || 'defaultUser'; // Fallback if no userId
    const fields = ['name', 'id', 'faculty', 'year', 'examday', 'Instructor', 
                    'reciept', 'doctor', 'personal', 'then', 
                    'advisor', 'courseCode', 'courseName', 
                    'reason'];
    
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        localStorage.setItem(getStorageKey(field, userId), value);
    });
}

// Add a function to clear user-specific form data when logging out
function clearUserFormData() {
    const userId = sessionStorage.getItem('userId') || 'defaultUser';
    const formFields = [
        'date', 'name', 'id', 'faculty', 'year', 'examday', 'Instructor', 
        'reciept', 'doctor', 'personal', 'then', 
        'advisor', 'courseCode', 'courseName', 
        'reason'
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
        'year', 'examday', 'Instructor', 
        'reciept', 'doctor', 'personal', 'then', 
        'advisor', 'courseCode', 'courseName', 
        'reason'
    ];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.hasAttribute("readonly")) {
            field.value = "";  // Clear only non-read-only fields
        }
    });
}

function clearCheckboxData() {
    const userId = sessionStorage.getItem('userId') || 'defaultUser';
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        const storageKey = `checkbox_${userId}_${checkbox.name}`;
        
        // ลบข้อมูลที่เก็บใน localStorage
        localStorage.removeItem(storageKey);

        // Uncheck Checkbox
        checkbox.checked = false;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const userId = sessionStorage.getItem('userId') || 'defaultUser';
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Restore checkbox states จาก localStorage
    checkboxes.forEach(checkbox => {
        const storageKey = `checkbox_${userId}_${checkbox.name}`;
        const isChecked = localStorage.getItem(storageKey) === 'true';
        checkbox.checked = isChecked;

        // Add event listener เพื่อเก็บสถานะเมื่อมีการเปลี่ยนแปลง
        checkbox.addEventListener('change', function() {
            localStorage.setItem(storageKey, this.checked);
        });
    });
});

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
