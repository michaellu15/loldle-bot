const {addStats} = require('./updateleaderboard.js')

//stores active games in channel id/champion object key value pairs
const games = new Map();

function startGame(channelId, champion){
    games.set(channelId,{
        target: champion,
        guesses: [],
        guessers: []
    });
}

function addGuess(channelId, guess, user){
    if (!games.has(channelId)) return;
    const game = games.get(channelId);
    game.guesses.push(guess);
    game.guessers.push(user);
}

function getGuesses(channelId){
  return games.get(channelId).guesses
}
function getGame(channelId){
    return games.get(channelId);
}
function endGame(channelId,winner,guildId){
  const game = games.get(channelId)
  if(!game){
    return;
  }
  addStats(guildId,games.get(channelId).guessers,winner)
  games.delete(channelId)
}
const feedbackMessages = new Map();

function setFeedbackMessage(channelId, message) {
  feedbackMessages.set(channelId, message);
}

function getFeedbackMessage(channelId) {
  return feedbackMessages.get(channelId);
}

async function deleteFeedbackMessage(channelId) {
  const msg = feedbackMessages.get(channelId);
  feedbackMessages.delete(channelId);

  if (!msg) return;

  try {
    const message = await msg.channel.messages.fetch(msg.id);
    if (message && message.deletable) {
      await message.delete();
    }
  } catch (err) {
    if (err.code !== 10008) {
      console.error(`Failed to delete feedback message:`, err);
    }
  }
}

module.exports = {startGame, addGuess, getGame, endGame, getGuesses,setFeedbackMessage, getFeedbackMessage, deleteFeedbackMessage}