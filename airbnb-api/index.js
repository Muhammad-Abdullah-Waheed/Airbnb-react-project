const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const compression = require("compression");
const path = require("path");
const fs = require("fs");

dotenv.config();

const UserRoute = require("./routes/user");
const ListingRoute = require("./routes/listings");
const BookingRoute = require("./routes/booking");

// Fail fast if required secrets are missing rather than silently serving a
// broken app in production.
const required = ["MONGODB_URI", "JWT_SECRET"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`[fatal] Missing required env var: ${key}`);
    process.exit(1);
  }
}

const app = express();

const isProd = process.env.NODE_ENV === "production";
const port = process.env.PORT || 4000;

// When deployed behind Render / Nginx / any reverse proxy, this makes
// express use the correct client IP (important for rate limiting) and marks
// connections as secure so the `secure` cookie flag works.
app.set("trust proxy", 1);

app.use(helmet());
app.use(compression());
app.use(morgan(isProd ? "combined" : "dev"));

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

// Strip any $-prefixed keys from request bodies / queries / params to defuse
// NoSQL injection attempts like { "$gt": "" }.
app.use(mongoSanitize());

// CORS — supports a comma-separated list of allowed origins so you can permit
// both localhost (for dev) and the deployed frontend URL at the same time.
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow server-to-server / curl / same-origin (no Origin header).
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// Targeted rate limiting. Applied to the auth endpoints (brute force
// protection) and the booking endpoint (abuse protection). The whole app
// doesn't need a limiter — static reads are cheap.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down." },
});

app.use("/api/login", authLimiter);
app.use("/api/register", authLimiter);
app.use("/api/savebooking", writeLimiter);

// Liveness / readiness endpoint used by hosting providers and uptime monitors.
app.get("/api/healthz", (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected
  const ok = dbState === 1;
  return res
    .status(ok ? 200 : 503)
    .json({ status: ok ? "ok" : "degraded", db: dbState });
});

// API routes
app.use("/api", UserRoute);
app.use("/api", ListingRoute);
app.use("/api", BookingRoute);

// In production, serve the built React frontend from `/dist` (created by
// `npm run build` in the project root). This lets us deploy the whole app
// as a single service, which is the simplest setup for a free-tier demo.
if (isProd) {
  const clientDist = path.resolve(__dirname, "..", "dist");
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    // Everything that isn't an /api/* route should fall through to React's
    // client-side router.
    app.get(/^\/(?!api).*/, (req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  } else {
    console.warn(
      `[warn] NODE_ENV=production but build output not found at ${clientDist}. ` +
        `Run 'npm run build' from the project root before starting.`
    );
  }
}

// Centralized error handler. Any route that calls `next(err)` (or throws in
// an async handler that we catch) ends up here. This guarantees consistent
// error shape and makes sure we never leak stack traces to clients in prod.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[error]", err);
  const status = err.status || 500;
  res.status(status).json({
    error: isProd && status >= 500 ? "Internal server error" : err.message,
  });
});

// --- Server lifecycle ---

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "sample_airbnb",
    });
    console.log("[mongo] connected");
  } catch (error) {
    console.error("[mongo] connection error:", error);
    process.exit(1);
  }
}

const startServer = async () => {
  await connectToMongoDB();
  const server = app.listen(port, () => {
    console.log(`[server] listening on port ${port} (env=${process.env.NODE_ENV || "development"})`);
  });

  // Graceful shutdown: on SIGTERM (sent by Render/Docker/k8s when redeploying)
  // stop accepting new connections, wait for in-flight ones to finish, then
  // close the DB connection. Without this, clients can hit hard TCP resets
  // during a deploy.
  const shutdown = async (signal) => {
    console.log(`[server] ${signal} received, shutting down...`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log("[server] shutdown complete");
      process.exit(0);
    });

    setTimeout(() => {
      console.error("[server] forced shutdown after timeout");
      process.exit(1);
    }, 10_000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

startServer();
