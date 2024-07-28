// server.js

const { kickstartServer } = require("./kickstart.config");
const { httpServer } = require("./http/http.config");
const { configureApp } = require("./express/express.config");
const { initializeSocket } = require("./socket/socket.config");
const { setIoInstance, getIoInstance } = require("./socket/socket");

module.exports = {
  kickstartServer,
  httpServer,
  configureApp,
  initializeSocket,
  setIoInstance,
  getIoInstance,
};
