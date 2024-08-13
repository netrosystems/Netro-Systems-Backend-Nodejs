// controllers/Content/Portfolio/PortfolioController.js

const { asyncHandler } = require("../../../middlewares");
const { Portfolio } = require("../../../models");
const {
  handleFileUpload,
  sendResponse,
  ObjectIdChecker,
  CustomError,
} = require("../../../services");

//get all Portfolio using mongoose
const getAllPortfolios = async (req, res) => {
  //perform query on database
  const portfolios = await Portfolio.getAllPortfolios();
  return sendResponse(res, 200, "Fetched all portfolios", portfolios);
};

//get one Portfolio using mongoose
const getOnePortfolio = async (req, res) => {
  const portfolioId = req?.params?.id;
  //object id validation
  if (!ObjectIdChecker(portfolioId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const portfolio = await Portfolio.getOnePortfolio(portfolioId);
  return sendResponse(res, 200, "Portfolio retrieved successfully", portfolio);
};

//get related portfolios using mongoose
const getRelatedPortfoliosByCategory = async (req, res) => {
  const portfolioCategory = req?.params?.category;

  //perform query on database
  const portfolios = await Portfolio.getRelatedPortfoliosByCategory(
    portfolioCategory
  );
  return sendResponse(
    res,
    200,
    "Related portfolios retrieved successfully",
    portfolios
  );
};

// //get featured portfolios using mongoose
// const getFeaturedPortfolios = async (req, res) => {
//   //perform query on database
//   const portfolios = await Portfolio.getFeaturedPortfolios();
//   return sendResponse(
//     res,
//     200,
//     "Featured portfolios retrieved successfully",
//     portfolios
//   );
// };

// Create a new Portfolio
const createOnePortfolio = async (req, res) => {
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const files = req?.files;

  const {
    title,
    videoUrl,
    clientOrigin,
    timeline,
    content,
    category,
    type,
    liveUrl,
    projectImages,
    userGained,
    investment,
    expansion,
    salesIncreased,
    metaTags,
    metaDescription,
  } = data;

  if (
    !title ||
    !videoUrl ||
    !clientOrigin ||
    !timeline ||
    !content ||
    !category ||
    !type ||
    !liveUrl ||
    !projectImages ||
    !userGained ||
    !investment ||
    !expansion ||
    !salesIncreased ||
    !metaTags ||
    !metaDescription
  ) {
    throw new CustomError(
      400,
      "These fields are required: title, videoUrl, clientOrigin, timeline, content, category, type, liveUrl,projectImages, userGained, investment, expansion, salesIncreased, metaTags, metaDescription"
    );
  }

  //validate authority from middleware authentication
  const userId = req?.auth?._id;
  if (!userId) {
    throw new CustomError(401, "Unauthorized user");
  }

  let updatedData = {
    author: userId,
    title,
    videoUrl,
    clientOrigin,
    timeline,
    content,
    category,
    type,
    liveUrl,
    projectImages,
    userGained,
    investment,
    expansion,
    salesIncreased,
    metaTags,
    metaDescription,
  };
  const folderName = "portfolios";

  //upload featuredImage
  if (files?.single) {
    const fileUrls = await handleFileUpload({
      req,
      files: files?.single,
      folderName,
    });
    const featuredImage = fileUrls[0];
    updatedData = { ...updatedData, featuredImage };
  }

  //upload projectImages
  // if (files?.multiple) {
  //   const fileUrls = await handleFileUpload({
  //     req,
  //     files: files?.multiple,
  //     folderName,
  //   });
  //   const projectImages = fileUrls;
  //   updatedData = { ...updatedData, projectImages };
  // }

  //perform query on database
  const portfolio = await Portfolio.createOnePortfolio(updatedData);
  return sendResponse(res, 201, "Portfolio created successfully", portfolio);
};

//update a Portfolio using mongoose
const updateOnePortfolio = async (req, res) => {
  const portfolioId = req?.params?.id;
  const files = req?.files;
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};

  //object id validation
  if (!ObjectIdChecker(portfolioId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  let updatedData = data ? data : {};
  const folderName = "portfolios";

  //upload featuredImage
  if (files?.single) {
    const fileUrls = await handleFileUpload({
      req,
      files: files?.single,
      folderName,
    });
    const featuredImage = fileUrls[0];
    updatedData = { ...updatedData, featuredImage };
  }

  //upload projectImages
  // if (files?.multiple) {
  //   const fileUrls = await handleFileUpload({
  //     req,
  //     files: files?.multiple,
  //     folderName,
  //   });
  //   const projectImages = fileUrls;
  //   updatedData = { ...updatedData, projectImages };
  // }

  //perform query on database
  const updatedPortfolio = await Portfolio.updateOnePortfolio({
    portfolioId,
    updatedData,
  });
  return sendResponse(
    res,
    200,
    "Portfolio updated successfully",
    updatedPortfolio
  );
};

//delete a Portfolio using mongoose
const deleteOnePortfolio = async (req, res) => {
  const portfolioId = req?.params?.id;

  //object id validation
  if (!ObjectIdChecker(portfolioId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const deletedPortfolio = await Portfolio.deleteOnePortfolio(portfolioId);
  return sendResponse(
    res,
    200,
    "Portfolio deleted successfully",
    deletedPortfolio
  );
};

module.exports = {
  getAllPortfolios: asyncHandler(getAllPortfolios),
  getOnePortfolio: asyncHandler(getOnePortfolio),
  getRelatedPortfoliosByCategory: asyncHandler(getRelatedPortfoliosByCategory),
  createOnePortfolio: asyncHandler(createOnePortfolio),
  updateOnePortfolio: asyncHandler(updateOnePortfolio),
  deleteOnePortfolio: asyncHandler(deleteOnePortfolio),
};
