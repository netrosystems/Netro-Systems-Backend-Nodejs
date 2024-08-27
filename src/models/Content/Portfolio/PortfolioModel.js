// models/Portfolio.js
const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const { CustomError } = require("../../../services");

const portfolioSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  clientOrigin: {
    type: String,
    required: true,
  },
  timeline: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  projectImages: {
    type: [String],
    default: [],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  liveUrl: {
    type: String,
    required: true,
  },
  userGained: {
    type: String,
    required: true,
  },
  investment: {
    type: String,
    required: true,
  },
  expansion: {
    type: String,
    required: true,
  },
  salesIncreased: {
    type: String,
    required: true,
  },
  featuredImage: {
    type: String,
    default: "https://via.placeholder.com/150",
    required: true,
  },
  metaTitle: {
    type: String,
    default: "",
  },
  metaDescription: {
    type: String,
    default: "",
  },
  published: {
    type: Boolean,
    default: false,
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
portfolioSchema.pre("save", function (next) {
  this.updatedAt = () => Timekoto();
  next();
});

// Define a static method to get all portfolios
portfolioSchema.statics.getAllPortfolios = async function () {
  try {
    // Find all portfolios and populate the portfolioedBy field while excluding the password field
    const portfolios = await this.find()
      .sort({ createdAt: -1 })
      .populate("author", { fullName: 1, profileImage: 1, _id: 0 });

    if (portfolios?.length === 0) {
      throw new CustomError(404, "No portfolios found");
    }

    // Return portfolios
    return portfolios;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to get one portfolio by id
portfolioSchema.statics.getOnePortfolio = async function (portfolioId) {
  try {
    // Find portfolio by id and populate the portfolioedBy field while excluding the password field
    const portfolio = await this.findById(portfolioId).populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    if (!portfolio) {
      throw new CustomError(404, "Portfolio not found");
    }

    // Return portfolio
    return portfolio;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to get portfolios by title
portfolioSchema.statics.getPortfolioByTitle = async function (portfolioTitle) {
  try {
    // Find portfolio by title and populate the portfolioedBy field while excluding the password field
    const portfolio = await this.findOne({
      title: { $regex: new RegExp(`^${portfolioTitle}$`, "i") },
    }).populate("author", { fullName: 1, profileImage: 1, _id: 0 });

    if (!portfolio) {
      throw new CustomError(404, "Portfolio not found");
    }

    // Return portfolio
    return portfolio;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define  a static method to get related portfolios by category
portfolioSchema.statics.getRelatedPortfoliosByCategory = async function (
  portfolioCategory
) {
  try {
    // Find related portfolios by category and populate the portfolioedBy field while excluding the password field
    const portfolios = await this.find({ category: portfolioCategory })
      .sort({ createdAt: -1 })
      .populate("author", { fullName: 1, profileImage: 1, _id: 0 });

    if (portfolios?.length === 0) {
      throw new CustomError(404, "No portfolios found");
    }

    // Return portfolios
    return portfolios;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to create a portfolio
portfolioSchema.statics.createOnePortfolio = async function (portfolioData) {
  try {
    //check if the title already exists (case insensitive)
    const portfolioExists = await this.findOne({
      title: { $regex: new RegExp(`^${portfolioData.title}$`, "i") },
    });

    if (portfolioExists) {
      throw new CustomError(
        400,
        "Portfolio already exists with the same title"
      );
    }

    // Create portfolio
    const portfolio = await this.create(portfolioData);

    await portfolio.populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    // Return portfolio
    return portfolio;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to update a portfolio by id
portfolioSchema.statics.updateOnePortfolio = async function ({
  portfolioId,
  updatedData,
}) {
  try {
    // Find portfolio by id and update
    const portfolio = await this.findByIdAndUpdate(portfolioId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!portfolio) {
      throw new CustomError(404, "Portfolio not found");
    }

    await portfolio.populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    // Return portfolio
    return portfolio;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to delete a portfolio by id
portfolioSchema.statics.deleteOnePortfolio = async function (portfolioId) {
  try {
    // Find portfolio by id and delete
    const portfolio = await this.findByIdAndDelete(portfolioId);

    if (!portfolio) {
      throw new CustomError(404, "Portfolio not found");
    }

    // Return portfolio
    return portfolio;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;
