package com.cs261group5.CRUD.repository;

import com.cs261group5.CRUD.enitity.FormMissingExam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormMissingExamDAO extends JpaRepository<FormMissingExam, Integer> {

    FormMissingExam findByStudentID(String studentID);

}