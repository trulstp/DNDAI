const mongoose = require("mongoose");
const { rateLimit } = require("express-rate-limit");
const Usage = require("../models/usageSchema");

// Limits on the routes that call OpenAI, which is what costs money. Both can be changed
// with environment variables without a code change
const positive = (value, fallback) => (Number(value) > 0 ? Number(value) : fallback);
const AI_LIMIT_PER_HOUR = positive(process.env.AI_LIMIT_PER_HOUR, 20);
const AI_LIMIT_PER_DAY = positive(process.env.AI_LIMIT_PER_DAY, 150);

// Every route: generous for people, only stops scripts hammering the server
const generalLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests. Wait a moment and try again.", code: "RATE_LIMIT" },
});

// OpenAI routes, per visitor (IP address). An encounter or character with artwork is two requests
const aiVisitorLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: AI_LIMIT_PER_HOUR,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "You've reached the hourly limit for AI generations. Try again later.",
    code: "AI_HOURLY_LIMIT",
  },
});

const today = () => new Date().toISOString().slice(0, 10);

// Used only while the database isn't connected
let memoryDay = today();
let memoryCount = 0;

// Counts one AI request against today's budget for all visitors together.
// Returns false once the budget is used up. The count lives in MongoDB so it survives
// restarts (the free hosting plan restarts the server after it has been idle)
async function takeFromDailyBudget() {
  const day = today();
  if (mongoose.connection.readyState === 1) {
    try {
      // Only matches while the day is under the cap, so checking and counting are one atomic step
      await Usage.findOneAndUpdate(
        { _id: day, count: { $lt: AI_LIMIT_PER_DAY } },
        { $inc: { count: 1 } },
        { upsert: true }
      );
      return true;
    } catch (err) {
      // At the cap the filter doesn't match, so the upsert collides with the existing day
      if (err.code === 11000) return false;
      console.error("Usage counter failed, counting in memory:", err.message);
    }
  }
  if (memoryDay !== day) {
    memoryDay = day;
    memoryCount = 0;
  }
  if (memoryCount >= AI_LIMIT_PER_DAY) return false;
  memoryCount++;
  return true;
}

// All visitors together, so the OpenAI bill has a ceiling even if many IPs are used
const aiDailyCap = async (req, res, next) => {
  if (await takeFromDailyBudget()) return next();
  res.status(503).json({
    error: "Support Roll has reached its daily limit for AI generations. Try again tomorrow.",
    code: "AI_DAILY_LIMIT",
  });
};

// Per visitor first, so one visitor using up their own limit doesn't use up the daily budget
const aiLimits = [aiVisitorLimit, aiDailyCap];

module.exports = { generalLimit, aiLimits, AI_LIMIT_PER_HOUR, AI_LIMIT_PER_DAY };
