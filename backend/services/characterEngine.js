// Builds a random character from the SRD data that scripts/syncCharacterData.js stores in
// MongoDB, replacing scripts/Class_creator.py.
//
// Every function that needs randomness takes `random`, a function returning a number in [0, 1)
// like Math.random. The game uses Math.random; the tests pass a fixed sequence so the results
// can be checked.
//
// TODO: each function below that throws "not written yet" has tests in
// test/characterEngine.test.js marked `todo`. Write the function, then remove its `todo`.
const {
  ABILITIES,
  SKILLS,
  STAT_PRIORITY,
  BACKGROUNDS,
  BACKGROUND_WEIGHTS,
} = require("../data/characterRules");

const MAX_ABILITY_SCORE = 20;

const notWritten = (name) => new Error(`${name} is not written yet`);

// --- Worked example ---

// 10-11 -> 0, 12-13 -> +1, 8-9 -> -1, ...
const abilityModifier = (score) => Math.floor((score - 10) / 2);

// --- Helpers ---

// A die roll from 1 to `sides`
const rollDie = (sides, random) => {
  throw notWritten("rollDie");
};

// `count` different items from `list`, in random order. Doesn't change `list`
const pickSome = (list, count, random) => {
  throw notWritten("pickSome");
};

// One key of `weights` ({ Sage: 5, Soldier: 1 }), more likely the higher its weight
const pickWeighted = (weights, random) => {
  throw notWritten("pickWeighted");
};

// --- Ability scores ---

// Six scores, each the sum of the highest three of four d6, sorted highest first
const rollAbilityScores = (random) => {
  throw notWritten("rollAbilityScores");
};

// Scores (highest first) -> { Strength: ..., ... }, the highest going to the first ability in
// `priority`
const assignAbilityScores = (scores, priority) => {
  throw notWritten("assignAbilityScores");
};

// Adds a race's increases ([{ ability, value }]) and returns new scores. A null ability is the
// player's choice: pick an ability the race doesn't already increase. No score goes above 20
const applyRacialIncreases = (abilities, increases, random) => {
  throw notWritten("applyRacialIncreases");
};

// Each "Ability Score Improvement" up to `level` gives +2, to the first ability in `priority`
// that is below 20 (one point at a time, so 19 becomes 20 and the next point goes on)
const applyAbilityScoreImprovements = (abilities, levels, level, priority) => {
  throw notWritten("applyAbilityScoreImprovements");
};

// --- Class ---

// Level 1: the full hit die. Every later level: a roll of the hit die. Each level adds the
// Constitution modifier, but always gains at least 1 hit point
const hitPoints = (hitDie, level, constitutionModifier, random) => {
  throw notWritten("hitPoints");
};

// The background's skills plus `skillChoices.count` more from `skillChoices.from` (any skill
// when it's empty), never the same skill twice. Sorted alphabetically
const pickSkills = (backgroundSkills, skillChoices, random) => {
  throw notWritten("pickSkills");
};

// One option from each entry of the class's equipment ([["a mace", "a warhammer"], ["A shield"]])
const pickEquipment = (equipment, random) => {
  throw notWritten("pickEquipment");
};

// The features of every level up to `level`: { 1: ["Rage", ...], 2: [...] }. Levels without
// features are left out
const featuresByLevel = (levels, level) => {
  throw notWritten("featuresByLevel");
};

// --- Spells ---

// How many spells a character of this class and level learns:
// { cantrips, spells, maxSpellLevel }
// - cantrips: the level's cantripsKnown (0 if missing)
// - maxSpellLevel: the highest spell level the level has slots for (0 if none)
// - spells:
//   - wizard: 6 at level 1 and 2 more each level (the spellbook)
//   - bard, ranger, sorcerer, warlock: the level's spellsKnown
//   - cleric, druid: spellcasting ability modifier + level, at least 1
//   - paladin: spellcasting ability modifier + half the level rounded down, at least 1,
//     from level 2 (0 at level 1)
//   - classes without spellcasting: 0
const spellCounts = (characterClass, level, spellcastingModifier) => {
  throw notWritten("spellCounts");
};

// Picks spells from `spells` (the class's spell list, from MongoDB) to match `counts`:
// `counts.cantrips` of level 0, and `counts.spells` from levels 1 to `counts.maxSpellLevel`.
// Returns them grouped by level for the character sheet: { 0: [...names], 1: [...], ... }.
// Levels without spells are left out
const pickSpells = (spells, counts, random) => {
  throw notWritten("pickSpells");
};

// --- Putting it together ---

// The character the frontend expects, in the same shape as the Python script's output:
// { Name, Race, Class, Level, Alignment, Hitpoints, Stats: { Strength, ... }, Size,
//   Speed: "30 feet", Equipment, Skills, Spells: { 0: [...], 1: [...] } or false, Languages,
//   Abilities: [...race traits and the background feature], ClassSkills: { 1: [...], ... } }
//
// data: { characterClass, race, spells } from MongoDB (spells already filtered to the class)
// choices: { name, level, subrace } with everything already decided (no "random")
const createCharacter = (data, choices, random = Math.random) => {
  throw notWritten("createCharacter");
};

module.exports = {
  abilityModifier,
  rollDie,
  pickSome,
  pickWeighted,
  rollAbilityScores,
  assignAbilityScores,
  applyRacialIncreases,
  applyAbilityScoreImprovements,
  hitPoints,
  pickSkills,
  pickEquipment,
  featuresByLevel,
  spellCounts,
  pickSpells,
  createCharacter,
};
