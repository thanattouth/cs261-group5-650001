package com.cs261group5.CRUD.repository;

import com.cs261group5.CRUD.enitity.Student;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class StudentRepository implements StudentDAO{

    private EntityManager entityManager;

    @Autowired
    public StudentRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
    }



    @Override
    @Transactional
    public Student save(Student student) {
        entityManager.persist(student);
        return  student;
    }

    // ค้นหานักศึกษาจาก username
    public Student findByUsername(String username) {
        String jpql = "SELECT s FROM Student s WHERE s.userName = :username";  // ใช้ JPQL เพื่อค้นหาจาก username
        TypedQuery<Student> query = entityManager.createQuery(jpql, Student.class);
        query.setParameter("username", username);
        return query.getSingleResult();  // คืนค่าผลลัพธ์ของการค้นหาตาม username
    }

    // ค้นหานักศึกษาจาก engName
    public Student findByEngName(String engName) {
        String jpql = "SELECT s FROM Student s WHERE s.engName = :engName";  // ฟิลด์นี้ต้องตรงกับที่ประกาศใน Student entity
        TypedQuery<Student> query = entityManager.createQuery(jpql, Student.class);
        query.setParameter("engName", engName); // ค่าที่จะส่งเข้าไปใน parameter
        return query.getSingleResult();  // คืนค่าผลลัพธ์ของการค้นหาตาม engName
    }


    @Override
    @Transactional
    public void delete(Integer id) {
        Student student= entityManager.find(Student.class,id);
        entityManager.remove(student);
    }

    @Override
    public Student get(Integer id) {
        return entityManager.find(Student.class,id);

    }

    @Override
    public List<Student> getAll() {
        TypedQuery<Student> query = entityManager.createQuery("FROM Student",Student.class);
        return query.getResultList();
    }

    @Override
    @Transactional
    public void update(Student student) {
        entityManager.merge(student);

    }
}
