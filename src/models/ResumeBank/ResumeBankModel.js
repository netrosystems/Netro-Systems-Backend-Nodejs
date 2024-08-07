// models/resume.js
const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const { CustomError } = require("../../services");

const resumeSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    default: null,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    validate: {
      validator: (value) => /\S+@\S+\.\S+/.test(value),
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  number: {
    type: String,
    required: true,
    trim: true,
    maxlength: 15,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  salaryExpectation: {
    type: Number,
    required: true,
  },
  experience: {
    type: String,
    required: true,
    trim: true,
  },
  previousCompany: {
    type: String,
    required: true,
    trim: true,
  },
  resumeUrl: {
    type: String,
    required: true,
    trim: true,
  },
  resumeUrl: {
    type: String,
    required: true,
    trim: true,
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
resumeSchema.pre("save", function (next) {
  this.updatedAt = () => Timekoto();
  next();
});

// Define a static method to get all resumes
resumeSchema.statics.getAllResumes = async function () {
  try {
    // Find all resumes and populate the resumeedBy field while excluding the password field
    const resumes = await this.find()
      .sort({ createdAt: -1 })
      .populate("author", { fullName: 1, profileImage: 1, _id: 0 });

    if (resumes?.length === 0) {
      throw new CustomError(404, "No resumes found");
    }

    // Return resumes
    return resumes;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to get one resume by id
resumeSchema.statics.getOneResume = async function (resumeId) {
  try {
    // Find resume by id and populate the resumeedBy field while excluding the password field
    const resume = await this.findById(resumeId).populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    if (!resume) {
      throw new CustomError(404, "Resume not found");
    }

    // Return resume
    return resume;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to create a resume
resumeSchema.statics.createOneResume = async function (resumeData) {
  try {
    // Create resume
    const resume = await this.create(resumeData);

    await resume.populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    // Return resume
    return resume;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to update a resume by id
resumeSchema.statics.updateOneResume = async function ({
  resumeId,
  updatedData,
}) {
  try {
    // Find resume by id and update
    const resume = await this.findByIdAndUpdate(resumeId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!resume) {
      throw new CustomError(404, "Resume not found");
    }

    await resume.populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    // Return resume
    return resume;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to delete a resume by id
resumeSchema.statics.deleteOneResume = async function (resumeId) {
  try {
    // Find resume by id and delete
    const resume = await this.findByIdAndDelete(resumeId);

    if (!resume) {
      throw new CustomError(404, "Resume not found");
    }

    // Return resume
    return resume;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
