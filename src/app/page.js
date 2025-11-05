'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [newStreamer, setNewStreamer] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/bot/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bot/start', { method: 'POST' });
      const data = await response.json();
      alert(data.message);
      fetchStatus();
    } catch (error) {
      alert('Error starting bot: ' + error.message);
    }
    setLoading(false);
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bot/stop', { method: 'POST' });
      const data = await response.json();
      alert(data.message);
      fetchStatus();
    } catch (error) {
      alert('Error stopping bot: ' + error.message);
    }
    setLoading(false);
  };

  const handleAddStreamer = async (e) => {
    e.preventDefault();
    if (!newStreamer.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/bot/streamer/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamer: newStreamer.trim() })
      });
      const data = await response.json();
      alert(data.message);
      setNewStreamer('');
      fetchStatus();
    } catch (error) {
      alert('Error adding streamer: ' + error.message);
    }
    setLoading(false);
  };

  const handleRemoveStreamer = async (streamerName) => {
    setLoading(true);
    try {
      const response = await fetch('/api/bot/streamer/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamer: streamerName })
      });
      const data = await response.json();
      alert(data.message);
      fetchStatus();
    } catch (error) {
      alert('Error removing streamer: ' + error.message);
    }
    setLoading(false);
  };

  const formatUptime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🎮 Kick Point Bot Dashboard</h1>
        <div className={styles.status}>
          Status: {status?.isRunning ?
            <span className={styles.online}>🟢 Online</span> :
            <span className={styles.offline}>🔴 Offline</span>
          }
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.controls}>
          <h2>Bot Control</h2>
          <div className={styles.buttons}>
            <button
              onClick={handleStart}
              disabled={loading || status?.isRunning}
              className={styles.btnStart}
            >
              ▶️ Start Bot
            </button>
            <button
              onClick={handleStop}
              disabled={loading || !status?.isRunning}
              className={styles.btnStop}
            >
              ⏹️ Stop Bot
            </button>
          </div>
        </section>

        {status && (
          <section className={styles.stats}>
            <h2>Statistics</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{status.stats.messagesSent}</div>
                <div className={styles.statLabel}>Messages Sent</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{status.stats.errors}</div>
                <div className={styles.statLabel}>Errors</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {status.stats.uptime > 0 ? formatUptime(status.stats.uptime) : '0s'}
                </div>
                <div className={styles.statLabel}>Uptime</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{status.activeStreamers.length}</div>
                <div className={styles.statLabel}>Active Streamers</div>
              </div>
            </div>
          </section>
        )}

        <section className={styles.streamers}>
          <h2>Streamers</h2>

          <form onSubmit={handleAddStreamer} className={styles.addForm}>
            <input
              type="text"
              placeholder="Streamer username"
              value={newStreamer}
              onChange={(e) => setNewStreamer(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading}>➕ Add</button>
          </form>

          <div className={styles.streamerList}>
            {status?.activeStreamers?.map((streamer) => (
              <div key={streamer.name} className={styles.streamerCard}>
                <div className={styles.streamerInfo}>
                  <h3>{streamer.name}</h3>
                  <p>Channel ID: {streamer.channelId}</p>
                  <p>Messages: {streamer.messagesSent}</p>
                </div>
                <button
                  onClick={() => handleRemoveStreamer(streamer.name)}
                  disabled={loading}
                  className={styles.btnRemove}
                >
                  🗑️
                </button>
              </div>
            ))}
            {(!status?.activeStreamers || status.activeStreamers.length === 0) && (
              <p className={styles.emptyState}>No active streamers</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
