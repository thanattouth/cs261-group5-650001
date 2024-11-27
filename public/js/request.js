// Java script หน้าเลือกคำร้อง

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop(); // Gets the current file name

    if (currentPage === 'request0.html') {
        document.getElementById('req1-nav').classList.add('active'); // Add the active class
    }

    disableCurrentPageLink();
    updateDynamicLink();
});

// Function to disable current page link
function disableCurrentPageLink() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Disable home link if on home page
    if (currentPage === 'home.html') {
        const homeLink = document.querySelector('a[href="home.html"]');
        if (homeLink) {
            homeLink.style.pointerEvents = 'none';
            homeLink.style.cursor = 'default';
            document.getElementById('home-nav').classList.add('active');
        }
    }
    
    // Disable request link if on any request page
    if (currentPage.startsWith('request') && currentPage.endsWith('.html')) {
        const requestLink = document.getElementById('dynamicLink');
        if (requestLink) {
            requestLink.style.pointerEvents = 'none';
            requestLink.style.cursor = 'default';
            document.getElementById('req1-nav').classList.add('active');
        }
    }

    // Disable home link if on home page
    if (currentPage === 'listrequest.html') {
        const listLink = document.querySelector('a[href="listrequest.html"]');
        if (listLink) {
            listLink.style.pointerEvents = 'none';
            listLink.style.cursor = 'default';
            document.getElementById('list-nav').classList.add('active');
        }
    }
}

// Update the dynamic link based on selected request
function updateDynamicLink() {
    const requestLink = document.getElementById('dynamicLink');
    if (!requestLink) return;

    const selectedRequest = localStorage.getItem('selectedRequest');
    requestLink.href = selectedRequest ? `request${selectedRequest}.html` : 'request0.html';
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

document.addEventListener("DOMContentLoaded", function () {
    const selectElement = document.getElementById("request");

    // เมื่อมีการเลือกค่าใน select
    selectElement.addEventListener("change", function () {
        const selectedValue = selectElement.value;

        // เก็บค่า selection ไว้ใน localStorage หรือ sessionStorage
        localStorage.setItem("selectedRequest", selectedValue);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const savedRequest = localStorage.getItem("selectedRequest");
    const selectElement = document.getElementById("request");

    if (savedRequest && selectElement) {
        selectElement.value = savedRequest; // ตั้งค่า selection
    }
});

// ฟังก์ชันสำหรับสร้าง key ที่ไม่ซ้ำใน LocalStorage
function getStorageKey(formId, requestType, fieldId) {
    return `${formId}_type${requestType}_${fieldId}`; // Key ที่ไม่ซ้ำกัน
}

// ฟังก์ชันบันทึก Draft ลง LocalStorage
function saveDraft(formId, requestType) {
    const formElements = document.querySelectorAll(`#${formId} input, #${formId} select, #${formId} textarea`);
    
    formElements.forEach(element => {
        if (element.id) { // บันทึกเฉพาะฟิลด์ที่มี ID
            const storageKey = getStorageKey(formId, requestType, element.id);
            localStorage.setItem(storageKey, element.value); // เก็บข้อมูลใน LocalStorage
            console.log(`Draft saved: ${storageKey} = ${element.value}`);
        }
    });
}

// ฟังก์ชันโหลด Draft จาก LocalStorage
function loadDraft(formId, requestType) {
    const formElements = document.querySelectorAll(`#${formId} input, #${formId} select, #${formId} textarea`);
    
    formElements.forEach(element => {
        if (element && element.id) {
            try {
                const storageKey = getStorageKey(formId, requestType, element.id);
                const savedValue = localStorage.getItem(storageKey);
                
                // Special handling for file inputs
                if (element.type === 'file') {
                    console.log('Skipping file input draft loading');
                    return;
                }
                
                if (savedValue !== null) {
                    // Additional check to prevent setting value on invalid elements
                    if (element.value !== undefined) {
                        element.value = savedValue;
                        console.log(`Draft loaded: ${storageKey} = ${savedValue}`);
                    } else {
                        console.warn(`Cannot set value for element: ${element.id}`);
                    }
                }
            } catch (error) {
                console.error('Error loading draft for element:', element.id, error);
            }
        }
    });
}

// ฟังก์ชันจัดการหน้า
document.addEventListener('DOMContentLoaded', function () {
    const formId = 'requestForm';
    const requestTypeElement = document.getElementById('requestType');

    if (!requestTypeElement) {
        console.error('Request type element not found');
        return;
    }

    const requestType = requestTypeElement.value;

    const form = document.getElementById(formId);
    if (!form) {
        console.error('Form not found');
        return;
    }

    // โหลด draft ของฟอร์มปัจจุบัน
    loadDraft(formId, requestType);

    // บันทึก draft เมื่อผู้ใช้กรอกข้อมูล
    document.querySelectorAll(`#${formId} input, #${formId} select, #${formId} textarea`).forEach(element => {
        element.addEventListener('input', () => saveDraft(formId, requestType));
    });

    // จัดการการเปลี่ยนหน้าเมื่อเปลี่ยน dropdown
    const requestDropdown = document.getElementById('request');
    if (requestDropdown) {
        requestDropdown.addEventListener('change', function () {
            const selectedRequestType = requestDropdown.value;

            // บันทึก draft ของคำร้องปัจจุบันก่อนเปลี่ยนหน้า
            saveDraft(formId, requestType);

            // เปลี่ยนหน้าโดยไม่บันทึกค่าเดิม
            window.location.href = `request${selectedRequestType}.html`;
        });

        // ตั้งค่า dropdown ให้ตรงกับ `requestType` ปัจจุบัน
        requestDropdown.value = requestType;
    }
});

// หลังจากส่งฟอร์มสำเร็จ
function clearDraftAfterSubmit() {
    const formId = 'requestForm';
    const requestType = document.getElementById('requestType').value;
    
    const formElements = document.querySelectorAll(`#${formId} input, #${formId} select, #${formId} textarea`);
    
    formElements.forEach(element => {
        if (element.id) {
            const storageKey = getStorageKey(formId, requestType, element.id);
            localStorage.removeItem(storageKey);
        }
    });
}