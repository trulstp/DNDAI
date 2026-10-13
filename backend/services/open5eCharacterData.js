// Turns Open5e v1 classes, races and spells into the shapes the character data is stored in.
// Much of Open5e's character data is rules text ("Choose two from Arcana, History, ..."),
// so most of the work here is reading that text. The parsers throw when the text doesn't
// look as expected, so a change on Open5e's side stops the sync instead of saving bad data
const { ABILITIES, SKILLS, SPELLS_ALSO_ON_CLASS_LIST } = require("../data/characterRules");

const MAX_LEVEL = 20;
const SPELL_LEVELS = 9;
const SPELLCASTING_CLASSES = ["bard", "cleric", "druid", "paladin", "ranger", "sorcerer", "warlock", "wizard"];
const NUMBER_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5 };
const SKILL_LIST_PATTERN = /^choose (any )?(\w+)(?: skills?)?(?: from (.+))?$/i;

const fail = (what, problem) => {
  throw new Error(`${what}: ${problem}`);
};

// "1st" -> 1, "20th" -> 20
const ordinal = (text) => parseInt(text, 10);

// "-" and "" are the tables' way of writing "none"
const isEmpty = (text) => text === undefined || text === "" || text === "-" || /^none$/i.test(text);

// Splits on commas that aren't inside parentheses, so "Extra Attack (2), Indomitable (two uses)"
// gives two items and "shields (druids will not wear metal, ...)" stays in one piece
const splitList = (text) => {
  const items = [];
  let depth = 0;
  let current = "";
  for (const char of text) {
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (char === "," && depth === 0) {
      items.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  items.push(current);
  return items.map((item) => item.trim()).filter((item) => !isEmpty(item));
};

// "Light armor, medium armor, shields" -> ["Light armor", "medium armor", "shields"]; "None" -> []
const parseProficiencies = (text) => (isEmpty((text || "").trim()) ? [] : splitList(text));

// A markdown table -> one object per row, keyed by the header cells
const parseMarkdownTable = (markdown) => {
  const rows = markdown
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"))
    .map((line) =>
      line
        .slice(1, line.endsWith("|") ? -1 : undefined)
        .split("|")
        .map((cell) => cell.trim())
    );
  const [header, separator, ...body] = rows;
  if (!header || !separator || !separator.every((cell) => /^:?-+:?$/.test(cell))) {
    return [];
  }
  return body.map((cells) => Object.fromEntries(header.map((name, i) => [name, cells[i] ?? ""])));
};

// "Choose two from Arcana, History, ..." -> { count: 2, from: ["Arcana", "History", ...] }.
// "Choose any three" gives from: [], meaning any skill
const parseSkillChoices = (text, what) => {
  const match = SKILL_LIST_PATTERN.exec(text.trim());
  const count = match && NUMBER_WORDS[match[2].toLowerCase()];
  if (!count) fail(what, `unexpected skill choice "${text}"`);
  if (match[1] || !match[3]) return { count, from: [] };

  // Matching known skills, rather than splitting on commas, copes with "Animal, Handling"
  const listed = match[3].replace(/,/g, " ").replace(/\s+/g, " ").toLowerCase();
  const from = SKILLS.filter((skill) => listed.includes(skill.toLowerCase()));
  if (from.length < count) fail(what, `found ${from.length} skills in "${text}"`);
  return { count, from };
};

// Each bulleted line becomes a list of options: "(a) a mace or (b) a warhammer" gives two,
// and a line without options ("A spellbook") gives one, which the character always gets
const parseEquipment = (text, what) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("*"))
    .map((line) => line.replace(/^\*\s*/, "").replace(/\*/g, "").replace(/’/g, "'"));
  if (lines.length === 0) fail(what, "no equipment lines");

  return lines.map((line) =>
    line
      .split(/\([a-z]\)/)
      // Drops the ", or" before the next option, without touching words ending in "or" ("armor")
      .map((option) => option.trim().replace(/[,\s]+(or)?$/, ""))
      .filter(Boolean)
  );
};

