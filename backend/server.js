const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const monsterRoutes = require("./routes/dndRoutes");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

dotenv.config();

const connectToMongo = async () => {
    await mongoose.connect(process.env.DATABASE_ACCESS);
    console.log("Connected to MongoDB");
  };
  
  connectToMongo();
app.use(express.json());
app.use(cors());
app.use("/app", monsterRoutes);
app.listen(PORT, () => console.log(`server is up and running on ${PORT}`))