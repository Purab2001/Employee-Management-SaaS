const { Router } = require("express");
const { verifyAdmin } = require("../middlewares/auth");
const { createCheckoutSession } = require("../controllers/paymentController");

const router = Router();

router.post("/create-checkout-session", verifyAdmin, createCheckoutSession);

module.exports = router;