// One entry per level from the class table. Columns every class has get their own fields;
// the class-specific ones (Rages, Sneak Attack, Ki Points, ...) are kept as text in `other`
const parseClassLevels = (table, what) => {
  const rows = parseMarkdownTable(table);
  if (rows.length !== MAX_LEVEL) fail(what, `class table has ${rows.length} levels`);

  return rows.map((row, index) => {
    const level = ordinal(row.Level);
    if (level !== index + 1) fail(what, `class table row ${index + 1} is level "${row.Level}"`);

    const entry = {
      level,
      proficiencyBonus: parseInt(row["Proficiency Bonus"], 10),
      features: splitList(row.Features || ""),
      spellSlots: Array(SPELL_LEVELS).fill(0),
      other: {},
    };
    for (const [column, value] of Object.entries(row)) {
      const slotLevel = /^\d+(st|nd|rd|th)$/.test(column) ? ordinal(column) : 0;
      if (slotLevel) {
        entry.spellSlots[slotLevel - 1] = isEmpty(value) ? 0 : parseInt(value, 10);
      } else if (column === "Cantrips Known" || column === "Spells Known") {
        const field = column === "Cantrips Known" ? "cantripsKnown" : "spellsKnown";
        entry[field] = isEmpty(value) ? 0 : parseInt(value, 10);
      } else if (!["Level", "Proficiency Bonus", "Features", "Spell Slots", "Slot Level"].includes(column)) {
        entry.other[column] = value;
      }
    }
    // Warlocks' pact magic: all slots are of one level, given in a column of its own
    if ("Spell Slots" in row) {
      entry.spellSlots[ordinal(row["Slot Level"]) - 1] = parseInt(row["Spell Slots"], 10);
    }
    if (Number.isNaN(entry.proficiencyBonus) || entry.spellSlots.some(Number.isNaN)) {
      fail(what, `unreadable numbers at level ${level}`);
    }
    return entry;
  });
};

// Full casters reach 9th-level slots, half casters 5th; warlocks have pact magic
const casterTypeOf = (levels, table) => {
  if (/\|\s*Slot Level\s*\|/.test(table)) return "pact";
  const highestSlot = levels[MAX_LEVEL - 1].spellSlots.findLastIndex((slots) => slots > 0) + 1;
  if (highestSlot === 9) return "full";
  if (highestSlot === 5) return "half";
  return null;
};

const parseClass = (raw) => {
  const what = `class ${raw.slug}`;
  const hitDie = parseInt(String(raw.hit_dice).replace(/^1d/i, ""), 10);
  if (!hitDie) fail(what, `unexpected hit dice "${raw.hit_dice}"`);

  const savingThrows = parseProficiencies(raw.prof_saving_throws);
  if (savingThrows.length !== 2 || !savingThrows.every((save) => ABILITIES.includes(save))) {
    fail(what, `unexpected saving throws "${raw.prof_saving_throws}"`);
  }

  const levels = parseClassLevels(raw.table, what);
  const subclass = (raw.archetypes || []).find((archetype) => archetype.document__slug === "wotc-srd");

  return {
    slug: raw.slug,
    name: raw.name,
    hitDie,
    savingThrows,
    spellcastingAbility: ABILITIES.includes(raw.spellcasting_ability) ? raw.spellcasting_ability : null,
    casterType: casterTypeOf(levels, raw.table),
    proficiencies: {
      armor: parseProficiencies(raw.prof_armor),
      weapons: parseProficiencies(raw.prof_weapons),
      tools: parseProficiencies(raw.prof_tools),
    },
    skillChoices: parseSkillChoices(raw.prof_skills, what),
    equipment: parseEquipment(raw.equipment, what),
    subclassTitle: raw.subtypes_name,
    subclass: subclass ? { slug: subclass.slug, name: subclass.name } : null,
    levels,
  };
};

