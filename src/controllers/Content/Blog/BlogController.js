//controllers/Content/Blog/BlogController.js
const { asyncHandler } = require("../../../middlewares");
const { Blog } = require("../../../models");
const {
  handleFileUpload,
  sendResponse,
  ObjectIdChecker,
  logger,
  CustomError,
} = require("../../../services");

//get all Blog using mongoose
const getAllBlogs = async (req, res) => {
  //perform query on database
  const blogs = await Blog.getAllBlogs();
  return sendResponse(res, 200, "Fetched all blogs", blogs);
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

// Create a new Blog
const createOneBlog = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const files = req?.files;

  const { title, category, content, metaTags, metaDescription, tags } = data;

  if (
    !title ||
    !category ||
    !content ||
    !metaTags ||
    !metaDescription ||
    !tags
  ) {
    throw new CustomError(
      400,
      "These fields are required: title, category, content, metaTags, metaDescription, tags"
    );
  }

  //validate authority from middleware authentication
  const userId = req?.auth?._id;
  if (!userId) {
    throw new CustomError(401, "Unauthorized user");
  }

  let updatedData = {
    author: userId,
    title,
    category,
    content,
    metaTags,
    metaDescription,
    tags,
  };
  const folderName = "blogs";
  if (files?.single) {
    const fileUrls = await handleFileUpload({
      req,
      files: files?.single,
      folderName,
    });
    const featuredImage = fileUrls[0];
    updatedData = { ...updatedData, featuredImage };
  }

  //perform query on database
  const blog = await Blog.createOneBlog(updatedData);
  return sendResponse(res, 201, "Blog created successfully", blog);
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
  }

  //perform query on database
  const updatedBlog = await Blog.updateOneBlog({ blogId, updatedData });
  return sendResponse(res, 200, "Blog updated successfully", updatedBlog);
};

//delete a Blog using mongoose
const deleteOneBlog = async (req, res) => {
  const blogId = req?.params?.id;

  //object id validation
  if (!ObjectIdChecker(blogId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const deletedBlog = await Blog.deleteOneBlog(blogId);
  return sendResponse(res, 200, "Blog deleted successfully", deletedBlog);
};

module.exports = {
  getAllBlogs: asyncHandler(getAllBlogs),
  getOneBlog: asyncHandler(getOneBlog),
  createOneBlog: asyncHandler(createOneBlog),
  updateOneBlog: asyncHandler(updateOneBlog),
  deleteOneBlog: asyncHandler(deleteOneBlog),
};
