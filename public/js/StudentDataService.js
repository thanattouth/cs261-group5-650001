const sql = require('mssql');

class StudentDataService {
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

    async getAllStudents() {
        const pool = await this.getPool();
        try {
            const result = await pool.request()
                .query(`
                    SELECT id, user_name, eng_name, email, 
                           faculty, department, type, login_time
                    FROM Students
                `);
            return result.recordset;
        } catch (err) {
            console.error('Error fetching all students:', err);
            throw err;
        } finally {
            await sql.close();
        }
    }

    async getStudentByUsername(username) {
        const pool = await this.getPool();
        try {
            const result = await pool.request()
                .input('username', sql.NVarChar, username)
                .query(`
                    SELECT id, user_name, eng_name, email, 
                           faculty, department, type, login_time
                    FROM Students
                    WHERE user_name = @username
                `);
            return result.recordset[0];
        } catch (err) {
            console.error('Error fetching student by username:', err);
            throw err;
        } finally {
            await sql.close();
        }
    }

    async addStudent(student) {
        const pool = await this.getPool();
        try {
            const result = await pool.request()
                .input('userName', sql.NVarChar, student.userName)
                .input('engName', sql.NVarChar, student.engName)
                .input('email', sql.NVarChar, student.email)
                .input('faculty', sql.NVarChar, student.faculty)
                .input('department', sql.NVarChar, student.department)
                .input('type', sql.NVarChar, student.type)
                .input('loginTime', sql.DateTime, new Date())
                .query(`
                    INSERT INTO Students (
                        user_name, eng_name, email, faculty, 
                        department, type, login_time
                    )
                    VALUES (
                        @userName, @engName, @email, @faculty,
                        @department, @type, @loginTime
                    );
                    SELECT SCOPE_IDENTITY() AS id;
                `);
            return result.recordset[0];
        } catch (err) {
            console.error('Error adding student:', err);
            throw err;
        } finally {
            await sql.close();
        }
    }

    async updateStudent(student) {
        const pool = await this.getPool();
        try {
            await pool.request()
                .input('id', sql.BigInt, student.id)
                .input('userName', sql.NVarChar, student.userName)
                .input('engName', sql.NVarChar, student.engName)
                .input('email', sql.NVarChar, student.email)
                .input('faculty', sql.NVarChar, student.faculty)
                .input('department', sql.NVarChar, student.department)
                .input('type', sql.NVarChar, student.type)
                .query(`
                    UPDATE Students
                    SET user_name = @userName,
                        eng_name = @engName,
                        email = @email,
                        faculty = @faculty,
                        department = @department,
                        type = @type
                    WHERE id = @id
                `);
            return true;
        } catch (err) {
            console.error('Error updating student:', err);
            throw err;
        } finally {
            await sql.close();
        }
    }

    async deleteStudent(id) {
        const pool = await this.getPool();
        try {
            await pool.request()
                .input('id', sql.BigInt, id)
                .query('DELETE FROM Students WHERE id = @id');
            return true;
        } catch (err) {
            console.error('Error deleting student:', err);
            throw err;
        } finally {
            await sql.close();
        }
    }

    async getStudentsByFaculty(faculty) {
        const pool = await this.getPool();
        try {
            const result = await pool.request()
                .input('faculty', sql.NVarChar, faculty)
                .query(`
                    SELECT id, user_name, eng_name, email, 
                           faculty, department, type, login_time
                    FROM Students
                    WHERE faculty = @faculty
                `);
            return result.recordset;
        } catch (err) {
            console.error('Error fetching students by faculty:', err);
            throw err;
        } finally {
            await sql.close();
        }
    }
}

module.exports = new StudentDataService();