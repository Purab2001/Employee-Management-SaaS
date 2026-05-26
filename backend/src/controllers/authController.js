const admin = require("../config/firebase");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const register = async (req, res) => {
  const { idToken, name } = req.body;

  const decoded = await admin.auth().verifyIdToken(idToken);
  const { uid, email, picture } = decoded;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    firebaseUid: uid,
    name,
    email,
    photoURL: picture || "",
  });

  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoURL: user.photoURL,
    },
  });
};

const login = async (req, res) => {
  const { idToken } = req.body;

  const decoded = await admin.auth().verifyIdToken(idToken);
  const { uid, email, name, picture } = decoded;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      firebaseUid: uid,
      name: name || email.split("@")[0],
      email,
      photoURL: picture || "",
    });
  }

  if (user.status === "fired") {
    return res.status(403).json({ message: "Your account has been deactivated" });
  }

  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoURL: user.photoURL,
    },
  });
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

const logout = async (_req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

module.exports = { register, login, getMe, logout };
