const mongoose = require("mongoose")

jest.mock("../src/config/firebase", () => ({
  auth: () => ({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: "test", email: "test@test.com" }),
  }),
}))

jest.mock("../src/services/stripe", () => ({
  checkout: {
    sessions: {
      create: jest.fn().mockResolvedValue({
        id: "cs_test_mock",
        url: "https://checkout.stripe.com/cs_test_mock",
      }),
    },
  },
  webhooks: {
    constructEvent: jest.fn(),
  },
}))

const request = require("supertest")
const app = require("../src/app")
const Payroll = require("../src/models/Payroll")
const User = require("../src/models/User")
const { createTestUser } = require("../tests/helpers")

const stripe = require("../src/services/stripe")

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
  jest.clearAllMocks()
})

describe("Payment Flow", () => {
  let adminToken
  let employeeUser
  let payrollRecord

  beforeEach(async () => {
    const admin = await createTestUser({ role: "admin" })
    adminToken = admin.token

    const emp = await createTestUser({ role: "employee", isVerified: true })
    employeeUser = emp.user

    payrollRecord = await Payroll.create({
      employeeId: employeeUser._id,
      employeeEmail: employeeUser.email,
      salary: employeeUser.salary,
      month: "may",
      year: 2026,
      transactionId: "PR_TEST",
    })
  })

  describe("POST /api/payments/create-checkout-session", () => {
    it("creates a Stripe checkout session", async () => {
      const res = await request(app)
        .post("/api/payments/create-checkout-session")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ payrollId: payrollRecord._id })
      expect(res.status).toBe(200)
      expect(res.body.url).toContain("checkout.stripe.com")
      expect(stripe.checkout.sessions.create).toHaveBeenCalled()
    })

    it("rejects missing payrollId", async () => {
      const res = await request(app)
        .post("/api/payments/create-checkout-session")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({})
      expect(res.status).toBe(400)
    })

    it("rejects already paid payroll", async () => {
      payrollRecord.paid = true
      await payrollRecord.save()

      const res = await request(app)
        .post("/api/payments/create-checkout-session")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ payrollId: payrollRecord._id })
      expect(res.status).toBe(400)
    })
  })

  describe("POST /api/payments/webhook", () => {
    it("rejects missing stripe-signature header", async () => {
      const res = await request(app)
        .post("/api/payments/webhook")
        .send({})
      expect(res.status).toBe(400)
      expect(res.body.message).toBe("Missing stripe-signature header")
    })

    it("handles checkout.session.completed event", async () => {
      stripe.webhooks.constructEvent.mockReturnValue({
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_completed",
            metadata: { payrollId: payrollRecord._id.toString() },
          },
        },
      })

      const res = await request(app)
        .post("/api/payments/webhook")
        .set("stripe-signature", "valid_sig")
        .send({ raw_body: "mock" })
      expect(res.status).toBe(200)

      const updated = await Payroll.findById(payrollRecord._id)
      expect(updated.paid).toBe(true)
      expect(updated.transactionId).toBe("cs_test_completed")
    })

    it("handles signature verification failure", async () => {
      stripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error("Signature verification failed")
      })

      const res = await request(app)
        .post("/api/payments/webhook")
        .set("stripe-signature", "invalid_sig")
        .send({})
      expect(res.status).toBe(400)
      expect(res.body.message).toBe("Webhook signature verification failed")
    })
  })
})
