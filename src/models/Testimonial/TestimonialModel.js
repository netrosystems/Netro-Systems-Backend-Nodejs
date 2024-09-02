// models/testimonial.js
const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const { CustomError } = require("../../services");

const testimonialSchema = new mongoose.Schema({
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
  occupation: {
    type: String,
    default: "",
    required: true,
  },
  review: {
    type: String,
    default: "",
    required: true,
  },
  imageUrl: {
    type: String,
    default: "",
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
testimonialSchema.pre("save", function (next) {
  this.updatedAt = () => Timekoto();
  next();
});

// Define a static method to get all testimonials
testimonialSchema.statics.getAllTestimonials = async function () {
  try {
    // Find all testimonials and populate the testimonialedBy field while excluding the password field
    const testimonials = await this.find()
      // .sort({ createdAt: -1 })
      .populate("author", { fullName: 1, profileImage: 1, _id: 0 });

    if (testimonials?.length === 0) {
      throw new CustomError(404, "No testimonials found");
    }

    //randomize the order of testimonials
    testimonials.sort(() => Math.random() - 0.5);

    // Return testimonials
    return testimonials;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to get one testimonial by id
testimonialSchema.statics.getOneTestimonial = async function (testimonialId) {
  try {
    // Find testimonial by id and populate the testimonialedBy field while excluding the password field
    const testimonial = await this.findById(testimonialId).populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    if (!testimonial) {
      throw new CustomError(404, "Testimonial not found");
    }

    // Return testimonial
    return testimonial;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to create a testimonial
testimonialSchema.statics.createOneTestimonial = async function (
  testimonialData
) {
  try {
    // Create testimonial
    const testimonial = await this.create(testimonialData);

    await testimonial.populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    // Return testimonial
    return testimonial;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to update a testimonial by id
testimonialSchema.statics.updateOneTestimonial = async function ({
  testimonialId,
  updatedData,
}) {
  try {
    // Find testimonial by id and update
    const testimonial = await this.findByIdAndUpdate(
      testimonialId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!testimonial) {
      throw new CustomError(404, "Testimonial not found");
    }

    await testimonial.populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    // Return testimonial
    return testimonial;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to delete a testimonial by id
testimonialSchema.statics.deleteOneTestimonial = async function (
  testimonialId
) {
  try {
    // Find testimonial by id and delete
    const testimonial = await this.findByIdAndDelete(testimonialId);

    if (!testimonial) {
      throw new CustomError(404, "Testimonial not found");
    }

    // Return testimonial
    return testimonial;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//count documents
testimonialSchema.statics.countDocuments = async function () {
  try {
    // Count all documents
    const count = await this.find().countDocuments();

    // Return count
    return count;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

module.exports = Testimonial;
