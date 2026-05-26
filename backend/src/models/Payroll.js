const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    salary: { type: Number, required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    paymentDate: { type: Date, default: null },
    transactionId: { type: String, default: "" },
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Payroll", payrollSchema);
