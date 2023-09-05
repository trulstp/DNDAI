const { response } = require("express");
const express = require("express");

const {
    register,
    getMonsters,
    getAllMonsters,
} = require("../controller/dndController");

const router = express.Router();

router.post("/register", register);

router.get("/encounter", getMonsters);

router.get("/all", getAllMonsters);

module.exports = router;