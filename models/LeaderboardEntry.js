const mongoose = require('mongoose');

const LeaderboardEntrySchema = new mongoose.Schema({
    guildId: String,
    userId: String,
    username: String,
    wins: {type: Number, default: 0},
    guesses: {type: Number, default: 0},
})

module.exports = mongoose.model('LeaderboardEntry', LeaderboardEntrySchema)