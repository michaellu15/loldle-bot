function getFeedback(guess, answer){
    const categories = [
        'gender',
        'resource',
        'rangeType',
        'positions',
        'regions',
        'species',
        'releaseDate'
    ]
    const categoryMap = new Map(
        [['gender','Gender'],
        ['resource','Resource'],
        ['rangeType','Range'],
        ['positions','Roles(s)'],
        ['regions','Region(s)'],
        ['species','Species'],
        ['releaseDate','Release Date']]
    )
    
    const lines = []

    lines.push(`**Name:** ${guess.name}`)

    categories.forEach((category)=>{
        const guessVal = guess[category];
        const answerVal = answer[category];

        let result = '';

        if(Array.isArray(guessVal)&&Array.isArray(answerVal)){
            const match = guessVal.filter((val)=>answerVal.includes(val))
            const isExactMatch = guessVal.length === answerVal.length && guessVal.every((val)=>answerVal.includes(val))&&answerVal.every((val)=>guessVal.includes(val));

            if(isExactMatch){
                result = `🟩 **${categoryMap.get(category)}:** ${guessVal.join(', ')}`
            }
            else if(match.length>0){
                result = `🟨 **${categoryMap.get(category)}:** ${guessVal.join(', ')}`
            }
            else{
                result = `🟥 **${categoryMap.get(category)}:** ${guessVal.join(', ')}`
            }

        }
        else if (category === 'releaseDate'){
            const diff = guessVal - answerVal;

            if(diff===0){
                result = `🟩 **Release Year:** ${guessVal}`
            }
            else if(diff >0){
                result = `⬇️ **Release Year:** ${guessVal}`
            }
            else{
                result = `⬆️ **Release Year:** ${guessVal}`
            }
        }
        else{
            if(guessVal === answerVal){
                result = `🟩 **${categoryMap.get(category)}:** ${guessVal}`
            }
            else{
                result = `🟥 **${categoryMap.get(category)}:** ${guessVal}`
            }
        }
        lines.push(result);
    })
    return lines;
}

module.exports = {getFeedback}