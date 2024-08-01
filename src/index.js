//src/index.js

const path = require("path");

// Import the environment variables
const { loadEnv } = require("../config/env/env.config");

// Load the environment variables before importing the server kickstart function
loadEnv();

// Import the server kickstart function after loading the dotenv
const { kickstartServer } = require("../config/server");

// Start the server
kickstartServer();

