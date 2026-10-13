// The character engine. Tests marked `todo` are for functions that aren't written yet: they
// run and report, but don't fail `npm test`. Remove `todo` once a function is written.
const test = require("node:test");
const assert = require("node:assert/strict");
const engine = require("../services/characterEngine");
const { parseClass, parseRace } = require("../services/open5eCharacterData");
const { ABILITIES, SKILLS, STAT_PRIORITY } = require("../data/characterRules");
const fixture = require("./fixtures/open5eCharacterData.json");

const characterClass = (slug) => parseClass(fixture.classes.find((c) => c.slug === slug));
const race = (slug) => parseRace(fixture.races.find((r) => r.slug === slug));

// A `random` that returns `values` in order, then starts over
const sequence = (...values) => {
  let i = 0;
  return () => values[i++ % values.length];
};
// A `random` that makes rollDie(sides) give these faces, in order
const rolls = (sides, ...faces) => sequence(...faces.map((face) => (face - 0.5) / sides));

const allTens = () => Object.fromEntries(ABILITIES.map((ability) => [ability, 10]));
const sum = (numbers) => numbers.reduce((total, n) => total + n, 0);

// A spell list with `count` spells at each level, named by level: "L1 spell 3"
const fakeSpells = (countsByLevel) =>
  countsByLevel.flatMap((count, level) =>
    Array.from({ length: count }, (_, i) => ({ name: `L${level} spell ${i + 1}`, level }))
  );

// --- Worked example ---

test("ability modifiers", () => {
  assert.equal(engine.abilityModifier(10), 0);
  assert.equal(engine.abilityModifier(11), 0);
  assert.equal(engine.abilityModifier(12), 1);
  assert.equal(engine.abilityModifier(9), -1);
  assert.equal(engine.abilityModifier(3), -4);
  assert.equal(engine.abilityModifier(20), 5);
});

// --- Helpers ---

test("rollDie gives 1 to sides", { todo: "write rollDie" }, () => {
  assert.equal(engine.rollDie(6, () => 0), 1);
  assert.equal(engine.rollDie(6, () => 0.999), 6);
  assert.equal(engine.rollDie(20, () => 0.5), 11);
  for (let i = 0; i < 1000; i++) {
    const roll = engine.rollDie(8, Math.random);
    assert.ok(Number.isInteger(roll) && roll >= 1 && roll <= 8);
  }
});

test("pickSome picks different items and leaves the list alone", { todo: "write pickSome" }, () => {
  const list = ["a", "b", "c", "d", "e"];
  for (let i = 0; i < 100; i++) {
    const picked = engine.pickSome(list, 3, Math.random);
    assert.equal(picked.length, 3);
    assert.equal(new Set(picked).size, 3);
    assert.ok(picked.every((item) => list.includes(item)));
  }
  assert.deepEqual(list, ["a", "b", "c", "d", "e"]);
  assert.deepEqual(engine.pickSome(list, 0, Math.random), []);
});

test("pickWeighted favours higher weights", { todo: "write pickWeighted" }, () => {
  // Weights add up to 4: [0, 0.25) is A, [0.25, 1) is B
  const weights = { A: 1, B: 3 };
  assert.equal(engine.pickWeighted(weights, () => 0), "A");
  assert.equal(engine.pickWeighted(weights, () => 0.2), "A");
  assert.equal(engine.pickWeighted(weights, () => 0.3), "B");
  assert.equal(engine.pickWeighted(weights, () => 0.99), "B");
});

// --- Ability scores ---

test("ability scores are the best three of 4d6, highest first", { todo: "write rollAbilityScores" }, () => {
  const random = rolls(6, 6, 6, 6, 1, 1, 1, 1, 1, 3, 4, 5, 2, 2, 2, 2, 2, 6, 5, 4, 3, 1, 2, 3, 4);
  assert.deepEqual(engine.rollAbilityScores(random), [18, 15, 12, 9, 6, 3]);

  for (let i = 0; i < 200; i++) {
    const scores = engine.rollAbilityScores(Math.random);
    assert.equal(scores.length, 6);
    assert.ok(scores.every((score) => score >= 3 && score <= 18));
    assert.deepEqual(scores, [...scores].sort((a, b) => b - a));
  }
});

