import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import connectDb from "./utils/connectDb.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.route.js"
import notesRouter from "./routes/genrate.route.js"
import pdfRouter from "./routes/pdf.route.js"
import creditRouter from "./routes/credits.route.js"
import { stripeWebhook } from "./controllers/credits.controller.js"

dotenv.config()

const app = express()

const normalizeOrigin = (value) => {
  try {
    return new URL(value.trim()).origin
  } catch {
    return null
  }
}

// Keep the production domain explicitly allow-listed as a safe fallback in
// case the Render CLIENT_URL value contains formatting or stale configuration.
const allowedOrigins = new Set(
  [
    ...(process.env.CLIENT_URL || "http://localhost:5173").split(","),
    "https://prep-pilot-ai-pdoq.vercel.app",
    "http://localhost:5173",
  ]
    .map(normalizeOrigin)
    .filter(Boolean)
)

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true)
    }

    console.warn(`[CORS] Rejected origin: ${origin}`)
    return callback(null, false)
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
}

// Log request origin/method so production CORS failures are diagnosable.
app.use((req, _res, next) => {
  if (req.method === "OPTIONS" || req.path.startsWith("/api/")) {
    console.log(`[HTTP] ${req.method} ${req.originalUrl} | Origin: ${req.get("origin") || "none"}`)
  }
  next()
})

app.use(cors(corsOptions))

app.post(
  "/api/credits/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
)

app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 5000

app.get("/", (_req, res) => {
  res.json({ message: "PrepPilot API is running" })
})

// Safe diagnostic endpoint: reports service/database state without exposing secrets.
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    allowedOrigins: [...allowedOrigins],
  })
})

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/notes", notesRouter)
app.use("/api/pdf", pdfRouter)
app.use("/api/credit", creditRouter)

// Return a readable API 404 rather than Express' plain "Not Found".
app.use((req, res) => {
  console.warn(`[404] No route for ${req.method} ${req.originalUrl}`)
  res.status(404).json({
    message: "API route not found",
    method: req.method,
    path: req.originalUrl,
  })
})

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
  console.log(`✅ CORS allowed origins: ${[...allowedOrigins].join(", ")}`)
})

connectDb()
