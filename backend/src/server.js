const dotenv = require("dotenv");
dotenv.config();

const REQUIRED_ENV_VARS = [
  "MONGODB_URI",
  "JWT_SECRET",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "CLIENT_URL",
];

const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    `Missing required environment variables:\n  ${missing.join("\n  ")}\n\n` +
    "Please set them in your .env file before starting the server."
  );
  process.exit(1);
}

const app = require("./app");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
