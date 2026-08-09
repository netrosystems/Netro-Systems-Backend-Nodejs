// config/databases/mongoose.config.js

const mongoose = require("mongoose");
// const dns = require("dns");
const { logger } = require("../../src/services");

const connectToDatabase = async () => {
  // Custom DNS resolution to ensure MongoDB Atlas SRV records resolve cleanly across ISPs and environments
  // try {
  //   dns.setServers(["8.8.8.8", "1.1.1.1"]);
  // } catch (err) {
  //   // Ignore error if custom DNS resolution is unsupported in certain environments
  // }

  const uri = `${process.env.MONGOOSE_URI}/${process.env.DATABASE_NAME}`;

  try {
    await mongoose.connect(uri, {
      // Specify the write concern mode
      writeConcern: { w: "majority" },
    });
    logger.log("info", "Connected to MongoDB using Mongoose!");
  } catch (error) {
    logger.log(
      "error",
      `Error connecting to MongoDB using Mongoose:
    ${error?.message}`
    );
    process.exit(1);
  }
};

module.exports = { connectToDatabase };
