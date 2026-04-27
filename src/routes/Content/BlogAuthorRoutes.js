const BlogAuthorRouter = require("express").Router();

const {
  getAllAuthors,
  getOneAuthor,
  createOneAuthor,
  updateOneAuthor,
  deleteOneAuthor,
} = require("../../controllers/Content/Blog/BlogAuthorController");
const { authorizeAdmin } = require("../../middlewares");

BlogAuthorRouter.get("/all", getAllAuthors);
BlogAuthorRouter.get("/find/:id", getOneAuthor);
BlogAuthorRouter.post("/create", authorizeAdmin, createOneAuthor);
BlogAuthorRouter.patch("/update/:id", authorizeAdmin, updateOneAuthor);
BlogAuthorRouter.delete("/delete/:id", authorizeAdmin, deleteOneAuthor);

module.exports = BlogAuthorRouter;
