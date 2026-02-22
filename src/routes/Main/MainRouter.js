//router/Main/MainRouter.js

const MainRouter = require("express").Router();

//default route
const DefaultRouter = require("./DefaultRoutes");

//import routes
const AdminRouter = require("../Admin/AdminRoutes");
const BlogRouter = require("../Content/BlogRoutes");
const BlogCategoryRouter = require("../Content/BlogCategoryRoutes");
const BlogAuthorRouter = require("../Content/BlogAuthorRoutes");
const ServiceRouter = require("../Content/ServiceRoutes");
const PortfolioRouter = require("../Content/PortfolioRoutes");
const PortfolioCategoryRouter = require("../Content/PortfolioCategoryRoutes");
const TeamRouter = require("../Content/TeamRoutes");
const JobRouter = require("../Content/JobRoutes");
const JobCategoryRouter = require("../Content/JobCategoryRoutes");
const ResumeRouter = require("../ResumeBank/ResumeBankRoutes");
const TestimonialRouter = require("../Testimonial/TestimonialRoutes");
const LeadRouter = require("../Settings/Lead/LeadRoutes");
const DashboardRouter = require("../Dashboard/DashboardRoutes");

const faRouter = require("../Totp/TotpRoutes");

//routes with prefixes
MainRouter.use("/admins", AdminRouter);
MainRouter.use("/blogs", BlogRouter);
MainRouter.use("/blog-categories", BlogCategoryRouter);
MainRouter.use("/blog-authors", BlogAuthorRouter);
MainRouter.use("/services", ServiceRouter);
MainRouter.use("/portfolios", PortfolioRouter);
MainRouter.use("/portfolio-categories", PortfolioCategoryRouter);
MainRouter.use("/teams", TeamRouter);
MainRouter.use("/jobs", JobRouter);
MainRouter.use("/job-categories", JobCategoryRouter);
MainRouter.use("/resumes", ResumeRouter);
MainRouter.use("/testimonials", TestimonialRouter);
MainRouter.use("/leads", LeadRouter);
MainRouter.use("/dashboard", DashboardRouter);

MainRouter.use("/2fa", faRouter);

//default routes
MainRouter.use(DefaultRouter);

//export router
module.exports = { MainRouter };
