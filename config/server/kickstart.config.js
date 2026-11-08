// config/server/kickstart.config.js

const { logger, startScheduledBlogPublisher } = require("../../src/services");
const { connectToDatabase } = require("../../config");
const { initializeExpress } = require("./express/express.config");
const { startInquiryNotifications } = require("../../src/services/emailHandlers/SendInquiryNotifications");
const port = process.env.SERVER_PORT || 5005;

//starting the server
async function kickstartServer() {
  try {
    // Connect to MongoDB using Mongoose
    await connectToDatabase();

    // Initialize the Express app
    const expressApp = initializeExpress();

    // Start the http server
    expressApp.listen(port, () => {
      logger.log("info", `Server is running on port: ${port}`);
      startScheduledBlogPublisher();
      startInquiryNotifications();
    });
  } catch (error) {
    // Log the error and exit the process
    logger.log("error", "Error starting the server: ", error);

    // Gracefully exit the process
    process.exit(1);
  }
}

module.exports = { kickstartServer };
