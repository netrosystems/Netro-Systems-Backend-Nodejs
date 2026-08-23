// controllers/Content/Blog/BlogController.js
const { Blog, BlogAuthor, Admin } = require("../../../models");
const { asyncHandler } = require("../../../middlewares");
const { generateUniqueSlug } = require("../../../services/slugHandlers/HandleSlug");
const {
  handleFileUpload,
  sendResponse,
  ObjectIdChecker,
  CustomError,
  handleFileDelete,
} = require("../../../services");
const { Timekoto } = require("timekoto");

const DHAKA_UTC_OFFSET_HOURS = 6;

const parseBangladeshScheduleTime = (scheduledAt) => {
  if (!scheduledAt) return null;

  if (typeof scheduledAt === "number" || /^\d+$/.test(String(scheduledAt))) {
    return Number(scheduledAt);
  }

  const match = String(scheduledAt).match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/
  );

  if (!match) {
    throw new CustomError(
      400,
      "Scheduled date must use YYYY-MM-DDTHH:mm Bangladesh time"
    );
  }

  const [, year, month, day, hour, minute] = match.map(Number);
  return Math.floor(
    Date.UTC(
      year,
      month - 1,
      day,
      hour - DHAKA_UTC_OFFSET_HOURS,
      minute,
      0,
      0
    ) / 1000
  );
};

const getBlogPublishFields = ({
  publishStatus,
  scheduledAt,
  published,
  publishedAt,
} = {}) => {
  const now = Timekoto();
  const normalizedStatus = publishStatus || (published ? "published" : "draft");
  const parsedScheduledAt = parseBangladeshScheduleTime(scheduledAt);

  if (normalizedStatus === "scheduled") {
    if (!parsedScheduledAt || parsedScheduledAt <= now) {
      throw new CustomError(400, "Scheduled date must be in the future");
    }

    return {
      publishStatus: "scheduled",
      published: true,
      scheduledAt: parsedScheduledAt,
      publishedAt: parsedScheduledAt,
    };
  }

  if (normalizedStatus === "published") {
    return {
      publishStatus: "published",
      published: true,
      scheduledAt: null,
      publishedAt: publishedAt || now,
    };
  }

  return {
    publishStatus: "draft",
    published: false,
    scheduledAt: null,
    publishedAt: publishedAt || null,
  };
};

const getValidatedAuthorId = async ({ author, fallbackAuthor }) => {
  const authorId = author || fallbackAuthor;

  if (!authorId || !ObjectIdChecker(authorId)) {
    throw new CustomError(400, "Valid author is required");
  }

  // Check if author exists in BlogAuthor or Admin
  const blogAuthorExists = await BlogAuthor.findById(authorId).select("_id");
  if (blogAuthorExists) {
    return authorId;
  }

  const adminExists = await Admin.findById(authorId).select("_id");
  if (adminExists) {
    return authorId;
  }

  throw new CustomError(404, "Selected author not found");
};

const isLivePublishedBlog = (blog = {}) => {
  const now = Timekoto();

  if (blog.publishStatus === "published" && blog.published) {
    return true;
  }

  if (
    blog.publishStatus === "scheduled" &&
    blog.published &&
    blog.scheduledAt &&
    blog.scheduledAt <= now
  ) {
    return true;
  }

  return !blog.publishStatus && blog.published !== false;
};

// Helper to safely parse incoming request data
const parseRequestData = (req) => {
  if (!req?.body) return {};
  if (req.body.data) {
    if (typeof req.body.data === "string") {
      try {
        return JSON.parse(req.body.data);
      } catch (e) {
        throw new CustomError(400, "Invalid JSON format in data field");
      }
    }
    if (typeof req.body.data === "object") {
      return req.body.data;
    }
  }
  return req.body;
};

// get all Blog using mongoose (supports query params: page, limit, category, search, tag)
const getAllBlogs = async (req, res) => {
  const blogs = await Blog.getAllBlogs(req.query);
  return res.status(200).json({
    status: 200,
    message: "Fetched all blogs",
    ...blogs,
  });
};

const getAllBlogsForAdmin = async (req, res) => {
  const blogs = await Blog.getAllBlogsForAdmin();
  return sendResponse(res, 200, "Fetched all blogs", blogs);
};

const getPublishedBlogsForAdmin = async (req, res) => {
  const blogs = await Blog.getPublishedBlogsForAdmin();
  return sendResponse(res, 200, "Fetched published blogs", blogs);
};

const getScheduledBlogs = async (req, res) => {
  const blogs = await Blog.getScheduledBlogs();
  return sendResponse(res, 200, "Fetched scheduled blogs", blogs);
};

const getDraftBlogs = async (req, res) => {
  const blogs = await Blog.getDraftBlogs();
  return sendResponse(res, 200, "Fetched draft blogs", blogs);
};

