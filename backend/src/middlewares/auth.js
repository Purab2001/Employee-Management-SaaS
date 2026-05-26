const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-__v");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.status === "fired") {
      return res.status(403).json({ message: "Account deactivated" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

const verifyAdmin = [verifyToken, verifyRole("admin")];
const verifyHR = [verifyToken, verifyRole("hr")];
const verifyEmployee = [verifyToken, verifyRole("employee")];
const verifyHRAndAdmin = [verifyToken, verifyRole("hr", "admin")];

module.exports = { verifyToken, verifyRole, verifyAdmin, verifyHR, verifyEmployee, verifyHRAndAdmin };
