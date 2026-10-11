export const raceOptions = [
  { value: "Dragonborn", label: "Dragonborn" },
  { value: "Dwarf", label: "Dwarf" },
  { value: "Elf", label: "Elf" },
  { value: "Gnome", label: "Gnome" },
  { value: "Half-Elf", label: "Half-Elf" },
  { value: "Half-Orc", label: "Half-Orc" },
  { value: "Halfling", label: "Halfling" },
  { value: "Human", label: "Human" },
  { value: "Tiefling", label: "Tiefling" },
];

export const classTypeOptions = [
  { value: "Cleric", label: "Cleric" },
  { value: "Fighter", label: "Fighter" },
  { value: "Rogue", label: "Rogue" },
  { value: "Wizard", label: "Wizard" },
];

export const levelOptions = [
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  // Add more levels as required
];

export const numbersArray = Array.from({ length: 24 }, (_, index) => index + 1);

export const locations = [
  "abandoned buildings",
  "alien dimension",
  "ambush sites",
  "battlegrounds",
  "caves",
  "caverns",
  "coastal caves",
  "coastal cliffs",
  "cold caves",
  "deep caves",
  "desert sandy caverns",
  "drow cities",
  "duergar fortresses",
  "dungeons",
  "dungeons sewers",
  "dwarven halls",
  "elven cities",
  "forests",
  "fortresses",
  "glades",
  "graveyards",
  "haunted places",
  "icy mountains",
  "jungles",
  "lair",
  "magma caverns",
  "marshes",
  "mountain caverns",
  "mountain fortresses",
  "mountains",
  "oceans",
  "patrol routes",
  "plains",
  "ritual sites",
  "rocky terrains",
  "ruins",
  "strongholds",
  "swamps",
  "temples",
  "tombs",
  "tundras",
  "underground",
  "underground cities",
  "underdark",
  "volcanoes",
  "wastelands",
  "war camps",
  "warm caves",
];

// Locations grouped for the encounter picker; values match the locations list above
export const locationGroups = [
  {
    label: "Caves & Caverns",
    locations: ["caves", "caverns", "deep caves", "warm caves", "cold caves", "coastal caves", "mountain caverns", "desert sandy caverns", "magma caverns"],
  },
  {
    label: "Underdark & Otherworldly",
    locations: ["underground", "underground cities", "underdark", "drow cities", "duergar fortresses", "dwarven halls", "alien dimension"],
  },
  {
    label: "Wilderness",
    locations: ["forests", "glades", "jungles", "swamps", "marshes", "plains", "mountains", "rocky terrains", "icy mountains", "tundras", "wastelands", "coastal cliffs", "oceans", "volcanoes"],
  },
  {
    label: "Civilisation & War",
    locations: ["abandoned buildings", "elven cities", "fortresses", "mountain fortresses", "strongholds", "war camps", "battlegrounds", "patrol routes", "ambush sites"],
  },
  {
    label: "Dungeons, Ruins & the Dead",
    locations: ["dungeons", "dungeons sewers", "lair", "ruins", "tombs", "graveyards", "haunted places", "temples", "ritual sites"],
  },
];

// 5e tiers of play, used to give the challenge rating slider a meaning
export const crTiers = [
  { max: 4, label: "Tier 1 · Local Heroes" },
  { max: 10, label: "Tier 2 · Heroes of the Realm" },
  { max: 16, label: "Tier 3 · Masters of the Realm" },
  { max: 24, label: "Tier 4 · Masters of the World" },
];

export const raceHints = {
  Dragonborn: "Breath weapon, draconic ancestry",
  Dwarf: "Darkvision, tough and resilient",
  Elf: "Darkvision, keen senses, trance",
  Gnome: "Darkvision, gnome cunning",
  "Half-Elf": "Versatile, fey ancestry",
  "Half-Orc": "Relentless endurance",
  Halfling: "Lucky, brave, nimble",
  Human: "Adaptable and ambitious",
  Tiefling: "Hellish resistance, infernal magic",
};

export const classHints = {
  Cleric: "Divine magic and healing",
  Fighter: "Weapons and heavy armour",
  Rogue: "Sneak attack and skills",
  Wizard: "Arcane spells and a spellbook",
};