test("the highest scores go to the class's main abilities", { todo: "write assignAbilityScores" }, () => {
  const scores = [18, 15, 12, 9, 6, 3];
  assert.deepEqual(engine.assignAbilityScores(scores, STAT_PRIORITY.wizard), {
    Intelligence: 18,
    Wisdom: 15,
    Dexterity: 12,
    Constitution: 9,
    Charisma: 6,
    Strength: 3,
  });
  assert.deepEqual(scores, [18, 15, 12, 9, 6, 3]);
});

test("racial increases are added, up to 20", { todo: "write applyRacialIncreases" }, () => {
  const elf = race("elf");
  assert.equal(engine.applyRacialIncreases(allTens(), elf.abilityScoreIncreases, Math.random).Dexterity, 12);

  const nearlyMax = { ...allTens(), Dexterity: 19 };
  assert.equal(engine.applyRacialIncreases(nearlyMax, elf.abilityScoreIncreases, Math.random).Dexterity, 20);
  assert.equal(nearlyMax.Dexterity, 19, "the scores passed in are left alone");
});

test("the half-elf's free increases go to two other abilities", { todo: "write applyRacialIncreases" }, () => {
  const halfElf = race("half-elf");
  for (let i = 0; i < 100; i++) {
    const result = engine.applyRacialIncreases(allTens(), halfElf.abilityScoreIncreases, Math.random);
    assert.equal(result.Charisma, 12);
    const raised = ABILITIES.filter((ability) => ability !== "Charisma" && result[ability] === 11);
    assert.equal(raised.length, 2);
    assert.equal(sum(Object.values(result)), 64);
  }
});

test("ability score improvements raise the main ability to 20, then the next", { todo: "write applyAbilityScoreImprovements" }, () => {
  const { levels } = characterClass("wizard");
  const scores = { ...allTens(), Intelligence: 17, Wisdom: 14 };
  const improve = (level) => engine.applyAbilityScoreImprovements(scores, levels, level, STAT_PRIORITY.wizard);

  assert.deepEqual(improve(3), scores);
  assert.equal(improve(4).Intelligence, 19);
  // Level 8: 17 + 2 + 2 = 21, so one point goes to Wisdom
  assert.equal(improve(8).Intelligence, 20);
  assert.equal(improve(8).Wisdom, 15);
  assert.equal(scores.Intelligence, 17, "the scores passed in are left alone");
});

// --- Class ---

test("hit points: the full die at level 1, then rolls, each with Constitution", { todo: "write hitPoints" }, () => {
  assert.equal(engine.hitPoints(8, 1, 2, Math.random), 10);
  // 8 + 1, then 5 + 1 and 2 + 1
  assert.equal(engine.hitPoints(8, 3, 1, rolls(8, 5, 2)), 18);
  // 6 - 3 = 3, then 1 - 3 is less than 1, so 1
  assert.equal(engine.hitPoints(6, 2, -3, rolls(6, 1)), 4);
});

test("skills: the background's plus the class's choices, no repeats", { todo: "write pickSkills" }, () => {
  const background = ["Insight", "Religion"];
  const { skillChoices } = characterClass("cleric");
  for (let i = 0; i < 100; i++) {
    const skills = engine.pickSkills(background, skillChoices, Math.random);
    assert.equal(skills.length, 4);
    assert.equal(new Set(skills).size, 4);
    assert.ok(background.every((skill) => skills.includes(skill)));
    assert.ok(skills.every((skill) => background.includes(skill) || skillChoices.from.includes(skill)));
    assert.deepEqual(skills, [...skills].sort());
  }
});

test("skills: an empty list means any skill", { todo: "write pickSkills" }, () => {
  const { skillChoices } = characterClass("bard");
  const skills = engine.pickSkills(["Arcana", "History"], skillChoices, Math.random);
  assert.equal(skills.length, 5);
  assert.ok(skills.every((skill) => SKILLS.includes(skill)));
});

test("equipment: one option from each entry", { todo: "write pickEquipment" }, () => {
  const { equipment } = characterClass("wizard");
  const picked = engine.pickEquipment(equipment, Math.random);
  assert.equal(picked.length, equipment.length);
  picked.forEach((item, i) => assert.ok(equipment[i].includes(item)));
  assert.equal(picked.at(-1), "A spellbook");
});

