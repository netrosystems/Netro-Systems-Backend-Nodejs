// serverBaseUrlGetter.js

/**
 * Gets the server's base URL based on the request object.
 * @param {Express.Request} req - The Express request object.
 * @returns {string} The server's base URL.
 */

const getServerBaseUrl = (req) => {
  // Construct the server base URL
  const serverBaseUrl = `https://${req.get("host")}`;
  return serverBaseUrl;
};

module.exports = { getServerBaseUrl };
