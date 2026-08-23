const BlogRouter = require("express").Router();

const {
  getAllBlogs,
  getAllBlogsForAdmin,
  getPublishedBlogsForAdmin,
  getBlogsForLandingPage,
  getOneBlog,
  getBlogByTitle,
  getBlogBySlug,
  getBlogBySlugSingleParam,
  getRelatedBlogs,
  increaseBlogViewCount,
  getMostRecentBlogs,
  getBlogsByCategory,
  getFeaturedBlogs,
  getScheduledBlogs,
  getDraftBlogs,
  createOneBlog,
  updateOneBlog,
  toggleFeaturedStatus,
  deleteOneBlog,
} = require("../../controllers/Content/Blog/BlogController");
const { authorizeAdmin } = require("../../middlewares");

BlogRouter.get("/all", getAllBlogs);
BlogRouter.get("/admin/all", authorizeAdmin, getAllBlogsForAdmin);
BlogRouter.get("/admin/published", authorizeAdmin, getPublishedBlogsForAdmin);
BlogRouter.get("/landing", getBlogsForLandingPage);
BlogRouter.get("/scheduled", authorizeAdmin, getScheduledBlogs);
BlogRouter.get("/drafts", authorizeAdmin, getDraftBlogs);
BlogRouter.get("/related/:slug", getRelatedBlogs);
BlogRouter.get("/find/:id", getOneBlog);
BlogRouter.get("/find-by-title/*", getBlogByTitle);
BlogRouter.get("/find-by-slug/:slug", getBlogBySlugSingleParam);
BlogRouter.get("/find-by-slug/*", getBlogBySlug);
BlogRouter.get("/increase-view-count/:id", increaseBlogViewCount);
BlogRouter.get("/recent", getMostRecentBlogs);
BlogRouter.get("/category/:category", getBlogsByCategory);
BlogRouter.get("/featured", getFeaturedBlogs);
BlogRouter.post("/create", authorizeAdmin, createOneBlog);
BlogRouter.patch("/update/:id", authorizeAdmin, updateOneBlog);
BlogRouter.patch("/toggle-featured/:id", authorizeAdmin, toggleFeaturedStatus);
BlogRouter.delete("/delete/:id", authorizeAdmin, deleteOneBlog);

module.exports = BlogRouter;
