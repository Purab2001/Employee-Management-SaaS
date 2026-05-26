const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { submitContact } = require("../controllers/contactController");

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many messages. Please try again later." },
});

router.post("/", contactLimiter, submitContact);

module.exports = router;
