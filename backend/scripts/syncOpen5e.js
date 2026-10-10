// Syncs SRD monster stat blocks from Open5e into the statblocks collection.
// The app reads stat blocks from MongoDB only, so Open5e is called just when this runs
// (4 requests for the 322 SRD monsters).
// Safe to re-run: stat blocks are updated in place, keyed by slug.
// Usage (from backend/): node scripts/syncOpen5e.js [--dry-run]
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Statblock = require("../models/statblockSchema");
const { BASE, fetchAllPages } = require("../services/open5eClient");

const SRD_MONSTERS_URL = `${BASE}/v1/monsters/?document__slug=wotc-srd&limit=100`;
const MAX_PAGES = 10;

const dryRun = process.argv.includes("--dry-run");

const FIELDS = Object.keys(Statblock.schema.paths).filter(
  (field) => !["_id", "__v", "nameKeys"].includes(field)
);

const nameKeysFor = (name) => {
  const full = name.toLowerCase().trim();
  const withoutParenthetical = full.replace(/\s*\(.*\)\s*$/, "");
  return [...new Set([full, withoutParenthetical])];
};

const toStatblock = (monster) => {
  const statblock = { nameKeys: nameKeysFor(monster.name) };
  for (const field of FIELDS) {
    // Open5e uses "" or null for empty lists of actions
    const value = monster[field];
    if (value !== undefined && value !== null && value !== "") {
      statblock[field] = value;
    }
  }
  return statblock;
};

(async () => {
  const monsters = await fetchAllPages(SRD_MONSTERS_URL, MAX_PAGES);
  const statblocks = monsters.map(toStatblock);

  if (dryRun) {
    console.log(`Dry run: fetched ${statblocks.length} SRD stat blocks`);
    return;
  }

  await mongoose.connect(process.env.DATABASE_ACCESS);

  const result = await Statblock.bulkWrite(
    statblocks.map((statblock) => ({
      replaceOne: {
        filter: { slug: statblock.slug },
        replacement: statblock,
        upsert: true,
      },
    }))
  );

  console.log(
    `Synced ${statblocks.length} stat blocks: ${result.upsertedCount} new, ${result.modifiedCount} updated`
  );
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
