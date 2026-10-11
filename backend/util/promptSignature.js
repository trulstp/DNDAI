const crypto = require("crypto");

// Image prompts are written by the AI but sent back from the browser when the user asks
// for artwork. Each one is signed when it's written, and the image routes only accept a
// prompt whose signature matches, so they can't be used to generate arbitrary images on
// this app's OpenAI account.

// PROMPT_SIGNING_SECRET can be set on its own. Otherwise a key is derived from the OpenAI
// key, so signatures keep working across restarts without another secret to manage
const signingKey = () =>
  process.env.PROMPT_SIGNING_SECRET ||
  crypto
    .createHmac("sha256", process.env.OPENAI_API_KEY || "")
    .update("support-roll image prompts")
    .digest();

// kind ("encounter" or "portrait") is part of the signature, so a prompt signed for one
// image route isn't accepted by the other
const signPrompt = (kind, prompt) =>
  crypto
    .createHmac("sha256", signingKey())
    .update(`${kind}\n${prompt}`)
    .digest("base64url");

function isSignedPrompt(kind, prompt, signature) {
  if (typeof prompt !== "string" || typeof signature !== "string") return false;
  const expected = Buffer.from(signPrompt(kind, prompt));
  const given = Buffer.from(signature);
  // Constant-time comparison, so the response time doesn't leak how much of it matched
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

module.exports = { signPrompt, isSignedPrompt };
