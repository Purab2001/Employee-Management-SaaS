const { Router } = require("express");
const { verifyEmployee } = require("../middlewares/auth");
const { getPayments } = require("../controllers/paymentHistoryController");

const router = Router();

router.get("/", verifyEmployee, getPayments);

module.exports = router;
