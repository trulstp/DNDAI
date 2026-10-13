const mongoose = require("mongoose");

// SRD spells synced from Open5e by scripts/syncCharacterData.js
const spellSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  // 0 for cantrips
  level: Number,
  school: String,
  // Lowercase class slugs whose own spell list has the spell, e.g. ["cleric", "paladin"]
  classes: [String],
  castingTime: String,
  range: String,
  components: String,
  material: String,
  duration: String,
  concentration: Boolean,
  ritual: Boolean,
  desc: String,
  higherLevel: String,
});

// Characters pick their spells by class and level
spellSchema.index({ classes: 1, level: 1 });

module.exports = mongoose.model("spells", spellSchema);
