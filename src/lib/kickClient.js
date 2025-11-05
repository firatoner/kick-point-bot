const axios = require('axios');
const Pusher = require('pusher-js');

class KickClient {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.authToken = null;
    this.pusher = null;
    this.baseURL = 'https://kick.com/api/v2';
  }

  async login() {
    try {
      // Get CSRF token
      const csrfResponse = await axios.get('https://kick.com/api/v1/csrf-cookie');
      const cookies = csrfResponse.headers['set-cookie'];

      // Login
      const loginResponse = await axios.post('https://kick.com/api/v1/login', {
        email: this.username,
        password: this.password
      }, {
        headers: {
          'Cookie': cookies.join('; '),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });

      this.authToken = loginResponse.data.token;
      console.log(`✅ Logged in as ${this.username}`);
      return true;
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      return false;
    }
  }

  async getChannelInfo(streamerName) {
    try {
      const response = await axios.get(`${this.baseURL}/channels/${streamerName}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to get channel info for ${streamerName}:`, error.message);
      return null;
    }
  }

  async sendChatMessage(channelId, message) {
    try {
      const response = await axios.post(`https://kick.com/api/v2/messages/send/${channelId}`, {
        content: message,
        type: 'message'
      }, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error(`❌ Failed to send message:`, error.message);
      return null;
    }
  }

  connectToPusher(channelId, onMessage) {
    this.pusher = new Pusher('eb1d5f283081a78b932c', {
      cluster: 'us2',
      encrypted: true
    });

    const channel = this.pusher.subscribe(`chatrooms.${channelId}.v2`);

    channel.bind('App\\Events\\ChatMessageEvent', (data) => {
      if (onMessage) onMessage(data);
    });

    console.log(`🔌 Connected to channel ${channelId}`);
    return this.pusher;
  }

  disconnect() {
    if (this.pusher) {
      this.pusher.disconnect();
      console.log('🔌 Disconnected from Pusher');
    }
  }
}

module.exports = KickClient;
