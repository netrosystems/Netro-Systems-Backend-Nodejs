const JobRouter = require("express").Router();

const {
  getAllJobs,
  getOneJob,
  createOneJob,
  updateOneJob,
  deleteOneJob,
} = require("../../controllers/Content/Job/JobController");
const { authorizeAdmin } = require("../../middlewares");

JobRouter.get("/all", getAllJobs);
JobRouter.get("/find/:id", getOneJob);
JobRouter.post("/create", authorizeAdmin, createOneJob);
JobRouter.patch("/update/:id", authorizeAdmin, updateOneJob);
JobRouter.delete("/delete/:id", authorizeAdmin, deleteOneJob);

module.exports = JobRouter;
