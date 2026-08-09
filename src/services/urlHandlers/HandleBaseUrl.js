// serverBaseUrlGetter.js

/**
 * Gets the server's base URL based on the request object.
 * @param {Express.Request} req - The Express request object.
 * @returns {string} The server's base URL.
 */

const getServerBaseUrl = (req) => {
  // Construct the server base URL using request protocol or fallback to http
  const rawProto = req.get("x-forwarded-proto") || req.protocol || "http";
  const protocol = rawProto.split(",")[0].trim();
  const host = req.get("host") || "localhost:5000";
  const serverBaseUrl = `${protocol}://${host}`;
  return serverBaseUrl;
};

module.exports = { getServerBaseUrl };
