//chat/GroupChatModule.js
const { Timekoto } = require("timekoto");
const Group = require("../models");
const { logger } = require("../services");
const GroupChatMessage = require("../models");

async function handleGroupMessage(io, data) {
  try {
    const { senderId, senderImage, groupId, message, attachment } = data;
    const processedData = {
      sender: senderId,
      senderImage: senderImage,
      group: groupId,
      message: message,
      attachment: attachment,
    };

    //get users list from the group
    const groupUsers = await Group.findById(groupId);
    if (!groupUsers) {
      throw new CustomError(404, "Group not found");
    }
    if (!groupUsers?.members) {
      throw new CustomError(404, "Group members not found");
    }
    groupUsers?.members?.forEach((id) => {
      io.to(id.toString()).emit("group", {
        ...processedData,
        createdAt: Timekoto(),
      });
    });

    //save the message to the database
    const newMessage = await GroupChatMessage.addGroupChatMessage(
      processedData
    );

    //log the message
    logger.log({
      level: "debug",
      message: `GROUP: Message sent from "${senderId}" to the group"${groupId}": \n messge: "${message}" \n attachment: "${attachment}"`,
    });

    // io.to(groupId).emit("group", newMessage);
  } catch (error) {
    console.error("Error saving group chat message:", error);
  }
}

module.exports = {
  handleGroupMessage,
};
