package com.cs261group5.CRUD.Restcontroller;


import com.cs261group5.CRUD.enitity.FormRevocation;
import com.cs261group5.CRUD.enitity.Student;
import com.cs261group5.CRUD.repository.EmailService;
import com.cs261group5.CRUD.repository.FormRevRepository;
import com.cs261group5.CRUD.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/form/rev")
public class FormRevController {

    private final FormRevRepository requestformService;
    
     @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private EmailService emailService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public FormRevController(FormRevRepository requestformService, StudentRepository studentRepository, EmailService emailService) {
        this.requestformService = requestformService;
        this.studentRepository = studentRepository;
        this.emailService = emailService;
    }

    @PostMapping("/upload")
    public ResponseEntity<FormRevocation> uploadStudentInfo(
            @RequestParam("engName") String engName,
            @RequestParam("date") String date,
            @RequestParam("fullName") String fullName,
            @RequestParam("studentID") String studentID,
            @RequestParam("department") String department,
            @RequestParam("year") Integer year,
            @RequestParam("address") String address,
            @RequestParam("district") String district,
            @RequestParam("subdistrict") String subdistrict,
            @RequestParam("province") String province,
            @RequestParam("studentTel") String studentTel,
            @RequestParam("parentTel") String parentTel,
            @RequestParam("advisor") String advisor,
            @RequestParam("semester") String semester,
            @RequestParam("courseID") String courseID,
            @RequestParam("courseName") String courseName,
            @RequestParam("section") String section,
            @RequestParam("reason") String reason,
            @RequestParam("files") List<MultipartFile> files
    ) {
        try {
            // ค้นหานักศึกษาจาก engName
            Student student = studentRepository.findByEngName(engName);  // ใช้ findByEngName
            if (student == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // ถ้าไม่พบข้อมูลนักศึกษา
            }
    
            // ดึงข้อมูล email จาก Student
            String email = student.getEmail();


            FormRevocation requestform = new FormRevocation();
            requestform.setDate(Date.valueOf(date));  // แปลง String เป็น Date
            requestform.setFullName(fullName);
            requestform.setStudentID(studentID);
            requestform.setDepartment(department);
            requestform.setYear(year);
            requestform.setAddress(address);
            requestform.setDistrict(district);
            requestform.setSubdistrict(subdistrict);
            requestform.setProvince(province);
            requestform.setStudentTel(studentTel);
            requestform.setParentTel(parentTel);
            requestform.setAdvisor(advisor);
            requestform.setSemester(semester);
            requestform.setCourseID(courseID);
            requestform.setCourseName(courseName);
            requestform.setSection(section);
            requestform.setReason(reason);

            FormRevocation savedInfo = requestformService.saveStudentInfoWithFiles(requestform, files);

                    // ส่งอีเมลแจ้งเตือน
                        String subject = "คำร้องถูกส่งสำเร็จ";
                        String body = "คำร้องของคุณถูกส่งเรียบร้อยแล้วเมื่อวันที่: " + date + "\n\n" +
                                        "รายละเอียดคำร้อง:\n" +
                                        reason + "\n\n" +
                                        "ขอบคุณที่ใช้บริการ";

                    // ส่งอีเมลไปยังที่อยู่อีเมลที่ดึงมา
                    emailService.sendEmail(email, subject, body);


            return new ResponseEntity<>(savedInfo, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
