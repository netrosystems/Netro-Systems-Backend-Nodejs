const jwt = require("jsonwebtoken");

const tempSessionSecret = process.env.TEMP_SESSION_SECRET || null;
const tempSessionExpiresIn = process.env.TEMP_SESSION_EXPIRES_IN || "5m";

function createTempSession(adminId) {
  if (!tempSessionSecret) {
    throw new Error("Temporary session secret is not set");
  }
  // Create a JWT with a short expiration time (e.g., 5 minutes)
  return jwt.sign({ adminId }, tempSessionSecret, {
    expiresIn: tempSessionExpiresIn,
  });
}

function getAdminIdFromTempSession(tempSession) {
  try {
    const decoded = jwt.verify(tempSession, tempSessionSecret);
    return decoded.adminId;
  } catch (err) {
    return null; // Invalid or expired session
  }
}

module.exports = {
  createTempSession,
  getAdminIdFromTempSession,
};
