const monsterSchema = require("../models/DnDSchema");


// registers a monster based on schema, all needs to be included

const register = async (req, res) => {
    let registeredMonster = new monsterSchema({
        monster: req.body.monster,
        number: req.body.number,
        challengeRating: req.body.challengeRating,
        setting: req.body.setting,
        location: req.body.location,
    });
    registeredMonster = await
        registeredMonster.save()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err);
        });
};

// gets a monster based on location, challenge rating, and setting

const getMonsters = async (req, res) => {
    try {
        const { location, challengeRating, setting } = req.query;

        // Construct a query object based on the provided criteria
        const query = {
            location: location,
            challengeRating: challengeRating,
            setting: setting,
        };

        // Use the query object to find matching monsters in the database
        const monsters = await monsterSchema.find(query);

        res.json(monsters);
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
    getMonsters,
    getAllMonsters,
};