package com.cs261group5.CRUD.enitity;

import jakarta.persistence.*;

import java.sql.Date;
import java.util.List;

@Entity
@Table(name="form_revocation")
public class FormRevocation {

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

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "district", nullable = false)
    private String district;

    @Column(name = "subdistrict", nullable = false)
    private String subdistrict;

    @Column(name = "province", nullable = false)
    private String province;

    @Column(name = "student_number", nullable = false)
    private String studentTel;

    @Column(name = "parent_number", nullable = false)
    private String parentTel;

    @Column(name = "advisor", nullable = false)
    private String advisor;

    @Column(name = "semester", nullable = false)
    private String semester;

    @Column(name = "course_id", nullable = false)
    private String courseID;

    @Column(name = "course_name", nullable = false)
    private String courseName;

    @Column(name = "section", nullable = false)
    private String section;

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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getSubdistrict() {
        return subdistrict;
    }

    public void setSubdistrict(String subdistrict) {
        this.subdistrict = subdistrict;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getStudentTel() {
        return studentTel;
    }

    public void setStudentTel(String studentTel) {
        this.studentTel = studentTel;
    }

    public String getParentTel() {
        return parentTel;
    }

    public void setParentTel(String parentTel) {
        this.parentTel = parentTel;
    }

    public String getAdvisor() {
        return advisor;
    }

    public void setAdvisor(String advisor) {
        this.advisor = advisor;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
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

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
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