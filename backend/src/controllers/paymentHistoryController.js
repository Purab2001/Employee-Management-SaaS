const PaymentHistory = require("../models/PaymentHistory");

exports.getPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      PaymentHistory.find({ employeeEmail: req.user.email })
        .sort({ paymentDate: -1 })
        .skip(skip)
        .limit(limit),
      PaymentHistory.countDocuments({ employeeEmail: req.user.email }),
    ]);

    res.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};
