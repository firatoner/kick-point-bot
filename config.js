require('dotenv').config();

module.exports = {
  // Kick authentication
  kickUsername: process.env.KICK_USERNAME || '',
  kickPassword: process.env.KICK_PASSWORD || '',

  // Streamers to monitor (comma-separated)
  streamers: (process.env.STREAMERS || '').split(',').filter(s => s.trim()),

  // Emoji settings
  emojis: process.env.EMOJIS ? process.env.EMOJIS.split(',') : ['❤️', '😂', '👍', '🔥', '💯'],

  // Interval settings (in milliseconds)
  minInterval: parseInt(process.env.MIN_INTERVAL) || 60000, // 1 minute
  maxInterval: parseInt(process.env.MAX_INTERVAL) || 300000, // 5 minutes

  // Retry settings
  reconnectDelay: parseInt(process.env.RECONNECT_DELAY) || 5000,
  maxRetries: parseInt(process.env.MAX_RETRIES) || 5
};
