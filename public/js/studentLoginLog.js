class StudentLoginLog{

    constructor() {
        // ประกาศตัวแปรไว้เก็บเวลา Login
        this.loginTime = new Date().toISOString();
    }

    //ดึงข้อมูลจากมหาลัยเด้อ
    fetchUserData(username) {
        return fetch(`https://restapi.tu.ac.th/api/v2/profile/std/info/?id=${username}`, {  
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Application-Key': 'TUc5ebf849dbf40bbf6c2e08b39871ce155af8f632f03e869ee720d1e4cee9fd147dba9fd5885339a521d8701701bae419'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch user data: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched user data:', data);  // พิมพ์ข้อมูลที่ได้รับจาก API บน console เด้อ
    
            // ตรวจสอบว่า dataที่ได้มามี status เป็น true 
            if (data.status == true ) {
                //ใหเ userData เก็บข้อมูล data ที่ api จากมหาลัยตอบกลับมา
                const userData = data.data; 
                // เก็บ email ใน localStorage
                localStorage.setItem('userEmail', userData.email);
                //เรียกใช้ฟังก์ชันส่งข้อมูลไป backend+ saveข้อมูลงฐาน เด้อ
                return this.sendUserDataToBackend(userData, username);
            } else {
                alert('ไม่มีข้อมูลจาก API มหาลัย ส่งกลับมา');
                return
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
        });
    }
    
    //ส่งข้อมูลไป backend เด้อ
    sendUserDataToBackend(userData, username) {
        return fetch('http://localhost:8080/api/student/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
        "userName": username,
        "engName": userData.displayname_en,
        "email": userData.email,
        "faculty": userData.faculty,
        "department":userData.department,
        "type": userData.type,
        "loginTime": this.loginTime
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send data to backend');
            }
            return response.json();  
        })
        .then(data => {
            console.log('Backend Response:', data);  // ตรวจสอบข้อมูลที่ตอบกลับจาก backend บน console
    
         
            if (data.userName) {  
                //อยากให้ทำไรเพิ่มก็เขียนเพิ่มได้    หลังจากเช็คว่าข้อมูลที่ส่งกลับมาจาก backend มีข้อมูลกลับมาแล้ว
            } else {
                // แสดงข้อความจาก backend ถ้าไม่สำเร็จ
                alert('ไม่มีข้อมูลจาก backend ส่งกลับมา');
                return
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('ไม่สามารถส่งข้อมูลเข้าสู่ฐานข้อมูลได้');
        });
    }
}