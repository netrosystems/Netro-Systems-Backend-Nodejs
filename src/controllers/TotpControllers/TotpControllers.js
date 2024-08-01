const {
  generateOTP,
  validateToken,
} = require("../../services/totp/HandleOTPAuth");

const generateTOTPAndQRCode = async (req, res) => {
  try {
    // Generate issuer and label server-side
    const issuer = "Netro"; // Replace with your app's name
    const label = "AbdullahWins"; // Replace with a specific label

    console.log("Generating TOTP for issuer:", issuer, "and label:", label);

    // Generate OTP with secret, TOTP object, and QR code
    const { secret, qrCode, totp } = await generateOTP(issuer, label);

    return res.json({
      secret, // Provides the secret in Base32 format
      uri: totp.toString(), // URI for the TOTP
      qrCode, // Base64 encoded QR code
    });
  } catch (err) {
    console.error("Error generating TOTP and QR code:", err);
    res.status(500).send("Internal Server Error");
  }
};

const verifyTOTPToken = async (req, res) => {
  try {
    const data = req.body.data ? JSON.parse(req.body.data) : {};
    const { token, secret } = data;

    if (!token || !secret) {
      console.log("Missing token or secret in request data.");
      return res.status(400).send("Token and secret are required.");
    }

    const isValid = validateToken(secret, token);

    if (isValid) {
      return res.send("Token is valid");
    } else {
      return res.send("Token is invalid");
    }
  } catch (err) {
    console.error("Error verifying TOTP token:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  generateTOTPAndQRCode,
  verifyTOTPToken,
};
