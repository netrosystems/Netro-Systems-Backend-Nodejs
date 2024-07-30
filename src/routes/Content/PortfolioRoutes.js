const PortfolioRouter = require("express").Router();

const {
  getAllPortfolios,
  getOnePortfolio,
  createOnePortfolio,
  updateOnePortfolio,
  deleteOnePortfolio,
} = require("../../controllers/Content/Portfolio/PortfolioController");
const { authorizeAdmin } = require("../../middlewares");

PortfolioRouter.get("/all", getAllPortfolios);
PortfolioRouter.get("/find/:id", getOnePortfolio);
PortfolioRouter.post("/create", authorizeAdmin, createOnePortfolio);
PortfolioRouter.patch("/update/:id", authorizeAdmin, updateOnePortfolio);
PortfolioRouter.delete("/delete/:id", authorizeAdmin, deleteOnePortfolio);

module.exports = PortfolioRouter;
