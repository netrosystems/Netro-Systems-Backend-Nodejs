// controllers/Content/Blog/BlogController.js

const { asyncHandler } = require("../../../middlewares");
const { Blog } = require("../../../models");
const {
  handleFileUpload,
  sendResponse,
  ObjectIdChecker,
  CustomError,
  handleFileDelete,
} = require("../../../services");
const { generateUniqueSlug } = require("../../../services/slugHandlers/HandleSlug");

//get all Blog using mongoose
const getAllBlogs = async (req, res) => {
  //perform query on database
  const blogs = await Blog.getAllBlogs();
  return sendResponse(res, 200, "Fetched all blogs", blogs);
};

//get 3 featured Blog using mongoose
const getBlogsForLandingPage = async (req, res) => {
  //perform query on database
  const blogs = await Blog.getBlogsForLandingPage();
  return sendResponse(res, 200, "Fetched featured blogs", blogs);
};

//get one Blog using mongoose
const getOneBlog = async (req, res) => {
  const blogId = req?.params?.id;
  //object id validation
  if (!ObjectIdChecker(blogId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const blog = await Blog.getOneBlog(blogId);
  return sendResponse(res, 200, "Blog retrieved successfully", blog);
};

//get blog by title using mongoose
const getBlogByTitle = async (req, res) => {
  const title = req.params[0]; // This captures the entire title after /find-by-title/
  const blogTitle = decodeURIComponent(title); // Decode the title
  // const blogTitle = req?.params?.title;
  //perform query on database
  const blog = await Blog.getBlogByTitle(blogTitle);
  return sendResponse(res, 200, "Blog retrieved successfully", blog);
};

//get blog by title using mongoose
const getBlogBySlugSingleParam = async (req, res) => {
  const slug = req?.params?.slug;
  const blog = await Blog.getBlogBySlug(slug);
  return sendResponse(res, 200, "Blog retrieved successfully", blog);
};

// get blog by slug using mongoose
const getBlogBySlug = async (req, res) => {
  const slug = req.params[0];
  const blogSlug = decodeURIComponent(slug);
  //perform query on database
  const blog = await Blog.getBlogBySlug(blogSlug);

  //increase blog view count by 1
  await Blog.increaseBlogViewCount(blog._id);

  //return the blog
  return sendResponse(res, 200, "Blog retrieved successfully", blog);
};

//increase blog view count by 1 using mongoose
const increaseBlogViewCount = async (req, res) => {
  const blogId = req?.params?.id;
  //object id validation
  if (!ObjectIdChecker(blogId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }
  //perform query on database
  const blog = await Blog.increaseBlogViewCount(blogId);
  return sendResponse(res, 200, "Blog view count increased successfully", blog);
};

//get 3 most recent Blog using mongoose
const getMostRecentBlogs = async (req, res) => {
  //perform query on database
  const blogs = await Blog.getMostRecentBlogs();
  return sendResponse(res, 200, "Fetched most recent blogs", blogs);
};

//get blogs by category using mongoose
const getBlogsByCategory = async (req, res) => {
  const category = req?.params?.category;
  //perform query on database
  const blogs = await Blog.getBlogsByCategory(category);
  return sendResponse(res, 200, "Fetched blogs by category", blogs);
};

//get featured Blog using mongoose
const getFeaturedBlogs = async (req, res) => {
  //perform query on database
  const blogs = await Blog.getFeaturedBlogs();
  return sendResponse(res, 200, "Fetched featured blogs", blogs);
};

// Create a new Blog
const createOneBlog = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  // const files = req?.files;

  // const { title, category, content, metaTitle, metaDescription, tags } = data;

  // if (
  //   !title ||
  //   !category ||
  //   !content ||
  //   !metaTitle ||
  //   !metaDescription ||
  //   !tags
  // ) {
  //   throw new CustomError(
  //     400,
  //     "These fields are required: title, category, content, metaTitle, metaDescription, tags"
  //   );
  // }
  const { title, slug, description, readingTime, category, content, metaTitle, metaDescription, tags } = data;

  if (
    !title ||
    !slug ||
    !description ||
    !readingTime ||
    !category ||
    !content ||
    !metaTitle ||
    !metaDescription ||
    !tags
  ) {
    throw new CustomError(
      400,
      "These fields are required: title, slug, description, readingTime, category, content, metaTitle, metaDescription, tags"
    );
  }

  // const slug = await generateUniqueSlug(title, Blog);

  // //validate authority from middleware authentication
  // const userId = req?.auth?._id;
  // if (!userId) {
  //   throw new CustomError(401, "Unauthorized user");
  // }

  // let updatedData = {
  //   author: userId,
  //   title,
  //   category,
  //   content,
  //   metaTitle,
  //   metaDescription,
  //   tags,
  //   slug,
  // };
  // const folderName = "blogs";
  // if (files?.single) {
  //   const fileUrls = await handleFileUpload({
  //     req,
  //     files: files?.single,
  //     folderName,
  //   });
  //   const featuredImage = fileUrls[0];
  //   updatedData = { ...updatedData, featuredImage };
  // }

  // //perform query on database
  // const blog = await Blog.createOneBlog(updatedData);
  // return sendResponse(res, 201, "Blog created successfully", blog);

  try {
    // 1. Fetch only blogs that don't have a slug yet
    const blogsToUpdate = await Blog.find({
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: "" }
      ]
    });

    let updatedData = {
      author: userId,
      title,
      category,
      content,
      metaTitle,
      metaDescription,
      tags,
      slug,
      description,
      readingTime,
    };
    const folderName = "blogs";
    if (files?.single) {
      const fileUrls = await handleFileUpload({
        req,
        files: files?.single,
        folderName,
      });
    }

    if (blogsToUpdate.length === 0) {
      return sendResponse(res, 200, "No blogs found requiring slug migration.", { updated: 0 });
    }

    const updateResults = [];

    // 2. Iterate and update
    for (const blog of blogsToUpdate) {
      // Call your existing helper function
      const uniqueSlug = await generateUniqueSlug(blog.title, Blog);

      // Update the document
      const updatedBlog = await Blog.findByIdAndUpdate(
        blog._id,
        { $set: { slug: uniqueSlug } },
        { new: true }
      );

      updateResults.push({
        id: blog._id,
        title: blog.title,
        slug: uniqueSlug
      });
    }

    return sendResponse(res, 200, `Successfully migrated ${updateResults.length} blogs.`, {
      updatedCount: updateResults.length,
      details: updateResults
    });
  } catch (error) {
    errorLogger.error(`Migration Error: ${error.message}`);
    throw new CustomError(500, "Internal Server Error during slug migration.");
  }
};

