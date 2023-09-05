const mongoose = require("mongoose");


const monsterSchema = new mongoose.Schema({
    monster: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
    },
    challengeRating: {
        type: Number,
        required: true, 
    },
    setting: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("monsters", monsterSchema);