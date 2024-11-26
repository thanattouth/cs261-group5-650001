package com.cs261group5.CRUD.enitity;

import jakarta.persistence.*;

import java.sql.Date;
import java.util.List;

@Entity
@Table(name="form_missingExam")
public class FormMissingExam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "date", nullable = false)
    private Date date;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "studentID", nullable = false)
    private String studentID;

    @Column(name = "department", nullable = false)
    private String department;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "advisor", nullable = false)
    private String advisor;

    @Column(name = "course_id", nullable = false)
    private String courseID;

    @Column(name = "course_name", nullable = false)
    private String courseName;

    @Column(name = "exam_date", nullable = false)
    private String examDate;

    @Column(name = "teacher", nullable = false)
    private String teacher;

    @Column(name = "reason_missing", nullable = false, columnDefinition = "TEXT")
    private String reasonMissing;

    @Column(name = "type_document", nullable = false)
    private String typeDocument;

    @Column(name = "reason", nullable = false, columnDefinition = "TEXT")
    private String reason;



    @ElementCollection
    @Column(name = "attachment_files")
    private List<String> attachmentFiles;  // เก็บไฟล์เป็นชื่อไฟล์

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getStudentID() {
        return studentID;
    }

    public void setStudentID(String studentID) {
        this.studentID = studentID;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getAdvisor() {
        return advisor;
    }

    public void setAdvisor(String advisor) {
        this.advisor = advisor;
    }

    public String getCourseID() {
        return courseID;
    }

    public void setCourseID(String courseID) {
        this.courseID = courseID;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getExamDate() {
        return examDate;
    }

    public void setExamDate(String examDate) {
        this.examDate = examDate;
    }

    public String getTeacher() {
        return teacher;
    }

    public void setTeacher(String teacher) {
        this.teacher = teacher;
    }

    public String getReasonMissing() {
        return reasonMissing;
    }

    public void setReasonMissing(String reasonMissing) {
        this.reasonMissing = reasonMissing;
    }

    public String getTypeDocuments() {
        return typeDocument;
    }

    public void setTypeDocuments(String document) {
        this.typeDocument = document;
    }
    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public List<String> getAttachmentFiles() {
        return attachmentFiles;
    }

    public void setAttachmentFiles(List<String> attachmentFiles) {
        this.attachmentFiles = attachmentFiles;
    }
}