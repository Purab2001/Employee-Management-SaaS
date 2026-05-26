const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    photoURL: { type: String, default: "" },
    role: {
      type: String,
      enum: ["employee", "hr", "admin"],
      default: "employee",
    },
    designation: { type: String, default: "" },
    salary: { type: Number, default: 0 },
    bank_account_no: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "fired"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
