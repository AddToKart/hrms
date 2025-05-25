import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Get employee count
    const [employeeCount] = await pool.execute(`
      SELECT COUNT(*) as total_employees
      FROM employees 
      WHERE status = 'Active'
    `);

    // Get today's attendance
    const [attendanceToday] = await pool.execute(
      `
      SELECT 
        COUNT(*) as present_today,
        COUNT(CASE WHEN status = 'Present' THEN 1 END) as present_count
      FROM attendance 
      WHERE date = ?
    `,
      [today]
    );

    // Get pending leave requests
    const [pendingLeaves] = await pool.execute(`
      SELECT COUNT(*) as pending_leaves
      FROM leave_requests 
      WHERE status = 'Pending'
    `);

    // Get monthly payroll total
    const [monthlyPayroll] = await pool.execute(
      `
      SELECT COALESCE(SUM(net_pay), 0) as monthly_payroll
      FROM payroll 
      WHERE MONTH(pay_period_start) = ? AND YEAR(pay_period_start) = ?
    `,
      [currentMonth, currentYear]
    );

    // Get recent activities
    const [recentActivities] = await pool.execute(`
      (SELECT 'leave_request' as type, CONCAT(e.name, ' submitted leave request') as activity, 
              lr.created_at as timestamp
       FROM leave_requests lr
       JOIN employees e ON lr.employee_id = e.employee_id
       ORDER BY lr.created_at DESC LIMIT 3)
      UNION ALL
      (SELECT 'payroll' as type, 'Payroll processed' as activity, 
              created_at as timestamp
       FROM payroll 
       WHERE status = 'Processed'
       ORDER BY created_at DESC LIMIT 2)
      ORDER BY timestamp DESC LIMIT 5
    `);

    res.json({
      status: "success",
      data: {
        total_employees: employeeCount[0].total_employees,
        present_today: attendanceToday[0].present_count || 0,
        pending_leaves: pendingLeaves[0].pending_leaves,
        monthly_payroll: monthlyPayroll[0].monthly_payroll,
        recent_activities: recentActivities,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch dashboard statistics",
    });
  }
});

export default router;
