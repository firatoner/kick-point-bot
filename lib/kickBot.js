const axios = require('axios');
const Pusher = require('pusher-js');
const EventEmitter = require('events');

class KickBot extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.streamers = new Map();
    this.isRunning = false;
    this.authToken = null;
    this.cookies = null;
    this.xsrfToken = null;
    this.logs = [];
  }

  log(message, type = 'info') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      type
    };
    this.logs.push(logEntry);
    if (this.logs.length > 100) {
      this.logs.shift();
    }
    this.emit('log', logEntry);
    console.log(`[${type.toUpperCase()}] ${message}`);
  }

  async login(otpCode = null) {
    try {
      this.log('Attempting to login to Kick...');

      // Browser-like headers
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://kick.com',
        'Referer': 'https://kick.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
      };

      // Step 1: Get CSRF cookie
      this.log('Getting CSRF token...');
      const csrfResponse = await axios.get('https://kick.com/api/v1/sanctum/csrf-cookie', {
        headers: headers,
        withCredentials: true,
        maxRedirects: 5
      });

      // Extract cookies
      const setCookies = csrfResponse.headers['set-cookie'] || [];
      let cookieString = '';
      let xsrfToken = '';

      setCookies.forEach(cookie => {
        const [cookiePair] = cookie.split(';');
        const [name, value] = cookiePair.split('=');

        if (name === 'XSRF-TOKEN') {
          xsrfToken = decodeURIComponent(value);
        }

        if (cookieString) cookieString += '; ';
        cookieString += cookiePair;
      });

      if (!xsrfToken) {
        throw new Error('Failed to get XSRF token');
      }

      this.log('CSRF token obtained');

      // Step 2: Login
      const loginData = {
        email: this.config.kickUsername,
        password: this.config.kickPassword
      };

      if (otpCode) {
        loginData.one_time_password = otpCode;
        this.log('Using OTP code for 2FA');
      }

      this.log('Sending login request...');
      const loginResponse = await axios.post('https://kick.com/api/v1/login', loginData, {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Cookie': cookieString,
          'X-XSRF-TOKEN': xsrfToken
        },
        withCredentials: true,
        maxRedirects: 5
      });

      // Extract auth token
      if (loginResponse.data && loginResponse.data.token) {
        this.authToken = loginResponse.data.token;
        this.cookies = cookieString;
        this.xsrfToken = xsrfToken;

        this.log('Successfully logged in to Kick', 'success');
        return { success: true };
      }

      throw new Error('No auth token received from Kick');

    } catch (error) {
      // Log detailed error info
      if (error.response) {
        this.log(`Login failed with status ${error.response.status}: ${JSON.stringify(error.response.data)}`, 'error');

        // Check if OTP is required
        if (error.response.status === 401 || error.response.status === 422) {
          const errorData = error.response.data;

          // Check for 2FA requirement
          if (errorData.message && (
              errorData.message.includes('2FA') ||
              errorData.message.includes('verification') ||
              errorData.message.includes('one_time_password') ||
              errorData.errors?.one_time_password
          )) {
            this.log('OTP code required for login', 'warning');
            return { success: false, otpRequired: true, message: 'OTP code required' };
          }
        }

        return { success: false, otpRequired: false, message: error.response.data.message || error.message };
      }

      this.log(`Login failed: ${error.message}`, 'error');
      return { success: false, otpRequired: false, message: error.message };
    }
  }

  async getChannelInfo(username) {
    try {
      const response = await axios.get(`https://kick.com/api/v2/channels/${username}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Referer': 'https://kick.com/'
        }
      });
      return response.data;
    } catch (error) {
      this.log(`Failed to get channel info for ${username}: ${error.message}`, 'error');
      return null;
    }
  }

  async sendEmoji(channelId, emoji) {
    try {
      const response = await axios.post(`https://kick.com/api/v2/channels/${channelId}/messages`, {
        content: emoji,
        type: 'message'
      }, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
          'Cookie': this.cookies,
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': this.xsrfToken,
          'Origin': 'https://kick.com',
          'Referer': 'https://kick.com/'
        }
      });

      this.log(`Sent emoji ${emoji} to channel ${channelId}`, 'success');
      return true;
    } catch (error) {
      this.log(`Failed to send emoji to channel ${channelId}: ${error.message}`, 'error');
      return false;
    }
  }

  getRandomEmoji() {
    const emojis = this.config.emojis;
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  getRandomInterval() {
    const min = this.config.minInterval;
    const max = this.config.maxInterval;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async startMonitoring(streamerName) {
    if (this.streamers.has(streamerName)) {
      this.log(`Already monitoring ${streamerName}`, 'warning');
      return;
    }

    const channelInfo = await this.getChannelInfo(streamerName);
    if (!channelInfo) {
      this.log(`Could not start monitoring ${streamerName}`, 'error');
      return;
    }

    const streamerData = {
      name: streamerName,
      channelId: channelInfo.id,
      isLive: channelInfo.livestream !== null,
      interval: null,
      stats: {
        emojisSent: 0,
        errors: 0
      }
    };

    this.streamers.set(streamerName, streamerData);
    this.log(`Started monitoring ${streamerName} (Channel ID: ${channelInfo.id})`, 'success');

    // Start sending emojis
    this.scheduleNextEmoji(streamerName);
  }

  scheduleNextEmoji(streamerName) {
    const streamerData = this.streamers.get(streamerName);
    if (!streamerData || !this.isRunning) return;

    const interval = this.getRandomInterval();

    streamerData.interval = setTimeout(async () => {
      if (!this.isRunning) return;

      const emoji = this.getRandomEmoji();
      const success = await this.sendEmoji(streamerData.channelId, emoji);

      if (success) {
        streamerData.stats.emojisSent++;
      } else {
        streamerData.stats.errors++;
      }

      this.emit('stats', this.getStats());
      this.scheduleNextEmoji(streamerName);
    }, interval);

    this.log(`Next emoji for ${streamerName} in ${Math.round(interval / 1000)}s`);
  }

  stopMonitoring(streamerName) {
    const streamerData = this.streamers.get(streamerName);
    if (!streamerData) return;

    if (streamerData.interval) {
      clearTimeout(streamerData.interval);
    }

    this.streamers.delete(streamerName);
    this.log(`Stopped monitoring ${streamerName}`, 'info');
  }

  async start(otpCode = null) {
    if (this.isRunning) {
      this.log('Bot is already running', 'warning');
      return { success: false, message: 'Bot is already running' };
    }

    const loginResult = await this.login(otpCode);
    if (!loginResult.success) {
      if (loginResult.otpRequired) {
        this.log('Waiting for OTP code...', 'warning');
        return { success: false, otpRequired: true, message: 'Please provide OTP code' };
      }
      this.log('Failed to start bot: Login failed', 'error');
      return { success: false, message: 'Login failed: ' + loginResult.message };
    }

    this.isRunning = true;
    this.log('Bot started successfully', 'success');

    // Start monitoring all configured streamers
    for (const streamer of this.config.streamers) {
      await this.startMonitoring(streamer);
    }

    return { success: true, message: 'Bot started successfully' };
  }

  stop() {
    if (!this.isRunning) {
      this.log('Bot is not running', 'warning');
      return;
    }

    this.isRunning = false;

    // Stop all monitoring
    for (const streamerName of this.streamers.keys()) {
      this.stopMonitoring(streamerName);
    }

    this.log('Bot stopped', 'info');
  }

  getStats() {
    const stats = {
      isRunning: this.isRunning,
      streamers: Array.from(this.streamers.entries()).map(([name, data]) => ({
        name,
        channelId: data.channelId,
        isLive: data.isLive,
        emojisSent: data.stats.emojisSent,
        errors: data.stats.errors
      })),
      totalEmojis: Array.from(this.streamers.values()).reduce((sum, s) => sum + s.stats.emojisSent, 0)
    };
    return stats;
  }

  getLogs() {
    return this.logs;
  }
}

module.exports = KickBot;
