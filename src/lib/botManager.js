const KickClient = require('./kickClient');

class BotManager {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.activeStreamers = new Map();
    this.intervalTimers = new Map();
    this.isRunning = false;
    this.stats = {
      messagesSent: 0,
      errors: 0,
      startTime: null
    };
  }

  async start() {
    if (this.isRunning) {
      console.log('⚠️  Bot already running');
      return false;
    }

    console.log('🚀 Starting Kick Point Bot...');

    // Initialize Kick client
    this.client = new KickClient(this.config.kickUsername, this.config.kickPassword);

    // Login
    const loginSuccess = await this.client.login();
    if (!loginSuccess) {
      console.error('❌ Failed to start bot: Login failed');
      return false;
    }

    // Connect to streamers
    for (const streamerName of this.config.streamers) {
      await this.connectToStreamer(streamerName);
    }

    this.isRunning = true;
    this.stats.startTime = new Date();
    console.log('✅ Bot started successfully');
    return true;
  }

  async connectToStreamer(streamerName) {
    try {
      console.log(`🔍 Connecting to ${streamerName}...`);

      const channelInfo = await this.client.getChannelInfo(streamerName);
      if (!channelInfo) {
        console.error(`❌ Could not find channel: ${streamerName}`);
        return false;
      }

      const channelId = channelInfo.chatroom?.id;
      if (!channelId) {
        console.error(`❌ No chatroom found for ${streamerName}`);
        return false;
      }

      // Store channel info
      this.activeStreamers.set(streamerName, {
        channelId,
        channelInfo,
        messageCount: 0
      });

      // Connect to Pusher for this channel
      this.client.connectToPusher(channelId, (data) => {
        console.log(`💬 [${streamerName}] ${data.sender?.username}: ${data.content}`);
      });

      // Start emoji sending interval
      this.startEmojiInterval(streamerName, channelId);

      console.log(`✅ Connected to ${streamerName} (Channel ID: ${channelId})`);
      return true;
    } catch (error) {
      console.error(`❌ Error connecting to ${streamerName}:`, error.message);
      this.stats.errors++;
      return false;
    }
  }

  startEmojiInterval(streamerName, channelId) {
    const sendEmoji = async () => {
      if (!this.isRunning) return;

      try {
        // Random emoji from config
        const emoji = this.config.emojis[Math.floor(Math.random() * this.config.emojis.length)];

        // Send emoji
        const result = await this.client.sendChatMessage(channelId, emoji);

        if (result) {
          const streamer = this.activeStreamers.get(streamerName);
          streamer.messageCount++;
          this.stats.messagesSent++;
          console.log(`✉️  [${streamerName}] Sent emoji: ${emoji} (Total: ${streamer.messageCount})`);
        } else {
          this.stats.errors++;
        }
      } catch (error) {
        console.error(`❌ Error sending emoji to ${streamerName}:`, error.message);
        this.stats.errors++;
      }

      // Schedule next emoji
      if (this.isRunning) {
        const nextDelay = this.getRandomInterval();
        const timer = setTimeout(sendEmoji, nextDelay);
        this.intervalTimers.set(streamerName, timer);
      }
    };

    // Start first emoji after random delay
    const initialDelay = this.getRandomInterval();
    const timer = setTimeout(sendEmoji, initialDelay);
    this.intervalTimers.set(streamerName, timer);
  }

  getRandomInterval() {
    const min = this.config.minInterval;
    const max = this.config.maxInterval;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async addStreamer(streamerName) {
    if (this.activeStreamers.has(streamerName)) {
      console.log(`⚠️  Already connected to ${streamerName}`);
      return false;
    }

    const success = await this.connectToStreamer(streamerName);
    if (success) {
      // Add to config
      if (!this.config.streamers.includes(streamerName)) {
        this.config.streamers.push(streamerName);
      }
    }
    return success;
  }

  removeStreamer(streamerName) {
    if (!this.activeStreamers.has(streamerName)) {
      console.log(`⚠️  Not connected to ${streamerName}`);
      return false;
    }

    // Clear interval timer
    const timer = this.intervalTimers.get(streamerName);
    if (timer) {
      clearTimeout(timer);
      this.intervalTimers.delete(streamerName);
    }

    // Remove from active streamers
    this.activeStreamers.delete(streamerName);

    // Remove from config
    this.config.streamers = this.config.streamers.filter(s => s !== streamerName);

    console.log(`✅ Disconnected from ${streamerName}`);
    return true;
  }

  stop() {
    if (!this.isRunning) {
      console.log('⚠️  Bot is not running');
      return false;
    }

    console.log('🛑 Stopping bot...');

    // Clear all timers
    for (const timer of this.intervalTimers.values()) {
      clearTimeout(timer);
    }
    this.intervalTimers.clear();

    // Disconnect from Pusher
    if (this.client) {
      this.client.disconnect();
    }

    // Clear streamers
    this.activeStreamers.clear();

    this.isRunning = false;
    console.log('✅ Bot stopped');
    return true;
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      activeStreamers: Array.from(this.activeStreamers.entries()).map(([name, data]) => ({
        name,
        channelId: data.channelId,
        messagesSent: data.messageCount
      })),
      stats: {
        ...this.stats,
        uptime: this.stats.startTime ? Date.now() - this.stats.startTime.getTime() : 0
      }
    };
  }
}

module.exports = BotManager;
