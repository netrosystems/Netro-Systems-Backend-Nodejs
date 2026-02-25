// controllers/Content/Lead/LeadController.js

const { asyncHandler } = require("../../../middlewares");
const { Lead } = require("../../../models");
const {
  sendResponse,
  ObjectIdChecker,
  CustomError,
} = require("../../../services");

//get all Lead using mongoose
const getAllLeads = async (req, res) => {
  //perform query on database
  const leads = await Lead.getAllLeads();
  return sendResponse(res, 200, "Fetched all leads", leads);
};

//get one Lead using mongoose
const getOneLead = async (req, res) => {
  const leadId = req?.params?.id;
  //object id validation
  if (!ObjectIdChecker(leadId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const lead = await Lead.getOneLead(leadId);
  return sendResponse(res, 200, "Lead retrieved successfully", lead);
};

// Create a new Lead
const createOneLead = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};

  const { name, email, message, budget } = data;

  if (!email) {
    throw new CustomError(400, "These fields are required: email");
  }

  const updatedData = {
    name,
    email,
    message,
    budget,
  };

  //perform query on database
  const lead = await Lead.createOneLead(updatedData);
  return sendResponse(res, 201, "Lead created successfully", lead);
};

//update a Lead using mongoose
const updateOneLead = async (req, res) => {
  const leadId = req?.params?.id;
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};

  //object id validation
  if (!ObjectIdChecker(leadId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  let updatedData = data ? data : {};

  //perform query on database
  const updatedLead = await Lead.updateOneLead({
    leadId,
    updatedData,
  });
  
  return sendResponse(res, 200, "Lead updated successfully", updatedLead);
};

//delete a Lead using mongoose
const deleteOneLead = async (req, res) => {
  const leadId = req?.params?.id;

  //object id validation
  if (!ObjectIdChecker(leadId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const deletedLead = await Lead.deleteOneLead(leadId);
  return sendResponse(res, 200, "Lead deleted successfully", deletedLead);
};

module.exports = {
  getAllLeads: asyncHandler(getAllLeads),
  getOneLead: asyncHandler(getOneLead),
  createOneLead: asyncHandler(createOneLead),
  updateOneLead: asyncHandler(updateOneLead),
  deleteOneLead: asyncHandler(deleteOneLead),
};
