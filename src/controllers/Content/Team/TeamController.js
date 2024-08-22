// controllers/Content/Team/TeamController.js

const { asyncHandler } = require("../../../middlewares");
const { Team } = require("../../../models");
const {
  handleFileUpload,
  sendResponse,
  ObjectIdChecker,
  CustomError,
} = require("../../../services");

//get all Team using mongoose
const getAllTeams = async (req, res) => {
  //perform query on database
  const teams = await Team.getAllTeams();
  return sendResponse(res, 200, "Fetched all team members", teams);
};

//get one Team using mongoose
const getOneTeam = async (req, res) => {
  const teamId = req?.params?.id;
  //object id validation
  if (!ObjectIdChecker(teamId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const team = await Team.getOneTeam(teamId);
  return sendResponse(res, 200, "Team members retrieved successfully", team);
};

// Create a new Team
const createOneTeam = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const files = req?.files;

  const { name, designation, facebook, twitter, linkedin, steam, other } = data;

  if (!name || !designation) {
    throw new CustomError(400, "These fields are required: name, designation");
  }

  //validate authority from middleware authentication
  const userId = req?.auth?._id;
  if (!userId) {
    throw new CustomError(401, "Unauthorized user");
  }

  let updatedData = {
    author: userId,
    name,
    designation,
    facebook,
    twitter,
    linkedin,
    steam,
    other,
  };
  const folderName = "teams";
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
  const team = await Team.createOneTeam(updatedData);
  return sendResponse(res, 201, "Team member created successfully", team);
};

//update a Team using mongoose
const updateOneTeam = async (req, res) => {
  const teamId = req?.params?.id;
  const files = req?.files;
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};

  //object id validation
  if (!ObjectIdChecker(teamId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  let updatedData = data ? data : {};
  const folderName = "teams";
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
  const updatedTeam = await Team.updateOneTeam({ teamId, updatedData });
  return sendResponse(
    res,
    200,
    "Team member updated successfully",
    updatedTeam
  );
};

//delete a Team using mongoose
const deleteOneTeam = async (req, res) => {
  const teamId = req?.params?.id;

  //object id validation
  if (!ObjectIdChecker(teamId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const deletedTeam = await Team.deleteOneTeam(teamId);
  return sendResponse(
    res,
    200,
    "Team member deleted successfully",
    deletedTeam
  );
};

module.exports = {
  getAllTeams: asyncHandler(getAllTeams),
  getOneTeam: asyncHandler(getOneTeam),
  createOneTeam: asyncHandler(createOneTeam),
  updateOneTeam: asyncHandler(updateOneTeam),
  deleteOneTeam: asyncHandler(deleteOneTeam),
};
