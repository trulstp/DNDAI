const mongoose = require("mongoose");

// How many AI requests all visitors made on one day (UTC), for the daily cap
const usageSchema = new mongoose.Schema({
  // The day as "2026-10-11"
  _id: String,
  count: {
    type: Number,
    default: 0,
  },
  // Old days are deleted automatically after a week
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7,
  },
});

module.exports = mongoose.model("usage", usageSchema);
