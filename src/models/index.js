// models/index.js

const Admin = require("./Admin/AdminModel");
const Group = require("./Group/GroupModel");
const OTP = require("./Otp/OtpModel");
const User = require("./User/UserModel");
const Blog = require("./Content/Blog/BlogModel");

module.exports = {
  Admin,
  Group,
  OTP,
  User,
  Blog,
};
