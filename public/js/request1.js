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
        errorElement.style.display = "none";    // ซ่อนข้อความเตือนเมื่อรูปแบบถูกต้อง
        semesterInput.classList.remove("error");
    }
}

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

document.addEventListener('DOMContentLoaded', function() {
    const attachmentInput = document.getElementById('attachment');
    const fileListContainer = document.getElementById('file-list');
    const dt = new DataTransfer();

    attachmentInput.addEventListener('change', function() {
        if (dt.items.length + this.files.length > 5) {
            alert("คุณสามารถแนบไฟล์ได้สูงสุด 5 ไฟล์");
            return;
        }

        const files = Array.from(this.files);
        files.forEach(file => {
            if ((file.type === "application/pdf" || file.type.startsWith('image/')) && file.size > 302400) {
                alert("ไฟล์ PDF และไฟล์รูปภาพต้องมีขนาดไม่เกิน 300 KB");
                return;
            }
            dt.items.add(file);
            addFileItem(file);
        });

        attachmentInput.files = dt.files;
    });

    function addFileItem(file) {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');

        const fileLink = document.createElement('a');
        fileLink.href = URL.createObjectURL(file);
        fileLink.download = file.name;
        fileLink.classList.add('file-name');
        fileLink.target = '_blank';
        fileLink.textContent = file.type === "application/pdf" ? '📄 ' : (file.type.startsWith('image/') ? '🖼️ ' : '📄 ');
        fileLink.appendChild(document.createTextNode(` ${file.name} (${(file.size / 1024).toFixed(2)} KB)`));

        fileItem.appendChild(fileLink);

        const renameButton = createRenameButton(file, fileLink);
        fileItem.appendChild(renameButton);

        const removeButton = createRemoveButton(file, fileItem);
        fileItem.appendChild(removeButton);

        fileListContainer.appendChild(fileItem);
    }

    function createRenameButton(file, fileLink) {
        const button = document.createElement('button');
        button.textContent = "เปลี่ยนชื่อ";
        button.classList.add('rename-file-button');
        button.onclick = () => {
            const newName = prompt("กรุณากรอกชื่อไฟล์ใหม่:", file.name);
            if (newName && newName !== file.name) {
                const updatedFile = new File([file], newName, { type: file.type });

                // สร้าง DataTransfer ใหม่เพื่อเก็บรายการไฟล์ทั้งหมดรวมถึงไฟล์ที่เปลี่ยนชื่อแล้ว
                const newDt = new DataTransfer();
                Array.from(dt.files).forEach(f => {
                    // ใช้ไฟล์ที่ถูกเปลี่ยนชื่อแทนไฟล์เก่า
                    newDt.items.add(f === file ? updatedFile : f);
                });

                // อัปเดต `dt` และ `attachmentInput` ด้วย `newDt`
                dt.items.clear();
                Array.from(newDt.files).forEach(f => dt.items.add(f));
                attachmentInput.files = dt.files;

                // อัปเดตลิงก์และชื่อที่แสดงใน UI
                fileLink.href = URL.createObjectURL(updatedFile);
                fileLink.download = newName;
                fileLink.textContent = `${fileLink.textContent.split(' ')[0]} ${newName} (${(updatedFile.size / 1024).toFixed(2)} KB)`;
            }
        };
        return button;
    }

    function createRemoveButton(file, fileItem) {
        const button = document.createElement('button');
        button.innerHTML = "&#10006;";
        button.classList.add('remove-file-button');
        button.onclick = () => {
        // สร้าง DataTransfer ใหม่เพื่ออัปเดตรายการไฟล์ที่เหลืออยู่
        const newDt = new DataTransfer();

        // เพิ่มไฟล์ที่เหลืออยู่ ยกเว้นไฟล์ที่ต้องการลบ เข้าไปใน newDt
        Array.from(dt.files).forEach(f => {
            if (f !== file) {
                newDt.items.add(f);
            }
        });

            // อัปเดต dt และ input field ด้วย DataTransfer ใหม่
            dt.items.clear();
            Array.from(newDt.files).forEach(f => dt.items.add(f));
            attachmentInput.files = dt.files;

            // ลบ UI ของไฟล์ที่ถูกลบ
            fileItem.remove();
        };
        return button;
    }

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
            clearNonReadOnlyFields();
            // รีเซ็ตไฟล์แนบ
            resetFiles();
        }
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

    function resetFiles() {
        // เคลียร์ DataTransfer object
        dt.items.clear();
        
        // รีเซ็ต input file
        attachmentInput.value = '';
        
        // เคลียร์รายการไฟล์ที่แสดงใน UI
        fileListContainer.innerHTML = '';
        
        // อัปเดต files ของ input
        attachmentInput.files = dt.files;
    }

    // แก้ไขฟังก์ชัน submitForm ให้ใช้ preventDefault() แทนการ return false
    document.getElementById('requestForm').onsubmit = function(event) {
        event.preventDefault();
        if (validateForm()) {
            resetFiles();
            this.submit();
        }
    };
});