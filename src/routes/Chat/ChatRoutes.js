//router/Chat/ChatRoutes.js

const ChatRouter = require("express").Router();
const { authorizeRequest } = require("../../middlewares");
//group chat controller imports
const {
  getAllChatsByGroupId,
  getAllGroupsJoinedByUserWithLastMessage,
} = require("../../controllers/Chat/GroupChatController");
//individual chat controller imports
const {
  getIndivualChattedUsers,
  getAllIndividualChatsBetweenTwoUser,
} = require("../../controllers/Chat/IndividualChatController");

//individual chat routes
ChatRouter.get("/chatted-users", authorizeRequest, getIndivualChattedUsers);
ChatRouter.get(
  "/individual/:receiverId",
  authorizeRequest,
  getAllIndividualChatsBetweenTwoUser
);

//group chat routes
ChatRouter.get(
  "/my-groups",
  authorizeRequest,
  getAllGroupsJoinedByUserWithLastMessage
);
ChatRouter.get("/groups/:groupId", authorizeRequest, getAllChatsByGroupId);

//export router
module.exports = ChatRouter;
