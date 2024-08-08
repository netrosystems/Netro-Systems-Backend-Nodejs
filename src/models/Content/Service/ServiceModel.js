// models/Service.js
const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const { CustomError } = require("../../../services");

const serviceSchema = new mongoose.Schema({
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
  metaTitle: {
    type: String,
    default: "",
  },
  metaTags: {
    type: [String],
    default: [],
    required: true,
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
serviceSchema.pre("save", function (next) {
  this.updatedAt = () => Timekoto();
  next();
});

// Define a static method to get all services
serviceSchema.statics.getAllServices = async function () {
  try {
    // Find all services and populate the serviceedBy field while excluding the password field
    const services = await this.find()
      .sort({ createdAt: -1 })
      .populate("author", { fullName: 1, profileImage: 1, _id: 0 });

    if (services?.length === 0) {
      throw new CustomError(404, "No services found");
    }

    // Return services
    return services;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to get one service by id
serviceSchema.statics.getOneService = async function (serviceId) {
  try {
    // Find service by id and populate the serviceedBy field while excluding the password field
    const service = await this.findById(serviceId).populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    if (!service) {
      throw new CustomError(404, "Service not found");
    }

    // Return service
    return service;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to create a service
serviceSchema.statics.createOneService = async function (serviceData) {
  try {
    // Create service
    const service = await this.create(serviceData);

    await service.populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    // Return service
    return service;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to update a service by id
serviceSchema.statics.updateOneService = async function ({
  serviceId,
  updatedData,
}) {
  try {
    // Find service by id and update
    const service = await this.findByIdAndUpdate(serviceId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      throw new CustomError(404, "Service not found");
    }

    await service.populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    // Return service
    return service;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to delete a service by id
serviceSchema.statics.deleteOneService = async function (serviceId) {
  try {
    // Find service by id and delete
    const service = await this.findByIdAndDelete(serviceId);

    if (!service) {
      throw new CustomError(404, "Service not found");
    }

    // Return service
    return service;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
