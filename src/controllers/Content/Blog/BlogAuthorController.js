// controllers/Content/Blog/BlogAuthorController.js

const { asyncHandler } = require("../../../middlewares");
const { BlogAuthor } = require("../../../models");
const {
  sendResponse,
  ObjectIdChecker,
  CustomError,
  handleFileUpload,
} = require("../../../services");

//get all Author using mongoose
const getAllAuthors = async (req, res) => {
  //perform query on database
  const authors = await BlogAuthor.getAllAuthors();
  return sendResponse(res, 200, "Fetched all authors", authors);
};

//get one Author using mongoose
const getOneAuthor = async (req, res) => {
  const authorId = req?.params?.id;
  //object id validation
  if (!ObjectIdChecker(authorId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const author = await BlogAuthor.getOneAuthor(authorId);
  return sendResponse(res, 200, "Author retrieved successfully", author);
};

// Create a new Author
const createOneAuthor = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const files = req?.files;

  const { name, title } = data;

  if (!name || !title) {
    throw new CustomError(400, "These fields are required: name, title");
  }

  //validate authority from middleware authentication
  const userId = req?.auth?._id;
  if (!userId) {
    throw new CustomError(401, "Unauthorized user");
  }

  const updatedData = {
    createdBy: userId,
    name,
    title,
  };

  const folderName = "authors";
  if (files?.single) {
    const fileUrls = await handleFileUpload({
      req,
      files: files?.single,
      folderName,
    });
    const image = fileUrls[0];
    updatedData = { ...updatedData, image };
  }

  //perform query on database
  const blogAuthor = await BlogAuthor.createOneAuthor(updatedData);
  return sendResponse(res, 201, "Author created successfully", blogAuthor);
};

//update a Author using mongoose
const updateOneAuthor = async (req, res) => {
  const authorId = req?.params?.id;
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const files = req?.files;

  const { name, title } = data;

  //object id validation
  if (!ObjectIdChecker(authorId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //check for required fields
  if (!name || !title) {
    throw new CustomError(400, "These fields are required: name, title");
  }

  //prepare updated data
  const updatedData = { name, title };

  const folderName = "authors";
  if (files?.single) {
    const fileUrls = await handleFileUpload({
      req,
      files: files?.single,
      folderName,
    });
    const image = fileUrls[0];
    updatedData = { ...updatedData, image };
  }

  //perform query on database
  const updatedAuthor = await BlogAuthor.updateOneAuthor({
    authorId,
    updatedData,
  });
  return sendResponse(
    res,
    200,
    "Author updated successfully",
    updatedAuthor
  );
};

//delete a Author using mongoose
const deleteOneAuthor = async (req, res) => {
  const authorId = req?.params?.id;

  //object id validation
  if (!ObjectIdChecker(authorId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const deletedAuthor = await BlogAuthor.deleteOneAuthor(authorId);
  return sendResponse(
    res,
    200,
    "Author deleted successfully",
    deletedAuthor
  );
};

module.exports = {
  getAllAuthors: asyncHandler(getAllAuthors),
  getOneAuthor: asyncHandler(getOneAuthor),
  createOneAuthor: asyncHandler(createOneAuthor),
  updateOneAuthor: asyncHandler(updateOneAuthor),
  deleteOneAuthor: asyncHandler(deleteOneAuthor),
};