const getRelatedBlogs = async (req, res) => {
  const slug = req?.params?.slug;
  const limit = req?.query?.limit ? Number(req.query.limit) : 5;
  const blogs = await Blog.getRelatedBlogs(slug, limit);
  return sendResponse(res, 200, "Fetched related blogs", blogs);
};

// get 3 featured Blog using mongoose
const getBlogsForLandingPage = async (req, res) => {
  const blogs = await Blog.getBlogsForLandingPage();
  return sendResponse(res, 200, "Fetched featured blogs", blogs);
};

// get one Blog using mongoose
const getOneBlog = async (req, res) => {
  const blogId = req?.params?.id;
  if (!ObjectIdChecker(blogId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  const blog = await Blog.getOneBlog(blogId);
  return sendResponse(res, 200, "Blog retrieved successfully", blog);
};

// get blog by title using mongoose
const getBlogByTitle = async (req, res) => {
  const title = req.params[0];
  const blogTitle = decodeURIComponent(title);
  const blog = await Blog.getBlogByTitle(blogTitle);
  return sendResponse(res, 200, "Blog retrieved successfully", blog);
};

// get blog by slug single param
const getBlogBySlugSingleParam = async (req, res) => {
  const slug = req?.params?.slug;
  const blog = await Blog.getBlogBySlug(slug);
  return sendResponse(res, 200, "Blog retrieved successfully", blog);
};

// get blog by slug wildcard
const getBlogBySlug = async (req, res) => {
  const slug = req.params[0];
  const blogSlug = decodeURIComponent(slug);
  const blog = await Blog.getBlogBySlug(blogSlug);

  await Blog.increaseBlogViewCount(blog._id);

  return sendResponse(res, 200, "Blog retrieved successfully", blog);
};

// increase blog view count by 1
const increaseBlogViewCount = async (req, res) => {
  const blogId = req?.params?.id;
  if (!ObjectIdChecker(blogId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }
  const blog = await Blog.increaseBlogViewCount(blogId);
  return sendResponse(res, 200, "Blog view count increased successfully", blog);
};

// get 3 most recent Blog using mongoose
const getMostRecentBlogs = async (req, res) => {
  const blogs = await Blog.getMostRecentBlogs();
  return sendResponse(res, 200, "Fetched most recent blogs", blogs);
};

// get blogs by category using mongoose
const getBlogsByCategory = async (req, res) => {
  const category = req?.params?.category;
  const blogs = await Blog.getBlogsByCategory(category);
  return sendResponse(res, 200, "Fetched blogs by category", blogs);
};

// get featured Blog using mongoose
const getFeaturedBlogs = async (req, res) => {
  const blogs = await Blog.getFeaturedBlogs();
  return sendResponse(res, 200, "Fetched featured blogs", blogs);
};

// Create a new Blog
const createOneBlog = async (req, res) => {
  const data = parseRequestData(req);
  let {
    title,
    category,
    content,
    metaTitle,
    metaDescription,
    tags,
    slug,
    publishStatus,
    scheduledAt,
    excerpt,
    description,
    readingTime,
    featuredImageAlt,
    author,
  } = data;

  const resolvedDescription = description || excerpt || "";
  const resolvedExcerpt = excerpt || description || "";

  if (
    !title ||
    !category ||
    !content ||
    !metaTitle ||
    !metaDescription ||
    !tags ||
    (Array.isArray(tags) && tags.length === 0)
  ) {
    throw new CustomError(
      400,
      "These fields are required: title, category, content, metaTitle, metaDescription, tags"
    );
  }

  if (slug) {
    const existingBlog = await Blog.findOne({ slug: slug.trim().toLowerCase() });
    if (existingBlog) {
      throw new CustomError(409, `A blog with the slug "${slug}" already exists.`);
    }
    slug = slug.trim().toLowerCase();
  } else {
    slug = await generateUniqueSlug(title, Blog);
  }

  const userId = req?.auth?._id;
  const authorId = await getValidatedAuthorId({
    author,
    fallbackAuthor: userId,
  });

  let updatedData = {
    author: authorId,
    title,
    category,
    content,
    metaTitle,
    metaDescription,
    tags: Array.isArray(tags) ? tags : [tags],
    slug,
    description: resolvedDescription,
    excerpt: resolvedExcerpt,
    readingTime: readingTime !== undefined && readingTime !== null ? Number(readingTime) : 0,
    featuredImageAlt: featuredImageAlt || "",
    ...getBlogPublishFields({ publishStatus, scheduledAt }),
  };

  const folderName = "blogs";
  const incomingFiles = req?.files?.single || req?.files;

  if (incomingFiles) {
    const fileUrls = await handleFileUpload({
      req,
      files: Array.isArray(incomingFiles) ? incomingFiles : [incomingFiles],
      folderName,
    });
    if (fileUrls && fileUrls.length > 0) {
      const featuredImage = fileUrls[0];
      updatedData = { ...updatedData, featuredImage };
    }
  }

  const blog = await Blog.createOneBlog(updatedData);
  return sendResponse(res, 201, "Blog created successfully", blog);
};

// update a Blog using mongoose
const updateOneBlog = async (req, res) => {
  const blogId = req?.params?.id;
  if (!ObjectIdChecker(blogId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  const data = parseRequestData(req);
  let updatedData = data ? { ...data } : {};

  if (data?.publishStatus === "scheduled") {
    const existingBlog = await Blog.findById(blogId).select(
      "publishStatus published scheduledAt"
    );
    if (!existingBlog) {
      throw new CustomError(404, "Blog not found");
    }
    if (isLivePublishedBlog(existingBlog)) {
      throw new CustomError(
        400,
        "Published posts cannot be scheduled. Save as draft first, then schedule it."
      );
    }
  }

  if (updatedData.author) {
    updatedData.author = await getValidatedAuthorId({
      author: updatedData.author,
      fallbackAuthor: req?.auth?._id,
    });
  }

  if (updatedData.readingTime !== undefined) {
    updatedData.readingTime = Number(updatedData.readingTime);
  }

  if (updatedData.slug) {
    updatedData.slug = updatedData.slug.trim().toLowerCase();
  }

  if (updatedData.excerpt && !updatedData.description) {
    updatedData.description = updatedData.excerpt;
  } else if (updatedData.description && !updatedData.excerpt) {
    updatedData.excerpt = updatedData.description;
  }

  if (data && Object.prototype.hasOwnProperty.call(data, "publishStatus")) {
    updatedData = {
      ...updatedData,
      ...getBlogPublishFields({
        publishStatus: data.publishStatus,
        scheduledAt: data.scheduledAt,
        publishedAt: data.publishedAt,
      }),
    };
  }

  const folderName = "blogs";
  const incomingFiles = req?.files?.single || req?.files;

  if (incomingFiles) {
    const fileUrls = await handleFileUpload({
      req,
      files: Array.isArray(incomingFiles) ? incomingFiles : [incomingFiles],
      folderName,
    });
    if (fileUrls && fileUrls.length > 0) {
      const featuredImage = fileUrls[0];
      updatedData = { ...updatedData, featuredImage };

      try {
        const existingBlog = await Blog.getOneBlog(blogId);
        if (existingBlog?.featuredImage) {
          await handleFileDelete(existingBlog?.featuredImage);
        }
      } catch (err) {
        console.error("Error cleaning up old blog featured image:", err);
      }
    }
  }

  const updatedBlog = await Blog.updateOneBlog({ blogId, updatedData });
  return sendResponse(res, 200, "Blog updated successfully", updatedBlog);
};

// toggle featured status of a Blog using mongoose
const toggleFeaturedStatus = async (req, res) => {
  const blogId = req?.params?.id;
  if (!ObjectIdChecker(blogId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  const blog = await Blog.toggleFeaturedStatus(blogId);
  return sendResponse(res, 200, "Blog updated successfully", blog);
};

// delete a Blog using mongoose
const deleteOneBlog = async (req, res) => {
  const blogId = req?.params?.id;
  if (!ObjectIdChecker(blogId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  const existingBlog = await Blog.getOneBlog(blogId);
  if (existingBlog?.featuredImage) {
    await handleFileDelete(existingBlog?.featuredImage);
  }

  const deletedBlog = await Blog.deleteOneBlog(blogId);
  return sendResponse(res, 200, "Blog deleted successfully", deletedBlog);
};

module.exports = {
  getAllBlogs: asyncHandler(getAllBlogs),
  getAllBlogsForAdmin: asyncHandler(getAllBlogsForAdmin),
  getPublishedBlogsForAdmin: asyncHandler(getPublishedBlogsForAdmin),
  getBlogsForLandingPage: asyncHandler(getBlogsForLandingPage),
  getOneBlog: asyncHandler(getOneBlog),
  getBlogByTitle: asyncHandler(getBlogByTitle),
  getBlogBySlugSingleParam: asyncHandler(getBlogBySlugSingleParam),
  getBlogBySlug: asyncHandler(getBlogBySlug),
  getRelatedBlogs: asyncHandler(getRelatedBlogs),
  increaseBlogViewCount: asyncHandler(increaseBlogViewCount),
  getMostRecentBlogs: asyncHandler(getMostRecentBlogs),
  getBlogsByCategory: asyncHandler(getBlogsByCategory),
  getFeaturedBlogs: asyncHandler(getFeaturedBlogs),
  getScheduledBlogs: asyncHandler(getScheduledBlogs),
  getDraftBlogs: asyncHandler(getDraftBlogs),
  createOneBlog: asyncHandler(createOneBlog),
  updateOneBlog: asyncHandler(updateOneBlog),
  toggleFeaturedStatus: asyncHandler(toggleFeaturedStatus),
  deleteOneBlog: asyncHandler(deleteOneBlog),
};
