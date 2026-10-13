// Reading Open5e's classes, races and spells for the character data sync. The fixture is real
// Open5e data, trimmed, so the tests run without the network
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parseClass,
  parseRace,
  parseSpell,
  parseMarkdownTable,
  parseSkillChoices,
  parseEquipment,
  parseLanguages,
} = require("../services/open5eCharacterData");
const fixture = require("./fixtures/open5eCharacterData.json");

const rawClass = (slug) => fixture.classes.find((c) => c.slug === slug);
const rawRace = (slug) => fixture.races.find((r) => r.slug === slug);
const spell = (name) => parseSpell(fixture.spells.find((s) => s.name === name));

test("a class gets its hit die, saves, proficiencies and SRD subclass", () => {
  const wizard = parseClass(rawClass("wizard"));
  assert.equal(wizard.hitDie, 6);
  assert.deepEqual(wizard.savingThrows, ["Intelligence", "Wisdom"]);
  assert.equal(wizard.spellcastingAbility, "Intelligence");
  assert.deepEqual(wizard.proficiencies.armor, []);
  assert.deepEqual(wizard.proficiencies.weapons, ["Daggers", "darts", "slings", "quarterstaffs", "light crossbows"]);
  assert.deepEqual(wizard.skillChoices, {
    count: 2,
    from: ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"],
  });
  // Only the SRD's subclass, not the third-party ones Open5e also lists
  assert.deepEqual(wizard.subclass, { slug: "school-of-evocation", name: "School of Evocation" });
});

