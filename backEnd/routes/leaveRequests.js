import express from "express";
import { body, validationResult } from "express-validator";
import pool from "../config/database.js";

const router = express.Router();

// GET /api/leave-requests - Get all leave requests
router.get("/", async (req, res) => {
  try {
    const { status, employee_id } = req.query;

    let query = `
      SELECT 
        lr.*, e.name as employee_name
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.employee_id
    `;

    const params = [];
    const conditions = [];

    if (status) {
      conditions.push("lr.status = ?");
      params.push(status);
    }

    if (employee_id) {
      conditions.push("lr.employee_id = ?");
      params.push(employee_id);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY lr.applied_date DESC";

    const [requests] = await pool.execute(query, params);

    res.json({
      status: "success",
      data: requests,
      count: requests.length,
    });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch leave requests",
    });
  }
});

// POST /api/leave-requests - Create new leave request
router.post(
  "/",
  [
    body("employee_id").notEmpty().withMessage("Employee ID is required"),
    body("leave_type")
      .isIn(["Annual Leave", "Sick Leave", "Personal Leave", "Emergency Leave"])
      .withMessage("Valid leave type is required"),
    body("start_date").isDate().withMessage("Valid start date is required"),
    body("end_date").isDate().withMessage("Valid end date is required"),
    body("reason")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Reason must be at least 5 characters"),
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

      const { employee_id, leave_type, start_date, end_date, reason } =
        req.body;

      // Calculate days requested
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      const days_requested =
        Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      const applied_date = new Date().toISOString().split("T")[0];

      const [result] = await pool.execute(
        `
      INSERT INTO leave_requests 
      (employee_id, leave_type, start_date, end_date, days_requested, reason, applied_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
        [
          employee_id,
          leave_type,
          start_date,
          end_date,
          days_requested,
          reason,
          applied_date,
        ]
      );

      res.status(201).json({
        status: "success",
        message: "Leave request submitted successfully",
        data: {
          id: result.insertId,
          employee_id,
          leave_type,
          start_date,
          end_date,
          days_requested,
          reason,
          applied_date,
          status: "Pending",
        },
      });
    } catch (error) {
      console.error("Error creating leave request:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to create leave request",
      });
    }
  }
);

// PUT /api/leave-requests/:id/approve - Approve leave request
router.put("/:id/approve", async (req, res) => {
  try {
    const { approved_by } = req.body;
    const approved_date = new Date().toISOString().split("T")[0];

    const [result] = await pool.execute(
      `
      UPDATE leave_requests 
      SET status = 'Approved', approved_by = ?, approved_date = ?
      WHERE id = ?
    `,
      [approved_by, approved_date, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Leave request not found",
      });
    }

    res.json({
      status: "success",
      message: "Leave request approved successfully",
    });
  } catch (error) {
    console.error("Error approving leave request:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to approve leave request",
    });
  }
});

// PUT /api/leave-requests/:id/reject - Reject leave request
router.put("/:id/reject", async (req, res) => {
  try {
    const { approved_by } = req.body;
    const approved_date = new Date().toISOString().split("T")[0];

    const [result] = await pool.execute(
      `
      UPDATE leave_requests 
      SET status = 'Rejected', approved_by = ?, approved_date = ?
      WHERE id = ?
    `,
      [approved_by, approved_date, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Leave request not found",
      });
    }

    res.json({
      status: "success",
      message: "Leave request rejected",
    });
  } catch (error) {
    console.error("Error rejecting leave request:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to reject leave request",
    });
  }
});

// GET /api/leave-requests/stats - Get leave request statistics
router.get("/stats", async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_requests,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected_count
      FROM leave_requests
      WHERE MONTH(applied_date) = MONTH(CURRENT_DATE())
      AND YEAR(applied_date) = YEAR(CURRENT_DATE())
    `);

    res.json({
      status: "success",
      data: stats[0],
    });
  } catch (error) {
    console.error("Error fetching leave request stats:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch leave request statistics",
    });
  }
});

export default router;
