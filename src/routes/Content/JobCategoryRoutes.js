const JobRouter = require("express").Router();

const {
  getAllCategories,
  getOneCategory,
  createOneCategory,
  updateOneCategory,
  deleteOneCategory,
} = require("../../controllers/Content/Job/JobCategoryController");
const { authorizeAdmin } = require("../../middlewares");

JobRouter.get("/all", getAllCategories);
JobRouter.get("/find/:id", getOneCategory);
JobRouter.post("/create", authorizeAdmin, createOneCategory);
JobRouter.patch("/update/:id", authorizeAdmin, updateOneCategory);
JobRouter.delete("/delete/:id", authorizeAdmin, deleteOneCategory);

module.exports = JobRouter;
