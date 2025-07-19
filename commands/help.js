module.exports = {
    name: 'help',
    execute(message) {
        const helpMessage = `
**Available Commands**:
\`?start\` – Start a new game.
\`?guess <champion name>\` – Make a guess.
\`?end\` – End the current game and reveal the answer.
\`?help\` – Show this help message.
        `;

        message.author.send(helpMessage);
        message.delete()
    }
};