const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const workSheetRoutes = require("./routes/workSheet");
const paymentHistoryRoutes = require("./routes/paymentHistory");
const hrRoutes = require("./routes/hr");
const adminRoutes = require("./routes/admin");
const paymentRoutes = require("./routes/payment");
const { handleWebhook } = require("./controllers/paymentController");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests. Please try again later." },
});

// Stripe webhook needs raw body before JSON parser
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), handleWebhook);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Rate limit all API routes
app.use("/api", apiLimiter);

app.get("/", (_req, res) => {
  res.json({ message: "PayNode API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/worksheets", workSheetRoutes);
app.use("/api/payments", paymentHistoryRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
