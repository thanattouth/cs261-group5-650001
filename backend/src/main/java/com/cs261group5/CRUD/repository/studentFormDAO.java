package com.cs261group5.CRUD.repository;

import com.cs261group5.CRUD.enitity.studentForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface studentFormDAO extends JpaRepository<studentForm, Integer> {

    studentForm findByStudentID(String studentID);

}
