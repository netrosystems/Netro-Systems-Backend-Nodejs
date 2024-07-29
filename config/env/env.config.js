// config/env/env.config.js

const dotenv = require("dotenv");
const path = require("path");

const loadEnv = () => {
  return dotenv.config({ path: path.join(process.cwd(), ".env") });
};

module.exports = { loadEnv };
