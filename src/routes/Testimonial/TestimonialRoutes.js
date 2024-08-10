const TestimonialRouter = require("express").Router();

const {
  getAllTestimonials,
  getOneTestimonial,
  createOneTestimonial,
  updateOneTestimonial,
  deleteOneTestimonial,
} = require("../../controllers/Testimonial/TestimonialController");
const { authorizeAdmin } = require("../../middlewares");

TestimonialRouter.get("/all", getAllTestimonials);
TestimonialRouter.get("/find/:id", getOneTestimonial);
TestimonialRouter.post("/create", authorizeAdmin, createOneTestimonial);
TestimonialRouter.patch("/update/:id", authorizeAdmin, updateOneTestimonial);
TestimonialRouter.delete("/delete/:id", authorizeAdmin, deleteOneTestimonial);

module.exports = TestimonialRouter;
