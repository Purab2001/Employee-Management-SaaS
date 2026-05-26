const { Router } = require("express");
const { verifyHRAndAdmin } = require("../middlewares/auth");
const {
  getEmployees,
  getEmployeeById,
  verifyEmployee,
  payEmployee,
  getEmployeePayments,
  getProgress,
} = require("../controllers/hrController");

const router = Router();

router.get("/employees", verifyHRAndAdmin, getEmployees);
router.get("/employees/:id", verifyHRAndAdmin, getEmployeeById);
router.patch("/employees/:id/verify", verifyHRAndAdmin, verifyEmployee);
router.post("/employees/:id/pay", verifyHRAndAdmin, payEmployee);
router.get("/employees/:id/payments", verifyHRAndAdmin, getEmployeePayments);
router.get("/progress", verifyHRAndAdmin, getProgress);

module.exports = router;
