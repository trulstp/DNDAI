// Loaded first, so every module sees the settings in .env
require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;
const useHttps = process.env.USE_HTTPS === "true";

(async () => {
  // Optional MongoDB
  if (process.env.DATABASE_ACCESS) {
    try {
      await mongoose.connect(process.env.DATABASE_ACCESS);
      console.log("Connected to MongoDB");
    } catch (err) {
      console.warn(
        "MongoDB not connected (continuing without DB):",
        err.message
      );
    }
  } else {
    console.log("No DATABASE_ACCESS set (running without MongoDB)");
  }

  // Start server
  if (useHttps) {
    const https = require("https");
    const fs = require("fs");

    const serverOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    };

    https.createServer(serverOptions, app).listen(PORT, () => {
      console.log(`HTTPS server is up and running on ${PORT}`);
    });
  } else {
    app.listen(PORT, () => {
      console.log(`HTTP server is up and running on ${PORT}`);
    });
  }
})();