test("the class table gives all 20 levels, with spell slots by spell level", () => {
  const wizard = parseClass(rawClass("wizard"));
  assert.equal(wizard.levels.length, 20);
  assert.deepEqual(wizard.levels[0].features, ["Spellcasting", "Arcane Recovery"]);
  assert.equal(wizard.levels[0].cantripsKnown, 3);
  // 2nd-level slots arrive at level 3 (Open5e's v2 API has them at level 4)
  assert.deepEqual(wizard.levels[2].spellSlots, [4, 2, 0, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(wizard.levels[19].spellSlots, [4, 3, 3, 3, 3, 2, 2, 1, 1]);
  assert.equal(wizard.levels[16].proficiencyBonus, 6);
  assert.equal(wizard.casterType, "full");
});

test("warlocks' pact slots are counted at their slot level", () => {
  const warlock = parseClass(rawClass("warlock"));
  assert.equal(warlock.casterType, "pact");
  assert.deepEqual(warlock.levels[0].spellSlots, [1, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(warlock.levels[2].spellSlots, [0, 2, 0, 0, 0, 0, 0, 0, 0]);
  assert.equal(warlock.levels[19].spellsKnown, 15);
  assert.equal(warlock.levels[19].other["Invocations Known"], "8");
});

test("class-specific columns are kept, and martial classes have no slots", () => {
  const barbarian = parseClass(rawClass("barbarian"));
  assert.equal(barbarian.casterType, null);
  assert.equal(barbarian.spellcastingAbility, null);
  assert.deepEqual(barbarian.levels[0].other, { Rages: "2", "Rage Damage": "+2" });
  assert.equal(barbarian.levels[19].other.Rages, "Unlimited");
  assert.ok(barbarian.levels.every((level) => level.spellSlots.every((slots) => slots === 0)));
});

test("skill choices cope with typos and 'any'", () => {
  // Open5e's fighter text has "Animal, Handling"
  assert.ok(parseClass(rawClass("fighter")).skillChoices.from.includes("Animal Handling"));
  assert.deepEqual(parseClass(rawClass("bard")).skillChoices, { count: 3, from: [] });
  assert.throws(() => parseSkillChoices("Pick some skills", "test"), /unexpected skill choice/);
  assert.throws(() => parseSkillChoices("Choose two from Arcana", "test"), /found 1 skills/);
});

test("starting equipment becomes a list of options per item", () => {
  assert.deepEqual(parseClass(rawClass("wizard")).equipment, [
    ["a quarterstaff", "a dagger"],
    ["a component pouch", "an arcane focus"],
    ["a scholar's pack", "an explorer's pack"],
    ["A spellbook"],
  ]);
  assert.deepEqual(
    parseEquipment("* (*a*) a rapier, (*b*) a longsword, or (*c*) any simple weapon\n* Leather armor", "test"),
    [["a rapier", "a longsword", "any simple weapon"], ["Leather armor"]]
  );
  // An option ending in "or" keeps it
  assert.deepEqual(parseEquipment("* (*a*) leather armor or (*b*) chain mail", "test"), [
    ["leather armor", "chain mail"],
  ]);
});

test("a race gets its ability increases, speed, languages, traits and SRD subraces", () => {
  const elf = parseRace(rawRace("elf"));
  assert.equal(elf.speed, 30);
  assert.equal(elf.size, "Medium");
  assert.deepEqual(elf.abilityScoreIncreases, [{ ability: "Dexterity", value: 2 }]);
  assert.deepEqual(elf.languages, ["Common", "Elvish"]);
  assert.equal(elf.extraLanguages, 0);
  assert.deepEqual(
    elf.traits.map((trait) => trait.name),
    ["Darkvision", "Keen Senses", "Fey Ancestry", "Trance"]
  );
  assert.deepEqual(elf.subraces.map((subrace) => subrace.name), ["High Elf"]);
  assert.deepEqual(elf.subraces[0].abilityScoreIncreases, [{ ability: "Intelligence", value: 1 }]);
});

test("choices left to the player are marked", () => {
  const halfElf = parseRace(rawRace("half-elf"));
  assert.deepEqual(halfElf.abilityScoreIncreases, [
    { ability: "Charisma", value: 2 },
    { ability: null, value: 1 },
    { ability: null, value: 1 },
  ]);
  assert.deepEqual(halfElf.languages, ["Common", "Elvish"]);
  assert.equal(halfElf.extraLanguages, 1);
  assert.equal(parseRace(rawRace("human")).abilityScoreIncreases.length, 6);
  assert.deepEqual(parseLanguages("You can speak, read, and write Common and Orc.", "test"), {
    languages: ["Common", "Orc"],
    extraLanguages: 0,
  });
});

test("the dragonborn's ancestry table stays with the Draconic Ancestry trait", () => {
  const dragonborn = parseRace(rawRace("dragonborn"));
  assert.equal(dragonborn.traits[0].name, "Draconic Ancestry");
  assert.match(dragonborn.traits[0].desc, /\| Red\s+\| Fire/);
});

test("spells list only the classes that have them on their own list", () => {
  assert.equal(spell("Fire Bolt").level, 0);
  assert.deepEqual(spell("Fire Bolt").classes, ["sorcerer", "wizard"]);
  // Druids only get Acid Arrow from a subclass
  assert.deepEqual(spell("Acid Arrow").classes, ["wizard"]);
  // On a cleric subclass list and on the cleric list itself
  assert.ok(spell("Dispel Magic").classes.includes("cleric"));
  assert.ok(spell("Meld into Stone").classes.includes("druid"));
  // Paladins, which Open5e's spell_lists field leaves out
  assert.deepEqual(spell("Aid").classes, ["cleric", "paladin"]);
  // Paladins get Hunter's Mark only from the Oath of Vengeance
  assert.deepEqual(spell("Hunter's Mark").classes, ["ranger"]);
  assert.equal(spell("Hunter's Mark").concentration, true);
});

test("a class table that isn't 20 levels stops the sync", () => {
  const wizard = rawClass("wizard");
  const shortTable = wizard.table.split("\n").slice(0, -1).join("\n");
  assert.throws(() => parseClass({ ...wizard, table: shortTable }), /class table has 19 levels/);
  assert.deepEqual(parseMarkdownTable("no table here"), []);
});
