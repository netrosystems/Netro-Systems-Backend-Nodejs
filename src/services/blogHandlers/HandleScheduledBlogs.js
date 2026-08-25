const mongoose = require("mongoose");
const { logger } = require("../logHandlers/HandleWinston");

const DEFAULT_INTERVAL_MS = 60 * 1000;
let scheduledBlogPublisherInterval = null;
let isPublishingScheduledBlogs = false;

const publishDueScheduledBlogs = async () => {
  if (isPublishingScheduledBlogs) return;

  isPublishingScheduledBlogs = true;

  try {
    const Blog = mongoose.models.Blog || mongoose.model("Blog");
    if (!Blog || typeof Blog.activateDueScheduledBlogs !== "function") {
      return;
    }

    const publishedCount = await Blog.activateDueScheduledBlogs();

    if (publishedCount > 0) {
      logger.log("info", `Published ${publishedCount} scheduled blog(s)`);
    }
  } catch (error) {
    logger.log("error", `Scheduled blog publisher failed: ${error?.message}`);
  } finally {
    isPublishingScheduledBlogs = false;
  }
};

const startScheduledBlogPublisher = (intervalMs = DEFAULT_INTERVAL_MS) => {
  if (scheduledBlogPublisherInterval) return scheduledBlogPublisherInterval;

  publishDueScheduledBlogs();
  scheduledBlogPublisherInterval = setInterval(
    publishDueScheduledBlogs,
    intervalMs
  );

  return scheduledBlogPublisherInterval;
};

module.exports = { startScheduledBlogPublisher, publishDueScheduledBlogs };
