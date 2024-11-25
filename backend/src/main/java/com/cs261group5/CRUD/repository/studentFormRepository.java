package com.cs261group5.CRUD.repository;
import com.cs261group5.CRUD.enitity.studentForm;
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
public class studentFormRepository {

    @Value("${file.upload-dir}")
    private String uploadDir;  // รับค่าจาก properties บอกตำแหน่งว่าจะเก็บไฟล์ไว้ไหน

    private final studentFormDAO repository;

    // ใช้ instance variables สำหรับเก็บไฟล์และข้อมูล
    public studentFormRepository (studentFormDAO repository) {
        this.repository = repository;
    }

    public studentForm saveStudentInfoWithFiles(studentForm studentForm, List<MultipartFile> files) throws IOException {
        List<String> filePaths = new ArrayList<>();

        for (MultipartFile file : files) {
            String fileName = file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);

            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);  // สร้างโฟลเดอร์ถ้ายังไม่มี
            }

            // ตรวจสอบว่าไฟล์มีอยู่แล้วในโฟลเดอร์หรือไม่
            int counter = 1;
            String originalFileName = fileName;
            while (Files.exists(filePath)) {
                // ถ้าไฟล์ซ้ำกันให้เติม 1 2 3 n
                String fileExtension = getFileExtension(fileName); // ใช้ฟังก์ชันแยกนามสกุลไฟล์
                fileName = originalFileName.substring(0, originalFileName.lastIndexOf("."))
                        + "(" + counter + ")"
                        + fileExtension;
                filePath = Paths.get(uploadDir, fileName); // สร้าง Path ใหม่ที่มีเลขเพิ่ม
                counter++;
            }

            // คัดลอกไฟล์ไปยังโฟลเดอร์
            Files.copy(file.getInputStream(), filePath);
            filePaths.add(filePath.toString());
        }

        // กำหนดชื่อไฟล์ลงใน requestForm
        studentForm.setAttachmentFiles(filePaths);

        // บันทึกข้อมูลลงในฐานข้อมูล
        return repository.save(studentForm);
    }

    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return fileName.substring(lastDotIndex); // เช่น .txt, .jpg
        }
        return ""; // ถ้าไม่มีนามสกุลไฟล์
    }


    public List<String> getFilesByStudentID(String studentID) {
        // ค้นหาฟอร์มที่ตรงกับ studentID
        studentForm studentForm = repository.findByStudentID(studentID); // สมมติว่าใช้เมธอด findByStudentID()

        if (studentForm != null) {
            // ถ้ามีข้อมูล studentForm, คืนค่ารายการไฟล์
            return studentForm.getAttachmentFiles();
        }

        // ถ้าไม่พบข้อมูล studentForm, คืนค่า empty list
        return new ArrayList<>();
    }


    public studentForm findByStudentID(String studentID) {
        return repository.findByStudentID(studentID);  // เรียกใช้เมธอดที่มาจาก JpaRepository
    }

}
