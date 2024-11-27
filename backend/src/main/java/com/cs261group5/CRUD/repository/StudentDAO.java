package com.cs261group5.CRUD.repository;

import com.cs261group5.CRUD.enitity.Student;

import java.util.List;


public interface StudentDAO {

    Student save(Student student);
    public Student findByUsername(String username) ;
    public Student findByEngName(String engName);
    void delete(Integer id);
    Student get(Integer id);
    List<Student> getAll();
    void update(Student student);
}
