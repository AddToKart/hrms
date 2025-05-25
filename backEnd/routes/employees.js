import express from "express";
import { body, validationResult } from "express-validator";
import pool from "../config/database.js";

const router = express.Router();

// Validation middleware
const validateEmployee = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("department").trim().notEmpty().withMessage("Department is required"),
  body("position").trim().notEmpty().withMessage("Position is required"),
  body("base_salary").isNumeric().withMessage("Base salary must be a number"),
];

// GET /api/employees - Get all employees
router.get("/", async (req, res) => {
  try {
    const [employees] = await pool.execute(`
      SELECT 
        id, employee_id, name, email, department, position, 
        base_salary, allowances, deductions, status, hire_date,
        created_at, updated_at
      FROM employees 
      ORDER BY created_at DESC
    `);

    res.json({
      status: "success",
      data: employees,
      count: employees.length,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch employees",
    });
  }
});

// GET /api/employees/:id - Get employee by ID
router.get("/:id", async (req, res) => {
  try {
    const [employees] = await pool.execute(
      "SELECT * FROM employees WHERE employee_id = ?",
      [req.params.id]
    );

    if (employees.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found",
      });
    }

    res.json({
      status: "success",
      data: employees[0],
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch employee",
    });
  }
});

// POST /api/employees - Create new employee
router.post("/", validateEmployee, async (req, res) => {
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
      name,
      email,
      department,
      position,
      base_salary,
      allowances = 0,
      deductions = 0,
    } = req.body;

    // Generate employee ID
    const [lastEmployee] = await pool.execute(
      "SELECT employee_id FROM employees ORDER BY id DESC LIMIT 1"
    );

    let nextId = 1;
    if (lastEmployee.length > 0) {
      const lastId = parseInt(lastEmployee[0].employee_id.replace("EMP", ""));
      nextId = lastId + 1;
    }

    const employee_id = `EMP${nextId.toString().padStart(3, "0")}`;
    const hire_date = new Date().toISOString().split("T")[0];

    const [result] = await pool.execute(
      `
      INSERT INTO employees 
      (employee_id, name, email, department, position, base_salary, allowances, deductions, hire_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        employee_id,
        name,
        email,
        department,
        position,
        base_salary,
        allowances,
        deductions,
        hire_date,
      ]
    );

    res.status(201).json({
      status: "success",
      message: "Employee created successfully",
      data: {
        id: result.insertId,
        employee_id,
        name,
        email,
        department,
        position,
      },
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to create employee",
      });
    }
  }
});

// PUT /api/employees/:id - Update employee
router.put("/:id", validateEmployee, async (req, res) => {
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
      name,
      email,
      department,
      position,
      base_salary,
      allowances,
      deductions,
      status,
    } = req.body;

    const [result] = await pool.execute(
      `
      UPDATE employees 
      SET name = ?, email = ?, department = ?, position = ?, 
          base_salary = ?, allowances = ?, deductions = ?, status = ?
      WHERE employee_id = ?
    `,
      [
        name,
        email,
        department,
        position,
        base_salary,
        allowances,
        deductions,
        status,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found",
      });
    }

    res.json({
      status: "success",
      message: "Employee updated successfully",
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update employee",
    });
  }
});

// DELETE /api/employees/:id - Delete employee
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.execute(
      "DELETE FROM employees WHERE employee_id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found",
      });
    }

    res.json({
      status: "success",
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete employee",
    });
  }
});

export default router;
