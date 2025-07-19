const champions = require('./champions.json')

function getChampion(name){
    return champions.find((champion)=>
        champion.id.some((alias)=>alias.toLowerCase() === name)
    )
}

module.exports = {getChampion}