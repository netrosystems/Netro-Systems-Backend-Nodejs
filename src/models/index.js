// models/index.js

const Admin = require("./Admin/AdminModel");
const Group = require("./Group/GroupModel");
const OTP = require("./Otp/OtpModel");
const User = require("./User/UserModel");
const Blog = require("./Content/Blog/BlogModel");
const BlogCategory = require("./Content/Blog/BlogCategoryModel");
const Service = require("./Content/Service/ServiceModel");
const Portfolio = require("./Content/Portfolio/PortfolioModel");
const PortfolioCategory = require("./Content/Portfolio/PortfolioCategoryModel");

module.exports = {
  Admin,
  Group,
  OTP,
  User,
  Blog,
  BlogCategory,
  Service,
  Portfolio,
  PortfolioCategory,
};
