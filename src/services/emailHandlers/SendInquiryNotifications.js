const { createSmtpTransporter } = require("../../../config/emails/nodemailer.config");
const Lead = require("../../models/Settings/Lead/LeadModel");
const { logger } = require("../logHandlers/HandleWinston");

const recipient = "hello@netrosystems.com";
const pollMs = 15_000;
const retryMs = 5 * 60_000;
const leaseMs = 5 * 60_000;
const batchSize = 10;
const transporter = createSmtpTransporter({
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 30_000,
});

async function sendInquiryEmail(lead) {
  const replyTo = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(lead.email)
    ? { address: lead.email }
    : undefined;
  await transporter.sendMail({
    from: { name: process.env.SENDER_EMAIL_NAME || "Netro Systems", address: process.env.SENDER_EMAIL_ID },
    to: recipient,
    replyTo,
    subject: "New website inquiry",
    messageId: `<inquiry-${lead._id}@netrosystems.com>`,
    text: [
      "A new inquiry was saved in Admin → Support → Contact.",
      `Name: ${lead.name || "Not provided"}`,
      `Email: ${lead.email}`,
      ...(lead.budget ? [`Budget: ${lead.budget}`] : []),
      "",
      lead.message || "No message provided.",
    ].join("\n"),
  });
}

let processing = false;
async function sendDueInquiryNotifications() {
  if (processing) return;
  processing = true;

  try {
    for (let index = 0; index < batchSize; index += 1) {
      const now = new Date();
      const leaseUntil = new Date(now.getTime() + leaseMs);
      // Claim this inquiry atomically so only one backend instance sends it.
      const lead = await Lead.findOneAndUpdate(
        { inquiryEmailDueAt: { $lte: now } },
        { $set: { inquiryEmailDueAt: leaseUntil } },
        { sort: { inquiryEmailDueAt: 1 }, new: true },
      );
      if (!lead) return;

      const claim = { _id: lead._id, inquiryEmailDueAt: leaseUntil };
      try {
        await sendInquiryEmail(lead);
      } catch (error) {
        logger.log("warn", `Inquiry email deferred for ${lead._id} (${error.code || "SMTP error"})`);
        await Lead.updateOne(claim, { $set: { inquiryEmailDueAt: new Date(Date.now() + retryMs) } });
        continue;
      }

      await Lead.updateOne(claim, { $unset: { inquiryEmailDueAt: 1 } });
    }
  } catch (error) {
    logger.log("error", `Inquiry notification worker failed (${error.code || error.name})`);
  } finally {
    processing = false;
  }
}

function startInquiryNotifications() {
  if (!process.env.SENDER_EMAIL_HOSTNAME || !process.env.SENDER_EMAIL_ID) {
    logger.log("warn", "Inquiry emails will stay queued until SMTP host and sender are configured.");
    return;
  }

  void sendDueInquiryNotifications();
  setInterval(sendDueInquiryNotifications, pollMs).unref();
}

module.exports = { startInquiryNotifications };
