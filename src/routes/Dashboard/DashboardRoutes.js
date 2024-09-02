const BlogCategoryRouter = require("express").Router();

const {
  getDashboard,
} = require("../../controllers/Dashboard/DashboardController");
const { authorizeAdmin } = require("../../middlewares");

BlogCategoryRouter.get("/", authorizeAdmin, getDashboard);

module.exports = BlogCategoryRouter;
