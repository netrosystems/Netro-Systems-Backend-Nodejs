const PortfolioRouter = require("express").Router();

const {
  getAllPortfolios,
  getOnePortfolio,
  getRelatedPortfoliosByCategory,
  createOnePortfolio,
  updateOnePortfolio,
  deleteOnePortfolio,
} = require("../../controllers/Content/Portfolio/PortfolioController");
const { authorizeAdmin } = require("../../middlewares");

PortfolioRouter.get("/all", getAllPortfolios);
PortfolioRouter.get("/find/:id", getOnePortfolio);
PortfolioRouter.get("/related/:category", getRelatedPortfoliosByCategory);
PortfolioRouter.post("/create", authorizeAdmin, createOnePortfolio);
PortfolioRouter.patch("/update/:id", authorizeAdmin, updateOnePortfolio);
PortfolioRouter.delete("/delete/:id", authorizeAdmin, deleteOnePortfolio);

module.exports = PortfolioRouter;
