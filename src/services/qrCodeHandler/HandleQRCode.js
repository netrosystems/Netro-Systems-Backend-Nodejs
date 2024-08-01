const QRCode = require("qrcode");
const path = require("path");

/**
 * Generates a QR code for the given data.
 * @param {string} data - The data to encode in the QR code.
 * @returns {Promise<string>} - A promise that resolves to the QR code data URL.
 */
const generateQRCode = async (data) => {
  try {
    //create qr code
    const qrCodeUrl = await QRCode.toDataURL(data);
    return qrCodeUrl;
  } catch (error) {
    throw new Error("Failed to generate QR code: " + error.message);
  }
};

// const generateQRCode = async (data, baseUrl, filename) => {
//   try {
//     //save qr code to file
//     const folderName = "qr-codes";
//     const filePath = path.join(process.cwd(), "uploads", folderName);
//     await QRCode.toFile(filePath, data);

//     const fileUrl = `${baseUrl}/uploads/${folderName}/${filename}`;

//     return fileUrl;
//   } catch (error) {
//     throw new Error("Failed to generate QR code: " + error.message);
//   }
// };

module.exports = { generateQRCode };
