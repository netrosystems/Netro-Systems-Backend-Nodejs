const ServiceRouter = require("express").Router();

const {
  getAllServices,
  getOneService,
  getServiceByTitle,
  createOneService,
  updateOneService,
  deleteOneService,
} = require("../../controllers/Content/Service/ServiceController");
const { authorizeAdmin } = require("../../middlewares");

ServiceRouter.get("/all", getAllServices);
ServiceRouter.get("/find/:id", getOneService);
ServiceRouter.get("/find-by-title/:title", getServiceByTitle);
ServiceRouter.post("/create", authorizeAdmin, createOneService);
ServiceRouter.patch("/update/:id", authorizeAdmin, updateOneService);
ServiceRouter.delete("/delete/:id", authorizeAdmin, deleteOneService);

module.exports = ServiceRouter;
