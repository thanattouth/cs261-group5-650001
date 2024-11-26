package com.cs261group5.CRUD.repository;

import com.cs261group5.CRUD.enitity.FormAbsence;
import com.cs261group5.CRUD.enitity.FormDelayedReg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormAbsenceDAO extends JpaRepository<FormAbsence, Integer> {
    //อยากเขียนฟังก์ชันไรเพิ่มในก็เพิ่มได้
}
