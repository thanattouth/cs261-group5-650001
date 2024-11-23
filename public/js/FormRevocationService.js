const sql = require('mssql');
const path = require('path');
const fs = require('fs').promises;

class FormRevocationService {
    constructor() {
        this.config = {
            user: 'sa',
            password: 'YourStrong@Passw0rd',
            server: 'localhost',
            database: 'myDB',
            options: {
                encrypt: true,
                trustServerCertificate: true
            }
        };
        this.uploadDir = path.join(__dirname, 'uploads'); // Configure your upload directory
    }

    async getPool() {
        try {
            const pool = await sql.connect(this.config);
            return pool;
        } catch (err) {
            console.error('Error connecting to database:', err);
            throw err;
        }
    }

    async saveFormWithFiles(formData, files) {
        const pool = await this.getPool();
        const transaction = pool.transaction();

        try {
            await transaction.begin();

            // Save form data
            const result = await pool.request()
                .input('date', sql.Date, formData.date)
                .input('fullName', sql.NVarChar, formData.fullName)
                .input('studentID', sql.NVarChar, formData.studentID)
                .input('department', sql.NVarChar, formData.department)
                .input('year', sql.Int, formData.year)
                .input('address', sql.NVarChar, formData.address)
                .input('district', sql.NVarChar, formData.district)
                .input('subdistrict', sql.NVarChar, formData.subdistrict)
                .input('province', sql.NVarChar, formData.province)
                .input('studentTel', sql.NVarChar, formData.studentTel)
                .input('parentTel', sql.NVarChar, formData.parentTel)
                .input('advisor', sql.NVarChar, formData.advisor)
                .input('semester', sql.NVarChar, formData.semester)
                .input('courseID', sql.NVarChar, formData.courseID)
                .input('courseName', sql.NVarChar, formData.courseName)
                .input('section', sql.NVarChar, formData.section)
                .input('reason', sql.Text, formData.reason)
                .query(`
                    INSERT INTO [form-revocation] (
                        date, full_name, studentID, department, year,
                        address, district, subdistrict, province,
                        student_number, parent_number, advisor,
                        semester, course_id, course_name, section, reason
                    )
                    VALUES (
                        @date, @fullName, @studentID, @department, @year,
                        @address, @district, @subdistrict, @province,
                        @studentTel, @parentTel, @advisor,
                        @semester, @courseID, @courseName, @section, @reason
                    );
                    SELECT SCOPE_IDENTITY() AS id;
                `);

            const formId = result.recordset[0].id;

            // Save files
            if (files && files.length > 0) {
                // Ensure upload directory exists
                await fs.mkdir(this.uploadDir, { recursive: true });

                for (const file of files) {
                    const fileName = `${formId}_${Date.now()}_${file.originalname}`;
                    const filePath = path.join(this.uploadDir, fileName);
                    
                    // Save file to disk
                    await fs.writeFile(filePath, file.buffer);

                    // Save file reference to database
                    await pool.request()
                        .input('formId', sql.Int, formId)
                        .input('fileName', sql.NVarChar, fileName)
                        .query(`
                            INSERT INTO form_attachments (form_id, file_name)
                            VALUES (@formId, @fileName)
                        `);
                }
            }

            await transaction.commit();
            return { id: formId, ...formData };

        } catch (err) {
            await transaction.rollback();
            console.error('Error saving form:', err);
            throw err;
        } finally {
            await sql.close();
        }
    }

    async getFormByStudentId(studentId) {
        const pool = await this.getPool();
        try {
            const result = await pool.request()
                .input('studentId', sql.NVarChar, studentId)
                .query(`
                    SELECT f.*, 
                           (SELECT file_name 
                            FROM form_attachments 
                            WHERE form_id = f.id 
                            FOR JSON PATH) as attachment_files
                    FROM [form-revocation] f
                    WHERE f.studentID = @studentId
                `);
            
            if (result.recordset[0]) {
                const form = result.recordset[0];
                form.attachmentFiles = JSON.parse(form.attachment_files || '[]');
                delete form.attachment_files;
                return form;
            }
            return null;
        } catch (err) {
            console.error('Error fetching form:', err);
            throw err;
        } finally {
            await sql.close();
        }
    }

    async getAllForms() {
        const pool = await this.getPool();
        try {
            const result = await pool.request()
                .query(`
                    SELECT f.*, 
                           (SELECT file_name 
                            FROM form_attachments 
                            WHERE form_id = f.id 
                            FOR JSON PATH) as attachment_files
                    FROM [form-revocation] f
                `);
            
            return result.recordset.map(form => {
                form.attachmentFiles = JSON.parse(form.attachment_files || '[]');
                delete form.attachment_files;
                return form;
            });
        } catch (err) {
            console.error('Error fetching all forms:', err);
            throw err;
        } finally {
            await sql.close();
        }
    }

    async updateForm(formId, formData) {
        const pool = await this.getPool();
        try {
            await pool.request()
                .input('id', sql.Int, formId)
                .input('date', sql.Date, formData.date)
                .input('fullName', sql.NVarChar, formData.fullName)
                .input('studentID', sql.NVarChar, formData.studentID)
                .input('department', sql.NVarChar, formData.department)
                .input('year', sql.Int, formData.year)
                .input('address', sql.NVarChar, formData.address)
                .input('district', sql.NVarChar, formData.district)
                .input('subdistrict', sql.NVarChar, formData.subdistrict)
                .input('province', sql.NVarChar, formData.province)
                .input('studentTel', sql.NVarChar, formData.studentTel)
                .input('parentTel', sql.NVarChar, formData.parentTel)
                .input('advisor', sql.NVarChar, formData.advisor)
                .input('semester', sql.NVarChar, formData.semester)
                .input('courseID', sql.NVarChar, formData.courseID)
                .input('courseName', sql.NVarChar, formData.courseName)
                .input('section', sql.NVarChar, formData.section)
                .input('reason', sql.Text, formData.reason)
                .query(`
                    UPDATE [form-revocation]
                    SET date = @date,
                        full_name = @fullName,
                        studentID = @studentID,
                        department = @department,
                        year = @year,
                        address = @address,
                        district = @district,
                        subdistrict = @subdistrict,
                        province = @province,
                        student_number = @studentTel,
                        parent_number = @parentTel,
                        advisor = @advisor,
                        semester = @semester,
                        course_id = @courseID,
                        course_name = @courseName,
                        section = @section,
                        reason = @reason
                    WHERE id = @id
                `);
            return true;
        } catch (err) {
            console.error('Error updating form:', err);
            throw err;
        } finally {
            await sql.close();
        }
    }
}

module.exports = new FormRevocationService();