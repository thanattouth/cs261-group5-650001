function validateForm() {
    // Get form values
    const date = document.getElementById("date").value;
    const name = document.getElementById("name").value;
    const id = document.getElementById("id").value;
    const faculty = document.getElementById("faculty").value;
    const year = document.getElementById("year").value;
    const address = document.getElementById("address").value;
    const moo = document.getElementById("moo").value;
    const soy = document.getElementById("soy").value;
    const tanont = document.getElementById("tanont").value;
    const district = document.getElementById("district").value;
    const subdistrict = document.getElementById("subdistrict").value;
    const province = document.getElementById("province").value;
    const studentPhone = document.getElementById("student-tel").value;
    const emaildome = document.getElementById("emaildome").value;
    const courseCode = document.getElementById("courseCode").value;
    const courseName = document.getElementById("courseName").value;
    const section = document.getElementById("section").value;
    const Instructor = document.getElementById("Instructor").value;
    const start = document.getElementById("start-date").value;
    const end = document.getElementById("end-date").value;
    const reason = document.getElementById("reason").value;
    const document1 = document.getElementById("document1").value;
    const selectedRadio = document.querySelector('input[name="document1"]:checked');

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

    // Validate that all fields are filled
    if (
        !date || !name || !id || !faculty || !address || !moo || !soy || !tanont ||  !district || !subdistrict || !province  || !courseCode || !courseName || !section || !Instructor || !start-date || !end-date || !reason || !emaildome
    ) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            text: '',
            confirmButtonText: 'ตกลง'
        });
        return false;
    }

    if (!selectedRadio) {
        Swal.fire({
          icon: 'error', 
          title: 'กรุณาเลือกตัวเลือกการลา',
          text: '',
          confirmButtonText: 'ตกลง'
        });
        return false;
    }

    return true;
}

function validateEmail() {
    const emailInput = document.getElementById("emaildome");
    const emailPattern = /^[a-zA-Z0-9._%+-]+@dome\.tu\.ac\.th$/;
    const errorElement = document.getElementById("email-error");

    // ถ้าฟิลด์ว่าง ให้ซ่อนข้อความเตือน
    if (emailInput.value === "") {
        errorElement.style.display = "none";
        emailInput.classList.remove("error");
        return;
    }

    // ตรวจสอบว่าข้อมูลตรงตามรูปแบบหรือไม่
    if (!emailPattern.test(emailInput.value)) {
        errorElement.style.display = "inline"; // แสดงข้อความเตือนเมื่อรูปแบบไม่ถูกต้อง
        emailInput.classList.add("error");    // เพิ่มสไตล์สำหรับฟิลด์ที่ไม่ถูกต้อง
    } else {
        errorElement.style.display = "none"; // ซ่อนข้อความเตือนเมื่อรูปแบบถูกต้อง
        emailInput.classList.remove("error"); // ลบสไตล์ error
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop(); // Gets the current file name

    if (currentPage === 'request4.html') {
        document.getElementById('req1-nav').classList.add('active'); // Add the active class
    }
});

function getStorageKey(fieldName, userId) {
    return `form_${userId}_${fieldName}`;
}

// Function to get data from localStorage
function getFormDataFromLocalStorage() {
    const userId = sessionStorage.getItem('userId') || 'defaultUser';
    const fields = ['name', 'id', 'faculty', 'year', 'moo', 'soy', 'address', 'district', 'subdistrict', 
        'province', 'student-tel', 'tanont', 'emaildome', 'Instructor', 'courseCode', 'courseName', 
        'section', 'reason', 'start-date', 'end-date', 'document1'];
    
    fields.forEach(field => {
        const value = localStorage.getItem(getStorageKey(field, userId));
        if (value) document.getElementById(field).value = value;
    });
}

function saveFormDataToLocalStorage() {
    const userId = sessionStorage.getItem('userId') || 'defaultUser'; // Fallback if no userId
    const fields = ['name', 'id', 'faculty', 'year', 'moo', 'soy', 'address', 'district', 'subdistrict', 
        'province', 'student-tel', 'tanont', 'emaildome', 'Instructor', 'courseCode', 'courseName', 
        'section', 'reason', 'start-date', 'end-date', 'document1'];
    
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        localStorage.setItem(getStorageKey(field, userId), value);
    });
}

// Add a function to clear user-specific form data when logging out
function clearUserFormData() {
    const userId = sessionStorage.getItem('userId') || 'defaultUser';
    const formFields = [
        'date', 'name', 'id', 'faculty', 'year', 'moo', 'soy', 'address', 'district', 'subdistrict', 
        'province', 'student-tel', 'tanont', 'emaildome', 'Instructor', 'courseCode', 'courseName', 
        'section', 'reason', 'start-date', 'end-date', 'document1'
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
        'year', 'moo', 'soy', 'address', 'district', 'subdistrict', 
        'province', 'student-tel', 'tanont', 'emaildome', 'Instructor', 'courseCode', 'courseName', 
        'section', 'reason', 'start-date', 'end-date', 'document1'
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

document.addEventListener('DOMContentLoaded', () => {
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    let lastSelected = null; // To track the last selected radio button

    radioButtons.forEach((radio) => {
        radio.addEventListener('click', (e) => {
            // If the same radio button is clicked again, uncheck it
            if (lastSelected === e.target) {
                e.target.checked = false;
                lastSelected = null; // Reset the tracker
            } else {
                // Otherwise, update the tracker to the currently clicked radio
                lastSelected = e.target;
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const radioButtons = document.querySelectorAll('input[type="radio"]');

    radioButtons.forEach((radio) => {
        radio.addEventListener('click', (e) => {
            // If the clicked radio is already checked, uncheck it
            if (radio.checked) {
                radioButtons.forEach((btn) => {
                    btn.checked = false; // Uncheck all radios first
                });
                radio.checked = true; // Check only the clicked one
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const radioButtons = document.querySelectorAll('input[name="document1"]');
    const userId = sessionStorage.getItem('userId') || 'defaultUser';
    const storageKey = `selected_document_option_${userId}`;

    // Restore previous selection on page load
    const savedSelection = localStorage.getItem(storageKey);
    if (savedSelection) {
        const radioToSelect = document.querySelector(`input[name="document1"][value="${savedSelection}"]`);
        if (radioToSelect) {
            radioToSelect.checked = true;
        }
    }

    // Save or remove selection when a radio button is clicked
    radioButtons.forEach((radio) => {
        radio.addEventListener('click', (e) => {
            if (radio.checked) {
                // Save the selected value to localStorage
                localStorage.setItem(storageKey, radio.value);
            } else {
                // Remove the value from localStorage if unchecked
                localStorage.removeItem(storageKey);
            }
        });
    });

    // Clear the saved selection manually
    window.clearDocumentSelection = function () {
        localStorage.removeItem(storageKey);
        radioButtons.forEach((btn) => {
            btn.checked = false;
        });
    };

    // Clear the saved selection when logging out or clearing form
    window.clearDocumentSelection = function() {
        localStorage.removeItem(storageKey);
    };
});