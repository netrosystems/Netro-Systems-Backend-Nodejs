// middlewares/index.js

const { asyncHandler } = require("./AsyncHandler");
const {
  authorizeRequest,
  authorizeAdmin,
  isUserAccessingOwnData,
} = require("./AuthorizeRequest");
const { loginRateLimiter, registerRateLimiter } = require("./RateLimiters");

module.exports = {
  asyncHandler,
  authorizeRequest,
  authorizeAdmin,
  isUserAccessingOwnData,
  loginRateLimiter,
  registerRateLimiter,
};
