const BlogCategoryRouter = require("express").Router();

const {
  getAllCategories,
  getOneCategory,
  createOneCategory,
  updateOneCategory,
  deleteOneCategory,
} = require("../../controllers/Content/Blog/BlogCategoryController");
const { authorizeAdmin } = require("../../middlewares");

BlogCategoryRouter.get("/all", getAllCategories);
BlogCategoryRouter.get("/find/:id", getOneCategory);
BlogCategoryRouter.post("/create", authorizeAdmin, createOneCategory);
BlogCategoryRouter.patch("/update/:id", authorizeAdmin, updateOneCategory);
BlogCategoryRouter.delete("/delete/:id", authorizeAdmin, deleteOneCategory);

module.exports = BlogCategoryRouter;
