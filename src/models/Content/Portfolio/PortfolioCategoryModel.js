// models/Category.js
const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const { CustomError } = require("../../../services");

const categorySchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  category: {
    type: String,
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
categorySchema.pre("save", function (next) {
  this.updatedAt = () => Timekoto();
  next();
});

// Define a static method to get all categories
categorySchema.statics.getAllCategories = async function () {
  try {
    // Find all categories and populate the categoryedBy field while excluding the password field
    const categories = await this.find()
      .sort({ createdAt: -1 })
      .select("-createdBy");

    if (categories?.length === 0) {
      throw new CustomError(404, "No categories found");
    }

    // Return categories
    return categories;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to get one category by id
categorySchema.statics.getOneCategory = async function (categoryId) {
  try {
    // Find category by id and populate the categoryedBy field while excluding the password field
    const category = await this.findById(categoryId).select("-createdBy");

    if (!category) {
      throw new CustomError(404, "Category not found");
    }

    // Return category
    return category;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to create a category
categorySchema.statics.createOneCategory = async function (categoryData) {
  try {
    // Create category
    let category = await this.create(categoryData);

    // Convert to plain JavaScript object
    category = category.toObject();

    // Remove createdBy field
    delete category.createdBy;

    // Return category without createdBy
    return category;
  } catch (error) {
    throw new CustomError(
      error?.statusCode,
      error?.message || "Failed to create category"
    );
  }
};
// Define a static method to update a category by id
categorySchema.statics.updateOneCategory = async function ({
  categoryId,
  updatedData,
}) {
  try {
    // Find category by id and update
    const category = await this.findByIdAndUpdate(categoryId, updatedData, {
      new: true,
      runValidators: true,
    }).select("-createdBy");

    if (!category) {
      throw new CustomError(404, "Category not found");
    }

    // Return category
    return category;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to delete a category by id
categorySchema.statics.deleteOneCategory = async function (categoryId) {
  try {
    // Find category by id and delete
    const category = await this.findByIdAndDelete(categoryId).select(
      "-createdBy"
    );

    if (!category) {
      throw new CustomError(404, "Category not found");
    }

    // Return category
    return category;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const PortfolioCategory = mongoose.model("PortfolioCategory", categorySchema);

module.exports = PortfolioCategory;
