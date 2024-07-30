// controllers/Content/Blog/BlogCategoryController.js

const { asyncHandler } = require("../../../middlewares");
const { BlogCategory } = require("../../../models");
const {
  sendResponse,
  ObjectIdChecker,
  CustomError,
} = require("../../../services");

//get all Category using mongoose
const getAllCategories = async (req, res) => {
  //perform query on database
  const categories = await BlogCategory.getAllCategories();
  return sendResponse(res, 200, "Fetched all categories", categories);
};

//get one Category using mongoose
const getOneCategory = async (req, res) => {
  const categoryId = req?.params?.id;
  //object id validation
  if (!ObjectIdChecker(categoryId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const category = await BlogCategory.getOneCategory(categoryId);
  return sendResponse(res, 200, "Category retrieved successfully", category);
};

// Create a new Category
const createOneCategory = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};

  const { category } = data;

  if (!category) {
    throw new CustomError(400, "These fields are required: category");
  }

  //validate authority from middleware authentication
  const userId = req?.auth?._id;
  if (!userId) {
    throw new CustomError(401, "Unauthorized user");
  }

  const updatedData = {
    createdBy: userId,
    category,
  };

  //perform query on database
  const blogCategory = await BlogCategory.createOneCategory(updatedData);
  return sendResponse(res, 201, "Category created successfully", blogCategory);
};

//update a Category using mongoose
const updateOneCategory = async (req, res) => {
  const categoryId = req?.params?.id;
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const { category } = data;

  //object id validation
  if (!ObjectIdChecker(categoryId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //check for required fields
  if (!category) {
    throw new CustomError(400, "These fields are required: category");
  }

  //prepare updated data
  const updatedData = { category };

  //perform query on database
  const updatedCategory = await BlogCategory.updateOneCategory({
    categoryId,
    updatedData,
  });
  return sendResponse(
    res,
    200,
    "Category updated successfully",
    updatedCategory
  );
};

//delete a Category using mongoose
const deleteOneCategory = async (req, res) => {
  const categoryId = req?.params?.id;

  //object id validation
  if (!ObjectIdChecker(categoryId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const deletedCategory = await BlogCategory.deleteOneCategory(categoryId);
  return sendResponse(
    res,
    200,
    "Category deleted successfully",
    deletedCategory
  );
};

module.exports = {
  getAllCategories: asyncHandler(getAllCategories),
  getOneCategory: asyncHandler(getOneCategory),
  createOneCategory: asyncHandler(createOneCategory),
  updateOneCategory: asyncHandler(updateOneCategory),
  deleteOneCategory: asyncHandler(deleteOneCategory),
};
