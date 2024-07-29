// config/server/index.js

const { kickstartServer } = require("./kickstart.config");
const { configureApp } = require("./express/express.config");

module.exports = {
  kickstartServer,
  configureApp,
};
