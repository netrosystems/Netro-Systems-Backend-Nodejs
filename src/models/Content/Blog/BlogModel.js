// models/Blog.js
const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const { CustomError } = require("../../../services");

const blogSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BlogAuthor",
    default: null,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  category: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
    trim: true,
    maxlength: 300,
  },
  excerpt: {
    type: String,
    default: "",
    trim: true,
    maxlength: 300,
  },
  readingTime: {
    type: Number,
    default: 0,
    required: true,
  },
  totalViews: {
    type: Number,
    default: 0,
    required: true,
  },
  featuredImage: {
    type: String,
    default: "https://via.placeholder.com/150",
    required: true,
  },
  featuredImageAlt: {
    type: String,
    default: "",
    maxlength: 180,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  metaTitle: {
    type: String,
    default: "",
  },
  metaDescription: {
    type: String,
    default: "",
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
  publishStatus: {
    type: String,
    enum: ["draft", "published", "scheduled"],
    default: "published",
  },
  scheduledAt: {
    type: Number,
    default: null,
  },
  publishedAt: {
    type: Number,
    default: null,
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

// Middleware to update `updatedAt` and sync description/excerpt on save
blogSchema.pre("save", function (next) {
  this.updatedAt = Timekoto();
  if (this.excerpt && !this.description) {
    this.description = this.excerpt;
  } else if (this.description && !this.excerpt) {
    this.excerpt = this.description;
  }
  next();
});

const liveBlogFilter = () => {
  const now = Timekoto();
  return {
    $or: [
      { publishStatus: "published", published: { $ne: false } },
      {
        publishStatus: "scheduled",
        published: { $ne: false },
        scheduledAt: { $lte: now },
      },
      {
        publishStatus: { $exists: false },
        scheduledAt: { $exists: false },
      },
      {
        publishStatus: null,
        scheduledAt: null,
      },
    ],
  };
};

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildPublicBlogQuery = ({ search, category, tag } = {}) => {
  const query = liveBlogFilter();

  if (category) {
    query.category = category;
  }

  if (tag) {
    query.tags = tag;
  }

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    query.$and = [
      {
        $or: [
          { title: searchRegex },
          { category: searchRegex },
          { tags: searchRegex },
          { metaDescription: searchRegex },
          { description: searchRegex },
          { excerpt: searchRegex },
        ],
      },
    ];
  }

  return query;
};

blogSchema.statics.activateDueScheduledBlogs = async function () {
  const now = Timekoto();

  const result = await this.updateMany(
    {
      publishStatus: "scheduled",
      scheduledAt: { $lte: now },
    },
    {
      $set: {
        publishStatus: "published",
        published: true,
        scheduledAt: null,
        publishedAt: now,
        updatedAt: now,
      },
    }
  );

  return result?.modifiedCount || 0;
};

blogSchema.index({ publishStatus: 1, published: 1, scheduledAt: 1, publishedAt: -1 });
blogSchema.index({ category: 1, publishStatus: 1, published: 1, publishedAt: -1 });
blogSchema.index({ isFeatured: 1, publishStatus: 1, published: 1, publishedAt: -1 });

// Define a static method to get all blogs (public with pagination and search)
blogSchema.statics.getAllBlogs = async function (queryParams = {}) {
  try {
    await this.activateDueScheduledBlogs();
    const page = Math.max(parseInt(queryParams.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(queryParams.limit, 10) || 100, 1), 100);
    const skip = (page - 1) * limit;
    const query = buildPublicBlogQuery(queryParams);

    const blogs = await this.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", { name: 1, image: 1, title: 1, _id: 1 });
    const total = await this.find(query).countDocuments();

    if (blogs?.length === 0) {
      throw new CustomError(404, "No blogs found");
    }

    return { data: blogs, total, page, limit, totalPages: Math.ceil(total / limit) };
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to get all blogs for admin
blogSchema.statics.getAllBlogsForAdmin = async function () {
  try {
    await this.activateDueScheduledBlogs();
    const blogs = await this.find()
      .sort({ createdAt: -1 })
      .populate("author", { name: 1, image: 1, title: 1, _id: 1 });

    if (blogs?.length === 0) {
      throw new CustomError(404, "No blogs found");
    }

    return blogs;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

blogSchema.statics.getPublishedBlogsForAdmin = async function () {
  try {
    await this.activateDueScheduledBlogs();
    const now = Timekoto();
    const blogs = await this.find({
      $or: [
        { publishStatus: "published", published: { $ne: false } },
        {
          publishStatus: "scheduled",
          published: { $ne: false },
          scheduledAt: { $lte: now },
        },
        {
          publishStatus: { $exists: false },
          scheduledAt: { $exists: false },
        },
        {
          publishStatus: null,
          scheduledAt: null,
        },
      ],
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .populate("author", { name: 1, image: 1, title: 1, _id: 1 });

    if (blogs?.length === 0) {
      throw new CustomError(404, "No published blogs found");
    }

    return blogs;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

blogSchema.statics.getScheduledBlogs = async function () {
  try {
    await this.activateDueScheduledBlogs();
    const now = Timekoto();
    const blogs = await this.find({
      publishStatus: "scheduled",
      published: true,
      scheduledAt: { $gt: now },
    })
      .sort({ scheduledAt: 1 })
      .populate("author", { name: 1, image: 1, title: 1, _id: 1 });

    if (blogs?.length === 0) {
      throw new CustomError(404, "No scheduled blogs found");
    }

    return blogs;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

blogSchema.statics.getDraftBlogs = async function () {
  try {
    const blogs = await this.find({ publishStatus: "draft" })
      .sort({ updatedAt: -1, createdAt: -1 })
      .populate("author", { name: 1, image: 1, title: 1, _id: 1 });

    if (blogs?.length === 0) {
      throw new CustomError(404, "No draft blogs found");
    }

    return blogs;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

blogSchema.statics.getRelatedBlogs = async function (blogSlug, limit = 5) {
  try {
    await this.activateDueScheduledBlogs();
    const currentBlog = await this.findOne({ slug: blogSlug });
    if (!currentBlog) {
      throw new CustomError(404, "Blog not found");
    }

    const blogs = await this.find({
      ...liveBlogFilter(),
      _id: { $ne: currentBlog._id },
      $or: [
        { category: currentBlog.category },
        { tags: { $in: currentBlog.tags || [] } },
      ],
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .populate("author", { name: 1, image: 1, title: 1, _id: 0 });

    return blogs;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// get blogs for landing page (3 most recent featured live blogs)
blogSchema.statics.getBlogsForLandingPage = async function () {
  try {
    await this.activateDueScheduledBlogs();
    const blogs = await this.find({ ...liveBlogFilter(), isFeatured: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3)
      .populate("author", { name: 1, image: 1, title: 1, _id: 0 });

    if (blogs?.length === 0) {
      // Fallback to 3 most recent live blogs if none featured
      const fallbackBlogs = await this.find(liveBlogFilter())
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(3)
        .populate("author", { name: 1, image: 1, title: 1, _id: 0 });

      if (fallbackBlogs?.length === 0) {
        throw new CustomError(404, "No blogs found");
      }
      return fallbackBlogs;
    }

    return blogs;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to get one blog by id
blogSchema.statics.getOneBlog = async function (blogId) {
  try {
    await this.activateDueScheduledBlogs();
    const blog = await this.findById(blogId).populate("author", {
      name: 1,
      image: 1,
      title: 1,
      _id: 0,
    });

    if (!blog) {
      throw new CustomError(404, "Blog not found");
    }

    return blog;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// get blog by title (case insensitive)
blogSchema.statics.getBlogByTitle = async function (blogTitle) {
  try {
    await this.activateDueScheduledBlogs();
    const blog = await this.findOne({
      ...liveBlogFilter(),
      title: { $regex: new RegExp(`^${blogTitle}$`, "i") },
    }).populate("author", { name: 1, image: 1, title: 1, _id: 0 });

    if (!blog) {
      throw new CustomError(404, "Blog not found");
    }

    return blog;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// get blog by slug
blogSchema.statics.getBlogBySlug = async function (blogSlug) {
  try {
    await this.activateDueScheduledBlogs();
    const blog = await this.findOne({
      ...liveBlogFilter(),
      slug: blogSlug,
    }).populate("author", {
      name: 1,
      image: 1,
      title: 1,
      _id: 0,
    });

    if (!blog) {
      throw new CustomError(404, "Blog not found");
    }

    return blog;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to increase blog view count by 1
blogSchema.statics.increaseBlogViewCount = async function (blogId) {
  try {
    const blog = await this.findByIdAndUpdate(
      blogId,
      { $inc: { totalViews: 1 } },
      { new: true, runValidators: true }
    );

    if (!blog) {
      throw new CustomError(404, "Blog not found");
    }

    return blog;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to get 3 most recent blogs
blogSchema.statics.getMostRecentBlogs = async function () {
  try {
    await this.activateDueScheduledBlogs();
    const blogs = await this.find(liveBlogFilter())
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3)
      .populate("author", { name: 1, image: 1, title: 1, _id: 0 });

    if (blogs?.length === 0) {
      throw new CustomError(404, "No blogs found");
    }

    return blogs;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to get blogs by category
blogSchema.statics.getBlogsByCategory = async function (blogCategory) {
  try {
    await this.activateDueScheduledBlogs();
    const blogs = await this.find({ ...liveBlogFilter(), category: blogCategory })
      .sort({ publishedAt: -1, createdAt: -1 })
      .populate("author", { name: 1, image: 1, title: 1, _id: 0 });

    if (blogs?.length === 0) {
      throw new CustomError(404, "No blogs found");
    }

    return blogs;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to get featured blogs
blogSchema.statics.getFeaturedBlogs = async function () {
  try {
    await this.activateDueScheduledBlogs();
    const blogs = await this.find({ ...liveBlogFilter(), isFeatured: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .populate("author", { name: 1, image: 1, title: 1, _id: 0 });

    if (blogs?.length === 0) {
      throw new CustomError(404, "No featured blogs found");
    }

    return blogs;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to create a blog
blogSchema.statics.createOneBlog = async function (blogData) {
  try {
    const blogExists = await this.findOne({
      title: { $regex: new RegExp(`^${blogData.title}$`, "i") },
    });

    if (blogExists) {
      throw new CustomError(400, "Blog already exists with the same title");
    }

    const blog = await this.create(blogData);

    await blog.populate("author", {
      name: 1,
      image: 1,
      title: 1,
      _id: 1,
    });

    return blog;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to update a blog by id
blogSchema.statics.updateOneBlog = async function ({ blogId, updatedData }) {
  try {
    const blog = await this.findByIdAndUpdate(blogId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      throw new CustomError(404, "Blog not found");
    }

    await blog.populate("author", {
      name: 1,
      image: 1,
      title: 1,
      _id: 1,
    });

    return blog;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to toggle featured status of a blog by id
blogSchema.statics.toggleFeaturedStatus = async function (blogId) {
  try {
    const existingBlog = await this.findById(blogId);
    if (!existingBlog) {
      throw new CustomError(404, "Blog not found");
    }

    const blog = await this.findByIdAndUpdate(
      blogId,
      { isFeatured: !existingBlog.isFeatured, updatedAt: Timekoto() },
      { new: true, runValidators: true }
    );

    if (!blog) {
      throw new CustomError(404, "Blog not found");
    }

    return blog;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to delete a blog by id
blogSchema.statics.deleteOneBlog = async function (blogId) {
  try {
    const blog = await this.findByIdAndDelete(blogId);

    if (!blog) {
      throw new CustomError(404, "Blog not found");
    }

    return blog;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// count documents
blogSchema.statics.countDocuments = async function () {
  try {
    const count = await this.find().countDocuments();
    return count;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
