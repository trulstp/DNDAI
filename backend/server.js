const express = require("express");
const app = express();
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

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Allow requests from localhost
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

// Enable CORS for all routes

// Your route handling code here

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.listen(PORT, () => console.log(`server is up and running on ${PORT}`));
