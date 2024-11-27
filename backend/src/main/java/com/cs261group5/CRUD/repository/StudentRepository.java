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

    @Transactional
    public Student findByUsername(String username) {
        String jpql = "SELECT s FROM Student s WHERE s.userName = :username";  // ใช้ JPQL เพื่อค้นหาจาก username
        TypedQuery<Student> query = entityManager.createQuery(jpql, Student.class);
        query.setParameter("username", username);
        return query.getSingleResult();  // คืนค่าผลลัพธ์ของการค้นหาตาม username
    }

    @Transactional
    public Student findByStudentID(String studentID) {
        String jpql = "SELECT s FROM Student s WHERE s.studentID = :studentID";  // ใช้ JPQL เพื่อค้นหาจาก studentID
        TypedQuery<Student> query = entityManager.createQuery(jpql, Student.class);
        query.setParameter("studentID", studentID);
        return query.getSingleResult();  // คืนค่าผลลัพธ์ของการค้นหาตาม studentID
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
