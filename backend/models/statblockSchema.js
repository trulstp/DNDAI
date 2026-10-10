const mongoose = require("mongoose");

// SRD monster stat blocks synced from Open5e by scripts/syncOpen5e.js.
// Field names follow the Open5e v1 monster format.
const namedText = [{ _id: false, name: String, desc: String }];

const statblockSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  // Lowercased name, plus the name without any parenthetical
  // ("Deep Gnome (Svirfneblin)" -> "deep gnome"), for lookups by monster name
  nameKeys: { type: [String], index: true },
  size: String,
  type: String,
  subtype: String,
  alignment: String,
  armor_class: Number,
  armor_desc: String,
  hit_points: Number,
  hit_dice: String,
  speed: mongoose.Schema.Types.Mixed,
  strength: Number,
  dexterity: Number,
  constitution: Number,
  intelligence: Number,
  wisdom: Number,
  charisma: Number,
  strength_save: Number,
  dexterity_save: Number,
  constitution_save: Number,
  intelligence_save: Number,
  wisdom_save: Number,
  charisma_save: Number,
  skills: mongoose.Schema.Types.Mixed,
  damage_vulnerabilities: String,
  damage_resistances: String,
  damage_immunities: String,
  condition_immunities: String,
  senses: String,
  languages: String,
  challenge_rating: String,
  cr: Number,
  special_abilities: namedText,
  actions: namedText,
  bonus_actions: namedText,
  reactions: namedText,
  legendary_desc: String,
  legendary_actions: namedText,
  environments: [String],
});

module.exports = mongoose.model("statblocks", statblockSchema);
