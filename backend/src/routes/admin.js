const { Router } = require("express");
const { verifyAdmin } = require("../middlewares/auth");
const {
  getAllEmployees,
  promoteToHR,
  fireEmployee,
  updateSalary,
  getPayrolls,
  approvePayroll,
} = require("../controllers/adminController");

const router = Router();

router.get("/employees", verifyAdmin, getAllEmployees);
router.patch("/employees/:id/promote", verifyAdmin, promoteToHR);
router.patch("/employees/:id/fire", verifyAdmin, fireEmployee);
router.patch("/employees/:id/salary", verifyAdmin, updateSalary);
router.get("/payrolls", verifyAdmin, getPayrolls);
router.post("/payrolls", verifyAdmin, approvePayroll);

module.exports = router;
