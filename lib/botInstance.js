const KickBot = require('./kickBot');
const config = require('../config');

let botInstance = null;

function getBotInstance() {
  if (!botInstance) {
    botInstance = new KickBot(config);
  }
  return botInstance;
}

module.exports = { getBotInstance };
