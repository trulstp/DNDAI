const mongoose = require("mongoose");

// SRD classes synced from Open5e by scripts/syncCharacterData.js
const levelSchema = new mongoose.Schema(
  {
    level: Number,
    proficiencyBonus: Number,
    features: [String],
    // Slots per spell level, index 0 is 1st level. Warlocks' pact slots are counted at their slot level
    spellSlots: [Number],
    cantripsKnown: Number,
    spellsKnown: Number,
    // Class-specific table columns as text, e.g. { Rages: "2", "Rage Damage": "+2" }
    other: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const characterClassSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  hitDie: Number,
  savingThrows: [String],
  spellcastingAbility: String,
  // "full", "half", "pact" (warlock) or null
  casterType: String,
  proficiencies: {
    armor: [String],
    weapons: [String],
    tools: [String],
  },
  // An empty `from` means any skill
  skillChoices: { count: Number, from: [String] },
  // Each entry lists the options for one item; a single option is always given
  equipment: [[String]],
  subclassTitle: String,
  subclass: { slug: String, name: String },
  levels: [levelSchema],
});

module.exports = mongoose.model("characterclasses", characterClassSchema);
