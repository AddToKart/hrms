import express from "express";
import { body, validationResult } from "express-validator";
import pool from "../config/database.js";

const router = express.Router();

// GET /api/attendance - Get attendance records
router.get("/", async (req, res) => {
  try {
    const { date, employee_id } = req.query;
    let query = `
      SELECT 
        a.*, e.name as employee_name
      FROM attendance a
      JOIN employees e ON a.employee_id = e.employee_id
    `;

    const params = [];
    const conditions = [];

    if (date) {
      conditions.push("a.date = ?");
      params.push(date);
    }

    if (employee_id) {
      conditions.push("a.employee_id = ?");
      params.push(employee_id);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY a.date DESC, e.name ASC";

    const [attendance] = await pool.execute(query, params);

    res.json({
      status: "success",
      data: attendance,
      count: attendance.length,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch attendance records",
    });
  }
});

// POST /api/attendance - Mark attendance
router.post(
  "/",
  [
    body("employee_id").notEmpty().withMessage("Employee ID is required"),
    body("date").isDate().withMessage("Valid date is required"),
    body("check_in")
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Valid check-in time required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const {
        employee_id,
        date,
        check_in,
        check_out,
        status = "Present",
      } = req.body;

      // Calculate total hours if both check_in and check_out are provided
      let total_hours = 0;
      if (check_in && check_out) {
        const checkInTime = new Date(`${date} ${check_in}`);
        const checkOutTime = new Date(`${date} ${check_out}`);
        total_hours = (checkOutTime - checkInTime) / (1000 * 60 * 60); // Convert to hours
      }

      const [result] = await pool.execute(
        `
      INSERT INTO attendance (employee_id, date, check_in, check_out, total_hours, status)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      check_in = VALUES(check_in),
      check_out = VALUES(check_out),
      total_hours = VALUES(total_hours),
      status = VALUES(status)
    `,
        [employee_id, date, check_in, check_out, total_hours, status]
      );

      res.status(201).json({
        status: "success",
        message: "Attendance marked successfully",
        data: {
          employee_id,
          date,
          check_in,
          check_out,
          total_hours,
          status,
        },
      });
    } catch (error) {
      console.error("Error marking attendance:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to mark attendance",
      });
    }
  }
);

// GET /api/attendance/stats - Get attendance statistics
router.get("/stats", async (req, res) => {
  try {
    const { date = new Date().toISOString().split("T")[0] } = req.query;

    const [stats] = await pool.execute(
      `
      SELECT 
        COUNT(*) as total_employees,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_count,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent_count,
        SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) as late_count,
        SUM(CASE WHEN status = 'Half Day' THEN 1 ELSE 0 END) as half_day_count,
        AVG(total_hours) as average_hours
      FROM attendance 
      WHERE date = ?
    `,
      [date]
    );

    res.json({
      status: "success",
      data: stats[0],
    });
  } catch (error) {
    console.error("Error fetching attendance stats:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch attendance statistics",
    });
  }
});

export default router;
