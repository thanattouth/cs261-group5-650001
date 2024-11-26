package com.cs261group5.CRUD.Restcontroller;

import com.cs261group5.CRUD.enitity.FormAbsence;
import com.cs261group5.CRUD.enitity.FormDelayedReg;
import com.cs261group5.CRUD.repository.FormAbsenceRepository;
import com.cs261group5.CRUD.repository.FormDelayedRegRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/form/absence")
public class FormAbsenceController {

    private final FormAbsenceRepository requestformService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public FormAbsenceController(FormAbsenceRepository requestformService) {
        this.requestformService = requestformService;
    }

    @PostMapping("/upload")
    public ResponseEntity<FormAbsence> uploadStudentInfo(
            @RequestParam("date") String date,
            @RequestParam("absenceType") String absenceType,
            @RequestParam("fullName") String fullName,
            @RequestParam("studentID") String studentID,
            @RequestParam("department") String department,
            @RequestParam("year") Integer year,
            @RequestParam("reason") String reason,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("address") String address,
            @RequestParam("moo") String moo,
            @RequestParam("soy") String soy,
            @RequestParam("road") String road,
            @RequestParam("district") String district,
            @RequestParam("subdistrict") String subdistrict,
            @RequestParam("province") String province,
            @RequestParam("studentTel") String studentTel,
            @RequestParam("advisor") String advisor,
            @RequestParam("email") String email,
            @RequestParam("courseID") String courseID,
            @RequestParam("courseName") String courseName,
            @RequestParam("section") String section,
            @RequestParam("files") List<MultipartFile> files
    ) {
        try {
            FormAbsence requestform = new FormAbsence();
            requestform.setDate(Date.valueOf(date)); // แปลง String เป็น Date
            requestform.setAbsenceType(absenceType);
            requestform.setFullName(fullName);
            requestform.setStudentID(studentID);
            requestform.setDepartment(department);
            requestform.setYear(year);
            requestform.setReason(reason);
            requestform.setStartDate(startDate);
            requestform.setEndDate(endDate);
            requestform.setAddress(address);
            requestform.setMoo(moo);
            requestform.setSoy(soy);
            requestform.setRoad(road);
            requestform.setDistrict(district);
            requestform.setSubdistrict(subdistrict);
            requestform.setProvince(province);
            requestform.setStudentTel(studentTel);
            requestform.setAdvisor(advisor);
            requestform.setEmail(email);
            requestform.setCourseID(courseID);
            requestform.setCourseName(courseName);
            requestform.setSection(section);

            FormAbsence savedInfo = requestformService.saveStudentInfoWithFiles(requestform, files);
            return new ResponseEntity<>(savedInfo, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
