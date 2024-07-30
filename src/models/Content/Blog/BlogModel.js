// models/Blog.js
const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const { CustomError } = require("../../../services");

const blogSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  featuredImage: {
    type: String,
    default: "https://via.placeholder.com/150",
    required: true,
  },
  metaTags: {
    type: [String],
    default: [],
    required: true,
  },
  metaDescription: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
    required: true,
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
blogSchema.pre("save", function (next) {
  this.updatedAt = () => Timekoto();
  next();
});

// Define a static method to get all blogs
blogSchema.statics.getAllBlogs = async function () {
  try {
    // Find all blogs and populate the blogedBy field while excluding the password field
    const blogs = await this.find()
      .sort({ createdAt: -1 })
      .populate("author", { fullName: 1, profileImage: 1, _id: 0 });

    if (blogs?.length === 0) {
      throw new CustomError(404, "No blogs found");
    }

    // Return blogs
    return blogs;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to get one blog by id
blogSchema.statics.getOneBlog = async function (blogId) {
  try {
    // Find blog by id and populate the blogedBy field while excluding the password field
    const blog = await this.findById(blogId).populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    if (!blog) {
      throw new CustomError(404, "Blog not found");
    }

    // Return blog
    return blog;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to create a blog
blogSchema.statics.createOneBlog = async function (blogData) {
  try {
    // Create blog
    const blog = await this.create(blogData);

    await blog.populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    // Return blog
    return blog;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to update a blog by id
blogSchema.statics.updateOneBlog = async function ({ blogId, updatedData }) {
  try {
    // Find blog by id and update
    const blog = await this.findByIdAndUpdate(blogId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      throw new CustomError(404, "Blog not found");
    }

    await blog.populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    // Return blog
    return blog;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to delete a blog by id
blogSchema.statics.deleteOneBlog = async function (blogId) {
  try {
    // Find blog by id and delete
    const blog = await this.findByIdAndDelete(blogId);

    if (!blog) {
      throw new CustomError(404, "Blog not found");
    }

    // Return blog
    return blog;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
