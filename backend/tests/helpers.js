const jwt = require("jsonwebtoken")
const User = require("../src/models/User")

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

async function createTestUser(overrides = {}) {
  const userData = {
    firebaseUid: `firebase_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    name: "Test User",
    email: `test_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`,
    role: "employee",
    ...overrides,
  }

  const user = await User.create(userData)
  const token = generateToken(user._id)
  return { user, token }
}

module.exports = { generateToken, createTestUser }
