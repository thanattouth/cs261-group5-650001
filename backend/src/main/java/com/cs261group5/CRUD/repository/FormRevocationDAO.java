package com.cs261group5.CRUD.repository;

import com.cs261group5.CRUD.enitity.FormRevocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormRevocationDAO extends JpaRepository<FormRevocation, Integer> {

    FormRevocation findByStudentID(String studentID);

}

