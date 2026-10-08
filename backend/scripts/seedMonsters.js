// Seeds the monster catalogue from data/monsterSeed.js.
// Safe to re-run: monsters already registered for a location are skipped.
// Usage (from backend/): node scripts/seedMonsters.js [--dry-run]
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const monsterSchema = require("../models/DnDSchema");
const seed = require("../data/monsterSeed");

const dryRun = process.argv.includes("--dry-run");

(async () => {
  const docs = [];
  for (const [location, { setting, monsters }] of Object.entries(seed)) {
    for (const [monsterName, challengeRating, groupTag] of monsters) {
      if (!(challengeRating > 0)) {
        throw new Error(`${monsterName} in ${location} needs a CR above 0`);
      }
      docs.push({ monsterName, challengeRating, setting, location, groupTag });
    }
  }

  if (dryRun) {
    console.log(`Dry run: ${docs.length} monsters across ${Object.keys(seed).length} locations`);
    return;
  }

  await mongoose.connect(process.env.DATABASE_ACCESS);

  let inserted = 0;
  for (const doc of docs) {
    const result = await monsterSchema.updateOne(
      { monsterName: doc.monsterName, location: doc.location },
      { $setOnInsert: doc },
      { upsert: true }
    );
    inserted += result.upsertedCount;
  }

  console.log(`Inserted ${inserted} new monsters (${docs.length - inserted} already existed)`);
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
