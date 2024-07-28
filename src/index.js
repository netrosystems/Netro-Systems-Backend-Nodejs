// Imports
const path = require("path");
const dotenv = require("dotenv");
const { kickstartServer } = require("../config/server");
// Load environment variables from .env file before other imports
dotenv.config({ path: path.join(process.cwd(), ".env") });
// Imports

// Start the server
kickstartServer();
