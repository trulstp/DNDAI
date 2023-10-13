const monsterSchema = require("../models/DnDSchema");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

// registers a monster based on schema, all needs to be included

const register = async (req, res) => {
  // Check if the request contains an array of monsters
  if (Array.isArray(req.body)) {
    let registeredMonsters = [];

    // Loop through each monster in the array
    for (const monster of req.body) {
      const newMonster = new monsterSchema({
        monsterName: monster.monsterName,
        challengeRating: monster.challengeRating,
        setting: monster.setting,
        location: monster.location,
        groupTag: monster.groupTag,
      });

      // Save the monster
      await newMonster
        .save()
        .then((data) => {
          registeredMonsters.push(data);
        })
        .catch((err) => {
          return res.status(400).json(err);
        });
    }

    // Return the array of registered monsters
    return res.json(registeredMonsters);
  } else {
    // Handle single monster registration
    let registeredMonster = new monsterSchema({
      monsterName: req.body.monsterName,
      challengeRating: req.body.challengeRating,
      setting: req.body.setting,
      location: req.body.location,
      groupTag: req.body.groupTag,
    });

    registeredMonster = await registeredMonster
      .save()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
};

const API_KEY = process.env.OPENAI_API_KEY;

const openai = async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    data: {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.message }],
      max_tokens: 100,
    },
    url: "https://api.openai.com/v1/chat/completions",
  };

  try {
    const response = await axios(options);
    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
};

const openaiImage = async (req, res) => {
  const openai = new OpenAI();

  async function main() {
    const image = await openai.images.generate({
      prompt: "A cute baby sea otter",
    });

    console.log(image.data);
  }
  main();
};

// gets a monster based on location, challenge rating, and setting

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const getMonstersByLocationAndCR = async (req, res) => {
  try {
    const { location, challengeRating } = req.query;

    // Fetch all monsters of the given location
    const potentialMonsters = await monsterSchema.find({
      location: { $regex: location, $options: "i" },
    });

    let selectedMonsters = [];
    let remainingCR = parseInt(challengeRating, 10);

    // Create a pool of monsters based on their CR and the total available CR
    let monsterPool = [];
    for (const monster of potentialMonsters) {
      const maxAppearances = Math.floor(remainingCR / monster.challengeRating);
      for (let i = 0; i < maxAppearances; i++) {
        monsterPool.push(monster);
      }
    }

    // Shuffle multiple times for increased randomness
    shuffleArray(monsterPool);
    shuffleArray(monsterPool);
    shuffleArray(monsterPool);

    for (const monster of monsterPool) {
      if (monster.challengeRating <= remainingCR) {
        selectedMonsters.push(monster);
        remainingCR -= monster.challengeRating;
      }

      if (remainingCR <= 0) break;
    }

    // Return only the monster names as requested
    const monsterNames = selectedMonsters.map((monster) => monster.monsterName);
    res.json(monsterNames);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMonstersByLocation = async (req, res) => {
  try {
    const { location } = req.query;

    // Fetch all monsters of the given location
    const monsters = await monsterSchema.find({
      location: { $regex: location, $options: "i" },
    });

    // Filter the results to only include monsterName, challengeRating, and groupTag
    const filteredMonsters = monsters.map((monster) => ({
      monsterName: monster.monsterName,
      challengeRating: monster.challengeRating,
      groupTag: monster.groupTag,
    }));

    res.json(filteredMonsters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// gets all the monsters in the database

const getAllMonsters = async (req, res) => {
  try {
    const monsters = await monsterSchema.find();
    res.json(monsters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  getMonstersByLocationAndCR,
  getAllMonsters,
  openai,
  getMonstersByLocation,
};
