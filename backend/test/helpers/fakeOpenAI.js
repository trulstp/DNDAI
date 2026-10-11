// A stand-in for the OpenAI API, so tests can run the real routes without a key or a bill.
// It answers chat completions with a fixed encounter or character and images with a tiny PNG
const http = require("http");
const sharp = require("sharp");

const FAKE_ENCOUNTER = {
  title: "The Drowned Shrine",
  location: "A flooded cave",
  monsters: "Ghouls",
  obstacles: "Deep water",
  allies_npcs: "None",
  treasure_rewards: "A silver idol",
  random_events_twists: "The tide rises",
  mood_atmosphere: "Eerie",
  poster_description: "A flooded cave lit by green fungus, ghouls wading through black water",
};

const FAKE_CHARACTER = {
  personality: "Curious",
  ideals: "Knowledge",
  bonds: "Her old mentor",
  flaws: "Reckless",
  trinkets: "A brass key",
  quirks_and_habits: "Hums while reading",
  character_portrait: "A young elf wizard in a blue travelling cloak holding a glowing staff",
  backstory: "Raised in a library.",
};

const readBody = (req) =>
  new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body ? JSON.parse(body) : {}));
  });

// Starts the stand-in and points the app at it. Call before requiring the app
async function startFakeOpenAI() {
  const png = (
    await sharp({
      create: { width: 8, height: 8, channels: 3, background: "#884422" },
    })
      .png()
      .toBuffer()
  ).toString("base64");
  const requests = [];

  const server = http.createServer(async (req, res) => {
    const body = await readBody(req);
    requests.push({ path: req.url, body });
    res.setHeader("Content-Type", "application/json");

    if (req.url.endsWith("/chat/completions")) {
      const tool = body.tool_choice.function.name;
      const data = tool === "create_encounter" ? FAKE_ENCOUNTER : FAKE_CHARACTER;
      return res.end(
        JSON.stringify({
          choices: [
            {
              finish_reason: "stop",
              message: {
                tool_calls: [{ function: { name: tool, arguments: JSON.stringify(data) } }],
              },
            },
          ],
        })
      );
    }
    if (req.url.endsWith("/images/generations")) {
      return res.end(JSON.stringify({ data: [{ b64_json: png }] }));
    }
    res.statusCode = 404;
    res.end("{}");
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  process.env.OPENAI_API_KEY = "test-key";
  process.env.OPENAI_BASE_URL = `http://127.0.0.1:${server.address().port}/v1`;
  return { server, requests, FAKE_ENCOUNTER, FAKE_CHARACTER };
}

// Starts the app on a free port and returns fetches for its /app routes (getRoot for the others)
async function startApp() {
  const app = require("../../app");
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const root = `http://127.0.0.1:${server.address().port}`;
  const base = `${root}/app`;
  const post = (path, body, headers = {}) =>
    fetch(`${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
  const get = (path, headers = {}) => fetch(`${base}${path}`, { headers });
  const getRoot = (path) => fetch(`${root}${path}`);
  return { server, post, get, getRoot };
}

module.exports = { startFakeOpenAI, startApp };
