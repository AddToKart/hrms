import express from "express";
import { body, validationResult } from "express-validator";
import pool from "../config/database.js";

const router = express.Router();

// GET /api/payroll - Get payroll records
router.get("/", async (req, res) => {
  try {
    const { employee_id, status, month, year } = req.query;

    let query = `
      SELECT 
        p.*, e.name as employee_name, e.department, e.position
      FROM payroll p
      JOIN employees e ON p.employee_id = e.employee_id
    `;

    const params = [];
    const conditions = [];

    if (employee_id) {
      conditions.push("p.employee_id = ?");
      params.push(employee_id);
    }

    if (status) {
      conditions.push("p.status = ?");
      params.push(status);
    }

    if (month && year) {
      conditions.push(
        "MONTH(p.pay_period_start) = ? AND YEAR(p.pay_period_start) = ?"
      );
      params.push(month, year);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY p.pay_period_start DESC";

    const [payroll] = await pool.execute(query, params);

    res.json({
      status: "success",
      data: payroll,
      count: payroll.length,
    });
  } catch (error) {
    console.error("Error fetching payroll:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch payroll records",
    });
  }
});

// POST /api/payroll/process - Process payroll for all employees
router.post("/process", async (req, res) => {
  try {
    const { pay_period_start, pay_period_end } = req.body;

    // Get all active employees
    const [employees] = await pool.execute(`
      SELECT employee_id, base_salary, allowances, deductions
      FROM employees 
      WHERE status = 'Active'
    `);

    const payrollData = [];

    for (const employee of employees) {
      const gross_pay =
        parseFloat(employee.base_salary) + parseFloat(employee.allowances || 0);
      const net_pay = gross_pay - parseFloat(employee.deductions || 0);

      payrollData.push([
        employee.employee_id,
        pay_period_start,
        pay_period_end,
        employee.base_salary,
        employee.allowances || 0,
        0, // overtime_hours
        0, // overtime_rate
        employee.deductions || 0,
        gross_pay,
        net_pay,
        "Processed",
        new Date().toISOString().split("T")[0], // processed_date
      ]);
    }

    // Insert payroll records
    const [result] = await pool.execute(
      `
      INSERT INTO payroll 
      (employee_id, pay_period_start, pay_period_end, base_salary, allowances, 
       overtime_hours, overtime_rate, deductions, gross_pay, net_pay, status, processed_date)
      VALUES ?
    `,
      [payrollData]
    );

    res.status(201).json({
      status: "success",
      message: `Payroll processed for ${employees.length} employees`,
      data: {
        employees_processed: employees.length,
        pay_period_start,
        pay_period_end,
      },
    });
  } catch (error) {
    console.error("Error processing payroll:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to process payroll",
    });
  }
});

// GET /api/payroll/stats - Get payroll statistics
router.get("/stats", async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_employees,
        SUM(gross_pay) as total_gross_pay,
        SUM(net_pay) as total_net_pay,
        AVG(net_pay) as average_salary,
        SUM(CASE WHEN status = 'Processed' THEN 1 ELSE 0 END) as processed_count,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_count
      FROM payroll
      WHERE MONTH(pay_period_start) = MONTH(CURRENT_DATE())
      AND YEAR(pay_period_start) = YEAR(CURRENT_DATE())
    `);

    res.json({
      status: "success",
      data: stats[0],
    });
  } catch (error) {
    console.error("Error fetching payroll stats:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch payroll statistics",
    });
  }
});

export default router;
