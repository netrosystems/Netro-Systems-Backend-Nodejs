const BlogRouter = require("express").Router();

const {
  getAllBlogs,
  getOneBlog,
  getBlogByTitle,
  getMostRecentBlogs,
  getBlogsByCategory,
  getFeaturedBlogs,
  createOneBlog,
  updateOneBlog,
  toggleFeaturedStatus,
  deleteOneBlog,
} = require("../../controllers/Content/Blog/BlogController");
const { authorizeAdmin } = require("../../middlewares");

BlogRouter.get("/all", getAllBlogs);
BlogRouter.get("/find/:id", getOneBlog);
BlogRouter.get("/find-by-title/:title", getBlogByTitle);
BlogRouter.get("/recent", getMostRecentBlogs);
BlogRouter.get("/category/:category", getBlogsByCategory);
BlogRouter.get("/featured", getFeaturedBlogs);
BlogRouter.post("/create", authorizeAdmin, createOneBlog);
BlogRouter.patch("/update/:id", authorizeAdmin, updateOneBlog);
BlogRouter.patch("/toggle-featured/:id", authorizeAdmin, toggleFeaturedStatus);
BlogRouter.delete("/delete/:id", authorizeAdmin, deleteOneBlog);

module.exports = BlogRouter;
