const mongoose = require("mongoose")

jest.mock("../src/config/firebase", () => ({
  auth: () => ({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: "test", email: "test@test.com" }),
  }),
}))

const request = require("supertest")
const app = require("../src/app")
const WorkSheet = require("../src/models/WorkSheet")
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
  await WorkSheet.deleteMany({})
  await User.deleteMany({})
})

describe("WorkSheet CRUD", () => {
  let employeeToken
  let employeeUser

  beforeEach(async () => {
    const setup = await createTestUser({ role: "employee" })
    employeeUser = setup.user
    employeeToken = setup.token
  })

  describe("GET /api/worksheets", () => {
    it("returns empty array for new employee", async () => {
      const res = await request(app)
        .get("/api/worksheets")
        .set("Authorization", `Bearer ${employeeToken}`)
      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    it("returns only the employee's own entries", async () => {
      await WorkSheet.create({
        employeeEmail: employeeUser.email,
        task: "Sales",
        hours: 5,
        date: new Date(),
      })
      await WorkSheet.create({
        employeeEmail: "other@example.com",
        task: "Support",
        hours: 3,
        date: new Date(),
      })

      const res = await request(app)
        .get("/api/worksheets")
        .set("Authorization", `Bearer ${employeeToken}`)
      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0].employeeEmail).toBe(employeeUser.email)
    })
  })

  describe("POST /api/worksheets", () => {
    it("creates a work entry", async () => {
      const res = await request(app)
        .post("/api/worksheets")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({ task: "Sales", hours: 5, date: "2026-05-20" })
      expect(res.status).toBe(201)
      expect(res.body.task).toBe("Sales")
      expect(res.body.hours).toBe(5)
      expect(res.body.employeeEmail).toBe(employeeUser.email)
    })

    it("rejects invalid task", async () => {
      const res = await request(app)
        .post("/api/worksheets")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({ task: "InvalidTask", hours: 5, date: "2026-05-20" })
      expect(res.status).toBe(400)
    })

    it("rejects hours below 0.5", async () => {
      const res = await request(app)
        .post("/api/worksheets")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({ task: "Sales", hours: 0.1, date: "2026-05-20" })
      expect(res.status).toBe(400)
    })

    it("rejects hours above 24", async () => {
      const res = await request(app)
        .post("/api/worksheets")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({ task: "Sales", hours: 25, date: "2026-05-20" })
      expect(res.status).toBe(400)
    })

    it("rejects missing fields", async () => {
      const res = await request(app)
        .post("/api/worksheets")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({ task: "Sales" })
      expect(res.status).toBe(400)
    })
  })

  describe("PUT /api/worksheets/:id", () => {
    it("updates own entry", async () => {
      const entry = await WorkSheet.create({
        employeeEmail: employeeUser.email,
        task: "Sales",
        hours: 5,
        date: new Date(),
      })

      const res = await request(app)
        .put(`/api/worksheets/${entry._id}`)
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({ hours: 8 })
      expect(res.status).toBe(200)
      expect(res.body.hours).toBe(8)
    })

    it("rejects update of another employee's entry", async () => {
      const entry = await WorkSheet.create({
        employeeEmail: "other@example.com",
        task: "Support",
        hours: 3,
        date: new Date(),
      })

      const res = await request(app)
        .put(`/api/worksheets/${entry._id}`)
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({ hours: 8 })
      expect(res.status).toBe(404)
    })

    it("rejects invalid ObjectId", async () => {
      const res = await request(app)
        .put("/api/worksheets/invalid-id")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({ hours: 8 })
      expect(res.status).toBe(400)
    })
  })

  describe("DELETE /api/worksheets/:id", () => {
    it("deletes own entry", async () => {
      const entry = await WorkSheet.create({
        employeeEmail: employeeUser.email,
        task: "Sales",
        hours: 5,
        date: new Date(),
      })

      const res = await request(app)
        .delete(`/api/worksheets/${entry._id}`)
        .set("Authorization", `Bearer ${employeeToken}`)
      expect(res.status).toBe(200)
      expect(res.body.message).toBe("Work entry deleted")
    })

    it("rejects delete of another employee's entry", async () => {
      const entry = await WorkSheet.create({
        employeeEmail: "other@example.com",
        task: "Support",
        hours: 3,
        date: new Date(),
      })

      const res = await request(app)
        .delete(`/api/worksheets/${entry._id}`)
        .set("Authorization", `Bearer ${employeeToken}`)
      expect(res.status).toBe(404)
    })
  })
})
