// Syncs the SRD classes, races and spells from Open5e into the characterclasses, races and
// spells collections, for the character creator. Like the stat blocks, the app reads them
// from MongoDB only, so Open5e is called just when this runs (7 requests).
// Everything is fetched and checked before anything is written, so a failed run changes nothing.
// Safe to re-run: documents are replaced in place, keyed by slug, and ones no longer in the
// SRD are removed.
// Usage (from backend/): node scripts/syncCharacterData.js [--dry-run]
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const CharacterClass = require("../models/characterClassSchema");
const Race = require("../models/raceSchema");
const Spell = require("../models/spellSchema");
const { BASE, fetchAllPages } = require("../services/open5eClient");
const { parseClass, parseRace, parseSpell } = require("../services/open5eCharacterData");

// The v1 API: its class tables are complete, where v2's miss columns such as Spells Known
const SRD = "document__slug=wotc-srd&limit=100";
const SOURCES = {
  classes: `${BASE}/v1/classes/?${SRD}`,
  races: `${BASE}/v1/races/?${SRD}`,
  spells: `${BASE}/v1/spells/?${SRD}`,
};
const MAX_PAGES = 10;
// The SRD 5.1 has 12 classes and 9 races; fewer means Open5e sent something incomplete
const EXPECTED = { classes: 12, races: 9 };

const dryRun = process.argv.includes("--dry-run");

// Every level a spellcaster has slots for needs spells to choose from
const checkSpellLists = (classes, spells) => {
  for (const characterClass of classes) {
    const lastLevel = characterClass.levels[characterClass.levels.length - 1];
    lastLevel.spellSlots.forEach((slots, index) => {
      const spellLevel = index + 1;
      const available = spells.filter(
        (spell) => spell.level === spellLevel && spell.classes.includes(characterClass.slug)
      );
      if (slots > 0 && available.length === 0) {
        throw new Error(`class ${characterClass.slug}: no level ${spellLevel} spells`);
      }
    });
  }
};

const syncCollection = async (Model, documents) => {
  const result = await Model.bulkWrite(
    documents.map((document) => ({
      replaceOne: { filter: { slug: document.slug }, replacement: document, upsert: true },
    }))
  );
  const removed = await Model.deleteMany({ slug: { $nin: documents.map((document) => document.slug) } });
  return `${documents.length} ${Model.collection.name}: ${result.upsertedCount} new, ${result.modifiedCount} updated, ${removed.deletedCount} removed`;
};

(async () => {
  const [rawClasses, rawRaces, rawSpells] = await Promise.all(
    [SOURCES.classes, SOURCES.races, SOURCES.spells].map((url) => fetchAllPages(url, MAX_PAGES))
  );
  const classes = rawClasses.map(parseClass);
  const races = rawRaces.map(parseRace);
  const spells = rawSpells.map(parseSpell);

  for (const [name, documents] of Object.entries({ classes, races })) {
    if (documents.length < EXPECTED[name]) {
      throw new Error(`expected ${EXPECTED[name]} ${name}, Open5e sent ${documents.length}`);
    }
  }
  checkSpellLists(classes, spells);

  if (dryRun) {
    console.log(`Dry run: fetched and checked ${classes.length} classes, ${races.length} races and ${spells.length} spells`);
    return;
  }

  await mongoose.connect(process.env.DATABASE_ACCESS);
  try {
    console.log(`Synced ${await syncCollection(CharacterClass, classes)}`);
    console.log(`Synced ${await syncCollection(Race, races)}`);
    console.log(`Synced ${await syncCollection(Spell, spells)}`);
  } finally {
    await mongoose.disconnect();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
