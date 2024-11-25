package com.cs261group5.CRUD.repository;

import com.cs261group5.CRUD.enitity.FormMissingExam;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class FormMissingExRepository {

    @Value("${file.upload-dir}")
    private String uploadDir; // รับค่าจาก properties สำหรับตำแหน่งเก็บไฟล์

    private final FormMissingExamDAO repository;

    // Constructor injection ของ DAO
    public FormMissingExRepository(FormMissingExamDAO repository) {
        this.repository = repository;
    }

    // เมธอดสำหรับบันทึกฟอร์มพร้อมไฟล์แนบ
    public FormMissingExam saveFormWithFiles(FormMissingExam formMissingExam, List<MultipartFile> files) throws IOException {
        List<String> filePaths = new ArrayList<>();

        // การจัดการไฟล์แนบ
        for (MultipartFile file : files) {
            String fileName = file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);

            // สร้างไดเรกทอรีถ้ายังไม่มี
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            // ตรวจสอบว่าไฟล์ซ้ำหรือไม่ และแก้ไขชื่อไฟล์ถ้าซ้ำ
            int counter = 1;
            String originalFileName = fileName;
            while (Files.exists(filePath)) {
                String fileExtension = getFileExtension(fileName);
                fileName = originalFileName.substring(0, originalFileName.lastIndexOf("."))
                        + "(" + counter + ")"
                        + fileExtension;
                filePath = Paths.get(uploadDir, fileName);
                counter++;
            }

            // คัดลอกไฟล์ไปยังไดเรกทอรี
            Files.copy(file.getInputStream(), filePath);
            filePaths.add(filePath.toString());
        }

        // ตั้งค่ารายการไฟล์แนบในฟอร์ม
        formMissingExam.setAttachmentFiles(filePaths);

        // บันทึกข้อมูลลงฐานข้อมูล
        return repository.save(formMissingExam);
    }

    // ฟังก์ชันช่วยสำหรับดึงนามสกุลไฟล์
    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return fileName.substring(lastDotIndex); // เช่น .txt หรือ .jpg
        }
        return ""; // ถ้าไม่มีนามสกุลไฟล์
    }

    // เมธอดสำหรับดึงไฟล์แนบตาม Student ID
    public List<String> getFilesByStudentID(String studentID)  {
        // ค้นหาฟอร์มที่ตรงกับ Student ID
        FormMissingExam formMissingExam = repository.findByStudentID(studentID);

        if (formMissingExam != null) {
            // คืนค่ารายการไฟล์ถ้าพบข้อมูล
            return formMissingExam.getAttachmentFiles();
        }

        // คืนค่า List ว่างถ้าไม่พบข้อมูล
        return new ArrayList<>();
    }

    // เมธอดสำหรับดึงข้อมูลฟอร์มตาม Student ID
    public FormMissingExam findByStudentID(String studentID) {
        return repository.findByStudentID(studentID);
    }
}
