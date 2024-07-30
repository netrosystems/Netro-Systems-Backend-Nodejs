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

//routes with prefixes
MainRouter.use("/admins", AdminRouter);
MainRouter.use("/users", UserRouter);
MainRouter.use("/groups", GroupRouter);
MainRouter.use("/blogs", BlogRouter);
MainRouter.use("/blog-categories", BlogCategoryRouter);

//default routes
MainRouter.use(DefaultRouter);

//export router
module.exports = { MainRouter };
