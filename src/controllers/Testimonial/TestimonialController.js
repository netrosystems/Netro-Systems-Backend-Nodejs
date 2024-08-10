// controllers/Content/Testimonial/TestimonialController.js

const { asyncHandler } = require("../../middlewares");
const { Testimonial } = require("../../models");
const {
  handleFileUpload,
  sendResponse,
  ObjectIdChecker,
  CustomError,
} = require("../../services");

//get all Testimonial using mongoose
const getAllTestimonials = async (req, res) => {
  //perform query on database
  const testimonials = await Testimonial.getAllTestimonials();
  return sendResponse(res, 200, "Fetched all testimonials", testimonials);
};

//get one Testimonial using mongoose
const getOneTestimonial = async (req, res) => {
  const testimonialId = req?.params?.id;
  //object id validation
  if (!ObjectIdChecker(testimonialId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const testimonial = await Testimonial.getOneTestimonial(testimonialId);
  return sendResponse(
    res,
    200,
    "Testimonial retrieved successfully",
    testimonial
  );
};

// Create a new Testimonial
const createOneTestimonial = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const files = req?.files;

  //validate authority from middleware authentication
  const userId = req?.auth?._id;
  if (!userId) {
    throw new CustomError(401, "Unauthorized user");
  }

  console.log("user", req?.auth);

  const { name, occupation, review } = data;

  if (!name || !occupation || !review) {
    throw new CustomError(
      400,
      "These fields are required: name, occupation, review"
    );
  }

  let updatedData = {
    author: userId,
    name,
    occupation,
    review,
  };
  const folderName = "testimonials";

  //upload testimonialUrl
  if (files?.single) {
    const fileUrls = await handleFileUpload({
      req,
      files: files?.single,
      folderName,
    });
    const imageUrl = fileUrls[0];
    updatedData = { ...updatedData, imageUrl };
  }

  //perform query on database
  const testimonial = await Testimonial.createOneTestimonial(updatedData);
  return sendResponse(
    res,
    201,
    "Testimonial created successfully",
    testimonial
  );
};

//update a Testimonial using mongoose
const updateOneTestimonial = async (req, res) => {
  const testimonialId = req?.params?.id;
  const files = req?.files;
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};

  //object id validation
  if (!ObjectIdChecker(testimonialId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //validate authority from middleware authentication
  const userId = req?.auth?._id;
  if (!userId) {
    throw new CustomError(401, "Unauthorized user");
  }

  let updatedData = data ? data : {};
  const folderName = "testimonials";

  //upload testimonialUrl
  if (files?.single) {
    const fileUrls = await handleFileUpload({
      req,
      files: files?.single,
      folderName,
    });
    const imageUrl = fileUrls[0];
    updatedData = { ...updatedData, imageUrl };
  }

  //perform query on database
  const updatedTestimonial = await Testimonial.updateOneTestimonial({
    testimonialId,
    updatedData,
  });
  return sendResponse(
    res,
    200,
    "Testimonial updated successfully",
    updatedTestimonial
  );
};

//delete a Testimonial using mongoose
const deleteOneTestimonial = async (req, res) => {
  const testimonialId = req?.params?.id;

  //object id validation
  if (!ObjectIdChecker(testimonialId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const deletedTestimonial = await Testimonial.deleteOneTestimonial(
    testimonialId
  );
  return sendResponse(
    res,
    200,
    "Testimonial deleted successfully",
    deletedTestimonial
  );
};

module.exports = {
  getAllTestimonials: asyncHandler(getAllTestimonials),
  getOneTestimonial: asyncHandler(getOneTestimonial),
  createOneTestimonial: asyncHandler(createOneTestimonial),
  updateOneTestimonial: asyncHandler(updateOneTestimonial),
  deleteOneTestimonial: asyncHandler(deleteOneTestimonial),
};
