//router/Main/MainRouter.js

const MainRouter = require("express").Router();

//default route
const DefaultRouter = require("./DefaultRoutes");

//import routes
const AdminRouter = require("../Admin/AdminRoutes");
const UserRouter = require("../User/UserRoutes");
const GroupRouter = require("../Group/GroupRoutes");
const BlogRouter = require("../Content/BlogRoutes");
const BlogCategoryRouter = require("../Content/BlogCategoryRoutes");
const ServiceRouter = require("../Content/ServiceRoutes");
const PortfolioRouter = require("../Content/PortfolioRoutes");
const PortfolioCategoryRouter = require("../Content/PortfolioCategoryRoutes");
const TeamRouter = require("../Content/TeamRoutes");

//routes with prefixes
MainRouter.use("/admins", AdminRouter);
MainRouter.use("/users", UserRouter);
MainRouter.use("/groups", GroupRouter);
MainRouter.use("/blogs", BlogRouter);
MainRouter.use("/blog-categories", BlogCategoryRouter);
MainRouter.use("/services", ServiceRouter);
MainRouter.use("/protfolios", PortfolioRouter);
MainRouter.use("/portfolio-categories", PortfolioCategoryRouter);
MainRouter.use("/teams", TeamRouter);

//default routes
MainRouter.use(DefaultRouter);

//export router
module.exports = { MainRouter };
