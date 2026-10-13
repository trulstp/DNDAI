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

module.exports = { ABILITIES, SKILLS, SPELLS_ALSO_ON_CLASS_LIST };
