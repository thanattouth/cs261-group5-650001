package com.cs261group5.CRUD.Restcontroller;


import com.cs261group5.CRUD.enitity.FormMissingExam;
import com.cs261group5.CRUD.repository.FormMissingExRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/form")
public class FormMissingExController {

    private final FormMissingExRepository requestformService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public FormMissingExController(FormMissingExRepository requestformService) {
        this.requestformService = requestformService;
    }

    @PostMapping("/upload")
    public ResponseEntity<FormMissingExam> uploadStudentInfo(
            @RequestParam("date") String date,
            @RequestParam("fullName") String fullName,
            @RequestParam("studentID") String studentID,
            @RequestParam("department") String department,
            @RequestParam("year") Integer year,
            @RequestParam("advisor") String advisor,
            @RequestParam("courseID") String courseID,
            @RequestParam("courseName") String courseName,
            @RequestParam("dateExam") String dateExam,
            @RequestParam("teacher") String teacher,
            @RequestParam("reasonMissing") String reasonMissing,
            @RequestParam("reason") String reason,
            @RequestParam("files") List<MultipartFile> files
    ) {
        try {
            FormMissingExam requestform = new FormMissingExam();
            requestform.setDate(Date.valueOf(date));  // แปลง String เป็น Date
            requestform.setFullName(fullName);
            requestform.setStudentID(studentID);
            requestform.setDepartment(department);
            requestform.setYear(year);
            requestform.setAdvisor(advisor);
            requestform.setCourseID(courseID);
            requestform.setCourseName(courseName);
            requestform.setExamDate(dateExam);
            requestform.setTeacher(teacher);
            requestform.setReasonMissing(reasonMissing);
            requestform.setReason(reason);

            FormMissingExam savedInfo = requestformService.saveFormWithFiles(requestform, files);
            return new ResponseEntity<>(savedInfo, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
