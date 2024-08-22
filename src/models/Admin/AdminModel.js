//models/Admin/AdminModel.js

const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const {
  AdminLoginDTO,
  AdminRegisterDTO,
  AdminUpdateDTO,
  AdminFetchDTO,
} = require("../../dtos");
const {
  hashPassword,
  comparePasswords,
  CustomError,
  generateToken,
} = require("../../services");
const {
  generateOTP,
  validateToken,
} = require("../../services/totp/HandleOTPAuth");
const {
  createTempSession,
  getAdminIdFromTempSession,
} = require("../../services/sessionHandler.js/HandleSession");
const {
  verifyTOTPToken,
} = require("../../controllers/TotpControllers/TotpControllers");

const adminSchema = new mongoose.Schema({
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
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  twoFactorAuth: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: {
    type: String,
    default: null,
  },
  tempTwoFactorSecret: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Number,
    default: () => Timekoto(),
  },
  updatedAt: {
    type: Number,
    default: () => Timekoto(),
  },
});

// Middleware to update `updatedAt` on every save
adminSchema.pre("save", function (next) {
  this.updatedAt = () => Timekoto();
  next();
});

//get all admins
adminSchema.statics.getAllAdmins = async function () {
  try {
    const admins = await this.find().sort({ createdAt: -1 }).exec();

    //filter with dto
    const adminsDTO = admins.map((admin) => new AdminFetchDTO(admin));

    return adminsDTO;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//get one admin
adminSchema.statics.getOneAdmin = async function ({ id }) {
  try {
    const admin = await this.findById(id).exec();
    if (!admin) {
      throw new CustomError(404, "Admin not found");
    }
    const adminDTO = new AdminFetchDTO(admin);
    return adminDTO;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// static method for login
// adminSchema.statics.login = async function ({ email, password }) {
//   try {
//     //make the email case insensitive using regex
//     email = new RegExp(`^${email}$`, "i");
//     //check if the admin exists
//     const admin = await this.findOne({ email }).exec();
//     if (!admin) {
//       throw new CustomError(404, "Admin not found");
//     }

//     const passwordMatch = await comparePasswords(password, admin?.password);
//     if (!passwordMatch) {
//       throw new CustomError(401, "Invalid password");
//     }

//     const token = generateToken(admin?._id);
//     const adminDTO = new AdminLoginDTO(admin);

//     const finalResponse = { ...adminDTO, accessToken: token };
//     return finalResponse;
//   } catch (error) {
//     throw new CustomError(error?.statusCode, error?.message);
//   }
// };

// POST /api/auth/login
adminSchema.statics.login = async function ({ email, password }) {
  try {
    email = new RegExp(`^${email}$`, "i");
    const admin = await this.findOne({ email }).exec();
    if (!admin) {
      throw new CustomError(404, "Admin not found");
    }

    const passwordMatch = await comparePasswords(password, admin.password);
    if (!passwordMatch) {
      throw new CustomError(401, "Invalid password");
    }

    if (admin.twoFactorAuth) {
      const tempSession = createTempSession(admin._id);

      return {
        status: 200,
        message: "2FA required",
        data: {
          tempSession,
        },
      };
    }

    const accessToken = generateToken(admin._id);
    const adminDTO = new AdminLoginDTO(admin);
    return { ...adminDTO, accessToken };
  } catch (error) {
    throw new CustomError(
      error?.statusCode || 500,
      error?.message || "An error occurred during login"
    );
  }
};

adminSchema.statics.verify2FA = async function ({ tempSession, token }) {
  try {
    // Retrieve the admin ID using the temp session
    const adminId = getAdminIdFromTempSession(tempSession);
    if (!adminId) {
      throw new CustomError(401, "Invalid session");
    }

    const admin = await this.findById(adminId).exec();
    if (!admin || !admin.twoFactorAuth) {
      throw new CustomError(404, "Admin not found or 2FA not enabled");
    }

    // Verify the 2FA token
    const isTokenValid = await this.verify2FAToken(admin._id, token);
    if (!isTokenValid) {
      throw new CustomError(401, "Invalid 2FA token");
    }

    // Generate the access token
    const accessToken = generateToken(admin._id);
    const adminDTO = new AdminLoginDTO(admin);

    return { ...adminDTO, accessToken };
  } catch (error) {
    throw new CustomError(
      error?.statusCode || 500,
      error?.message || "An error occurred during 2FA verification"
    );
  }
};

//validate 2fa token
adminSchema.statics.verify2FAToken = async function (id, token) {
  try {
    const admin = await this.findById(id);

    if (!admin || !admin.twoFactorAuth) {
      throw new CustomError(404, "Admin not found or 2FA not enabled");
    }

    const isValid = validateToken(admin.twoFactorSecret, token);

    if (!isValid) {
      throw new CustomError(401, "Invalid token");
    }

    return true;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Function to initiate the 2FA setup
adminSchema.statics.initiate2FASetup = async function ({ adminId }) {
  try {
    // Fetch the admin from the database
    const admin = await this.findById(adminId);
    if (!admin) {
      throw new CustomError(404, "Admin not found");
    }

    // Generate a secret key and QR code
    const issuer = process.env.TTOP_ISSUER; // Replace with your app's name
    const label = admin.email; // Use the admin's email as the label
    const { secret, qrCode, totp } = await generateOTP(issuer, label);

    // Temporarily save the secret in the admin record, but do not enable 2FA yet
    admin.tempTwoFactorSecret = secret;
    await admin.save();

    // Return the QR code and potentially the secret to the frontend
    return { qrCode, secret, totp };
  } catch (error) {
    throw new CustomError(
      error?.statusCode || 500,
      error?.message || "Error initiating 2FA setup"
    );
  }
};

// Function to verify the 2FA setup
adminSchema.statics.verify2FASetup = async function ({ adminId, token }) {
  try {
    // Fetch the admin and check if they initiated the 2FA setup
    const admin = await this.findById(adminId);
    if (!admin || !admin.tempTwoFactorSecret) {
      throw new CustomError(
        404,
        "Invalid 2FA setup request or admin not found"
      );
    }

    // Verify the provided OTP against the stored secret
    const isTokenValid = await validateToken(admin.tempTwoFactorSecret, token);
    if (!isTokenValid) {
      throw new CustomError(401, "Invalid OTP");
    }

    // If valid, finalize 2FA setup
    admin.twoFactorAuth = true;
    admin.twoFactorSecret = admin.tempTwoFactorSecret;
    admin.tempTwoFactorSecret = null;
    await admin.save();

    return { message: "2FA has been enabled successfully" };
  } catch (error) {
    throw new CustomError(
      error?.statusCode || 500,
      error?.message || "Error verifying 2FA setup"
    );
  }
};

// static method for registration
adminSchema.statics.register = async function ({ fullName, email, password }) {
  try {
    //check if the admin already exists
    const existingAdminCheck = await this.findOne({ email }).exec();
    if (existingAdminCheck) {
      throw new CustomError(401, "Admin already exists");
    }

    //hash the password
    const hashedPassword = await hashPassword(password);

    //create a new admin instance
    const newAdmin = new this({ fullName, email, password: hashedPassword });

    //save the admin to the database
    await newAdmin.save();

    //generate token
    const token = generateToken(newAdmin?._id);
    const adminDTO = new AdminRegisterDTO(newAdmin);

    const finalResponse = { ...adminDTO, accessToken: token };
    return finalResponse;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Static method for updating admin data
adminSchema.statics.updateAdminById = async function ({ id, updatedData }) {
  try {
    const updatedAdmin = await this.findOneAndUpdate(
      { _id: id },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedAdmin) {
      throw new CustomError(404, "Admin not found");
    }
    const adminDTO = new AdminUpdateDTO(updatedAdmin);
    return adminDTO;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Static method for sending OTP
adminSchema.statics.updatePasswordByOTP = async function ({
  email,
  otp,
  newPassword,
}) {
  try {
    // Validate OTP
    const otpStatus = await validateOTP({ email, otp, Model: this });
    if (otpStatus.error) {
      throw new CustomError(401, otpStatus.error);
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the password
    const updatedAdmin = await this.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!updatedAdmin) {
      throw new CustomError(404, "Admin not found");
    }
    const adminDTO = new AdminUpdateDTO(updatedAdmin);
    return adminDTO;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Static method for updating password by email
adminSchema.statics.updatePasswordByEmail = async function ({
  email,
  oldPassword,
  newPassword,
}) {
  try {
    const admin = await this.findOne({ email });

    if (!admin) {
      throw new CustomError(404, "Admin not found");
    }

    const passwordMatch = await comparePasswords(oldPassword, admin.password);

    if (!passwordMatch) {
      throw new CustomError(401, "Invalid password");
    }

    const hashedPassword = await hashPassword(newPassword);

    const updatedAdmin = await this.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    const adminDTO = new AdminUpdateDTO(updatedAdmin);
    return adminDTO;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

adminSchema.statics.deleteAdminById = async function (id) {
  try {
    const result = await this.deleteOne({ _id: id });

    if (result?.deletedCount === 0) {
      throw new CustomError(404, "Admin not found");
    } else {
      return { message: `Admin deleted successfully with id: ${id}` };
    }
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
