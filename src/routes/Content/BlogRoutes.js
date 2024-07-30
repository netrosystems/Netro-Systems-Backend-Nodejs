const BlogRouter = require("express").Router();

const {
  getAllBlogs,
  getOneBlog,
  createOneBlog,
  updateOneBlog,
  deleteOneBlog,
} = require("../../controllers/Content/Blog/BlogController");
const { authorizeAdmin } = require("../../middlewares");

BlogRouter.get("/all", getAllBlogs);
BlogRouter.get("/find/:id", getOneBlog);
BlogRouter.post("/create", authorizeAdmin, createOneBlog);
BlogRouter.patch("/update/:id", authorizeAdmin, updateOneBlog);
BlogRouter.delete("/delete/:id", authorizeAdmin, deleteOneBlog);

module.exports = BlogRouter;
