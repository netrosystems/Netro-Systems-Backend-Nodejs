// controllers/Content/Job/JobController.js

const { asyncHandler } = require("../../../middlewares");
const { Job } = require("../../../models");
const {
  handleFileUpload,
  sendResponse,
  ObjectIdChecker,
  CustomError,
} = require("../../../services");

//get all Job using mongoose
const getAllJobs = async (req, res) => {
  //perform query on database
  const jobs = await Job.getAllJobs();
  return sendResponse(res, 200, "Fetched all jobs", jobs);
};

//get one Job using mongoose
const getOneJob = async (req, res) => {
  const jobId = req?.params?.id;
  //object id validation
  if (!ObjectIdChecker(jobId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const job = await Job.getOneJob(jobId);
  return sendResponse(res, 200, "Jobs retrieved successfully", job);
};

// Create a new Job
const createOneJob = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const files = req?.files;

  const { title, details, minimum, preferred, benefits, category, deadline } =
    data;

  if (
    !title ||
    !details ||
    !minimum ||
    !preferred ||
    !benefits ||
    !category ||
    !deadline
  ) {
    throw new CustomError(
      400,
      "These fields are required: name, designation, facebook, twitter, linkedin, sjob, other"
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
    details,
    minimum,
    preferred,
    benefits,
    category,
    deadline,
  };
  const folderName = "jobs";
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
  const job = await Job.createOneJob(updatedData);
  return sendResponse(res, 201, "Job created successfully", job);
};

//update a Job using mongoose
const updateOneJob = async (req, res) => {
  const jobId = req?.params?.id;
  const files = req?.files;
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};

  //object id validation
  if (!ObjectIdChecker(jobId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  let updatedData = data ? data : {};
  const folderName = "jobs";
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
  const updatedJob = await Job.updateOneJob({ jobId, updatedData });
  return sendResponse(res, 200, "Job updated successfully", updatedJob);
};

//toggle job status using mongoose
const toggleJobStatus = async (req, res) => {
  const jobId = req?.params?.id;

  //object id validation
  if (!ObjectIdChecker(jobId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const updatedJob = await Job.toggleJobStatus(jobId);
  return sendResponse(res, 200, "Job status updated successfully", updatedJob);
};

//delete a Job using mongoose
const deleteOneJob = async (req, res) => {
  const jobId = req?.params?.id;

  //object id validation
  if (!ObjectIdChecker(jobId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const deletedJob = await Job.deleteOneJob(jobId);
  return sendResponse(res, 200, "Job deleted successfully", deletedJob);
};

module.exports = {
  getAllJobs: asyncHandler(getAllJobs),
  getOneJob: asyncHandler(getOneJob),
  createOneJob: asyncHandler(createOneJob),
  updateOneJob: asyncHandler(updateOneJob),
  toggleJobStatus: asyncHandler(toggleJobStatus),
  deleteOneJob: asyncHandler(deleteOneJob),
};
