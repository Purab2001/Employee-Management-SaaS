const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema(
  {
    employeeEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    paymentDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentHistory", paymentHistorySchema);
