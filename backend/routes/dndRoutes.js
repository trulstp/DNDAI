const express = require("express");
const mongoose = require("mongoose");

const {
  openaiImages,
  getMonstersByLocationAndCR,
  encounter,
  getCharacter,
  creator,
  openaiImages2,
  getStatblocks,
  validateEncounterRequest,
  validateCharacterRequest,
  validateImageRequest,
} = require("../controller/dndController");
const { aiLimits } = require("../middleware/limits");

const router = express.Router();

// Fail fast on database routes instead of letting mongoose buffer until timeout
const requireDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database is not connected" });
  }
  next();
};

// url Example: http://localhost:4000/app/encounter?location=underdark&challengeRating=9
router.get("/encounter", requireDb, getMonstersByLocationAndCR);

// url Example: http://localhost:4000/app/statblocks?names=Wraith,Mummy
router.get("/statblocks", requireDb, getStatblocks);

router.post("/create-character", getCharacter);

// The routes below call OpenAI: requests are checked first, then counted against the limits
router.post("/schematic", validateEncounterRequest, ...aiLimits, encounter);

router.post("/openaiCharacter", validateCharacterRequest, ...aiLimits, creator);

router.post("/images", validateImageRequest("encounter"), ...aiLimits, openaiImages);

router.post("/images2", validateImageRequest("portrait"), ...aiLimits, openaiImages2);

module.exports = router;
