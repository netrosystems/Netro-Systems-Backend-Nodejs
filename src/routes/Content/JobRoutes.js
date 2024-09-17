const JobRouter = require("express").Router();

const {
  getAllJobs,
  getAllActiveJobs,
  getOneJob,
  createOneJob,
  updateOneJob,
  toggleJobStatus,
  deleteOneJob,
} = require("../../controllers/Content/Job/JobController");
const { authorizeAdmin } = require("../../middlewares");

JobRouter.get("/all", getAllJobs);
JobRouter.get("/active", getAllActiveJobs);
JobRouter.get("/find/:id", getOneJob);
JobRouter.post("/create", authorizeAdmin, createOneJob);
JobRouter.patch("/update/:id", authorizeAdmin, updateOneJob);
JobRouter.patch("/toggle-status/:id", authorizeAdmin, toggleJobStatus);
JobRouter.delete("/delete/:id", authorizeAdmin, deleteOneJob);

module.exports = JobRouter;
