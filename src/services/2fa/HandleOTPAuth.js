const OTPAuth = require("otpauth");
const QRCode = require("qrcode");

// Generate a cryptographically secure random secret in Base32
const generateSecret = () => {
  const secret = new OTPAuth.Secret({ size: 20 });
  console.log("Generated Secret (Base32):", secret.base32);
  return secret;
};

// Create a new TOTP object with the provided secret
const generateTOTP = (secret) => {
  const totp = new OTPAuth.TOTP({
    issuer: "Netro", // Replace with your issuer
    label: "AbdullahWins", // Replace with your label
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: secret.base32,
  });

  console.log("Generated TOTP object:", totp);
  return totp;
};

// Generate a QR code for the key URI
const generateQRCode = async (totp) => {
  const uri = totp.toString(); // Use toString() to get the URI
  console.log("TOTP URI for QR Code:", uri);
  try {
    const qrCode = await QRCode.toDataURL(uri);
    console.log("Generated QR Code:", qrCode);
    return qrCode;
  } catch (err) {
    console.error("Error generating QR code:", err);
    throw new Error("QR Code generation failed");
  }
};

// Validate the token with a time window
const validateToken = (secret, token) => {
  console.log("secret:", secret);
  console.log("token:", token);

  // Create a new TOTP object with the provided secret
  const totp = new OTPAuth.TOTP({
    issuer: "Netro",
    label: "AbdullahWins",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: secret, // Use the secret directly
  });

  const validation = totp.validate({ token, window: 2 });
  console.log("Validation result:", validation);

  return validation !== null; // Returns true if valid, false otherwise
};
// Create an OTPAuth.Secret object from a Base32 secret string
const createSecretObj = (base32Secret) => {
  console.log("Creating Secret object from Base32 secret:", base32Secret);
  const secretObj = new OTPAuth.Secret(base32Secret);
  console.log("Created Secret object:", secretObj);
  return secretObj;
};

// Generate OTP, including secret, TOTP object, and QR code
const generateOTP = async (issuer, label) => {
  console.log("Generating OTP for issuer:", issuer, "and label:", label);
  const secret = generateSecret();
  const totp = generateTOTP(secret);
  const qrCode = await generateQRCode(totp);

  return {
    secret: secret.base32,
    qrCode,
    totp,
  };
};

module.exports = {
  generateOTP,
  generateTOTP,
  validateToken,
  createSecretObj,
};
