//router/Admin/AdminRoutes.js

const AdminRouter = require("express").Router();
const {
  authorizeAdmin,
  loginRateLimiter,
  registerRateLimiter,
} = require("../../middlewares");

//importing controllers
const {
  getOneAdmin,
  getAllAdmins,
  loginAdmin,
  verify2FA,
  initiate2FASetup,
  verify2FASetup,
  registerAdmin,
  updateAdminById,
  sendPasswordResetOTP,
  validatePasswordResetOTP,
  updateAdminPasswordByOTP,
  updateAdminPasswordByOldPassword,
  deleteAdminById,
} = require("../../controllers/Admin/AdminController");

//routes
AdminRouter.get("/find/:id", authorizeAdmin, getOneAdmin);
AdminRouter.get("/all", authorizeAdmin, getAllAdmins);
AdminRouter.post("/register", registerRateLimiter, registerAdmin);
AdminRouter.post("/login", loginRateLimiter, loginAdmin);
AdminRouter.post("/2fa", verify2FA);
AdminRouter.post("/2fa/setup/:id", initiate2FASetup);
AdminRouter.post("/2fa/verify", verify2FASetup);
AdminRouter.post("/send-otp", sendPasswordResetOTP);
AdminRouter.post("/validate-otp", validatePasswordResetOTP);
AdminRouter.patch("/reset", updateAdminPasswordByOTP);
AdminRouter.patch("/update/:id", authorizeAdmin, updateAdminById);
AdminRouter.patch("/resetpassword/:email", updateAdminPasswordByOldPassword);
AdminRouter.delete("/delete/:id", authorizeAdmin, deleteAdminById);

//export router
module.exports = AdminRouter;
