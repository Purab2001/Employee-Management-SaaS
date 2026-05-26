const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const { register, login, getMe, logout } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/auth");

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Please try again later." },
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { message: "Too many registration attempts. Please try again later." },
});

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.get("/me", verifyToken, getMe);
router.post("/logout", logout);

module.exports = router;
