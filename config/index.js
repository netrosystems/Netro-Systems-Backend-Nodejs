// config/index.js

const {
  allowedOrigins,
  initializeCors,
} = require("../config/cors/cors.config");
const { connectToDatabase } = require("../config/databases/mongoose.config");
const { nodemailerTransporter } = require("../config/emails/nodemailer.config");
const { initializeHelmet } = require("../config/helmet/helmet.config");
const {
  initializeMonitoring,
  getMetrics,
} = require("../config/monitorings/prometheus.config");
const { initializeMulter } = require("../config/multer/multer.config");
const { initializeEnv } = require("../config/env/env.config");

module.exports = {
  allowedOrigins,
  initializeCors,
  connectToDatabase,
  nodemailerTransporter,
  initializeHelmet,
  initializeMonitoring,
  getMetrics,
  initializeMulter,
  initializeEnv,
};
