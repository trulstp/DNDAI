const { response } = require("express");
const express = require("express");

const {
  register,
  getAllMonsters,
  openai,
  openaiImages,
  getMonstersByLocationAndCR,
  getMonstersByLocation,
} = require("../controller/dndController");

const router = express.Router();

router.post("/register", register);

router.post("/completions", openai);

router.post("/images", openaiImages);

router.get("/encounter", getMonstersByLocationAndCR);

router.get("/all", getAllMonsters);

router.get("/location", getMonstersByLocation);

module.exports = router;
