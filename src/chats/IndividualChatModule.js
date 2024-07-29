//chat/IndividualChatModule.js
const { Timekoto } = require("timekoto");
const IndividualChatMessage = require("../models");
const { logger, CustomError } = require("../services");

async function handleIndividualMessage(io, data) {
  try {
    const { senderId, senderImage, receiverId, message, attachment } = data;
    //save the message to the database
    const processedData = {
      sender: senderId,
      senderImage: senderImage,
      receiver: receiverId,
      message: message,
      attachment: attachment,
    };

    //emit the message to the sender and receiver
    io.to(senderId).emit("individual", {
      ...processedData,
      createdAt: Timekoto(),
    });
    io.to(receiverId).emit("individual", {
      ...processedData,
      createdAt: Timekoto(),
    });

    //save the message to the database
    await IndividualChatMessage.addIndividualChatMessage(
      processedData
    );

    //log the message
    logger.log({
      level: "debug",
      message: `INDIVIDUAL: Message sent from "${senderId}" to "${receiverId}": \n messge: "${message}" \n attachment: "${attachment}"`,
    });

    return;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
}

module.exports = {
  handleIndividualMessage,
};