// "**_Keen Senses._** You have ..." blocks -> [{ name, desc }]. Text before the first block
// (the Dragonborn's ancestry table) belongs with the first trait
const parseTraits = (text) => {
  const parts = (text || "").split(/\*\*_(.+?)\._\*\*/);
  const preamble = parts[0].trim();
  const traits = [];
  for (let i = 1; i < parts.length; i += 2) {
    traits.push({ name: parts[i].trim(), desc: parts[i + 1].trim() });
  }
  if (preamble && traits.length > 0) traits[0].desc += `\n\n${preamble}`;
  return traits;
};

// Open5e writes "Other" for the Half-Elf's two increases of the player's choice; stored as null
const parseAbilityIncreases = (asi, what) =>
  (asi || []).flatMap(({ attributes, value }) =>
    attributes.map((ability) => {
      if (ability !== "Other" && !ABILITIES.includes(ability)) fail(what, `unknown ability "${ability}"`);
      return { ability: ability === "Other" ? null : ability, value };
    })
  );

// "You can speak, read, and write Common, Elvish, and one extra language of your choice."
// -> { languages: ["Common", "Elvish"], extraLanguages: 1 }
const parseLanguages = (text, what) => {
  const match = /speak, read, and write (.+?)\./.exec(text || "");
  if (!match) fail(what, "no languages");
  const names = match[1].split(/,\s*(?:and\s+)?|\s+and\s+/).map((name) => name.trim());
  const extraLanguages = names.filter((name) => /of your choice/.test(name)).length;
  return { languages: names.filter((name) => !/of your choice/.test(name)), extraLanguages };
};

const parseRace = (raw) => {
  const what = `race ${raw.slug}`;
  const speed = raw.speed && raw.speed.walk;
  if (!speed) fail(what, "no walking speed");

  return {
    slug: raw.slug,
    name: raw.name,
    size: raw.size_raw,
    speed,
    abilityScoreIncreases: parseAbilityIncreases(raw.asi, what),
    ...parseLanguages(raw.languages, what),
    traits: [...parseTraits(raw.vision), ...parseTraits(raw.traits)],
    subraces: (raw.subraces || [])
      .filter((subrace) => subrace.document__slug === "wotc-srd")
      .map((subrace) => ({
        slug: subrace.slug,
        name: subrace.name,
        abilityScoreIncreases: parseAbilityIncreases(subrace.asi, `subrace ${subrace.slug}`),
        traits: parseTraits(subrace.traits),
      })),
  };
};

// The classes whose list a spell is on, without the ones that only get it from a subclass
// (see SPELLS_ALSO_ON_CLASS_LIST). Read from `dnd_class` ("Cleric, Paladin, Ritual Caster")
// because `spell_lists` leaves out paladins
const classListsOf = (raw) => {
  const fromSubclasses = [...(raw.archetype || "").matchAll(/(\w+):/g)].map((m) => m[1].toLowerCase());
  const keep = SPELLS_ALSO_ON_CLASS_LIST[raw.name] || [];
  return (raw.dnd_class || "")
    .split(",")
    .map((className) => className.trim().toLowerCase())
    .filter((className) => SPELLCASTING_CLASSES.includes(className))
    .filter((className) => !fromSubclasses.includes(className) || keep.includes(className));
};

const parseSpell = (raw) => {
  const what = `spell ${raw.slug}`;
  const level = Number(raw.level_int);
  if (!Number.isInteger(level) || level < 0 || level > SPELL_LEVELS) fail(what, `unexpected level "${raw.level_int}"`);

  return {
    slug: raw.slug,
    name: raw.name,
    level,
    school: raw.school,
    classes: classListsOf(raw),
    castingTime: raw.casting_time,
    range: raw.range,
    components: raw.components,
    material: raw.material || "",
    duration: raw.duration,
    concentration: Boolean(raw.requires_concentration),
    ritual: Boolean(raw.can_be_cast_as_ritual),
    desc: raw.desc,
    higherLevel: raw.higher_level || "",
  };
};

module.exports = {
  parseClass,
  parseRace,
  parseSpell,
  // Exported for the tests
  parseMarkdownTable,
  parseSkillChoices,
  parseEquipment,
  parseLanguages,
  parseTraits,
};
