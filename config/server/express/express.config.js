// config/server/express/express.config.js

const express = require("express");

const {
  initializeCors,
  initializeMonitoring,
  initializeHelmet,
  initializeMulter,
} = require("../../../config");

const { globalErrorHandler } = require("../../../src/services");
const { MainRouter } = require("../../../src/routes");

const initializeExpress = () => {
  // Initialize Express app
  const app = express();


  // Middleware for parsing JSON and URL-encoded bodies with 50mb limits
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Middleware to collect request duration
  app.use(initializeMonitoring);

  // Initialize helmet
  initializeHelmet(app);

  // Initialize CORS
  initializeCors(app);

  // Initialize Multer
  initializeMulter(app);

  // Middleware for routing
  app.use(MainRouter);

  // Middleware for Global Error Handling
  app.use(globalErrorHandler);

  // Return the configured app
  return app;
};

module.exports = { initializeExpress };
