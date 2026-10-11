// Reading the visitor's address from a proxy's header (CLIENT_IP_HEADER), as behind Cloudflare
const test = require("node:test");
const assert = require("node:assert/strict");

process.env.CLIENT_IP_HEADER = "CF-Connecting-IP";
process.env.DEBUG_CLIENT_IP = "true";
const { startFakeOpenAI, startApp } = require("./helpers/fakeOpenAI");

let fakeOpenAI;
let app;

test.before(async () => {
  fakeOpenAI = await startFakeOpenAI();
  app = await startApp();
});

test.after(() => {
  app.server.close();
  fakeOpenAI.server.close();
});

const remaining = (response) => Number(response.headers.get("ratelimit").match(/r=(\d+)/)[1]);
const statblocks = (headers) => app.get("/statblocks?names=Ghoul", headers);

test("each address in the header gets its own limit", async () => {
  const first = remaining(await statblocks({ "CF-Connecting-IP": "203.0.113.10" }));
  assert.equal(remaining(await statblocks({ "CF-Connecting-IP": "203.0.113.10" })), first - 1);
  assert.equal(remaining(await statblocks({ "CF-Connecting-IP": "203.0.113.11" })), first);
});

test("a missing or malformed header falls back to the connection's address", async () => {
  const first = remaining(await statblocks({}));
  assert.equal(remaining(await statblocks({ "CF-Connecting-IP": "not an ip" })), first - 1);
});

test("the debug route shows the address the limits use", async () => {
  const response = await app.getRoot("/debug/client-ip");
  // Sent without the header, so it's the connection's address
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.limitedAs, body.reqIp);
  assert.ok("cf-connecting-ip" in body.headers);
});
