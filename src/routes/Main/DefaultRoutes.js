//router/Main/DefaultRoutes.js

// Init the default routes for the server
const express = require("express");
const path = require("path");
const DefaultRouter = require("express").Router();
const { getMetrics } = require("../../../config");
const {
  sendResponse,
  sendError,
  handleFileUpload,
  logger,
  handleFileDelete,
} = require("../../services");
const { authorizeAdmin } = require("../../middlewares");

// Default route
DefaultRouter.get("/", (req, res) => {
  logger.log("info", "welcome to the server!");
  sendResponse(res, 200, "Welcome to the server!");
});

// Expose metrics endpoint for Prometheus to scrape
DefaultRouter.get("/metrics", getMetrics);

// File upload and send the file path in response
DefaultRouter.post("/upload", async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return sendError(res, 400, "No attachment found to be uploaded!");
    }
    if (!req.files.single) {
      return sendError(res, 400, "No attachment found to be uploaded!");
    }
    const folderName = "attachments";
    //upload file
    const fileUrls = await handleFileUpload({
      req,
      files: req.files.single,
      folderName,
    });
    //get the first attachment url
    const attachment = fileUrls[0];
    //send response
    sendResponse(res, 200, "Attachment uploaded successfully!", {
      attachmentUrl: attachment,
    });
  } catch (error) {
    sendError(res, 500, error?.message || "Internal server error");
  }
});

// Serve uploaded files statically
DefaultRouter.use(
  "/uploads",
  express.static(path.join(__dirname, "../../../uploads"))
);

// Delete uploaded files by providing the file URL in the request body
DefaultRouter.delete("/delete-file", authorizeAdmin, async (req, res) => {
  try {
    const { fileUrl } = req.query;

    console.log("Delete fileUrl:", fileUrl);

    if (!fileUrl || typeof fileUrl !== "string") {
      return sendError(res, 400, "fileUrl query param is required");
    }

    const deleted = await handleFileDelete(fileUrl);

    if (!deleted) {
      return sendError(res, 404, "File not found or already deleted");
    }

    return sendResponse(res, 200, "File deleted successfully");
  } catch (error) {
    return sendError(
      res,
      500,
      error?.message || "Internal server error"
    );
  }
});

//not found route
DefaultRouter.use((req, res) => {
  sendError(res, 404, "Route not found");
});

//export the router
module.exports = DefaultRouter;
