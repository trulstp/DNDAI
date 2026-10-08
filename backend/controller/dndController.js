const monsterSchema = require("../models/DnDSchema");
const axios = require("axios");
const fetch = require("node-fetch");
const sharp = require("sharp");
const dotenv = require("dotenv");
const OpenAI = require("openai");
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// registers a monster based on schema, all needs to be included

const register = async (req, res) => {
  try {
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
        const data = await newMonster.save();
        registeredMonsters.push(data);
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

      const data = await registeredMonster.save();
      res.json(data);
    }
  } catch (err) {
    console.error("Register error:", err);
    res.status(400).json({
      error: err.message,
    });
  }
};

// My API key for OpenAI
const API_KEY = process.env.OPENAI_API_KEY;

// gets a response from openai based on a message
const openaimessage = async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    data: {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: req.body.message,
        },
      ],
      max_tokens: 600,
    },
    url: "https://api.openai.com/v1/chat/completions",
  };

  try {
    const response = await axios(options);
    res.send(response.data);
    console.log(response.data);
  } catch (error) {
    console.error("Error in openaimessage:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const openaiImages = async (req, res) => {
  try {
    const apiResponse = await openai.images.generate({
      model: "gpt-image-1-mini",
      prompt: req.body.message,
      n: 1,
      size: "1536x1024",
    });

    if (
      !apiResponse.data ||
      !Array.isArray(apiResponse.data) ||
      apiResponse.data.length === 0
    ) {
      throw new Error("No images returned");
    }

    const imageData = apiResponse.data[0].b64_json;

    if (!imageData) {
      throw new Error("No base64 image data returned");
    }

    const imageBuffer = Buffer.from(imageData, "base64");

    // Convert the image to AVIF format using sharp
    const avifImage = await sharp(imageBuffer).toFormat("avif").toBuffer();

    res.type("image/avif").send(avifImage);
  } catch (error) {
    console.error("Error in openaiImages:", error);
    res.status(500).send("Internal Server Error");
  }
};

const openaiImages2 = async (req, res) => {
  try {
    const apiResponse = await openai.images.generate({
      model: "gpt-image-1-mini",
      prompt: req.body.message,
      n: 1,
      size: "1024x1536",
    });

    if (
      !apiResponse.data ||
      !Array.isArray(apiResponse.data) ||
      apiResponse.data.length === 0
    ) {
      throw new Error("No images returned");
    }

    const imageData = apiResponse.data[0].b64_json;

    if (!imageData) {
      throw new Error("No base64 image data returned");
    }

    const imageBuffer = Buffer.from(imageData, "base64");

    // Convert the image to AVIF format using sharp
    const avifImage = await sharp(imageBuffer).toFormat("avif").toBuffer();

    res.type("image/avif").send(avifImage);
  } catch (error) {
    console.error("Error in openaiImages2:", error);
    res.status(500).send("Internal Server Error");
  }
};

const MAX_ENCOUNTER_SIZE = 8;
const KIN_PREFERENCE = 0.7;

// Exact, case-insensitive location match; the input is escaped so it can't act as a regex
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const locationQuery = (location) => ({
  location: { $regex: `^${escapeRegex(location)}$`, $options: "i" },
});

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

// Picks a random item, each item's chance proportional to weight(item)
function pickWeighted(items, weight) {
  const total = items.reduce((sum, item) => sum + weight(item), 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= weight(item);
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

// Builds an encounter from a lead monster plus followers that fill the CR budget
function buildEncounter(monsters, budget) {
  const candidates = monsters.filter(
    (m) => m.challengeRating > 0 && m.challengeRating <= budget
  );
  if (candidates.length === 0) return [];

  // Lead chance is proportional to CR, so higher budgets usually get a monster that matches them
  const lead = pickWeighted(candidates, (m) => m.challengeRating);
  const selected = [lead];
  let remainingCR = budget - lead.challengeRating;

  // Followers too weak to matter at this budget are skipped to avoid swarms of trivial creatures
  const minFollowerCR = budget / MAX_ENCOUNTER_SIZE;
  while (selected.length < MAX_ENCOUNTER_SIZE) {
    const fits = candidates.filter(
      (m) => m.challengeRating <= remainingCR && m.challengeRating >= minFollowerCR
    );
    if (fits.length === 0) break;

    // Prefer the lead's kind so the group reads as one band
    const kin = fits.filter((m) => m.groupTag === lead.groupTag);
    const pool = kin.length > 0 && Math.random() < KIN_PREFERENCE ? kin : fits;
    const follower = pickRandom(pool);
    selected.push(follower);
    remainingCR -= follower.challengeRating;
  }

  return selected;
}

// gets a random encounter for a location within a challenge rating budget
const getMonstersByLocationAndCR = async (req, res) => {
  try {
    const { location } = req.query;
    const budget = parseFloat(req.query.challengeRating);
    if (typeof location !== "string" || !location || !(budget > 0)) {
      return res
        .status(400)
        .json({ error: "location and a positive challengeRating are required" });
    }

    const monsters = await monsterSchema.find(locationQuery(location));
    const encounter = buildEncounter(monsters, budget);

    res.json(encounter.map((monster) => monster.monsterName));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMonstersByLocation = async (req, res) => {
  try {
    const { location } = req.query;
    if (typeof location !== "string" || !location) {
      return res.status(400).json({ error: "location is required" });
    }

    // Fetch all monsters of the given location
    const monsters = await monsterSchema.find(locationQuery(location));

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

const getLocations = async (req, res) => {
  try {
    const locations = await monsterSchema.find({}, "location");

    // Use a Set to store unique locations after standardizing them
    const uniqueLocationsSet = new Set();

    // Iterate through the locations and standardize them before adding to the Set
    locations.forEach((item) => {
      // You can use a custom function to standardize the location as needed
      const standardizedLocation = standardizeLocation(item.location);

      // Add the standardized location to the Set
      uniqueLocationsSet.add(standardizedLocation);
    });

    // Convert the Set back to an array
    const uniqueLocations = Array.from(uniqueLocationsSet);

    console.log("Distinct Locations:", uniqueLocations);
    res.json(uniqueLocations);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Custom function to standardize location
function standardizeLocation(location) {
  // You can implement your standardization logic here, e.g., removing spaces and making it lowercase
  return location.toLowerCase().replace(/\s/g, "");
}

const characterSchema = {
  type: "object",
  properties: {
    personality: {
      type: "string",
      description: "Describe the personality traits of the character.",
    },
    ideals: {
      type: "string",
      description:
        "Describe the ideals of the character, what do they strive for?",
    },
    bonds: {
      type: "string",
      description:
        "Describe the bonds of the character, what do they care for?",
    },
    flaws: {
      type: "string",
      description:
        "Describe the flaws of the character, what are they afraid of?",
    },
    trinkets: {
      type: "string",
      description:
        "Describe the trinkets and oddities of the character, what do they carry with them?",
    },
    quirks_and_habits: {
      type: "string",
      description:
        "Describe the quirks and habits of the character, what are their mannerisms?",
    },
    character_portrait: {
      type: "string",
      description:
        "Describe the character in intricate detail, include specific descriptions, shapes, colors, textures, patterns, and artistic styles.",
    },
    backstory: {
      type: "string",
      description:
        "Describe the characters backstory in intricate detail. max 150 words",
    },
  },
  required: [
    "personality",
    "ideals",
    "bonds",
    "flaws",
    "trinkets",
    "quirks_and_habits",
    "character_portrait",
    "backstory",
  ],
};

const creator = async (req, res) => {
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model: "gpt-5.4-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a dungeons and dragons assistant helper and you are creating a detailed player character based on their stats, skills, alignment, name, race, class, and level for a ttrpg game.",
      },
      {
        role: "user",
        content: `Create a detailed dnd player character based on this name: ${req.body.message.name}, this race: ${req.body.message.race}, this class: ${req.body.message.class}, this level: ${req.body.message.level}, this alignment: ${req.body.message.alignment}, these stats: ${JSON.stringify(req.body.message.stats)}, and these skills: ${req.body.message.skills}. Make the character interesting to read.`,
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "create_character",
          parameters: characterSchema,
        },
      },
    ],
    tool_choice: {
      type: "function",
      function: {
        name: "create_character",
      },
    },
    temperature: 1,
    max_completion_tokens: 4000,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorData}`);
    }

    const responseData = await response.json();

    if (responseData.choices?.[0]?.finish_reason === "length") {
      throw new Error("OpenAI response was cut off by the token limit");
    }

    const toolCall = responseData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("No tool call returned by OpenAI");
    }

    const argumentsString = toolCall.function?.arguments;

    if (!argumentsString) {
      throw new Error("OpenAI returned an empty function argument");
    }

    const characterData = JSON.parse(argumentsString);

    res.json(characterData);

    console.log("Character data:", characterData);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).send("Internal Server Error");
  }
};

const encounterSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Make a title for the encounter.",
    },
    location: {
      type: "string",
      description:
        "Make a description of the location of the encounter, include the terrain, the weather, the time of day, and the lighting.",
    },
    monsters: {
      type: "string",
      description:
        "Make a description of the monsters in the encounter, include their appearance, their actions, their motivations, and their goals.",
    },
    obstacles: {
      type: "string",
      description:
        "Describe any obstacles or environmental hazards present in the encounter location that the player characters might have to navigate or deal with.",
    },
    allies_npcs: {
      type: "string",
      description:
        "Specify if there are any non-player characters (NPCs) or potential allies present in the encounter. Describe their roles, relationships with the monsters, and whether they are friendly, hostile, or neutral toward the player characters.",
    },
    treasure_rewards: {
      type: "string",
      description:
        "Describe the treasure or rewards the monsters in the encounter are guarding or that the players might find.",
    },
    random_events_twists: {
      type: "string",
      description:
        "Include unexpected events or plot twists that can occur during the encounter, adding an element of surprise and narrative depth.",
    },
    mood_atmosphere: {
      type: "string",
      description:
        "Describe the overall mood and atmosphere of the encounter. Is it tense, eerie, jovial, or chaotic? Include sensory details such as sounds, smells, and the general emotional tone.",
    },
    poster_description: {
      type: "string",
      description:
        "Describe the encounter in intricate detail, include specific descriptions, shapes, colors, textures, patterns, and artistic styles.",
    },
  },
  required: [
    "title",
    "location",
    "monsters",
    "obstacles",
    "allies_npcs",
    "treasure_rewards",
    "random_events_twists",
    "mood_atmosphere",
    "poster_description",
  ],
};

const encounter = async (req, res) => {
  const url = "https://api.openai.com/v1/chat/completions";

  const body = {
    model: "gpt-5.4-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a dungeon master helper and you are creating detailed encounter descriptions based on monsters and location for your players.",
      },
      {
        role: "user",
        content: `Create detailed encounter descriptions based on these monsters: ${req.body.message.monsters} in this type of location: ${req.body.message.location}. Make the encounter interesting to read.`,
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "create_encounter",
          parameters: encounterSchema,
        },
      },
    ],
    tool_choice: {
      type: "function",
      function: {
        name: "create_encounter",
      },
    },
    temperature: 1,
    max_completion_tokens: 4000,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorData}`);
    }

    const responseData = await response.json();

    console.log("OpenAI response:", JSON.stringify(responseData, null, 2));

    if (responseData.choices?.[0]?.finish_reason === "length") {
      throw new Error("OpenAI response was cut off by the token limit");
    }

    const toolCall = responseData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("No tool call returned by OpenAI");
    }

    const argumentsString = toolCall.function?.arguments;

    if (!argumentsString) {
      throw new Error("OpenAI returned an empty function argument");
    }

    const encounterData = JSON.parse(argumentsString);

    res.json(encounterData);

    console.log("Encounter data:", encounterData);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).send("Internal Server Error");
  }
};

