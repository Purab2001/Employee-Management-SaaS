const User = require("../models/User");
const WorkSheet = require("../models/WorkSheet");
const PaymentHistory = require("../models/PaymentHistory");

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
      month,
      year,
    });

    if (existing) {
      return res.status(400).json({ message: "Payment already recorded for this month" });
    }

    const transactionId = "TXN" + Date.now() + Math.random().toString(36).slice(2, 8).toUpperCase();

    const payment = await PaymentHistory.create({
      employeeEmail: employee.email,
      month,
      year,
      amount,
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
      filter.employeeEmail = employeeEmail.toLowerCase();
    }

    if (month && year) {
      const monthIndex = [
        "january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december",
      ].indexOf(month.toLowerCase());

      if (monthIndex !== -1) {
        const startOfMonth = new Date(parseInt(year), monthIndex, 1);
        const endOfMonth = new Date(parseInt(year), monthIndex + 1, 0, 23, 59, 59, 999);

        filter.date = { $gte: startOfMonth, $lte: endOfMonth };
      }
    } else if (year) {
      const startOfYear = new Date(parseInt(year), 0, 1);
      const endOfYear = new Date(parseInt(year), 11, 31, 23, 59, 59, 999);

      filter.date = { $gte: startOfYear, $lte: endOfYear };
    } else if (month) {
      const currentYear = new Date().getFullYear();
      const monthIndex = [
        "january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december",
      ].indexOf(month.toLowerCase());

      if (monthIndex !== -1) {
        const startOfMonth = new Date(currentYear, monthIndex, 1);
        const endOfMonth = new Date(currentYear, monthIndex + 1, 0, 23, 59, 59, 999);

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
