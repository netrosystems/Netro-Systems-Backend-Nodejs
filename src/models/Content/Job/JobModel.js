// models/Content/Job/JobModel.js

const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const { CustomError } = require("../../../services");
const {
  generateQRCode,
} = require("../../../services/qrCodeHandler/HandleQRCode");

const jobSchema = new mongoose.Schema({
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
  details: {
    type: String,
    required: true,
  },
  minimum: {
    type: [String],
    default: [],
  },
  preferred: {
    type: [String],
    default: [],
  },
  benefits: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    default: null,
  },
  deadline: {
    type: String,
    default: null,
  },
  featuredImage: {
    type: String,
    default: "https://via.placeholder.com/150",
    required: true,
  },
  qrCode: {
    type: String,
    default: null,
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
jobSchema.pre("save", function (next) {
  this.updatedAt = () => Timekoto();
  next();
});

// Define a static method to get all jobs
jobSchema.statics.getAllJobs = async function () {
  try {
    // Find all jobs and populate the jobedBy field while excluding the password field
    const jobs = await this.find()
      .sort({ createdAt: -1 })
      .populate("author", { fullName: 1, profileImage: 1, _id: 0 });

    if (jobs?.length === 0) {
      throw new CustomError(404, "No jobs found");
    }

    // Return jobs
    return jobs;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to get one job by id
jobSchema.statics.getOneJob = async function (jobId) {
  try {
    // Find job by id and populate the jobedBy field while excluding the password field
    const job = await this.findById(jobId).populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    if (!job) {
      throw new CustomError(404, "Job not found");
    }

    // Return job
    return job;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to create a job
jobSchema.statics.createOneJob = async function (jobData) {
  try {
    // Create job
    const job = await this.create(jobData);

    //TODO: this must be replaced once the frontend url is known
    const qrCodeData = `${process.env.FRONTEND_BASE_URL}/jobs/${job._id}`;
    const qrCodeUrl = await generateQRCode(qrCodeData);

    //update job with qr code url
    const updatedJob = await this.findByIdAndUpdate(
      job._id,
      { qrCode: qrCodeUrl },
      { new: true }
    );

    await updatedJob.populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    // Return job
    return updatedJob;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to update a job by id
jobSchema.statics.updateOneJob = async function ({ jobId, updatedData }) {
  try {
    // Find job by id and update
    const job = await this.findByIdAndUpdate(jobId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      throw new CustomError(404, "Job not found");
    }

    await job.populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    // Return job
    return job;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to toggle status of a job by id
jobSchema.statics.toggleJobStatus = async function (jobId) {
  try {
    // Find job by id
    const job = await this.findById(jobId);

    if (!job) {
      throw new CustomError(404, "Job not found");
    }

    // Toggle status of job
    const status = job.status === "active" ? "inactive" : "active";

    // Update status of job
    const updatedJob = await this.findByIdAndUpdate(
      jobId,
      { status },
      { new: true }
    );

    await updatedJob.populate("author", {
      fullName: 1,
      profileImage: 1,
      _id: 0,
    });

    // Return job
    return updatedJob;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to delete a job by id
jobSchema.statics.deleteOneJob = async function (jobId) {
  try {
    // Find job by id and delete
    const job = await this.findByIdAndDelete(jobId);

    if (!job) {
      throw new CustomError(404, "Job not found");
    }

    // Return job
    return job;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
