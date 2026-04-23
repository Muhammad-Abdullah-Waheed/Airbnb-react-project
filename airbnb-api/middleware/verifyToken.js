const jwt = require("jsonwebtoken");

// Reads the JWT from either the httpOnly cookie (preferred) or the Authorization
// header (fallback for legacy clients), verifies it, and attaches the decoded
// payload to req.user. Fails with 401 if missing/invalid/expired.
const verifyToken = (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const headerToken = req.header("Authorization")?.split(" ")[1];
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
