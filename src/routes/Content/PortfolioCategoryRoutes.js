const PortfolioCategoryRouter = require("express").Router();

const {
  getAllCategories,
  getOneCategory,
  createOneCategory,
  updateOneCategory,
  deleteOneCategory,
} = require("../../controllers/Content/Portfolio/PortfolioCategoryController");
const { authorizeAdmin } = require("../../middlewares");

PortfolioCategoryRouter.get("/all", getAllCategories);
PortfolioCategoryRouter.get("/find/:id", getOneCategory);
PortfolioCategoryRouter.post("/create", authorizeAdmin, createOneCategory);
PortfolioCategoryRouter.patch("/update/:id", authorizeAdmin, updateOneCategory);
PortfolioCategoryRouter.delete(
  "/delete/:id",
  authorizeAdmin,
  deleteOneCategory
);

module.exports = PortfolioCategoryRouter;
