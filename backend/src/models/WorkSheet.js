const mongoose = require("mongoose");

const workSheetSchema = new mongoose.Schema(
  {
    employeeEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    task: {
      type: String,
      required: true,
      enum: ["Sales", "Support", "Content", "Paper-work"],
    },
    hours: {
      type: Number,
      required: true,
      min: 0.5,
      max: 24,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkSheet", workSheetSchema);
