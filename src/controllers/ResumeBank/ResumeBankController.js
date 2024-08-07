// controllers/Content/Resume/ResumeController.js

const { asyncHandler } = require("../../middlewares");
const { Resume } = require("../../models");
const {
  handleFileUpload,
  sendResponse,
  ObjectIdChecker,
  CustomError,
} = require("../../services");

//get all Resume using mongoose
const getAllResumes = async (req, res) => {
  //perform query on database
  const resumes = await Resume.getAllResumes();
  return sendResponse(res, 200, "Fetched all resumes", resumes);
};

//get one Resume using mongoose
const getOneResume = async (req, res) => {
  const resumeId = req?.params?.id;
  //object id validation
  if (!ObjectIdChecker(resumeId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const resume = await Resume.getOneResume(resumeId);
  return sendResponse(res, 200, "Resume retrieved successfully", resume);
};

// Create a new Resume
const createOneResume = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const files = req?.files;

  const {
    title,
    videoUrl,
    clientOrigin,
    timeline,
    content,
    category,
    type,
    liveUrl,
    userGained,
    investment,
    expansion,
    salesIncreased,
    metaTags,
    metaDescription,
  } = data;

  if (
    !title ||
    !videoUrl ||
    !clientOrigin ||
    !timeline ||
    !content ||
    !category ||
    !type ||
    !liveUrl ||
    !userGained ||
    !investment ||
    !expansion ||
    !salesIncreased ||
    !metaTags ||
    !metaDescription
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
    videoUrl,
    clientOrigin,
    timeline,
    content,
    category,
    type,
    liveUrl,
    userGained,
    investment,
    expansion,
    salesIncreased,
    metaTags,
    metaDescription,
  };
  const folderName = "resumes";

  //upload featuredImage
  if (files?.single) {
    const fileUrls = await handleFileUpload({
      req,
      files: files?.single,
      folderName,
    });
    const featuredImage = fileUrls[0];
    updatedData = { ...updatedData, featuredImage };
  }

  //upload projectImages
  if (files?.multiple) {
    const fileUrls = await handleFileUpload({
      req,
      files: files?.multiple,
      folderName,
    });
    const projectImages = fileUrls;
    updatedData = { ...updatedData, projectImages };
  }

  //perform query on database
  const resume = await Resume.createOneResume(updatedData);
  return sendResponse(res, 201, "Resume created successfully", resume);
};

//update a Resume using mongoose
const updateOneResume = async (req, res) => {
  const resumeId = req?.params?.id;
  const files = req?.files;
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};

  //object id validation
  if (!ObjectIdChecker(resumeId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  let updatedData = data ? data : {};
  const folderName = "resumes";

  //upload featuredImage
  if (files?.single) {
    const fileUrls = await handleFileUpload({
      req,
      files: files?.single,
      folderName,
    });
    const featuredImage = fileUrls[0];
    updatedData = { ...updatedData, featuredImage };
  }

  //upload projectImages
  if (files?.multiple) {
    const fileUrls = await handleFileUpload({
      req,
      files: files?.multiple,
      folderName,
    });
    const projectImages = fileUrls;
    updatedData = { ...updatedData, projectImages };
  }

  //perform query on database
  const updatedResume = await Resume.updateOneResume({
    resumeId,
    updatedData,
  });
  return sendResponse(res, 200, "Resume updated successfully", updatedResume);
};

//delete a Resume using mongoose
const deleteOneResume = async (req, res) => {
  const resumeId = req?.params?.id;

  //object id validation
  if (!ObjectIdChecker(resumeId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const deletedResume = await Resume.deleteOneResume(resumeId);
  return sendResponse(res, 200, "Resume deleted successfully", deletedResume);
};

module.exports = {
  getAllResumes: asyncHandler(getAllResumes),
  getOneResume: asyncHandler(getOneResume),
  createOneResume: asyncHandler(createOneResume),
  updateOneResume: asyncHandler(updateOneResume),
  deleteOneResume: asyncHandler(deleteOneResume),
};
