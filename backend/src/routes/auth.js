const { Router } = require("express");
const { register, login, getMe, logout } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/auth");

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.post("/logout", logout);

module.exports = router;
