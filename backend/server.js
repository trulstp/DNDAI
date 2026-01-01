const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const monsterRoutes = require("./routes/dndRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

dotenv.config();

const PORT = process.env.PORT || 5000;
const useHttps = process.env.USE_HTTPS === "true";

const app = express();

app.use(
  cors({ origin: ["http://localhost:3000", "https://supportroll.netlify.app"] })
);
app.use(express.json());

app.use("/app", monsterRoutes);
app.use("/user", userRoutes);

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
