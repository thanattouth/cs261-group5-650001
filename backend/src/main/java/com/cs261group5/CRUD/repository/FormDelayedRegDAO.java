package com.cs261group5.CRUD.repository;

import com.cs261group5.CRUD.enitity.FormDelayedReg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormDelayedRegDAO extends JpaRepository<FormDelayedReg, Integer> {

    FormDelayedReg findByStudentID(String studentID);

}
