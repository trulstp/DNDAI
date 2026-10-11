// The hourly limit per visitor and the daily cap for everyone, with small limits so they're
// quick to reach. Runs without MongoDB, so the daily count is kept in memory
const test = require("node:test");
const assert = require("node:assert/strict");

process.env.AI_LIMIT_PER_HOUR = "3";
process.env.AI_LIMIT_PER_DAY = "5";
// As on a host behind one proxy, so each X-Forwarded-For address is a different visitor
process.env.TRUST_PROXY = "1";
const { startFakeOpenAI, startApp } = require("./helpers/fakeOpenAI");

let fakeOpenAI;
let app;
let signPrompt;

test.before(async () => {
  fakeOpenAI = await startFakeOpenAI();
  app = await startApp();
  ({ signPrompt } = require("../util/promptSignature"));
});

test.after(() => {
  app.server.close();
  fakeOpenAI.server.close();
});

const imageRequest = (visitor) => {
  const prompt = "A misty swamp at dusk";
  return app.post(
    "/images",
    { message: prompt, signature: signPrompt("encounter", prompt) },
    { "X-Forwarded-For": visitor }
  );
};

test("each visitor gets the hourly limit, and everyone together the daily cap", async () => {
  // Refused requests never reach the limits, so they don't use any of them up
  for (let i = 0; i < 5; i++) {
    const unsigned = await app.post(
      "/images",
      { message: "Anything at all" },
      { "X-Forwarded-For": "203.0.113.1" }
    );
    assert.equal(unsigned.status, 403);
  }

  // Visitor A uses their whole hourly limit
  for (let i = 0; i < 3; i++) {
    assert.equal((await imageRequest("203.0.113.1")).status, 200);
  }
  const overHourly = await imageRequest("203.0.113.1");
  assert.equal(overHourly.status, 429);
  assert.equal((await overHourly.json()).code, "AI_HOURLY_LIMIT");

  // Visitor B still can, until the day's 5 requests are used (the refused one didn't count)
  assert.equal((await imageRequest("203.0.113.2")).status, 200);
  assert.equal((await imageRequest("203.0.113.2")).status, 200);
  const overDaily = await imageRequest("203.0.113.2");
  assert.equal(overDaily.status, 503);
  assert.equal((await overDaily.json()).code, "AI_DAILY_LIMIT");

  // Only the 5 accepted requests reached OpenAI
  assert.equal(fakeOpenAI.requests.length, 5);
});
