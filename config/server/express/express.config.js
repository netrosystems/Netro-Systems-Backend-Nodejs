const express = require("express");

const {
  initializeCors,
  initializeMonitoring,
  initializeHelmet,
  initializeMulter,
} = require("../../../config");

const { globalErrorHandler } = require("../../../src/services");
const { MainRouter } = require("../../../src/routes");

const configureApp = (server) => {
  // Initialize Express app
  const app = express();

  // Middleware for parsing URL-encoded bodies
  app.use(express.urlencoded({ extended: true }));

  // Middleware to collect request duration
  app.use(initializeMonitoring);

  // Initialize helmet
  initializeHelmet(app);

  // Initialize CORS
  initializeCors(app);

  // Initialize Multer
  initializeMulter(app);

  // Routes
  app.use(MainRouter);

  // Global Error Handling Middleware
  app.use(globalErrorHandler);

  return app;
};

module.exports = { configureApp };
