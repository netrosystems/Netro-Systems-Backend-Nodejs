// models/index.js

const Admin = require("./Admin/AdminModel");
const OTP = require("./Otp/OtpModel");
const Blog = require("./Content/Blog/BlogModel");
const BlogCategory = require("./Content/Blog/BlogCategoryModel");
const Service = require("./Content/Service/ServiceModel");
const Portfolio = require("./Content/Portfolio/PortfolioModel");
const PortfolioCategory = require("./Content/Portfolio/PortfolioCategoryModel");
const Team = require("./Content/Team/TeamModel");
const Job = require("./Content/Job/JobModel");
const JobCategory = require("./Content/Job/JobCategoryModel");
const Resume = require("./ResumeBank/ResumeBankModel");
const Testimonial = require("./Testimonial/TestimonialModel");
const Lead = require("./Settings/Lead/LeadModel");

module.exports = {
  Admin,
  OTP,
  Blog,
  BlogCategory,
  Service,
  Portfolio,
  PortfolioCategory,
  Team,
  Job,
  JobCategory,
  Resume,
  Testimonial,
  Lead,
};
