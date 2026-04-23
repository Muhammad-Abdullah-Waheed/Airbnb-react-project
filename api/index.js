// Vercel serverless entry point.
//
// Vercel auto-detects any file under /api as a serverless function.
// vercel.json rewrites `/api/*` to this single handler so the full Express
// app handles every /api route in one function (simpler bundling, one cold
// start to warm up, one Mongo connection to reuse).
//
// We use `serverless-http` because Vercel's Node runtime pre-parses the
// request body for JSON payloads; serverless-http normalizes this so Express's
// own body parsing and middleware keep working unchanged.

const serverless = require("serverless-http");
const { app, ensureMongo } = require("../airbnb-api/index.js");

const handler = serverless(app, {
  // Don't rewrite paths — Express routes are already mounted at /api/*
  // and Vercel passes the original URL through.
  basePath: "",
});

module.exports = async (req, res) => {
  try {
    await ensureMongo();
  } catch (err) {
    console.error("[api] mongo init failed:", err);
    return res
      .status(503)
      .json({ error: "Database unavailable. Please retry in a moment." });
  }
  return handler(req, res);
};
