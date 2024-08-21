const ResumeRouter = require("express").Router();

const {
  getAllResumes,
  getResumeCount,
  getAllResumesForOneJob,
  getOneResume,
  createOneResume,
  updateOneResume,
  deleteOneResume,
} = require("../../controllers/ResumeBank/ResumeBankController");
const { authorizeAdmin } = require("../../middlewares");

ResumeRouter.get("/all", getAllResumes);
ResumeRouter.get("/count", getResumeCount);
ResumeRouter.get("/job/:id", getAllResumesForOneJob);
ResumeRouter.get("/find/:id", getOneResume);
ResumeRouter.post("/create", createOneResume);
ResumeRouter.patch("/update/:id", authorizeAdmin, updateOneResume);
ResumeRouter.delete("/delete/:id", authorizeAdmin, deleteOneResume);

module.exports = ResumeRouter;
