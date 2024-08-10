// config/index.js

const { allowedOrigins, initializeCors } = require("./cors/cors.config");
const { connectToDatabase } = require("./databases/mongoose.config");
const { initializeHelmet } = require("./helmet/helmet.config");
const {
  initializeMonitoring,
  getMetrics,
} = require("./monitorings/prometheus.config");
const { initializeMulter } = require("./multer/multer.config");
const { nodemailerTransporter } = require("./emails/nodemailer.config");
const { loadEnv } = require("./env/env.config");

module.exports = {
  allowedOrigins,
  initializeCors,
  connectToDatabase,
  nodemailerTransporter,
  initializeHelmet,
  initializeMonitoring,
  getMetrics,
  initializeMulter,
  loadEnv,
};