test("class features are grouped by level, skipping levels without any", { todo: "write featuresByLevel" }, () => {
  const { levels } = characterClass("wizard");
  assert.deepEqual(engine.featuresByLevel(levels, 3), {
    1: ["Spellcasting", "Arcane Recovery"],
    2: ["Arcane Tradition"],
  });
  assert.deepEqual(Object.keys(engine.featuresByLevel(levels, 20)).length, 12);
});

// --- Spells ---

test("how many spells each kind of caster learns", { todo: "write spellCounts" }, () => {
  const counts = (slug, level, modifier = 3) => engine.spellCounts(characterClass(slug), level, modifier);

  assert.deepEqual(counts("wizard", 1), { cantrips: 3, spells: 6, maxSpellLevel: 1 });
  assert.deepEqual(counts("wizard", 3), { cantrips: 3, spells: 10, maxSpellLevel: 2 });
  assert.deepEqual(counts("bard", 3), { cantrips: 2, spells: 6, maxSpellLevel: 2 });
  assert.deepEqual(counts("warlock", 3), { cantrips: 2, spells: 4, maxSpellLevel: 2 });
  assert.deepEqual(counts("cleric", 1), { cantrips: 3, spells: 4, maxSpellLevel: 1 });
  assert.equal(counts("cleric", 1, -1).spells, 1);
  assert.deepEqual(counts("paladin", 1), { cantrips: 0, spells: 0, maxSpellLevel: 0 });
  assert.deepEqual(counts("paladin", 5), { cantrips: 0, spells: 5, maxSpellLevel: 2 });
  assert.deepEqual(counts("fighter", 5), { cantrips: 0, spells: 0, maxSpellLevel: 0 });
});

test("spells are picked by level, without repeats", { todo: "write pickSpells" }, () => {
  const spells = fakeSpells([5, 8, 5, 3]);
  for (let i = 0; i < 100; i++) {
    const picked = engine.pickSpells(spells, { cantrips: 3, spells: 6, maxSpellLevel: 2 }, Math.random);
    assert.equal(picked[0].length, 3);
    assert.equal((picked[1] || []).length + (picked[2] || []).length, 6);
    assert.equal(picked[3], undefined, "no spells above the highest slot");
    const names = Object.values(picked).flat();
    assert.equal(new Set(names).size, names.length);
  }
  assert.deepEqual(engine.pickSpells(spells, { cantrips: 0, spells: 0, maxSpellLevel: 0 }, Math.random), {});
});

// --- Putting it together ---

test("a character in the shape the frontend shows", { todo: "write createCharacter" }, () => {
  const data = { characterClass: characterClass("wizard"), race: race("elf"), spells: fakeSpells([10, 20, 10]) };
  const character = engine.createCharacter(data, { name: "Ilyra", level: 3, subrace: "high-elf" });

  assert.equal(character.Name, "Ilyra");
  assert.equal(character.Race, "Elf");
  assert.equal(character.Class, "Wizard");
  assert.equal(character.Level, 3);
  assert.equal(character.Speed, "30 feet");
  assert.equal(character.Size, "Medium");
  assert.match(character.Alignment, /^(Lawful|Neutral|Chaotic) (Good|Neutral|Evil)$|^True Neutral$/);
  assert.deepEqual(Object.keys(character.Stats).sort(), [...ABILITIES].sort());
  assert.ok(character.Hitpoints >= 3);
  assert.equal(character.Spells[0].length, 3);
  assert.ok(character.Abilities.includes("Darkvision"));
  assert.ok(character.Abilities.includes("Cantrip"), "the subrace's traits are included");
  assert.deepEqual(character.ClassSkills[1], ["Spellcasting", "Arcane Recovery"]);
  assert.ok(character.Languages.includes("Elvish"));
});

test("characters without spellcasting have Spells: false", { todo: "write createCharacter" }, () => {
  const data = { characterClass: characterClass("fighter"), race: race("human"), spells: [] };
  const character = engine.createCharacter(data, { name: "Bob", level: 1 });
  assert.equal(character.Spells, false);
});
