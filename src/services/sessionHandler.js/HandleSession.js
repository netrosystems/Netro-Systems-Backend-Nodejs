const jwt = require("jsonwebtoken");

const TEMP_SESSION_SECRET = "121212"; // Use a secure secret in production

function createTempSession(adminId) {
  // Create a JWT with a short expiration time (e.g., 5 minutes)
  return jwt.sign({ adminId }, TEMP_SESSION_SECRET, { expiresIn: "5m" });
}

function getAdminIdFromTempSession(tempSession) {
  try {
    const decoded = jwt.verify(tempSession, TEMP_SESSION_SECRET);
    return decoded.adminId;
  } catch (err) {
    return null; // Invalid or expired session
  }
}

module.exports = {
  createTempSession,
  getAdminIdFromTempSession,
};