//update a Blog using mongoose
const updateOneBlog = async (req, res) => {
  const blogId = req?.params?.id;
  const files = req?.files;
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};

  //object id validation
  if (!ObjectIdChecker(blogId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  let updatedData = data ? data : {};
  const folderName = "blogs";
  if (files?.single) {
    const fileUrls = await handleFileUpload({
      req,
      files: files?.single,
      folderName,
    });
    const featuredImage = fileUrls[0];
    updatedData = { ...updatedData, featuredImage };

    const existingBlog = await Blog.getOneBlog(blogId);
    if (existingBlog?.featuredImage) {
      await handleFileDelete(existingBlog?.featuredImage);
    }
  }

  //perform query on database
  const updatedBlog = await Blog.updateOneBlog({ blogId, updatedData });
  return sendResponse(res, 200, "Blog updated successfully", updatedBlog);
};

//toggle featured status of a Blog using mongoose
const toggleFeaturedStatus = async (req, res) => {
  const blogId = req?.params?.id;

  //object id validation
  if (!ObjectIdChecker(blogId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const blog = await Blog.toggleFeaturedStatus(blogId);
  return sendResponse(res, 200, "Blog updated successfully", blog);
};

//delete a Blog using mongoose
const deleteOneBlog = async (req, res) => {
  const blogId = req?.params?.id;

  //object id validation
  if (!ObjectIdChecker(blogId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  const existingBlog = await Blog.getOneBlog(blogId);
  if (existingBlog?.featuredImage) {
    await handleFileDelete(existingBlog?.featuredImage);
  }

  //perform query on database
  const deletedBlog = await Blog.deleteOneBlog(blogId);
  return sendResponse(res, 200, "Blog deleted successfully", deletedBlog);
};

module.exports = {
  getAllBlogs: asyncHandler(getAllBlogs),
  getBlogsForLandingPage: asyncHandler(getBlogsForLandingPage),
  getOneBlog: asyncHandler(getOneBlog),
  getBlogByTitle: asyncHandler(getBlogByTitle),
  getBlogBySlugSingleParam: asyncHandler(getBlogBySlugSingleParam),
  getBlogBySlug: asyncHandler(getBlogBySlug),
  increaseBlogViewCount: asyncHandler(increaseBlogViewCount),
  getMostRecentBlogs: asyncHandler(getMostRecentBlogs),
  getBlogsByCategory: asyncHandler(getBlogsByCategory),
  getFeaturedBlogs: asyncHandler(getFeaturedBlogs),
  createOneBlog: asyncHandler(createOneBlog),
  updateOneBlog: asyncHandler(updateOneBlog),
  toggleFeaturedStatus: asyncHandler(toggleFeaturedStatus),
  deleteOneBlog: asyncHandler(deleteOneBlog),
};
