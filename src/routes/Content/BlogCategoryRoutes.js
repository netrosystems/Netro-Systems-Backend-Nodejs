const BlogRouter = require("express").Router();

const {
  getAllCategories,
  getOneCategory,
  createOneCategory,
  updateOneCategory,
  deleteOneCategory,
} = require("../../controllers/Content/Blog/BlogCategoryController");
const { authorizeAdmin } = require("../../middlewares");

BlogRouter.get("/all", getAllCategories);
BlogRouter.get("/find/:id", getOneCategory);
BlogRouter.post("/create", authorizeAdmin, createOneCategory);
BlogRouter.patch("/update/:id", authorizeAdmin, updateOneCategory);
BlogRouter.delete("/delete/:id", authorizeAdmin, deleteOneCategory);

module.exports = BlogRouter;
