// Run with `npm test`. Uses Node's built-in test runner, so there's nothing extra to install.
// Nothing here calls OpenAI or needs MongoDB.
const test = require("node:test");
const assert = require("node:assert/strict");
const sharp = require("sharp");

// The OpenAI client refuses to start without a key; no request is ever sent with it
process.env.OPENAI_API_KEY ||= "test-key";
const {
  buildEncounter,
  buildEncounterPrompt,
  buildPortraitPrompt,
  encodeImage,
  getCharacter,
  getStatblocks,
} = require("../controller/dndController");
const monsterSeed = require("../data/monsterSeed");

const monster = (monsterName, challengeRating, groupTag = "Undead") => ({
  monsterName,
  challengeRating,
  groupTag,
});

const MONSTERS = [
  monster("Ghoul", 1),
  monster("Ghast", 2),
  monster("Mummy", 3),
  monster("Wraith", 5),
  monster("Mummy Lord", 15),
  monster("Bandit", 0.125, "Humanoid"),
];

const totalCR = (monsters) =>
  monsters.reduce((sum, m) => sum + m.challengeRating, 0);

// A stand-in for Express's res that records what the handler sent
function fakeResponse() {
  const res = { statusCode: 200, headers: {} };
  res.status = (code) => ((res.statusCode = code), res);
  res.set = (name, value) => ((res.headers[name] = value), res);
  res.json = (body) => ((res.body = body), res);
  res.send = (body) => ((res.body = body), res);
  return res;
}

test("encounters stay within the CR budget and the size limit", () => {
  for (const budget of [1, 4, 8, 12, 20]) {
    for (let i = 0; i < 200; i++) {
      const encounter = buildEncounter(MONSTERS, budget);
      assert.ok(encounter.length >= 1 && encounter.length <= 8);
      assert.ok(totalCR(encounter) <= budget, `CR ${totalCR(encounter)} > ${budget}`);
    }
  }
});

test("encounters never use monsters above the budget", () => {
  for (let i = 0; i < 200; i++) {
    const names = buildEncounter(MONSTERS, 4).map((m) => m.monsterName);
    assert.ok(!names.includes("Wraith") && !names.includes("Mummy Lord"));
  }
});

test("higher budgets usually get a lead monster that matches them", () => {
  // The lead is picked in proportion to CR, so at budget 15 the Mummy Lord leads most of the time
  let mummyLordLeads = 0;
  for (let i = 0; i < 500; i++) {
    if (buildEncounter(MONSTERS, 15)[0].monsterName === "Mummy Lord") mummyLordLeads++;
  }
  assert.ok(mummyLordLeads > 250, `Mummy Lord led ${mummyLordLeads} of 500`);
});

test("followers too weak to matter at the budget are skipped", () => {
  // At budget 16 followers must be at least CR 2, so no swarm of CR 1/8 bandits
  for (let i = 0; i < 200; i++) {
    const [, ...followers] = buildEncounter(MONSTERS, 16);
    assert.ok(followers.every((m) => m.challengeRating >= 2));
  }
});

test("no encounter when every monster is above the budget", () => {
  assert.deepEqual(buildEncounter([monster("Mummy Lord", 15)], 2), []);
});

test("the encounter prompt lists monsters in order with counts, CR and abilities", () => {
  const prompt = buildEncounterPrompt(
    {
      location: "tombs",
      challengeRating: 8,
      monsters: [monster("Wraith", 5), monster("Ghoul", 1), monster("Ghoul", 1), monster("Bandit", 0.125, "Humanoid")],
    },
    { Wraith: "traits: Incorporeal Movement; actions: Life Drain" }
  );
  assert.match(prompt, /location: tombs/);
  assert.match(prompt, /- 1× Wraith \(CR 5, Undead\) — traits: Incorporeal Movement; actions: Life Drain\n- 2× Ghoul \(CR 1, Undead\)\n- 1× Bandit \(CR 1\/8, Humanoid\)/);
  assert.match(prompt, /budget of 8 \(the monsters total CR 7\.125\)/);
  assert.match(prompt, /don't give them abilities they don't have/);
});

test("the encounter prompt leaves out the abilities line when there are none", () => {
  const prompt = buildEncounterPrompt({ location: "forest", monsters: ["Wolf"] });
  assert.match(prompt, /- 1× Wolf$/m);
  assert.doesNotMatch(prompt, /abilities/);
});

test("portrait prompts spell out race features and the shared style", () => {
  const prompt = buildPortraitPrompt({ message: "A scarred veteran.", race: "Half-Orc", characterClass: "Fighter" });
  assert.match(prompt, /^Subject: a Half-Orc Fighter \(two large tusks/);
  assert.match(prompt, /A scarred veteran\./);
  assert.match(prompt, /Style: moody oil painting/);
  assert.match(buildPortraitPrompt({ message: "x", race: "Human" }), /^Subject: a Human\./);
});

test("images are AVIF by default and WebP when asked", async () => {
  const png = await sharp({ create: { width: 8, height: 8, channels: 3, background: "#b46746" } }).png().toBuffer();
  for (const [requested, expected] of [[undefined, "avif"], ["avif", "avif"], ["webp", "webp"], ["gif", "avif"]]) {
    const { type, data } = await encodeImage(png, requested);
    assert.equal(type, `image/${expected}`);
    assert.equal((await sharp(data).metadata()).format, expected === "avif" ? "heif" : "webp");
  }
});

test("the character generator rejects unsupported choices", () => {
  const cases = [
    [{ classType: "Bard" }, /class must be one of/],
    [{ race: "Orc" }, /race must be one of/],
    [{ level: 7 }, /level must be one of/],
    [{ name: "x".repeat(41) }, /name must be at most 40/],
  ];
  for (const [body, error] of cases) {
    const res = fakeResponse();
    getCharacter({ body }, res);
    assert.equal(res.statusCode, 400, JSON.stringify(body));
    assert.match(res.body.error, error);
  }
});

test("stat block lookups need between 1 and 20 names", async () => {
  for (const names of ["", " , ", Array.from({ length: 21 }, (_, i) => `M${i}`).join(",")]) {
    const res = fakeResponse();
    await getStatblocks({ query: { names } }, res);
    assert.equal(res.statusCode, 400);
  }
});

test("seed monsters all have a positive CR, a group tag and no duplicates per location", () => {
  for (const [location, { setting, monsters }] of Object.entries(monsterSeed)) {
    assert.ok(setting, `${location} has no setting`);
    const names = new Set();
    for (const [name, cr, groupTag] of monsters) {
      assert.ok(cr > 0, `${location}: ${name} has CR ${cr}`);
      assert.ok(groupTag, `${location}: ${name} has no group tag`);
      assert.ok(!names.has(name), `${location}: ${name} is listed twice`);
      names.add(name);
    }
  }
});
