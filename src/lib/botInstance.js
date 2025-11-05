const BotManager = require('./botManager');
const config = require('../../config');

let botInstance = null;

function getBotInstance() {
  if (!botInstance) {
    botInstance = new BotManager(config);
  }
  return botInstance;
}

module.exports = { getBotInstance };
