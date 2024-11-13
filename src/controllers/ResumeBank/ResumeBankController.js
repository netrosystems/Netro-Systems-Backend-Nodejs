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

//get resume count and job id for all resumes
const getResumeCount = async (req, res) => {
  //perform query on database
  const resumes = await Resume.getResumeCount();
  return sendResponse(res, 200, "Fetched all resumes", resumes);
};

//get all resume for one job
const getAllResumesForOneJob = async (req, res) => {
  const jobId = req?.params?.id;
  //object id validation
  if (!ObjectIdChecker(jobId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const resumes = await Resume.getAllResumesForOneJob(jobId);
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
    job,
    name,
    email,
    number,
    location,
    salaryExpectation,
    experience,
    previousCompany,
    liveUrl,
  } = data;

  if (
    !job ||
    !name ||
    !email ||
    !number ||
    !location ||
    !salaryExpectation ||
    !experience ||
    !previousCompany ||
    !liveUrl
  ) {
    throw new CustomError(
      400,
      "These fields are required: job, name, email, number, location, salaryExpectation, experience, previousCompany, liveUrl"
    );
  }

  //check if the user already applied for this job
  const resumeExists = await Resume.checkIfResumeExists({ email, job });
  if (resumeExists) {
    throw new CustomError(400, "You have already applied for this job");
  }

  let updatedData = {
    job,
    name,
    email,
    number,
    location,
    salaryExpectation,
    experience,
    previousCompany,
    liveUrl,
  };
  const folderName = "resumes";

  //upload resumeUrl
  if (files?.single) {
    const fileUrls = await handleFileUpload({
      req,
      files: files?.single,
      folderName,
    });
    const resumeUrl = fileUrls[0];
    updatedData = { ...updatedData, resumeUrl };
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

  //upload resumeUrl
  if (files?.single) {
    const fileUrls = await handleFileUpload({
      req,
      files: files?.single,
      folderName,
    });
    const resumeUrl = fileUrls[0];
    updatedData = { ...updatedData, resumeUrl };
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
  getResumeCount: asyncHandler(getResumeCount),
  getAllResumesForOneJob: asyncHandler(getAllResumesForOneJob),
  getOneResume: asyncHandler(getOneResume),
  createOneResume: asyncHandler(createOneResume),
  updateOneResume: asyncHandler(updateOneResume),
  deleteOneResume: asyncHandler(deleteOneResume),
};
