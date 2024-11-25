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


class FileHandler {
    constructor() {
        this.dt = new DataTransfer();
        this.MAX_FILES = 5;
        this.MAX_SIZE = 302400; // 300 KB in bytes
        this.attachmentInput = document.getElementById('attachment');
        this.fileListContainer = document.getElementById('file-list');

        this.initializeEventListeners();
        this.createNotificationStyle();
    }

    initializeEventListeners() {
        this.attachmentInput.addEventListener('change', this.handleFileSelection.bind(this));
    }

    handleFileSelection(event) {
        const newFiles = Array.from(event.target.files);
        const currentFileCount = this.dt.items.length;

        if (currentFileCount + newFiles.length > this.MAX_FILES) {
            this.showNotification(`คุณสามารถแนบไฟล์ได้สูงสุด ${this.MAX_FILES} ไฟล์ (ปัจจุบัน: ${currentFileCount} ไฟล์)`);
            this.attachmentInput.value = '';
            return;
        }

        newFiles.forEach(file => {
            if ((file.type === "application/pdf" || file.type.startsWith('image/')) && file.size > this.MAX_SIZE) {
                this.showNotification("ไฟล์ PDF และไฟล์รูปภาพต้องมีขนาดไม่เกิน 300 KB");
                return;
            }
            this.dt.items.add(file);
            this.addFileItem(file);
        });

        this.attachmentInput.files = this.dt.files;
    }

    addFileItem(file) {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');

        const fileLink = document.createElement('a');
        fileLink.href = URL.createObjectURL(file);
        fileLink.download = file.name;
        fileLink.classList.add('file-name');
        fileLink.target = '_blank';
        fileLink.textContent = file.type === "application/pdf" ? '📄 ' : (file.type.startsWith('image/') ? '🖼️ ' : '📄 ');
        fileLink.appendChild(document.createTextNode(`${file.name} (${(file.size / 1024).toFixed(2)} KB)`));

        fileItem.appendChild(fileLink);

        const renameButton = this.createRenameButton(file, fileLink);
        fileItem.appendChild(renameButton);

        const removeButton = this.createRemoveButton(file, fileItem);
        fileItem.appendChild(removeButton);

        this.fileListContainer.appendChild(fileItem);
        
        const remainingFiles = this.dt.files.length;
        this.showNotification(`เพิ่มไฟล์เรียบร้อย (เหลือ ${remainingFiles} จาก ${this.MAX_FILES} ไฟล์)`);
    }

    createRenameButton(file, fileLink) {
        const button = document.createElement('button');
        button.textContent = "เปลี่ยนชื่อ";
        button.classList.add('rename-file-button');

        const updateRenameHandler = (currentFile) => {
            return (event) => {
                event.preventDefault();
                const newName = prompt("กรุณากรอกชื่อไฟล์ใหม่:", currentFile.name);
                if (newName && newName !== currentFile.name) {
                    const updatedFile = new File([currentFile], newName, { type: currentFile.type });
    
                    const fileIndex = Array.from(this.dt.files).findIndex(f => 
                        f.name === currentFile.name && 
                        f.size === currentFile.size && 
                        f.type === currentFile.type
                    );

                    if (fileIndex !== -1) {
                        const newDt = new DataTransfer();
                        Array.from(this.dt.files).forEach((f, index) => {
                            newDt.items.add(index === fileIndex ? updatedFile : f);
                        });

                        this.dt.items.clear();
                        Array.from(newDt.files).forEach(f => this.dt.items.add(f));
    
                        this.attachmentInput.files = this.dt.files;

                        fileLink.href = URL.createObjectURL(updatedFile);
                        fileLink.download = newName;
                        const fileIcon = fileLink.textContent.split(' ')[0];
                        fileLink.textContent = `${fileIcon} ${newName} (${(updatedFile.size / 1024).toFixed(2)} KB)`;
    
                        const removeButton = fileLink.parentElement.querySelector('.remove-file-button');
                        if (removeButton) {
                            removeButton.onclick = this.createRemoveButton(updatedFile, fileLink.parentElement).onclick;
                        }

                        button.onclick = updateRenameHandler(updatedFile);
                    }
                }
            };
        };

        button.onclick = updateRenameHandler(file);
        return button;
    }

    createRemoveButton(file, fileItem) {
        const button = document.createElement('button');
        button.innerHTML = "&#10006;";
        button.classList.add('remove-file-button');
        button.onclick = () => {
            const fileIndex = Array.from(this.dt.files).findIndex(f => 
                f.name === file.name && f.size === file.size && f.type === file.type
            );
    
            if (fileIndex !== -1) {
                const newDt = new DataTransfer();
                Array.from(this.dt.files).forEach((f, index) => {
                    if (index !== fileIndex) newDt.items.add(f);
                });
        
                this.dt.items.clear();
                Array.from(newDt.files).forEach(f => this.dt.items.add(f));
                this.attachmentInput.files = this.dt.files;

                fileItem.remove();
        
                const remainingFiles = this.dt.files.length;
                this.showNotification(`ลบไฟล์เรียบร้อย (เหลือ ${remainingFiles} จาก ${this.MAX_FILES} ไฟล์)`);
            }
        };
        return button;
    }

    showNotification(message) {
        const notification = document.createElement("div");
        notification.className = "notification-popup";
        notification.innerText = message;
    
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add("fade-out");
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    createNotificationStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .notification-popup {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 15px 20px;
                background-color: #4CAF50;
                color: white;
                font-size: 16px;
                border-radius: 5px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                opacity: 1;
                transition: opacity 0.5s ease;
                z-index: 1000;
                animation: slideIn 0.5s ease-out;
            }

            .fade-out {
                opacity: 0;
                transition: opacity 0.5s;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    resetFiles() {
        this.dt.items.clear();
        this.attachmentInput.value = '';
        this.fileListContainer.innerHTML = '';
        this.attachmentInput.files = this.dt.files;
    }

    async mergePDFs() {
        const pdfFiles = Array.from(this.dt.files).filter(file => file.type === "application/pdf");
        if (pdfFiles.length === 0) {
            alert("กรุณาเลือกไฟล์ PDF สำหรับการรวม");
            return;
        }

        const { PDFDocument } = PDFLib;
        const mergedPdf = await PDFDocument.create();
        
        for (const file of pdfFiles) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const mergedFile = new File([blob], "merged.pdf", { type: "application/pdf" });

        const nonPdfFiles = Array.from(this.dt.files).filter(file => file.type !== "application/pdf");
        this.dt.items.clear();
        this.dt.items.add(mergedFile);
        nonPdfFiles.forEach(file => this.dt.items.add(file));
        this.attachmentInput.files = this.dt.files;

        this.fileListContainer.innerHTML = '';
        Array.from(this.dt.files).forEach(file => this.addFileItem(file));
    }
}

// Initialize the FileHandler when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    const fileHandler = new FileHandler();

    // Merge PDF button event listener
    document.querySelector('.merge-pdf-button').addEventListener('click', () => {
        fileHandler.mergePDFs();
    });
});


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

