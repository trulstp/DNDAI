// Loaded first, so every module sees the settings in .env
require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;
const useHttps = process.env.USE_HTTPS === "true";
const DB_RETRY_MS = 30 * 1000;

// Optional MongoDB. A failed first connection is retried, so a database that's briefly
// unreachable when the server starts doesn't leave it without one until the next restart
async function connectDatabase() {
  if (!process.env.DATABASE_ACCESS) {
    console.log("No DATABASE_ACCESS set (running without MongoDB)");
    return;
  }
  try {
    await mongoose.connect(process.env.DATABASE_ACCESS);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.warn(
      `MongoDB not connected (continuing without DB, retrying in ${DB_RETRY_MS / 1000} s):`,
      err.message
    );
    setTimeout(connectDatabase, DB_RETRY_MS).unref();
  }
}

function startServer() {
  if (useHttps) {
    const https = require("https");
    const fs = require("fs");

    const serverOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    };

    return https.createServer(serverOptions, app).listen(PORT, () => {
      console.log(`HTTPS server is up and running on ${PORT}`);
    });
  }
  return app.listen(PORT, () => {
    console.log(`HTTP server is up and running on ${PORT}`);
  });
}

(async () => {
  await connectDatabase();
  const server = startServer();

  // Hosts send SIGTERM before replacing the server on a redeploy (Ctrl+C sends SIGINT).
  // Stop taking new requests, let the ones in progress finish (artwork can take a minute),
  // then close the database connection
  const shutdown = (signal) => {
    console.log(`${signal} received, finishing requests in progress`);
    server.close(async () => {
      await mongoose.disconnect();
      console.log("Server stopped");
      process.exit(0);
    });
    // Don't wait forever on a request that never ends
    setTimeout(() => process.exit(0), 2 * 60 * 1000).unref();
  };
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
})();
