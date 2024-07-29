//router/Main/MainRouter.js

const MainRouter = require("express").Router();

//import routes
const DefaultRouter = require("./DefaultRoutes");
const AdminRouter = require("../Admin/AdminRoutes");
const UserRouter = require("../User/UserRoutes");
const GroupRouter = require("../Group/GroupRoutes");
const ChatRouter = require("../Chat/ChatRoutes");
const NotificationRouter = require("../Notification/NotificationRoutes");

//routes with prefixes
MainRouter.use("/admins", AdminRouter);
MainRouter.use("/users", UserRouter);
MainRouter.use("/groups", GroupRouter);
MainRouter.use("/chats", ChatRouter);
MainRouter.use("/notifications", NotificationRouter);

//default routes
MainRouter.use(DefaultRouter);

//export router
module.exports = { MainRouter };
