package com.cs261group5.CRUD.repository;

import com.cs261group5.CRUD.enitity.FormAbsence;
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
public class FormAbsenceRepository {

    @Value("${file.upload-dir}")
    private String uploadDir;  // รับค่าจาก properties บอกตำแหน่งว่าจะเก็บไฟล์ไว้ไหน

    private final FormAbsenceDAO repository;

    // ใช้ instance variables สำหรับเก็บไฟล์และข้อมูล
    public FormAbsenceRepository(FormAbsenceDAO repository) {
        this.repository = repository;
    }

    public FormAbsence saveStudentInfoWithFiles(FormAbsence formAbsence, List<MultipartFile> files) throws IOException {
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
        formAbsence.setAttachmentFiles(filePaths);

        // บันทึกข้อมูลลงในฐานข้อมูล
        return repository.save(formAbsence);
    }

    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return fileName.substring(lastDotIndex); // เช่น .txt, .jpg
        }
        return ""; // ถ้าไม่มีนามสกุลไฟล์
    }

}
