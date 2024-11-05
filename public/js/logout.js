function logout() {
    const userData = JSON.parse(localStorage.getItem('userData'));

    // ลบข้อมูลการเข้าสู่ระบบจาก localStorage หรือ sessionStorage
    localStorage.removeItem("userData"); // ตัวอย่างลบข้อมูลที่เก็บอยู่ใน localStorage

    alert("Logout สำเร็จ");

    // นำผู้ใช้ไปยังหน้า login
    window.location.href = "./index.html";
}

// ผูกฟังก์ชัน logout เข้ากับปุ่ม "ออกจากระบบ"
document.getElementById("logout-nav").addEventListener("click", logout);

