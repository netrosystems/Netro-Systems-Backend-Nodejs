// helpers/responseHelper.js

const { logger } = require("../logHandlers/HandleWinston");

const sendResponse = (res, status, message, data = null) => {
  logger.log({
    level: "info",
    message: `Message: ${message}
    Response Data: ${JSON.stringify(data, null, 2)}`,
  });
  return res.status(status).json({
    status,
    message,
    data,
  });
};

const sendError = (res, status, message) => {
  return res.status(status).json({
    status,
    message,
  });
};

// Error handler for async functions
class CustomError extends Error {
  constructor(statusCode = 500, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler
const globalErrorHandler = (error, req, res, next) => {
  const statusCode = error?.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === "development";

  // Prepare the log message
  const logMessage = {
    message: error?.message || "An unexpected error occurred",
    statusCode,
    path: req?.path || "Unknown path",
    ip: req?.ip || "Unknown IP",
    // stack: isDevelopment ? error?.stack : undefined,
  };

  // Log the error using winston
  logger.error(`Error occurred: ${JSON.stringify(logMessage, null, 2)}`);

  // Send error response
  sendError(res, statusCode, error?.message);
};

module.exports = {
  sendResponse,
  sendError,
  CustomError,
  globalErrorHandler,
};
