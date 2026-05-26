const User = require("../models/User");
const WorkSheet = require("../models/WorkSheet");
const PaymentHistory = require("../models/PaymentHistory");
const { VALID_MONTHS, isValidObjectId, isValidMonth, isValidYear, isPositiveNumber } = require("../utils/validation");

exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.json(employees);
  } catch (error) {
    console.error("Get employees error:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const employee = await User.findById(req.params.id).select("-__v");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.role !== "employee") {
      return res.status(400).json({ message: "User is not an employee" });
    }

    const [totalHours, paymentCount] = await Promise.all([
      WorkSheet.aggregate([
        { $match: { employeeEmail: employee.email } },
        { $group: { _id: null, total: { $sum: "$hours" } } },
      ]),
      PaymentHistory.countDocuments({ employeeEmail: employee.email }),
    ]);

    res.json({
      employee,
      stats: {
        totalWorkHours: totalHours[0]?.total || 0,
        totalPayments: paymentCount,
      },
    });
  } catch (error) {
    console.error("Get employee by id error:", error);
    res.status(500).json({ message: "Failed to fetch employee" });
  }
};

exports.verifyEmployee = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const employee = await User.findById(req.params.id).select("-__v");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.role !== "employee") {
      return res.status(400).json({ message: "User is not an employee" });
    }

    employee.isVerified = true;
    await employee.save();

    res.json({ message: "Employee verified successfully", employee });
  } catch (error) {
    console.error("Verify employee error:", error);
    res.status(500).json({ message: "Failed to verify employee" });
  }
};

exports.payEmployee = async (req, res) => {
  try {
    const { month, year, amount } = req.body;

    if (!month || !year || !amount) {
      return res.status(400).json({ message: "Month, year, and amount are required" });
    }

    if (!isValidMonth(month)) {
      return res.status(400).json({ message: "Invalid month name" });
    }

    const yearNum = Number(year);
    if (!Number.isInteger(yearNum) || yearNum < 1900 || yearNum > 2100) {
      return res.status(400).json({ message: "Invalid year" });
    }

    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0 || amountNum > 10000000) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.role !== "employee") {
      return res.status(400).json({ message: "User is not an employee" });
    }

    if (!employee.isVerified) {
      return res.status(400).json({ message: "Cannot pay unverified employee" });
    }

    const existing = await PaymentHistory.findOne({
      employeeEmail: employee.email,
      month: month.toLowerCase(),
      year: yearNum,
    });

    if (existing) {
      return res.status(400).json({ message: "Payment already recorded for this month" });
    }

    const transactionId = "TXN" + Date.now() + Math.random().toString(36).slice(2, 8).toUpperCase();

    const payment = await PaymentHistory.create({
      employeeEmail: employee.email,
      month: month.toLowerCase(),
      year: yearNum,
      amount: amountNum,
      transactionId,
      paymentDate: new Date(),
    });

    res.status(201).json({ message: "Payment recorded successfully", payment });
  } catch (error) {
    console.error("Pay employee error:", error);
    res.status(500).json({ message: "Failed to process payment" });
  }
};

exports.getEmployeePayments = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const payments = await PaymentHistory.find({
      employeeEmail: employee.email,
    }).sort({ paymentDate: 1 });

    res.json(payments);
  } catch (error) {
    console.error("Get employee payments error:", error);
    res.status(500).json({ message: "Failed to fetch payment history" });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const { employeeEmail, month, year } = req.query;

    const filter = {};

    if (employeeEmail) {
      if (typeof employeeEmail !== "string" || employeeEmail.length > 254) {
        return res.status(400).json({ message: "Invalid employee email" });
      }
      filter.employeeEmail = employeeEmail.toLowerCase();
    }

    if (month && year) {
      if (!isValidMonth(month)) {
        return res.status(400).json({ message: "Invalid month name" });
      }

      const yearNum = Number(year);
      if (!Number.isInteger(yearNum) || yearNum < 1900 || yearNum > 2100) {
        return res.status(400).json({ message: "Invalid year" });
      }

      const monthIndex = VALID_MONTHS.indexOf(month.toLowerCase());

      if (monthIndex !== -1) {
        const startOfMonth = new Date(yearNum, monthIndex, 1);
        const endOfMonth = new Date(yearNum, monthIndex + 1, 0, 23, 59, 59, 999);

        filter.date = { $gte: startOfMonth, $lte: endOfMonth };
      }
    } else if (year) {
      const yearNum = Number(year);
      if (!Number.isInteger(yearNum) || yearNum < 1900 || yearNum > 2100) {
        return res.status(400).json({ message: "Invalid year" });
      }

      const startOfYear = new Date(yearNum, 0, 1);
      const endOfYear = new Date(yearNum, 11, 31, 23, 59, 59, 999);

      filter.date = { $gte: startOfYear, $lte: endOfYear };
    } else if (month) {
      if (!isValidMonth(month)) {
        return res.status(400).json({ message: "Invalid month name" });
      }

      const currentYearNum = new Date().getFullYear();
      const monthIndex = VALID_MONTHS.indexOf(month.toLowerCase());

      if (monthIndex !== -1) {
        const startOfMonth = new Date(currentYearNum, monthIndex, 1);
        const endOfMonth = new Date(currentYearNum, monthIndex + 1, 0, 23, 59, 59, 999);

        filter.date = { $gte: startOfMonth, $lte: endOfMonth };
      }
    }

    const entries = await WorkSheet.find(filter).sort({ date: -1 });

    const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

    res.json({ entries, totalHours });
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({ message: "Failed to fetch progress data" });
  }
};
