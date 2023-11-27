const express = require("express");
const https = require("https"); // Add the https module
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const monsterRoutes = require("./routes/dndRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const PORT = process.env.PORT || 4000;

dotenv.config();

const connectToMongo = async () => {
  await mongoose.connect(process.env.DATABASE_ACCESS);
  console.log("Connected to MongoDB");
};

connectToMongo();

const app = express();
const serverOptions = {
  key: fs.readFileSync("/etc/letsencrypt/live/your_domain.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/your_domain.com/fullchain.pem"),
};

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Origin", "https://supportroll.netlify.app");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
app.use("/app", monsterRoutes);
app.use("/user", userRoutes);

// Create an HTTPS server
const httpsServer = https.createServer(serverOptions, app);

httpsServer.listen(PORT, () =>
  console.log(`Server is up and running on ${PORT}`)
);
