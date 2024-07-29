//notifications/index.js

const {
  handleFriendRequestNotification,
  handleAcceptedFriendRequestNotification,
  handleGroupJoinNotification,
  handleGroupLeaveNotification,
} = require("./NotificationModule");

module.exports = {
  handleFriendRequestNotification,
  handleAcceptedFriendRequestNotification,
  handleGroupJoinNotification,
  handleGroupLeaveNotification,
};
