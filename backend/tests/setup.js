const dotenv = require("dotenv")
const path = require("path")

dotenv.config({ path: path.resolve(__dirname, "../.env.test") })

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret"
process.env.CLIENT_URL = "http://localhost:5173"
process.env.NODE_ENV = "test"
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder"
process.env.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder"
process.env.FIREBASE_PROJECT_ID = "test-project"
process.env.FIREBASE_CLIENT_EMAIL = "test@test.iam.gserviceaccount.com"
process.env.FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEA\n-----END PRIVATE KEY-----"
