const { response } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const open5e = require("../controller/open5eController");

const {
  register,
  getAllMonsters,
  openaimessage,
  openaiImages,
  getMonstersByLocationAndCR,
  getMonstersByLocation,
  getLocations,
  encounter,
  getCharacter,
  creator,
  openaiImages2,
} = require("../controller/dndController");

const router = express.Router();

// Fail fast on database routes instead of letting mongoose buffer until timeout
const requireDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database is not connected" });
  }
  next();
};

// url Example: http://localhost:4000/user/register body: json format { "monsterName" : "Beholder", "challengeRating" : 13, "location" : "Underdark", "groupTag" : "Beholder" }
router.post("/register", requireDb, register);

router.post("/completions", openaimessage);

router.post("/images", openaiImages);

// url Example: http://localhost:4000/app/encounter?location=underdark&challengeRating=9
router.get("/encounter", requireDb, getMonstersByLocationAndCR);

// url Example: http://localhost:4000/app/all
router.get("/all", requireDb, getAllMonsters);

// url Example: http://localhost:4000/app/location?location=underdark
router.get("/location", requireDb, getMonstersByLocation);

router.get("/locations", requireDb, getLocations);

router.post("/schematic", encounter);

router.post("/create-character", getCharacter);

router.post("/openaiCharacter", creator);

router.post("/images2", openaiImages2);
module.exports = router;
