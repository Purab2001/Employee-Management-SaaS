const { Router } = require("express");
const { verifyEmployee } = require("../middlewares/auth");
const {
  getWorkSheets,
  createWorkSheet,
  updateWorkSheet,
  deleteWorkSheet,
} = require("../controllers/workSheetController");

const router = Router();

router.get("/", verifyEmployee, getWorkSheets);
router.post("/", verifyEmployee, createWorkSheet);
router.put("/:id", verifyEmployee, updateWorkSheet);
router.delete("/:id", verifyEmployee, deleteWorkSheet);

module.exports = router;
