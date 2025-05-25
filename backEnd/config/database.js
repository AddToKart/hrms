import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hrms_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // Create employees table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        department VARCHAR(50) NOT NULL,
        position VARCHAR(100) NOT NULL,
        base_salary DECIMAL(10,2) DEFAULT 0,
        allowances DECIMAL(10,2) DEFAULT 0,
        deductions DECIMAL(10,2) DEFAULT 0,
        status ENUM('Active', 'On Leave', 'Inactive') DEFAULT 'Active',
        hire_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create attendance table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id VARCHAR(20) NOT NULL,
        date DATE NOT NULL,
        check_in TIME,
        check_out TIME,
        total_hours DECIMAL(4,2) DEFAULT 0,
        status ENUM('Present', 'Absent', 'Late', 'Half Day') DEFAULT 'Present',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
        UNIQUE KEY unique_attendance (employee_id, date)
      )
    `);

    // Create leave_requests table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS leave_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id VARCHAR(20) NOT NULL,
        leave_type ENUM('Annual Leave', 'Sick Leave', 'Personal Leave', 'Emergency Leave') NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        days_requested INT NOT NULL,
        reason TEXT NOT NULL,
        status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
        applied_date DATE NOT NULL,
        approved_by VARCHAR(20) NULL,
        approved_date DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
      )
    `);

    // Create payroll table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payroll (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id VARCHAR(20) NOT NULL,
        pay_period_start DATE NOT NULL,
        pay_period_end DATE NOT NULL,
        base_salary DECIMAL(10,2) NOT NULL,
        allowances DECIMAL(10,2) DEFAULT 0,
        overtime_hours DECIMAL(4,2) DEFAULT 0,
        overtime_rate DECIMAL(8,2) DEFAULT 0,
        deductions DECIMAL(10,2) DEFAULT 0,
        gross_pay DECIMAL(10,2) NOT NULL,
        net_pay DECIMAL(10,2) NOT NULL,
        status ENUM('Pending', 'Processed', 'Paid') DEFAULT 'Pending',
        processed_date DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
      )
    `);

    console.log("✅ Database tables initialized successfully");
    connection.release();
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    throw error;
  }
};

export default pool;
