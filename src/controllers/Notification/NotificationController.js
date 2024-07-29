//controllers/Notification/NotificationController.js
const { asyncHandler } = require("../../middlewares");
const Notification = require("../../models");
const { logger, CustomError, sendResponse } = require("../../services");

const getAllNotificationsByUser = async (req, res) => {
  //get userId from auth middleware
  const userId = req?.auth?._id;
  if (!userId) {
    throw new CustomError(401, "Unauthorized");
  }

  //perform query on database
  const notifications = await Notification.getNotificationsByUserId(userId);
  logger.log("info", `Found ${notifications?.length} notifications`);
  return sendResponse(res, 200, "Fetched all notifications", notifications);
};

module.exports = {
  getAllNotificationsByUser: asyncHandler(getAllNotificationsByUser),
};
