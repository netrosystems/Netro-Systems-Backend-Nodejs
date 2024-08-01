const JobCategoryRouter = require("express").Router();

const {
  getAllCategories,
  getOneCategory,
  createOneCategory,
  updateOneCategory,
  deleteOneCategory,
} = require("../../controllers/Content/Job/JobCategoryController");
const { authorizeAdmin } = require("../../middlewares");

JobCategoryRouter.get("/all", getAllCategories);
JobCategoryRouter.get("/find/:id", getOneCategory);
JobCategoryRouter.post("/create", authorizeAdmin, createOneCategory);
JobCategoryRouter.patch("/update/:id", authorizeAdmin, updateOneCategory);
JobCategoryRouter.delete("/delete/:id", authorizeAdmin, deleteOneCategory);

module.exports = JobCategoryRouter;
