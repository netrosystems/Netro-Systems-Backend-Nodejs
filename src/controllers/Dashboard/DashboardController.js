const { asyncHandler } = require("../../middlewares");
const {
  Blog,
  Service,
  Portfolio,
  Team,
  Job,
  Testimonial,
  Resume,
  Lead,
} = require("../../models");
const { sendResponse } = require("../../services");

const getDashboard = async (req, res) => {
  // Card specific data
  let cards = {
    blogs: 0,
    services: 0,
    portfolios: 0,
    teams: 0,
    jobs: 0,
    testimonials: 0,
    resumes: 0,
    leads: 0,
  };

  // Chart specific data
  let charts = {
    resume: [],
    lead: [],
  };

  let dashboard = {
    cards,
    charts,
  };

  // Populate the dashboard object with card data
  cards.blogs = await Blog.countDocuments();
  cards.services = await Service.countDocuments();
  cards.portfolios = await Portfolio.countDocuments();
  cards.teams = await Team.countDocuments();
  cards.jobs = await Job.countDocuments();
  cards.testimonials = await Testimonial.countDocuments();
  cards.resumes = await Resume.countDocuments();
  cards.leads = await Lead.countDocuments();

  // Populate the dashboard object with chart data
  // Get leads by date, grouped by year, month, and day
  let leads = await Lead.aggregate([
    {
      $group: {
        _id: {
          date: {
            $dateTrunc: {
              date: { $toDate: { $multiply: ["$createdAt", 1000] } },
              unit: "day",
            },
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        timestamp: {
          $floor: { $divide: [{ $toLong: "$_id.date" }, 1000] },
        },
        count: 1,
      },
    },
    {
      $sort: { timestamp: 1 },
    },
  ]);

  // Populate the leads chart data
  charts.lead = leads;

  // Get resumes by date, grouped by year, month, and day
  let resumes = await Resume.aggregate([
    {
      $group: {
        _id: {
          date: {
            $dateTrunc: {
              date: { $toDate: { $multiply: ["$createdAt", 1000] } },
              unit: "day",
            },
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        timestamp: {
          $floor: { $divide: [{ $toLong: "$_id.date" }, 1000] },
        },
        count: 1,
      },
    },
    {
      $sort: { timestamp: 1 },
    },
  ]);

  // Populate the resumes chart data
  charts.resume = resumes;

  // Return the dashboard data
  return sendResponse(res, 200, "Dashboard retrieved successfully", dashboard);
};

module.exports = {
  getDashboard: asyncHandler(getDashboard),
};
