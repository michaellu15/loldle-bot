const { getGame, addGuess, endGame, setFeedbackMessage, deleteFeedbackMessage } = require('../game.js')
const { getChampion } = require('../championlookup.js')
const { getFeedback } = require('../feedback.js')

module.exports = {
    name: 'guess',
    execute(message, args, input) {
        const channelId = message.channel.id
        const currentGame = getGame(channelId)
        if (!currentGame) {
            return message.reply('No game is running. Use `?start` to begin.')
        }
        if (!input) {
            return message.reply('Please provide a champion name')
        }

        const guess = input.toLowerCase();
        if (!guess) {
            message.reply("Invalid champion name.");
            return;
        }
        const guessChampion = getChampion(guess);
        if (!guessChampion) {
            message.reply("Invalid champion name. Try again!");
            return;
        }
        const alreadyGuessed = currentGame.guesses.some(
            (guess) => guess.name.toLowerCase() === guessChampion.name.toLowerCase()
        );

        if (alreadyGuessed) {
            const feedback = getFeedback(guessChampion, currentGame.target);
            return message.reply(
                `You've already guessed **${guessChampion.name}**! Here's the feedback again:\n\n${feedback}`
            );
        }
        message.delete();
        let username = message.member.displayName
        if(!username){
            username = message.author.username
        }
        addGuess(channelId, guessChampion,username);
        deleteFeedbackMessage(channelId);

        const history = currentGame.guesses.map((guessChampion, index) => {
            const feedback = getFeedback(guessChampion, currentGame.target);
            return `**Guess ${index + 1} by ${guessChampion.user}: ${guessChampion.name}**\n${feedback.slice(1).join(' ')}`;
        })

        message.channel.send(history.join('\n\n')).then(sent => {
            setFeedbackMessage(channelId, sent);
        });
        if (guessChampion.name.toLowerCase() === currentGame.target.name.toLowerCase()) {
            endGame(channelId);
            return message.channel.send(
                `Congratulations ${message.author}! You guessed the champion **${guessChampion.name}** correctly!`
            );
        }
    }
}