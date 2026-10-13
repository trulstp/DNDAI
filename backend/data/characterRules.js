// Rules the character data sync needs that Open5e doesn't provide in a usable form

const ABILITIES = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];

// The 18 SRD skills. Class skill choices are matched against these, which also copes with
// typos in the source text such as "Animal, Handling"
const SKILLS = [
  "Acrobatics",
  "Animal Handling",
  "Arcana",
  "Athletics",
  "Deception",
  "History",
  "Insight",
  "Intimidation",
  "Investigation",
  "Medicine",
  "Nature",
  "Perception",
  "Performance",
  "Persuasion",
  "Religion",
  "Sleight of Hand",
  "Stealth",
  "Survival",
];

// Open5e's class spell lists also contain the bonus spells of subclasses, most of them from
// outside the SRD (Acid Arrow is listed for druids because of the Swamp circle). Each spell's
// `archetype` field names those subclasses, so the sync drops a class from a spell when the
// class is named there. These spells are on the class's own list as well, so they keep it
const SPELLS_ALSO_ON_CLASS_LIST = {
  "Dispel Magic": ["cleric"],
  "Meld into Stone": ["druid"],
};

// --- Rules for the character engine (services/characterEngine.js) ---

// Which abilities get the highest rolls, best first, by class slug. From the Python script.
// TODO: the other eight classes (barbarian, bard, druid, monk, paladin, ranger, sorcerer, warlock)
const STAT_PRIORITY = {
  cleric: ["Wisdom", "Charisma", "Constitution", "Strength", "Intelligence", "Dexterity"],
  fighter: ["Strength", "Constitution", "Dexterity", "Wisdom", "Intelligence", "Charisma"],
  rogue: ["Dexterity", "Intelligence", "Constitution", "Strength", "Charisma", "Wisdom"],
  wizard: ["Intelligence", "Wisdom", "Dexterity", "Constitution", "Charisma", "Strength"],
};

// Backgrounds give two skills and a feature
const BACKGROUNDS = {
  Acolyte: { skills: ["Insight", "Religion"], feature: "Shelter of the Faithful" },
  Criminal: { skills: ["Deception", "Stealth"], feature: "Criminal Contact" },
  "Folk Hero": { skills: ["Animal Handling", "Survival"], feature: "Rustic Hospitality" },
  Noble: { skills: ["History", "Persuasion"], feature: "Position of Privilege" },
  Sage: { skills: ["Arcana", "History"], feature: "Researcher" },
  Soldier: { skills: ["Athletics", "Intimidation"], feature: "Military Rank" },
};

// How likely each background is per class, as weights (the Python script's repeated list entries).
// TODO: the other eight classes
const BACKGROUND_WEIGHTS = {
  cleric: { Sage: 3, Soldier: 1, Noble: 2, "Folk Hero": 2, Criminal: 1, Acolyte: 4 },
  fighter: { Sage: 1, Soldier: 5, Noble: 2, "Folk Hero": 2, Criminal: 2, Acolyte: 1 },
  rogue: { Sage: 1, Soldier: 2, Noble: 1, "Folk Hero": 4, Criminal: 4, Acolyte: 1 },
  wizard: { Sage: 5, Soldier: 1, Noble: 3, "Folk Hero": 1, Criminal: 1, Acolyte: 1 },
};

module.exports = {
  ABILITIES,
  SKILLS,
  SPELLS_ALSO_ON_CLASS_LIST,
  STAT_PRIORITY,
  BACKGROUNDS,
  BACKGROUND_WEIGHTS,
};
