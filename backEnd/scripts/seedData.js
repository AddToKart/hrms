import pool from "../config/database.js";

const seedData = async () => {
  try {
    console.log("🌱 Starting to seed sample data...");

    // Sample employees
    const employees = [
      [
        "EMP001",
        "John Doe",
        "john@company.com",
        "Engineering",
        "Senior Developer",
        85000,
        5000,
        3200,
        "Active",
        "2023-01-15",
      ],
      [
        "EMP002",
        "Jane Smith",
        "jane@company.com",
        "Marketing",
        "Marketing Manager",
        75000,
        4500,
        2800,
        "Active",
        "2023-02-20",
      ],
      [
        "EMP003",
        "Mike Johnson",
        "mike@company.com",
        "HR",
        "HR Specialist",
        65000,
        3000,
        2500,
        "Active",
        "2023-03-10",
      ],
      [
        "EMP004",
        "Sarah Wilson",
        "sarah@company.com",
        "Finance",
        "Accountant",
        70000,
        3500,
        2600,
        "On Leave",
        "2023-04-05",
      ],
      [
        "EMP005",
        "David Chen",
        "david@company.com",
        "Engineering",
        "Frontend Developer",
        80000,
        4000,
        3000,
        "Active",
        "2023-05-12",
      ],
    ];

    await pool.execute(
      `
      INSERT INTO employees 
      (employee_id, name, email, department, position, base_salary, allowances, deductions, status, hire_date)
      VALUES ?
    `,
      [employees]
    );

    // Sample attendance
    const today = new Date().toISOString().split("T")[0];
    const attendance = [
      ["EMP001", today, "09:00:00", "18:00:00", 9.0, "Present"],
      ["EMP002", today, "08:45:00", "17:30:00", 8.75, "Present"],
      ["EMP003", today, "09:15:00", "18:15:00", 9.0, "Late"],
      ["EMP004", today, null, null, 0, "Absent"],
      ["EMP005", today, "08:30:00", "16:30:00", 8.0, "Half Day"],
    ];

    await pool.execute(
      `
      INSERT INTO attendance 
      (employee_id, date, check_in, check_out, total_hours, status)
      VALUES ?
    `,
      [attendance]
    );

    // Sample leave requests
    const leaveRequests = [
      [
        "EMP001",
        "Annual Leave",
        "2024-02-01",
        "2024-02-05",
        5,
        "Family vacation",
        "Pending",
        "2024-01-20",
      ],
      [
        "EMP002",
        "Sick Leave",
        "2024-01-25",
        "2024-01-26",
        2,
        "Medical appointment",
        "Approved",
        "2024-01-22",
      ],
      [
        "EMP003",
        "Personal Leave",
        "2024-02-10",
        "2024-02-10",
        1,
        "Personal matters",
        "Rejected",
        "2024-01-28",
      ],
    ];

    await pool.execute(
      `
      INSERT INTO leave_requests 
      (employee_id, leave_type, start_date, end_date, days_requested, reason, status, applied_date)
      VALUES ?
    `,
      [leaveRequests]
    );

    console.log("✅ Sample data seeded successfully!");
    console.log("📊 Created:");
    console.log("   - 5 employees");
    console.log("   - 5 attendance records");
    console.log("   - 3 leave requests");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    process.exit();
  }
};

seedData();
