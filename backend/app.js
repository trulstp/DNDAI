const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const monsterRoutes = require("./routes/dndRoutes");
const { generalLimit } = require("./middleware/limits");

// Sites allowed to call the API, comma separated
const corsOrigins = (
  process.env.CORS_ORIGINS || "http://localhost:3000,https://supportroll.netlify.app"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Behind a host's proxy every request seems to come from the proxy, which would give all
// visitors one shared rate limit. TRUST_PROXY is the number of proxies in front of the app,
// so the visitor's real address is read from X-Forwarded-For
const trustProxy = Number(process.env.TRUST_PROXY) || 0;

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", trustProxy);
app.use(cors({ origin: corsOrigins }));
// The largest real request (a character's stats and skills) is about 1 KB
app.use(express.json({ limit: "20kb" }));

// For the host's health checks: 200 whenever the server is up. The database is reported but not
// required, since the character creator works without it and a database blip shouldn't get the
// server restarted
app.get("/health", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/app", generalLimit, monsterRoutes);

// Malformed or oversized JSON, and anything a route didn't catch, without a stack trace
app.use((err, req, res, next) => {
  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: "The request couldn't be read" });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

module.exports = app;
