// models/Content/Team/TeamModel.js

const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const { CustomError } = require("../../../services");

const teamSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  designation: {
    type: String,
    required: true,
  },
  facebook: {
    type: String,
    default: null,
  },
  twitter: {
    type: String,
    default: null,
  },
  linkedin: {
    type: String,
    default: null,
  },
  steam: {
    type: String,
    default: null,
  },
  other: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/150",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
    required: true,
  },
  publishedAt: {
    type: Number,
    default: () => Timekoto(),
    required: true,
  },
  createdAt: {
    type: Number,
    default: () => Timekoto(),
    required: true,
  },
  updatedAt: {
    type: Number,
    default: () => Timekoto(),
    required: true,
  },
});

// Middleware to update `updatedAt` on every save
teamSchema.pre("save", function (next) {
  this.updatedAt = () => Timekoto();
  next();
});

// Define a static method to get all teams
teamSchema.statics.getAllTeams = async function () {
  try {
    // Find all teams and populate the teamedBy field while excluding the password field
    const teams = await this.find()
      .sort({ createdAt: -1 })
      .populate("author", { fullName: 1, profileImage: 1, _id: 0 });

    if (teams?.length === 0) {
      throw new CustomError(404, "No teams found");
    }

    // Return teams
    return teams;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to get one team by id
teamSchema.statics.getOneTeam = async function (teamId) {
  try {
    // Find team by id and populate the teamedBy field while excluding the password field
    const team = await this.findById(teamId).populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    if (!team) {
      throw new CustomError(404, "Team not found");
    }

    // Return team
    return team;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to create a team
teamSchema.statics.createOneTeam = async function (teamData) {
  try {
    // Create team
    const team = await this.create(teamData);

    await team.populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    // Return team
    return team;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to update a team by id
teamSchema.statics.updateOneTeam = async function ({ teamId, updatedData }) {
  try {
    // Find team by id and update
    const team = await this.findByIdAndUpdate(teamId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!team) {
      throw new CustomError(404, "Team not found");
    }

    await team.populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    // Return team
    return team;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to delete a team by id
teamSchema.statics.deleteOneTeam = async function (teamId) {
  try {
    // Find team by id and delete
    const team = await this.findByIdAndDelete(teamId);

    if (!team) {
      throw new CustomError(404, "Team not found");
    }

    // Return team
    return team;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
