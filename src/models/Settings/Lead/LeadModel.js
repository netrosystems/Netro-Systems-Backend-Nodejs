// models/lead.js
const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const { CustomError } = require("../../../services");

const leadSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  message: {
    type: String,
    default: "",
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
leadSchema.pre("save", function (next) {
  this.updatedAt = () => Timekoto();
  next();
});

// Define a static method to get all leads
leadSchema.statics.getAllLeads = async function () {
  try {
    // Find all leads and populate the leadedBy field while excluding the password field
    const leads = await this.find().sort({ createdAt: -1 });

    if (leads?.length === 0) {
      throw new CustomError(404, "No leads found");
    }

    // Return leads
    return leads;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to get one lead by id
leadSchema.statics.getOneLead = async function (leadId) {
  try {
    // Find lead by id and populate the leadedBy field while excluding the password field
    const lead = await this.findById(leadId);

    if (!lead) {
      throw new CustomError(404, "Lead not found");
    }

    // Return lead
    return lead;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to create a lead
leadSchema.statics.createOneLead = async function (leadData) {
  try {
    // Create lead
    const lead = await this.create(leadData);

    // Return lead
    return lead;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to update a lead by id
leadSchema.statics.updateOneLead = async function ({ leadId, updatedData }) {
  try {
    // Find lead by id and update
    const lead = await this.findByIdAndUpdate(leadId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      throw new CustomError(404, "Lead not found");
    }

    // Return lead
    return lead;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Define a static method to delete a lead by id
leadSchema.statics.deleteOneLead = async function (leadId) {
  try {
    // Find lead by id and delete
    const lead = await this.findByIdAndDelete(leadId);

    if (!lead) {
      throw new CustomError(404, "Lead not found");
    }

    // Return lead
    return lead;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//count documents
leadSchema.statics.countDocuments = async function () {
  try {
    // Count all documents
    const count = await this.find().countDocuments();

    // Return count
    return count;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
