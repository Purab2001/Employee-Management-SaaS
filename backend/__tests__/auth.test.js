const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

// Must be before any module require to mock Firebase
jest.mock("../src/config/firebase", () => ({
  auth: () => ({
    verifyIdToken: jest.fn((idToken) => {
      if (!idToken) return Promise.reject(new Error("Mock: No idToken provided"))
      return Promise.resolve({
        uid: "test-firebase-uid",
        email: "existing@example.com",
        name: "Existing User",
        picture: "https://example.com/photo.jpg",
      })
    }),
  }),
}))

const request = require("supertest")
const app = require("../src/app")
const User = require("../src/models/User")
const { createTestUser } = require("../tests/helpers")

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

afterEach(async () => {
  await User.deleteMany({})
})

describe("Auth Routes", () => {
  describe("GET /", () => {
    it("returns API info", async () => {
      const res = await request(app).get("/")
      expect(res.status).toBe(200)
      expect(res.body.message).toBe("PayNode API")
    })
  })

  describe("POST /api/auth/register", () => {
    it("rejects missing idToken", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "New User" })
      expect(res.status).toBe(401)
    })
  })

  describe("POST /api/auth/login", () => {
    it("rejects missing idToken", async () => {
      const res = await request(app).post("/api/auth/login").send({})
      expect(res.status).toBe(401)
    })
  })

  describe("GET /api/auth/me", () => {
    it("returns 401 without token", async () => {
      const res = await request(app).get("/api/auth/me")
      expect(res.status).toBe(401)
      expect(res.body.message).toBe("No token provided")
    })

    it("returns user with valid token", async () => {
      const { token } = await createTestUser()
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`)
      expect(res.status).toBe(200)
      expect(res.body.user).toBeDefined()
      expect(res.body.user.email).toBeDefined()
    })

    it("rejects invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token")
      expect(res.status).toBe(401)
      expect(res.body.message).toBe("Invalid token")
    })

    it("blocks fired users", async () => {
      const { token } = await createTestUser({ status: "fired" })
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`)
      expect(res.status).toBe(403)
      expect(res.body.message).toBe("Account deactivated")
    })
  })

  describe("POST /api/auth/logout", () => {
    it("clears cookie", async () => {
      const res = await request(app).post("/api/auth/logout")
      expect(res.status).toBe(200)
      expect(res.body.message).toBe("Logged out")
    })
  })
})

describe("Authorization Middleware", () => {
  it("blocks employee from hr routes", async () => {
    const { token } = await createTestUser({ role: "employee" })
    const res = await request(app)
      .get("/api/hr/employees")
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(403)
  })

  it("blocks employee from admin routes", async () => {
    const { token } = await createTestUser({ role: "employee" })
    const res = await request(app)
      .get("/api/admin/employees")
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(403)
  })

  it("allows hr to access hr routes", async () => {
    const { token } = await createTestUser({ role: "hr" })
    const res = await request(app)
      .get("/api/hr/employees")
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200)
  })

  it("allows admin to access admin routes", async () => {
    const { token } = await createTestUser({ role: "admin" })
    const res = await request(app)
      .get("/api/admin/employees")
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200)
  })
})
