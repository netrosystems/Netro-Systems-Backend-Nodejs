// services/index.js

const {
  sendPasswordResetOTPEmail,
  sendEmail,
} = require("./emailHandlers/HandleEmail");
const {
  hashPassword,
  comparePasswords,
} = require("./encryptionHandlers/HandleBcrypt");
const { handleFileDelete } = require("./fileHandlers/HandleFileDelete");
const { handleFileUpload } = require("./fileHandlers/HandleFileUpload");
const {
  compressImage,
} = require("./fileModificationHandlers/HandleCompression");
const { logger } = require("./logHandlers/HandleWinston");
const {
  createOTP,
  saveOTP,
  sendOTP,
  matchOTP,
  validateOTP,
} = require("./otpHandlers/HandleOTP");
const {
  sendResponse,
  sendError,
  CustomError,
  globalErrorHandler,
} = require("./responseHandlers/HandleResponse");
const { generateToken, verifyToken } = require("./tokenHandlers/HandleJwt");
const { getServerBaseUrl } = require("./urlHandlers/HandleBaseUrl");
const { ObjectIdChecker } = require("./validationHandlers/ObjectIdChecker");

module.exports = {
  sendPasswordResetOTPEmail,
  sendEmail,
  hashPassword,
  comparePasswords,
  handleFileDelete,
  handleFileUpload,
  compressImage,
  logger,
  createOTP,
  saveOTP,
  sendOTP,
  matchOTP,
  validateOTP,
  sendResponse,
  sendError,
  CustomError,
  globalErrorHandler,
  generateToken,
  verifyToken,
  getServerBaseUrl,
  ObjectIdChecker,
};
