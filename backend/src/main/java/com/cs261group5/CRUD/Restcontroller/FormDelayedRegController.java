package com.cs261group5.CRUD.Restcontroller;


import com.cs261group5.CRUD.enitity.FormDelayedReg;
import com.cs261group5.CRUD.repository.FormDelayedRegRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/form/delayedReg")
public class FormDelayedRegController {

    private final FormDelayedRegRepository requestformService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public FormDelayedRegController(FormDelayedRegRepository requestformService) {
        this.requestformService = requestformService;
    }

    @PostMapping("/upload")
    public ResponseEntity<FormDelayedReg> uploadStudentInfo(
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
            FormDelayedReg requestform = new FormDelayedReg();
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

            FormDelayedReg savedInfo = requestformService.saveStudentInfoWithFiles(requestform, files);
            return new ResponseEntity<>(savedInfo, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
