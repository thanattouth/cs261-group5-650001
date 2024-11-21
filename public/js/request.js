// Java script หน้าเลือกคำร้อง

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop(); // Gets the current file name

    if (currentPage === 'request0.html') {
        document.getElementById('req1-nav').classList.add('active'); // Add the active class
    }
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