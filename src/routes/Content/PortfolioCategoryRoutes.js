const PortfolioRouter = require("express").Router();

const {
  getAllCategories,
  getOneCategory,
  createOneCategory,
  updateOneCategory,
  deleteOneCategory,
} = require("../../controllers/Content/Portfolio/PortfolioCategoryController");
const { authorizeAdmin } = require("../../middlewares");

PortfolioRouter.get("/all", getAllCategories);
PortfolioRouter.get("/find/:id", getOneCategory);
PortfolioRouter.post("/create", authorizeAdmin, createOneCategory);
PortfolioRouter.patch("/update/:id", authorizeAdmin, updateOneCategory);
PortfolioRouter.delete("/delete/:id", authorizeAdmin, deleteOneCategory);

module.exports = PortfolioRouter;
