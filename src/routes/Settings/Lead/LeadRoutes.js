const LeadRouter = require("express").Router();

const {
  getAllLeads,
  getOneLead,
  createOneLead,
  updateOneLead,
  deleteOneLead,
} = require("../../../controllers/Settings/Lead/Lead");
const { authorizeAdmin } = require("../../../middlewares");

LeadRouter.get("/all", getAllLeads);
LeadRouter.get("/find/:id", getOneLead);
LeadRouter.post("/create", authorizeAdmin, createOneLead);
LeadRouter.patch("/update/:id", authorizeAdmin, updateOneLead);
LeadRouter.delete("/delete/:id", authorizeAdmin, deleteOneLead);

module.exports = LeadRouter;
