// Imports
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env file before other imports
dotenv.config({ path: path.join(process.cwd(), ".env") });

//import the server kickstart function after loading the dotenv
const { kickstartServer } = require("../config/server");
// Imports

// Start the server
kickstartServer();