const { spawn } = require("child_process");

const getCharacter = (req, res) => {
  // Validate or set default values before passing them to the Python script
  const name = req.body.name || "random";
  const charClass = req.body.classType || "random";
  const race = req.body.race || "random";
  const level = req.body.level || 1; // Default level if not provided

  const args = [
    "scripts/Class_creator.py", // Ensure this is the correct path to your Python script
    name,
    charClass,
    race,
    String(level), // Convert level to a string to ensure all args are strings
  ];

  // Change "python" to "python3" or the correct path to your Python executable
  const python = spawn("python3", args);

  let dataToSend = "";
  let isClosed = false; // Flag to indicate if the response has been sent

  python.stdout.on("data", (data) => {
    dataToSend += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  python.on("error", (error) => {
    console.error(`error: ${error.message}`);
    if (!isClosed) {
      res.status(500).send("An error occurred while generating the character.");
      isClosed = true; // Update the flag
    }
  });

  python.on("close", (code) => {
    if (isClosed) return; // If the response is already sent, do nothing
    console.log(`Child process exited with code ${code}`);
    if (code === 0) {
      try {
        const jsonData = JSON.parse(dataToSend);
        res.json(jsonData); // Use res.json to send JSON response directly
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        res.status(500).send("Failed to parse character data.");
      }
    } else {
      res.status(500).send(`Python script exited with code ${code}`);
    }
    isClosed = true; // Update the flag
  });
};

module.exports = {
  buildEncounter,
  register,
  getMonstersByLocationAndCR,
  getAllMonsters,
  openaimessage,
  openaiImages,
  getMonstersByLocation,
  getLocations,
  encounter,
  getCharacter,
  creator,
  openaiImages2,
};
