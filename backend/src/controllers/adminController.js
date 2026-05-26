const User = require("../models/User");
const Payroll = require("../models/Payroll");
const { VALID_MONTHS, isValidObjectId, isValidMonth, isValidYear, isPositiveNumber } = require("../utils/validation");

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find()
      .select("-__v")
      .sort({ createdAt: -1 });

    res.json(employees);
  } catch (error) {
    console.error("Get all employees error:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

exports.promoteToHR = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "employee") {
      return res.status(400).json({ message: "Only employees can be promoted to HR" });
    }

    if (user.status === "fired") {
      return res.status(400).json({ message: "Cannot promote a fired user" });
    }

    user.role = "hr";
    await user.save();

    res.json({ message: "User promoted to HR successfully", user });
  } catch (error) {
    console.error("Promote to HR error:", error);
    res.status(500).json({ message: "Failed to promote user" });
  }
};

exports.fireEmployee = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "employee") {
      return res.status(400).json({ message: "Only employees can be fired" });
    }

    if (user.status === "fired") {
      return res.status(400).json({ message: "User is already fired" });
    }

    user.status = "fired";
    await user.save();

    res.json({ message: "Employee fired successfully", user });
  } catch (error) {
    console.error("Fire employee error:", error);
    res.status(500).json({ message: "Failed to fire employee" });
  }
};

exports.updateSalary = async (req, res) => {
  try {
    const { salary } = req.body;

    const salaryNum = Number(salary);
    if (!Number.isFinite(salaryNum) || salaryNum <= 0 || salaryNum > 10000000) {
      return res.status(400).json({ message: "Salary must be greater than 0" });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "employee") {
      return res.status(400).json({ message: "Only employee salaries can be updated" });
    }

    if (salaryNum <= user.salary) {
      return res.status(400).json({ message: "Salary can only be increased" });
    }

    user.salary = salaryNum;
    await user.save();

    res.json({ message: "Salary updated successfully", user });
  } catch (error) {
    console.error("Update salary error:", error);
    res.status(500).json({ message: "Failed to update salary" });
  }
};

exports.getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employeeId", "name email")
      .sort({ createdAt: -1 });

    res.json(payrolls);
  } catch (error) {
    console.error("Get payrolls error:", error);
    res.status(500).json({ message: "Failed to fetch payrolls" });
  }
};

exports.approvePayroll = async (req, res) => {
  try {
    let { employeeId, month, year } = req.body;

    if (!employeeId || !month || !year) {
      return res.status(400).json({ message: "Employee ID, month, and year are required" });
    }

    if (!isValidObjectId(employeeId)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    if (!isValidMonth(month)) {
      return res.status(400).json({ message: "Invalid month name" });
    }

    const yearNum = Number(year);
    if (!Number.isInteger(yearNum) || yearNum < 1900 || yearNum > 2100) {
      return res.status(400).json({ message: "Invalid year" });
    }

    month = month.toLowerCase();

    const employee = await User.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.role !== "employee") {
      return res.status(400).json({ message: "User is not an employee" });
    }

    if (!employee.isVerified) {
      return res.status(400).json({ message: "Cannot approve payroll for unverified employee" });
    }

    const existing = await Payroll.findOne({
      employeeId,
      month,
      year: yearNum,
    });

    if (existing) {
      return res.status(400).json({ message: "Payroll already approved for this month" });
    }

    const transactionId = "PR" + Date.now() + Math.random().toString(36).slice(2, 8).toUpperCase();

    const payroll = await Payroll.create({
      employeeId,
      employeeEmail: employee.email,
      salary: employee.salary,
      month,
      year: yearNum,
      transactionId,
    });

    res.status(201).json({ message: "Payroll approved successfully", payroll });
  } catch (error) {
    console.error("Approve payroll error:", error);
    res.status(500).json({ message: "Failed to approve payroll" });
  }
};
