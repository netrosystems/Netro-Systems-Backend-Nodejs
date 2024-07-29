// models/index.js

const Admin = require("./Admin/AdminModel");
const GroupChatMessage = require("./Chat/GroupChatModel");
const IndividualChatMessage = require("./Chat/IndividualChatModel");
const Group = require("./Group/GroupModel");
const Notification = require("./Notification/NotificationModel");
const OTP = require("./Otp/OtpModel");
const User = require("./User/UserModel");

module.exports = {
  Admin,
  GroupChatMessage,
  IndividualChatMessage,
  Group,
  Notification,
  OTP,
  User,
};
