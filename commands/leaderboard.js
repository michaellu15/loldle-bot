const {getScore, getLeaderboard} = require('../updateleaderboard')
module.exports = {
    name: 'leaderboard',
    async execute(message){
        const userId = message.author.id
        const guildId = message.guild.id
        const score = await getScore(guildId,userId)
        const leaderboard = await getLeaderboard(guildId)
        const leaderboardMessage = leaderboard.map((entry,i)=>
            `**#${i+1}** - **${entry.username}**: ${entry.wins} wins, ${entry.guesses} guesses`).join('\n')
        
        const user = leaderboard.find((entry)=>entry.userId===userId)
        const placement = leaderboard.findIndex((entry)=>entry.userId===userId)+1
        let userMessage = ``
        if(user && placement){
            userMessage = `\n\n **${message.author}'s Position:** **#${placement}** - ${user.wins} wins, ${user.guesses} guesses`
        }
        message.channel.send(`**Leaderboard**\n\n${leaderboardMessage}${userMessage}`)
    }
}