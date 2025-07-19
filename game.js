//stores active games in channel id/champion object key value pairs
const games = new Map();


function startGame(channelId, champion){
    games.set(channelId,{
        target: champion,
        guesses: []
    });
}

function addGuess(channelId,champion,user){
    if(!games.has(channelId)) return;
    games.get(channelId).guesses.push({name: champion.name, user: user});
}
function getGame(channelId){
    return games.get(channelId);
}
function endGame(channelId){
    games.delete(channelId)
}
const feedbackMessages = new Map();

function setFeedbackMessage(channelId, message) {
  feedbackMessages.set(channelId, message);
}

function getFeedbackMessage(channelId) {
  return feedbackMessages.get(channelId);
}

function deleteFeedbackMessage(channelId) {
  const msg = feedbackMessages.get(channelId);
  if (msg && msg.deletable) {
    msg.delete().catch(console.error);
  }
  feedbackMessages.delete(channelId);
}

module.exports = {startGame, addGuess, getGame, endGame, setFeedbackMessage, getFeedbackMessage, deleteFeedbackMessage}