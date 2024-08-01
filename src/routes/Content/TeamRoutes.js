const TeamRouter = require("express").Router();

const {
  getAllTeams,
  getOneTeam,
  createOneTeam,
  updateOneTeam,
  deleteOneTeam,
} = require("../../controllers/Content/Team/TeamController");
const { authorizeAdmin } = require("../../middlewares");

TeamRouter.get("/all", getAllTeams);
TeamRouter.get("/find/:id", getOneTeam);
TeamRouter.post("/create", authorizeAdmin, createOneTeam);
TeamRouter.patch("/update/:id", authorizeAdmin, updateOneTeam);
TeamRouter.delete("/delete/:id", authorizeAdmin, deleteOneTeam);

module.exports = TeamRouter;
