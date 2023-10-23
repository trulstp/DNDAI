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
app.use(express.json());
app.use(cors());
app.use("/app", monsterRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => console.log(`server is up and running on ${PORT}`));
