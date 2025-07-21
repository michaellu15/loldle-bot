const { getGame, endGame } = require('../game.js')
const { getFeedback} = require('../feedback.js')

module.exports = {
    name: 'end',
    execute(message){
        const game = getGame(message.channel.id);
        if(!game){
            return message.reply(`No active game to end!`)
        }
        const feedback = getFeedback(game.target,game.target);
        endGame(message.channel.id);

        message.channel.send(`The game has been ended by ${message.author}.\n\n` + `**Correct Answer: ${game.target.name}**\n${feedback.slice(1).join('\n')}`)
        message.delete();
    }
}