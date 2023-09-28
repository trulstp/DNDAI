const monsterSchema = require("../models/DnDSchema");
const axios = require('axios');
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
            await newMonster.save()
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

        registeredMonster = await registeredMonster.save()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    }
};


const API_KEY = process.env.API_KEY;

const openai = async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        data: {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: req.body.message}],
            max_tokens: 100
        },
        url: 'https://api.openai.com/v1/chat/completions'
    };
    
    try {
        const response = await axios(options);
        res.send(response.data);
    } catch (error) {
        console.log(error);
    }
}


const openaiImage = async(req, res) => {
    

const openai = new OpenAI();

async function main() {
  const image = await openai.images.generate({ prompt: "A cute baby sea otter" });

  console.log(image.data);
}
main();
}

// gets a monster based on location, challenge rating, and setting

const getMonstersByLocationAndCR = async (req, res) => {
    try {
        const { location, challengeRating } = req.query;  // I'm assuming you're passing these as query parameters

        // Fetch all monsters of the given location
        const potentialMonsters = await monsterSchema.find({ location: { $regex: location, $options: 'i' } });

        let selectedMonsters = [];
        let remainingCR = parseInt(challengeRating, 10);


        // Sorting monsters by CR in descending order
        potentialMonsters.sort((a, b) => b.challengeRating - a.challengeRating);

        for (const monster of potentialMonsters) {
            if (monster.challengeRating <= remainingCR) {
                selectedMonsters.push(monster);
                remainingCR -= monster.challengeRating;
            }

            // Optional: If you've found enough monsters or hit some other condition, you can break early
            if (remainingCR <= 0) break;
        }

        // Return only the monster names as requested
        const monsterNames = selectedMonsters.map(monster => monster.monsterName);
        res.json(monsterNames);

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

};