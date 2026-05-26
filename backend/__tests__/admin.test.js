const mongoose = require("mongoose")

jest.mock("../src/config/firebase", () => ({
  auth: () => ({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: "test", email: "test@test.com" }),
  }),
}))

const request = require("supertest")
const app = require("../src/app")
const User = require("../src/models/User")
const Payroll = require("../src/models/Payroll")
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
  await Payroll.deleteMany({})
})

describe("Admin Endpoints", () => {
  let adminToken
  let adminUser
  let employeeUser

  beforeEach(async () => {
    const admin = await createTestUser({ role: "admin" })
    adminToken = admin.token
    adminUser = admin.user

    const emp = await createTestUser({ role: "employee", isVerified: true })
    employeeUser = emp.user
  })

  describe("GET /api/admin/employees", () => {
    it("returns all employees", async () => {
      const res = await request(app)
        .get("/api/admin/employees")
        .set("Authorization", `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBe(2)
    })
  })

  describe("PATCH /api/admin/employees/:id/promote", () => {
    it("promotes employee to HR", async () => {
      const res = await request(app)
        .patch(`/api/admin/employees/${employeeUser._id}/promote`)
        .set("Authorization", `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.user.role).toBe("hr")
    })

    it("rejects promoting admin", async () => {
      const res = await request(app)
        .patch(`/api/admin/employees/${adminUser._id}/promote`)
        .set("Authorization", `Bearer ${adminToken}`)
      expect(res.status).toBe(400)
    })

    it("rejects promoting fired employee", async () => {
      const fired = await createTestUser({ role: "employee", status: "fired" })
      const res = await request(app)
        .patch(`/api/admin/employees/${fired.user._id}/promote`)
        .set("Authorization", `Bearer ${adminToken}`)
      expect(res.status).toBe(400)
    })
  })

  describe("PATCH /api/admin/employees/:id/fire", () => {
    it("fires an employee", async () => {
      const res = await request(app)
        .patch(`/api/admin/employees/${employeeUser._id}/fire`)
        .set("Authorization", `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.user.status).toBe("fired")
    })

    it("rejects firing already fired employee", async () => {
      const fired = await createTestUser({ role: "employee", status: "fired" })
      const res = await request(app)
        .patch(`/api/admin/employees/${fired.user._id}/fire`)
        .set("Authorization", `Bearer ${adminToken}`)
      expect(res.status).toBe(400)
    })

    it("rejects firing non-employee", async () => {
      const res = await request(app)
        .patch(`/api/admin/employees/${adminUser._id}/fire`)
        .set("Authorization", `Bearer ${adminToken}`)
      expect(res.status).toBe(400)
    })
  })

  describe("PATCH /api/admin/employees/:id/salary", () => {
    it("increases salary", async () => {
      const res = await request(app)
        .patch(`/api/admin/employees/${employeeUser._id}/salary`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ salary: employeeUser.salary + 1000 })
      expect(res.status).toBe(200)
      expect(res.body.user.salary).toBe(employeeUser.salary + 1000)
    })

    it("rejects equal or lower salary", async () => {
      const res = await request(app)
        .patch(`/api/admin/employees/${employeeUser._id}/salary`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ salary: employeeUser.salary })
      expect(res.status).toBe(400)
    })
  })

  describe("Payroll endpoints", () => {
    it("approves payroll for verified employee", async () => {
      const res = await request(app)
        .post("/api/admin/payrolls")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          employeeId: employeeUser._id,
          month: "may",
          year: 2026,
        })
      expect(res.status).toBe(201)
      expect(res.body.payroll.paid).toBe(false)
    })

    it("rejects duplicate payroll", async () => {
      await request(app)
        .post("/api/admin/payrolls")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ employeeId: employeeUser._id, month: "may", year: 2026 })

      const res = await request(app)
        .post("/api/admin/payrolls")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ employeeId: employeeUser._id, month: "may", year: 2026 })
      expect(res.status).toBe(400)
    })

    it("rejects payroll for unverified employee", async () => {
      const unverified = await createTestUser({ role: "employee", isVerified: false })
      const res = await request(app)
        .post("/api/admin/payrolls")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          employeeId: unverified.user._id,
          month: "may",
          year: 2026,
        })
      expect(res.status).toBe(400)
    })

    it("lists payrolls", async () => {
      await request(app)
        .post("/api/admin/payrolls")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ employeeId: employeeUser._id, month: "may", year: 2026 })

      const res = await request(app)
        .get("/api/admin/payrolls")
        .set("Authorization", `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
    })
  })
})
