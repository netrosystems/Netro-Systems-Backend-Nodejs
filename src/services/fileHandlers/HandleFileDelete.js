const fs = require("fs").promises;
const path = require("path");
const { URL } = require("url");

const handleFileDelete = async (fileUrl) => {
  try {
    if (!fileUrl) return false;

    const parsedUrl = new URL(fileUrl);

    const decodedPathname = decodeURIComponent(parsedUrl.pathname);

    const relativePath = decodedPathname.replace(/^\/uploads\//, "");

    const filePath = path.join(
      __dirname,
      "../../../uploads",
      relativePath
    );

    await fs.access(filePath);
    await fs.unlink(filePath);

    console.log("File deleted:", filePath);
    return true;
  } catch (err) {
    console.error("Error deleting file:", err.message);
    return false;
  }
};

module.exports = { handleFileDelete };
