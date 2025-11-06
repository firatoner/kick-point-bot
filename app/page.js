'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newStreamer, setNewStreamer] = useState('');

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/bot/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/bot/logs');
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchLogs();

    const interval = setInterval(() => {
      fetchStats();
      fetchLogs();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const startBot = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bot/start', {
        method: 'POST',
      });
      const data = await response.json();
      alert(data.message);
      await fetchStats();
    } catch (error) {
      alert('Failed to start bot: ' + error.message);
    }
    setLoading(false);
  };

  const stopBot = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bot/stop', {
        method: 'POST',
      });
      const data = await response.json();
      alert(data.message);
      await fetchStats();
    } catch (error) {
      alert('Failed to stop bot: ' + error.message);
    }
    setLoading(false);
  };

  const addStreamer = async () => {
    if (!newStreamer.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/bot/streamer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          streamerName: newStreamer.trim()
        })
      });
      const data = await response.json();
      alert(data.message);
      setNewStreamer('');
      await fetchStats();
    } catch (error) {
      alert('Failed to add streamer: ' + error.message);
    }
    setLoading(false);
  };

  const removeStreamer = async (streamerName) => {
    setLoading(true);
    try {
      const response = await fetch('/api/bot/streamer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          streamerName
        })
      });
      const data = await response.json();
      alert(data.message);
      await fetchStats();
    } catch (error) {
      alert('Failed to remove streamer: ' + error.message);
    }
    setLoading(false);
  };

  const getLogColorClass = (type) => {
    switch (type) {
      case 'success': return styles.logSuccess;
      case 'error': return styles.logError;
      case 'warning': return styles.logWarning;
      default: return styles.logInfo;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.maxWidth}>
        <header className={styles.header}>
          <h1 className={styles.title}>🎮 Kick Point Bot</h1>
          <p className={styles.subtitle}>Otomatik emoji gönderme sistemi</p>
        </header>

        {/* Control Panel */}
        <div className={styles.grid}>
          {/* Bot Control */}
          <div className="card">
            <h2 className={styles.sectionTitle}>Bot Kontrolü</h2>
            <div className={styles.flexRow}>
              <button
                onClick={startBot}
                disabled={loading || (stats && stats.isRunning)}
                className={`btn btn-primary ${styles.flex1}`}
              >
                ▶️ Başlat
              </button>
              <button
                onClick={stopBot}
                disabled={loading || (stats && !stats.isRunning)}
                className={`btn btn-danger ${styles.flex1}`}
              >
                ⏹️ Durdur
              </button>
            </div>
            <div className={styles.statusBox}>
              <p className={styles.statusText}>
                Durum: {' '}
                <span className={stats?.isRunning ? styles.statusGreen : styles.statusRed}>
                  {stats?.isRunning ? '🟢 Çalışıyor' : '🔴 Durduruldu'}
                </span>
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="card">
            <h2 className={styles.sectionTitle}>İstatistikler</h2>
            <div className={styles.stats}>
              <p className={styles.statText}>
                Toplam Emoji: <span className={styles.statGreen}>{stats?.totalEmojis || 0}</span>
              </p>
              <p className={styles.statText}>
                Aktif Yayıncı: <span className={styles.statBlue}>{stats?.streamers?.length || 0}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Add Streamer */}
        <div className={`card ${styles.mb8}`}>
          <h2 className={styles.sectionTitle}>Yayıncı Ekle</h2>
          <div className={styles.flexRow}>
            <input
              type="text"
              value={newStreamer}
              onChange={(e) => setNewStreamer(e.target.value)}
              placeholder="Yayıncı adı..."
              className={`input ${styles.flex1}`}
              onKeyPress={(e) => e.key === 'Enter' && addStreamer()}
            />
            <button
              onClick={addStreamer}
              disabled={loading || !newStreamer.trim()}
              className="btn btn-secondary"
            >
              ➕ Ekle
            </button>
          </div>
        </div>

        {/* Streamers List */}
        <div className={`card ${styles.mb8}`}>
          <h2 className={styles.sectionTitle}>Takip Edilen Yayıncılar</h2>
          {stats?.streamers && stats.streamers.length > 0 ? (
            <div className={styles.gridThree}>
              {stats.streamers.map((streamer) => (
                <div key={streamer.name} className={styles.streamerCard}>
                  <div className={styles.streamerHeader}>
                    <h3 className={styles.streamerName}>{streamer.name}</h3>
                    <button
                      onClick={() => removeStreamer(streamer.name)}
                      className={styles.removeBtn}
                      disabled={loading}
                    >
                      ❌
                    </button>
                  </div>
                  <p className={styles.streamerInfo}>ID: {streamer.channelId}</p>
                  <div className={styles.streamerStats}>
                    <p className={styles.streamerStatText}>
                      Emoji: <span className={styles.statGreen}>{streamer.emojisSent}</span>
                    </p>
                    <p className={styles.streamerStatText}>
                      Hata: <span className={styles.statusRed}>{streamer.errors}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>Henüz yayıncı eklenmemiş</p>
          )}
        </div>

        {/* Logs */}
        <div className="card">
          <h2 className={styles.sectionTitle}>Loglar</h2>
          <div className={styles.logsContainer}>
            {logs.length > 0 ? (
              logs.slice().reverse().map((log, index) => (
                <div key={index} className={styles.logEntry}>
                  <span className={styles.logTime}>{new Date(log.timestamp).toLocaleTimeString('tr-TR')}</span>
                  {' - '}
                  <span className={getLogColorClass(log.type)}>{log.message}</span>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>Henüz log yok</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
