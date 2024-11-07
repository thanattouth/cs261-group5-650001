package com.cs261group5.CRUD.enitity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="Students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  long id;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "eng_name", nullable = false)
    private String engName;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "faculty", nullable = false)
    private String faculty;

    @Column(name = "department", nullable = false)
    private String department;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "login_time", nullable = false)
    private LocalDateTime loginTime;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEngName() {
        return engName;
    }

    public void setEngName(String engName) {
        this.engName = engName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(LocalDateTime loginTime) {
        this.loginTime = loginTime;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
