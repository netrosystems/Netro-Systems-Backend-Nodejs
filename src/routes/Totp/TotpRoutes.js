const faRouter = require("express").Router();

const {
  generateTOTPAndQRCode,
  verifyTOTPToken,
} = require("../../controllers/TotpControllers/TotpControllers");

faRouter.get("/generate", generateTOTPAndQRCode);
faRouter.post("/verify", verifyTOTPToken);

module.exports = faRouter;
