//src/index.js

const path = require("path");
// Load the environment variables before importing the server kickstart function
const { loadEnv } = require("../config/env/env.config");
loadEnv();

// Import the server kickstart function after loading the dotenv
const { kickstartServer } = require("../config/server");

// Start the server
kickstartServer();
