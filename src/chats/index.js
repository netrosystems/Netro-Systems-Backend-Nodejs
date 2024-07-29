//chats/index.js

const { handleGroupMessage } = require("./GroupChatModule");
const { handleIndividualMessage } = require("./IndividualChatModule");

module.exports = {
  handleGroupMessage,
  handleIndividualMessage,
};
