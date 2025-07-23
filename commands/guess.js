const { getGame, addGuess, endGame, getGuesses, setFeedbackMessage, deleteFeedbackMessage } = require('../game.js')
const { getChampion } = require('../championlookup.js')
const { getFeedback } = require('../feedback.js')


module.exports = {
    name: 'guess',
    async execute(message, args, input) {
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
            message.channel.send(
                `${message.author} **${guessChampion.name}** has already been guessed! Here's the feedback again:\n\n${feedback.slice(1).join('\n')}`
            );
            return message.delete();
        }
        message.delete();
        addGuess(channelId, guessChampion, {
            username: message.author.username,
            nickname: message.member?.nickname,
            userId: message.author.id
        });
        

        const history = currentGame.guesses.map((guessChampion, index) => {
            const guesser = currentGame.guessers?.[index]
            const guesserName = guesser?.nickname || guesser?.username || 'Unknown'
            const feedback = getFeedback(guessChampion, currentGame.target);
            return `**Guess ${index + 1} by ${guesserName}: ${guessChampion.name}**\n${feedback.slice(1).join('\n')}`;
        })
        const guesses = getGuesses(channelId);
        if (guesses && guesses.length === 9&&!(guessChampion.name.toLowerCase() === currentGame.target.name.toLowerCase())) {
            const finalTarget = currentGame.target
            const finalGuesses = [...currentGame.guesses]
            const finalGuessers = [...currentGame.guessers]
            deleteFeedbackMessage(channelId);
            endGame(channelId,null,message.guild.id)
            const history = finalGuesses.map((guessChampion, index) => {
                const guesser = finalGuessers?.[index];
                const guesserName = guesser?.nickname || guesser?.username || 'Unknown';
                const feedback = getFeedback(guessChampion, finalTarget);
                return `**Guess ${index + 1} by ${guesserName}: ${guessChampion.name}**\n${feedback.slice(1).join('\n')}`;
            });

            await message.channel.send(history.join('\n\n'))
            const feedback = getFeedback(currentGame.target, currentGame.target)
            await message.channel.send(`\n**You have reached the maximum guesses of 9!**\n` + `**Correct Answer: ${currentGame.target.name}**\n${feedback.slice(1).join('\n')}`)
            return

        }
        if(guesses.length > 1){
            deleteFeedbackMessage(channelId);
        }
        

        message.channel.send(history.join('\n\n')).then(sent => {
            setFeedbackMessage(channelId, sent);
        });
        if (guessChampion.name.toLowerCase() === currentGame.target.name.toLowerCase()) {
            const winner = {userId:message.author.id}
            endGame(channelId,winner,message.guild.id)

            return message.channel.send(
                `Congratulations ${message.author}! You guessed the champion **${guessChampion.name}** correctly!`
            );
        }
    }
}