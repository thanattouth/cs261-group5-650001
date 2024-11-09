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
    const semester = document.getElementById("semester").value;
    const courseCode = document.getElementById("courseCode").value;
    const courseName = document.getElementById("courseName").value;
    const section = document.getElementById("section").value;
    const reason = document.getElementById("reason").value;

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

    // Function to display the custom notification
    function showNotification(message) {
        // Create a new notification element
        const notification = document.createElement("div");
        notification.className = "notification-popup";
        notification.innerText = message;
        
        // Append the notification to the body
        document.body.appendChild(notification);

        // Automatically remove the notification after 3 seconds
        setTimeout(() => {
            notification.classList.add("fade-out");
            setTimeout(() => {
                notification.remove();
            }, 500); // Wait for fade-out animation to complete
        }, 3000); // Display for 3 seconds
    }

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
            showNotification("ส่งคำร้องเรียบร้อยแล้ว");
        }
        clearNonReadOnlyFields();
        const userId = sessionStorage.getItem('userId') || 'defaultUser';
        const fields = [
            'name', 'id', 'faculty', 'year', 'address', 'district', 
            'subdistrict', 'province', 'student-tel', 'parent-tel', 
            'advisor', 'semester', 'courseCode', 'courseName', 
            'section', 'reason'
        ];
        
        fields.forEach(field => {
            localStorage.removeItem(getStorageKey(field, userId));  // Remove only the form-related keys
        });
    };
});

document.addEventListener('DOMContentLoaded', function() {
    // Check if the current page is the home page
    const currentPage = window.location.pathname.split('/').pop(); // Gets the current file name

    // Assuming this file is named "home.html"
    if (currentPage === 'request1.html') {
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
        setFieldReadOnly("faculty", userData.faculty);
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