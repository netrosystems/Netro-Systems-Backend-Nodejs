//router/Nofication/NotificationRoutes.js

const NotificationRouter = require("express").Router();
const { authorizeRequest } = require("../../middlewares");
const {
  getAllNotificationsByUser,
} = require("../../controllers/Notification/NotificationController");

//routes
NotificationRouter.get(
  "/get-own-notifications",
  authorizeRequest,
  getAllNotificationsByUser
);

//export router
module.exports = NotificationRouter;
