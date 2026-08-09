// config/cors/cors.config.js

const cors = require("cors");
const { logger, CustomError } = require("../../src/services");

const allowedOrigins = [
  //for development
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  //ip address
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5500",
  "null",

  //for deployment
  "https://netrosystems.netlify.com",
  "https://netrosystems.vercel.app",
  "https://www.netrosystems.com",
  "https://netrosystems.com",
  "https://sadmin.netrosystems.com",
  "https://admin.netrosystems.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    logger.log("silly", `Request Origin: ${origin}`);
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, "").toLowerCase();
    const isAllowed = allowedOrigins.some(
      (allowed) => allowed.replace(/\/$/, "").toLowerCase() === cleanOrigin
    );

    if (isAllowed) {
      logger.log("silly", "Request has been allowed by CORS");
      callback(null, true);
    } else {
      logger.log("warn", `Request origin blocked by CORS: ${origin}`);
      callback(null, false);
    }
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200,
};

//with configuration
const initializeCors = (app) => {
  app.use(cors(corsOptions));
  //pre-flight request
  app.options("*", cors(corsOptions));
};

//without any configuration
// const initializeCors = (app) => {
//   app.use(cors());
// };

module.exports = { allowedOrigins, initializeCors };
