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
    type: String,
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
  liveUrl: {
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
    const resumes = await this.find().sort({ createdAt: -1 }).populate("job", {
      title: 1,
      category: 1,
      publishedAt: 1,
      _id: 0,
    });

    if (resumes?.length === 0) {
      throw new CustomError(404, "No resumes found");
    }

    // Return resumes
    return resumes;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//get resume count and job id for all resumes
resumeSchema.statics.getResumeCount = async function () {
  try {
    // Aggregate resumes, group by job
    const resumes = await this.aggregate([
      {
        $group: {
          _id: "$job",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Populate the job field in the aggregated results
    const populatedResumes = await this.populate(resumes, {
      path: "_id",
      select: "title category publishedAt",
      model: "Job",
    });

    // Remove objects where the populated _id is null or doesn't have a job
    const filteredResumes = populatedResumes.filter(
      (resume) => resume._id !== null
    );

    if (filteredResumes.length === 0) {
      throw new CustomError(404, "No valid resumes found after population");
    }

    // Return the populated resumes
    return filteredResumes;
  } catch (error) {
    throw new CustomError(error.statusCode || 500, error.message);
  }
};

//get all resumes for a job
resumeSchema.statics.getAllResumesForOneJob = async function (jobId) {
  try {
    // Find all resumes for a job and populate the resumeedBy field while excluding the password field
    const resumes = await this.find({ job: jobId })
      .sort({ createdAt: -1 })
      .populate("job", {
        title: 1,
        category: 1,
        publishedAt: 1,
        _id: 0,
      });

    if (resumes?.length === 0) {
      throw new CustomError(404, "No resumes found for this job");
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
    const resume = await this.findById(resumeId);

    if (!resume) {
      throw new CustomError(404, "Resume not found");
    }

    //populate the job field
    await resume.populate("job", {
      title: 1,
      category: 1,
      publishedAt: 1,
      _id: 0,
    });

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

    //populate the job field
    await resume.populate("job", {
      title: 1,
      category: 1,
      publishedAt: 1,
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

//count documents
resumeSchema.statics.countDocuments = async function () {
  try {
    // Count all documents
    const count = await this.find().countDocuments();

    // Return count
    return count;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
