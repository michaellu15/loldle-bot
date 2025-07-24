const LeaderboardEntry = require('./models/LeaderboardEntry')

async function addStats(guildId, guessers, winner) {
    const guesserMap = new Map();
    guessers.forEach(guesser => {
        if (!guesser || !guesser.userId || !guesser.username) {
            return;
        }
        const userId = guesser.userId;
        if (!guesserMap.has(userId)) {
            guesserMap.set(userId, { guessCount: 1, username: guesser.username })
        }
        else {
            guesserMap.get(userId).guessCount++;
        }
    });
    for (const [userId, { guessCount, username }] of guesserMap.entries()) {
        const user = await LeaderboardEntry.findOne({ guildId: guildId, userId: userId })
        if (!user) {
            await LeaderboardEntry.create({ guildId: guildId, userId: userId, username: username, guesses: guessCount })
        }
        else {
            await LeaderboardEntry.findOneAndUpdate({ guildId: guildId, userId: userId }, { username: username, $inc: { guesses: guessCount } });
        }

    }
    if (winner && winner.userId) {
        await LeaderboardEntry.findOneAndUpdate({ guildId: guildId, userId: winner.userId }, { $inc: { wins: 1 } })
    }

}
async function getScore(guildId, userId) {
    const score = await LeaderboardEntry.findOne({ guildId: guildId, userId: userId })
    return score
}
async function getLeaderboard(guildId) {
    const leaderboard = await LeaderboardEntry.find({ guildId: guildId }).sort({ wins: -1, guesses: 1 })
    return leaderboard;
}

module.exports = { addStats, getScore, getLeaderboard }