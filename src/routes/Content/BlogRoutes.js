const BlogRouter = require("express").Router();

const {
  getAllBlogs,
  getBlogsForLandingPage,
  getOneBlog,
  getBlogByTitle,
  getBlogBySlug,
  increaseBlogViewCount,
  getMostRecentBlogs,
  getBlogsByCategory,
  getFeaturedBlogs,
  createOneBlog,
  updateOneBlog,
  toggleFeaturedStatus,
  deleteOneBlog,
  getBlogBySlug,
} = require("../../controllers/Content/Blog/BlogController");
const { authorizeAdmin } = require("../../middlewares");

BlogRouter.get("/all", getAllBlogs);
BlogRouter.get("/landing", getBlogsForLandingPage);
BlogRouter.get("/find/:id", getOneBlog);
BlogRouter.get("/find-by-title/*", getBlogByTitle);
<<<<<<< HEAD
BlogRouter.get("/find-by-slug/:slug", getBlogBySlug);
=======
BlogRouter.get("/find-by-slug/*", getBlogBySlug);
BlogRouter.get("/increase-view-count/:id", increaseBlogViewCount);
>>>>>>> a7a26ba840ff22c4f1da2f7ddc6bf8a88ec3543f
BlogRouter.get("/recent", getMostRecentBlogs);
BlogRouter.get("/category/:category", getBlogsByCategory);
BlogRouter.get("/featured", getFeaturedBlogs);
BlogRouter.post("/create", authorizeAdmin, createOneBlog);
BlogRouter.patch("/update/:id", authorizeAdmin, updateOneBlog);
BlogRouter.patch("/toggle-featured/:id", authorizeAdmin, toggleFeaturedStatus);
BlogRouter.delete("/delete/:id", authorizeAdmin, deleteOneBlog);

module.exports = BlogRouter;
