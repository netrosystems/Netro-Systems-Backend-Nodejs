// config/emails/nodemailer.config.js

const nodemailer = require("nodemailer");

const createSmtpTransporter = (options = {}) => nodemailer.createTransport({
  host: process.env.SENDER_EMAIL_HOSTNAME,
  port: process.env.SENDER_EMAIL_PORT,
  auth: {
    user: process.env.SENDER_EMAIL_ID,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
  ...options,
});

const nodemailerTransporter = createSmtpTransporter();

module.exports = { nodemailerTransporter, createSmtpTransporter };
