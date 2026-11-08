const LeadRouter = require("express").Router();

const {
  getAllLeads,
  getOneLead,
  createOneLead,
  updateOneLead,
  deleteOneLead,
} = require("../../../controllers/Settings/Lead/Lead");
const { authorizeAdmin } = require("../../../middlewares");

LeadRouter.get("/all", authorizeAdmin, getAllLeads);
LeadRouter.get("/find/:id", authorizeAdmin, getOneLead);
LeadRouter.post("/create", createOneLead);
LeadRouter.patch("/update/:id", authorizeAdmin, updateOneLead);
LeadRouter.delete("/delete/:id", authorizeAdmin, deleteOneLead);

module.exports = LeadRouter;
