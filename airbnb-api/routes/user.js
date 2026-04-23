const express = require("express");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Strip sensitive fields before sending a user back to the client.
const safeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};

// Cookie options used everywhere the token is set/cleared. httpOnly prevents
// JS on the page from reading the token (XSS protection).
//   - In production behind HTTPS: secure=true + sameSite='none' so the cookie
//     is allowed on cross-site XHR (frontend on vercel.app -> backend on
//     onrender.com). Browsers require secure=true when sameSite='none'.
//   - In development on plain http://localhost: secure=false + sameSite='lax'
//     (browsers let localhost cross-port cookies through with 'lax').
const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
  maxAge: 24 * 60 * 60 * 1000,
};

const MIN_PASSWORD_LENGTH = 8;

router.post("/register", async (req, res) => {
  const { email, password, name, usernumber, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    });
  }

  // Very light email shape check; full validation is handled by Mongoose.
  if (!/^\S+@\S+\.\S+$/.test(String(email))) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const allowedRoles = ["user", "host", "admin"];
  const finalRole = allowedRoles.includes(role) ? role : "user";

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({
      email: normalizedEmail,
      password,
      name,
      usernumber,
      role: finalRole,
    });

    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email and password are required" });
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  try {
    const user = await User.findOne({ email: normalizedEmail });

    // Return a generic 401 whether the email is unknown or the password is
    // wrong — this prevents attackers from probing which emails are registered.
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.cookie("token", token, cookieOptions).json(safeUser(user));
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/profile", async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "Token is not provided" });
  }

  try {
    const userdata = jwt.verify(token, process.env.JWT_SECRET);
    if (!userdata.id) {
      return res
        .status(400)
        .json({ message: "Invalid token: User ID not found" });
    }

    const user = await User.findOne({ _id: userdata.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(safeUser(user));
  } catch (err) {
    // Any error from jwt.verify (expired, malformed, bad signature) should
    // surface as 401 Unauthorized, not 500.
    if (
      err.name === "JsonWebTokenError" ||
      err.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error("Error verifying token or querying user:", err);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.get("/logout", (req, res) => {
  return res
    .clearCookie("token", cookieOptions)
    .json({ message: "Logged out successfully" });
});

module.exports = router;
