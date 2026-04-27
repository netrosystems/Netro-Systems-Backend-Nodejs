// controllers/Admin/AdminController.js

const { asyncHandler } = require("../../middlewares");
const { Admin } = require("../../models");
const {
  ObjectIdChecker,
  handleFileUpload,
  validateOTP,
  sendOTP,
  sendResponse,
  logger,
  hashPassword,
  handleFileDelete,
} = require("../../services");

// Login Admin using mongoose
const loginAdmin = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const { email, password } = data;
  const result = await Admin.login({ email, password });
  logger.log("info", `Admin logged in: ${email}`);
  return sendResponse(res, 200, "Admin logged in successfully", result);
};

// Verify 2FA using mongoose
const verify2FA = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const { tempSession, token } = data;
  const result = await Admin.verify2FA({ tempSession, token });
  logger.log("info", `2FA verified successfully`);
  return sendResponse(res, 200, "2FA verified successfully", result);
};

// initiate2FASetup
const initiate2FASetup = async (req, res) => {
  const adminId = req?.params?.id;
  const result = await Admin.initiate2FASetup({ adminId });
  logger.log("info", `2FA setup initiated successfully`);
  return sendResponse(res, 200, "2FA setup initiated successfully", result);
};

// verify2FASetup
const verify2FASetup = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const { adminId, token } = data;
  const result = await Admin.verify2FASetup({ adminId, token });
  logger.log("info", `2FA setup verified successfully`);
  return sendResponse(res, 200, "2FA setup verified successfully", result);
};

// Register Admin using mongoose
const registerAdmin = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const { fullName, email, password } = data;
  if (!fullName || !email || !password) {
    return sendResponse(res, 400, "Missing required fields");
  }
  const result = await Admin.register({ fullName, email, password });
  logger.log("info", `Admin registered: ${email}`);
  return sendResponse(res, 201, "Admin registered successfully", result);
};

// Get all Admins using mongoose
const getAllAdmins = async (req, res) => {
  const admins = await Admin.getAllAdmins();
  logger.log("info", `Found ${admins?.length} admins`);
  return sendResponse(res, 200, "Admins retrieved successfully", admins);
};

// Get Admin by id using mongoose
const getOneAdmin = async (req, res) => {
  const adminId = req?.params?.id;

  if (!ObjectIdChecker(adminId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  const admin = await Admin.getOneAdmin({ id: adminId });
  logger.log("info", JSON.stringify(admin, null, 2));
  return sendResponse(res, 200, "Admin retrieved successfully", admin);
};

// Update Admin by id using mongoose
const updateAdminById = async (req, res) => {
  const id = req?.params?.id;

  if (!ObjectIdChecker(id)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  const { files } = req;
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const { password, ...additionalData } = data;
  const folderName = "admins";
  let updatedData = {};

  if (files?.single) {
    const fileUrls = await handleFileUpload({
      req,
      files: files?.single,
      folderName,
    });
    const profileImage = fileUrls[0];
    updatedData = { ...updatedData, profileImage };

    const existingAdmin = await Admin.getOneAdmin({ id });
    if (existingAdmin?.profileImage) {
      await handleFileDelete(existingAdmin?.profileImage);
    }
  }

  if (password) {
    const hashedPassword = await hashPassword(password);
    updatedData = { ...updatedData, password: hashedPassword };
  }

  if (Object.keys(additionalData).length > 0) {
    updatedData = { ...updatedData, ...additionalData };
  }

  logger.log("info", JSON.stringify(updatedData, null, 2));

  const updatedAdmin = await Admin.updateAdminById({ id, updatedData });

  logger.log("info", "Admin updated successfully");

  return sendResponse(res, 200, "Admin updated successfully", updatedAdmin);
};

// Send password reset OTP
const sendPasswordResetOTP = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const { email } = data;
  //check if email exists
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return sendResponse(res, 404, "Admin not found");
  }
  const result = await sendOTP({ email });
  if (result?.error) {
    logger.log("error", result?.error);
    return sendResponse(res, 401, result?.error);
  } else {
    logger.log("info", result?.message);
    return sendResponse(res, 200, result?.message);
  }
};

const validatePasswordResetOTP = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const { otp, email } = data;
  if (!otp || !email) {
    return sendResponse(res, 400, "All fields are required");
  }
  //check if email exists
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return sendResponse(res, 404, "Admin not found");
  }
  const result = await validateOTP({ email, otp });
  if (result?.error) {
    logger.log("error", result?.error);
    return sendResponse(res, 401, result?.error);
  } else {
    logger.log("info", result?.message);
    return sendResponse(res, 200, result?.message);
  }
};

// Update admin password by OTP
const updateAdminPasswordByOTP = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const { otp, email, newPassword } = data;

  const updatedAdmin = await Admin.updatePasswordByOTP({
    email,
    otp,
    newPassword,
  });
  logger.log(
    "info",
    `Password updated successfully for: ${updatedAdmin?.email}`
  );
  return sendResponse(res, 200, "Password updated successfully", updatedAdmin);
};

// Update admin password by old password
const updateAdminPasswordByOldPassword = async (req, res) => {
  const email = req?.params?.email;
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const { oldPassword, newPassword } = data;

  const updatedAdmin = await Admin.updatePasswordByEmail({
    email,
    oldPassword,
    newPassword,
  });
  if (!updatedAdmin) {
    return sendResponse(res, 401, "Failed to update password");
  }
  if (updatedAdmin?.error) {
    return sendResponse(res, 400, updatedAdmin?.error);
  }
  logger.log("info", "Password updated successfully");
  return sendResponse(res, 200, "Password updated successfully", updatedAdmin);
};

// Delete admin by id using mongoose
const deleteAdminById = async (req, res) => {
  const id = req?.params?.id;

  if (!ObjectIdChecker(id)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  const existingAdmin = await Admin.getOneAdmin(id);
  if (existingAdmin?.profileImage) {
    await handleFileDelete(existingAdmin?.profileImage);
  }

  const deletionResult = await Admin.deleteAdminById(id);
  logger.log("info", deletionResult?.message);
  return sendResponse(res, 200, deletionResult?.message);
};

module.exports = {
  getOneAdmin: asyncHandler(getOneAdmin),
  getAllAdmins: asyncHandler(getAllAdmins),
  updateAdminById: asyncHandler(updateAdminById),
  sendPasswordResetOTP: asyncHandler(sendPasswordResetOTP),
  validatePasswordResetOTP: asyncHandler(validatePasswordResetOTP),
  updateAdminPasswordByOTP: asyncHandler(updateAdminPasswordByOTP),
  loginAdmin: asyncHandler(loginAdmin),
  verify2FA: asyncHandler(verify2FA),
  initiate2FASetup: asyncHandler(initiate2FASetup),
  verify2FASetup: asyncHandler(verify2FASetup),
  registerAdmin: asyncHandler(registerAdmin),
  updateAdminPasswordByOldPassword: asyncHandler(
    updateAdminPasswordByOldPassword
  ),
  deleteAdminById: asyncHandler(deleteAdminById),
};
