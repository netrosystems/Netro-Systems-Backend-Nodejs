// models/Author.js
const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const { CustomError } = require("../../../services");

const authorSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/150",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
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
authorSchema.pre("save", function (next) {
  this.updatedAt = () => Timekoto();
  next();
});

// Define a static method to get all authors
authorSchema.statics.getAllAuthors = async function () {
  try {
    // Find all authors
    const authors = await this.find()
      .sort({ createdAt: -1 })
      .select("-createdBy");

    if (authors?.length === 0) {
      throw new CustomError(404, "No authors found");
    }

    // Return authors
    return authors;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to get one author by id
authorSchema.statics.getOneAuthor = async function (authorId) {
  try {
    // Find author by id
    const author = await this.findById(authorId).select("-createdBy");

    if (!author) {
      throw new CustomError(404, "Author not found");
    }

    // Return author
    return author;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to create a author
authorSchema.statics.createOneAuthor = async function (authorData) {
  try {
    // Create author
    let author = await this.create(authorData);

    // Convert to plain JavaScript object
    author = author.toObject();

    // Remove createdBy field
    delete author.createdBy;

    // Return author without createdBy
    return author;
  } catch (error) {
    throw new CustomError(
      error?.statusCode,
      error?.message || "Failed to create author"
    );
  }
};
// Define a static method to update a author by id
authorSchema.statics.updateOneAuthor = async function ({
  authorId,
  updatedData,
}) {
  try {
    // Find author by id and update
    const author = await this.findByIdAndUpdate(authorId, updatedData, {
      new: true,
      runValidators: true,
    }).select("-createdBy");

    if (!author) {
      throw new CustomError(404, "Author not found");
    }

    // Return author
    return author;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to delete a author by id
authorSchema.statics.deleteOneAuthor = async function (authorId) {
  try {
    // Find author by id and delete
    const author = await this.findByIdAndDelete(authorId).select(
      "-createdBy"
    );

    if (!author) {
      throw new CustomError(404, "Author not found");
    }

    // Return author
    return author;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const BlogAuthor = mongoose.model("BlogAuthor", authorSchema);

module.exports = BlogAuthor;
