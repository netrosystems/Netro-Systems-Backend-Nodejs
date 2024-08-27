// controllers/Content/Service/ServiceController.js

const { asyncHandler } = require("../../../middlewares");
const { Service } = require("../../../models");
const {
  handleFileUpload,
  sendResponse,
  ObjectIdChecker,
  logger,
  CustomError,
} = require("../../../services");

//get all Service using mongoose
const getAllServices = async (req, res) => {
  //perform query on database
  const services = await Service.getAllServices();
  return sendResponse(res, 200, "Fetched all services", services);
};

//get one Service using mongoose
const getOneService = async (req, res) => {
  const serviceId = req?.params?.id;
  //object id validation
  if (!ObjectIdChecker(serviceId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const service = await Service.getOneService(serviceId);
  return sendResponse(res, 200, "Service retrieved successfully", service);
};

//get service by title using mongoose
const getServiceByTitle = async (req, res) => {
  const serviceTitle = req?.params?.title;
  //perform query on database
  const service = await Service.getServiceByTitle(serviceTitle);
  return sendResponse(res, 200, "Service retrieved successfully", service);
};

// Create a new Service
const createOneService = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const files = req?.files;

  const { title, category, content, metaTitle, metaDescription, tags } = data;

  if (
    !title ||
    !category ||
    !content ||
    !metaTitle ||
    !metaDescription ||
    !tags
  ) {
    throw new CustomError(
      400,
      "These fields are required: title, category, content, metaTitle, metaDescription, tags"
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
    metaTitle,
    metaDescription,
    tags,
  };
  const folderName = "services";
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
  const service = await Service.createOneService(updatedData);
  return sendResponse(res, 201, "Service created successfully", service);
};

//update a Service using mongoose
const updateOneService = async (req, res) => {
  const serviceId = req?.params?.id;
  const files = req?.files;
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};

  //object id validation
  if (!ObjectIdChecker(serviceId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  let updatedData = data ? data : {};
  const folderName = "services";
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
  const updatedService = await Service.updateOneService({
    serviceId,
    updatedData,
  });
  return sendResponse(res, 200, "Service updated successfully", updatedService);
};

//delete a Service using mongoose
const deleteOneService = async (req, res) => {
  const serviceId = req?.params?.id;

  //object id validation
  if (!ObjectIdChecker(serviceId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const deletedService = await Service.deleteOneService(serviceId);
  return sendResponse(res, 200, "Service deleted successfully", deletedService);
};

module.exports = {
  getAllServices: asyncHandler(getAllServices),
  getOneService: asyncHandler(getOneService),
  getServiceByTitle: asyncHandler(getServiceByTitle),
  createOneService: asyncHandler(createOneService),
  updateOneService: asyncHandler(updateOneService),
  deleteOneService: asyncHandler(deleteOneService),
};
