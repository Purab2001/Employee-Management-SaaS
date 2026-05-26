const WorkSheet = require("../models/WorkSheet");
const { VALID_TASKS, isValidObjectId, isValidDate } = require("../utils/validation");

exports.getWorkSheets = async (req, res) => {
  try {
    const entries = await WorkSheet.find({
      employeeEmail: req.user.email,
    }).sort({ date: -1 });

    res.json(entries);
  } catch (error) {
    console.error("Get worksheets error:", error);
    res.status(500).json({ message: "Failed to fetch work entries" });
  }
};

exports.createWorkSheet = async (req, res) => {
  try {
    const { task, hours, date } = req.body;

    if (!task || !hours || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!VALID_TASKS.includes(task)) {
      return res.status(400).json({ message: "Invalid task. Must be one of: " + VALID_TASKS.join(", ") });
    }

    const hoursNum = Number(hours);
    if (!Number.isFinite(hoursNum) || hoursNum < 0.5 || hoursNum > 24) {
      return res.status(400).json({ message: "Hours must be between 0.5 and 24" });
    }

    if (!isValidDate(date)) {
      return res.status(400).json({ message: "Valid date is required" });
    }

    const entry = await WorkSheet.create({
      employeeEmail: req.user.email,
      task,
      hours: hoursNum,
      date: new Date(date),
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error("Create worksheet error:", error);
    res.status(500).json({ message: "Failed to create work entry" });
  }
};

exports.updateWorkSheet = async (req, res) => {
  try {
    const { id } = req.params;
    const { task, hours, date } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid work entry ID" });
    }

    const update = {};

    if (task !== undefined) {
      if (!VALID_TASKS.includes(task)) {
        return res.status(400).json({ message: "Invalid task" });
      }
      update.task = task;
    }

    if (hours !== undefined) {
      const hoursNum = Number(hours);
      if (!Number.isFinite(hoursNum) || hoursNum < 0.5 || hoursNum > 24) {
        return res.status(400).json({ message: "Hours must be between 0.5 and 24" });
      }
      update.hours = hoursNum;
    }

    if (date !== undefined) {
      if (!isValidDate(date)) {
        return res.status(400).json({ message: "Valid date is required" });
      }
      update.date = new Date(date);
    }

    const entry = await WorkSheet.findOneAndUpdate(
      { _id: id, employeeEmail: req.user.email },
      update,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ message: "Work entry not found" });
    }

    res.json(entry);
  } catch (error) {
    console.error("Update worksheet error:", error);
    res.status(500).json({ message: "Failed to update work entry" });
  }
};

exports.deleteWorkSheet = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid work entry ID" });
    }

    const entry = await WorkSheet.findOneAndDelete({
      _id: id,
      employeeEmail: req.user.email,
    });

    if (!entry) {
      return res.status(404).json({ message: "Work entry not found" });
    }

    res.json({ message: "Work entry deleted" });
  } catch (error) {
    console.error("Delete worksheet error:", error);
    res.status(500).json({ message: "Failed to delete work entry" });
  }
};
