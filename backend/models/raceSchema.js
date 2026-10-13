const mongoose = require("mongoose");

// SRD races synced from Open5e by scripts/syncCharacterData.js
const trait = [{ _id: false, name: String, desc: String }];
// A null ability is the player's choice (the Half-Elf's two extra increases)
const abilityScoreIncreases = [{ _id: false, ability: String, value: Number }];

const raceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  size: String,
  // Walking speed in feet
  speed: Number,
  abilityScoreIncreases,
  languages: [String],
  // Languages of the player's choice on top of `languages`
  extraLanguages: Number,
  traits: trait,
  subraces: [
    {
      _id: false,
      slug: String,
      name: String,
      abilityScoreIncreases,
      traits: trait,
    },
  ],
});

module.exports = mongoose.model("races", raceSchema);
