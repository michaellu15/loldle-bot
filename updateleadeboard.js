const LeaderboardEntry = require('./models/LeaderboardEntry')

async function addStats(guildId, guessers, winner) {
    const guesserMap = new Map();
    guessers.forEach(guesser => {
        guesserMap.set(guesser, (guesserMap.get(guesser) || 0) + 1)
    });
    guesserMap.forEach(async (guessCount, guesser) => {
        const user = await LeaderboardEntry.findOne({ guildId: guildId, userId: guesser.userId })
        if (!user) {
            await LeaderboardEntry.create({ guildId: guildId, userId: guesser.userId, username: guesser.username, guesses:guessCount})
        }
        else {
            await LeaderboardEntry.findOneAndUpdate({ guildId: guildId, userId: guesser.userId}, {username: guesser.username, $inc: { guesses: guessCount } });
        }

    })
    if(winner){
        await LeaderboardEntry.findOneAndUpdate({guildId:guildId,userId:winner.userId},{$inc:{wins:1}})
    }

}
async function getScore(guildId, userId) {
    const score = await LeaderboardEntry.findOne({guildId:guildId,userId:userId})
    return score
}
async function getLeaderboard(guildId) {
    const leaderboard = await LeaderboardEntry.find({guildId:guildId}).sort({wins:-1,guesses:1})
    return leaderboard;
}

module.exports = {addStats, getScore, getLeaderboard}