const { response } = require("express");
const express = require("express");

const {
  register,
  getAllMonsters,
  openai,
  openaiImages,
  getMonstersByLocationAndCR,
  getMonstersByLocation,
  getLocations,
} = require("../controller/dndController");

const router = express.Router();

// url Example: http://localhost:4000/user/register body: json format { "monsterName" : "Beholder", "challengeRating" : 13, "location" : "Underdark", "groupTag" : "Beholder" }
router.post("/register", register);

router.post("/completions", openai);

router.post("/images", openaiImages);

// url Example: http://localhost:4000/app/encounter?location=underdark&challengeRating=9
router.get("/encounter", getMonstersByLocationAndCR);

// url Example: http://localhost:4000/app/all
router.get("/all", getAllMonsters);

// url Example: http://localhost:4000/app/location?location=underdark
router.get("/location", getMonstersByLocation);

router.get("/locations", getLocations);

module.exports = router;
