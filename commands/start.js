const champions = require('../champions.json')
const {startGame} = require('../game.js')

module.exports = {
    name: 'start',
    execute(message){
        const randomIndex = Math.floor(Math.random()*champions.length)
        const chosenChampion = champions[randomIndex]

        startGame(message.channel.id,chosenChampion)

        message.channel.send(
            `A new Loldle game was started by ${message.author}! Use \`?guess [champion name]\` to make your guess.`
        )
        message.delete()
        console.log(chosenChampion.name);
    }
}