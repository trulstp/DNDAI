const mongoose = require("mongoose");

const monsterSchema = new mongoose.Schema({
  monsterName: {
    type: String,
    required: true,
  },
  challengeRating: {
    type: Number,
    required: true,
  },
  setting: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  groupTag: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("monsters", monsterSchema);
