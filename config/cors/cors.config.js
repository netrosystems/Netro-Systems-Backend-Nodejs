// config/cors/cors.config.js

const cors = require("cors");
const { logger, CustomError } = require("../../src/services");

const allowedOrigins = [
  //for development
  "http://localhost:3000",
  //ip address
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5500",
  "null",

  //for deployment
  "https://netrosystems.netlify.com",
  "https://netrosystems.vercel.app",
  "https://netrosystems.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    logger.log("silly", `Request Origin: ${origin}`);
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      logger.log("silly", "Request has been allowed by CORS");
      callback(null, true);
    } else {
      callback(new CustomError(403, "Request has not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
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
