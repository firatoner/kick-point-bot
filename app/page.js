'use client';

import { useState, useEffect } from 'react';

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

  const getLogColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🎮 Kick Point Bot</h1>
          <p className="text-gray-400">Otomatik emoji gönderme sistemi</p>
        </header>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Bot Control */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Bot Kontrolü</h2>
            <div className="flex gap-4">
              <button
                onClick={startBot}
                disabled={loading || (stats && stats.isRunning)}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ▶️ Başlat
              </button>
              <button
                onClick={stopBot}
                disabled={loading || (stats && !stats.isRunning)}
                className="btn btn-danger flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⏹️ Durdur
              </button>
            </div>
            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
              <p className="text-sm">
                Durum: {' '}
                <span className={stats?.isRunning ? 'text-green-400' : 'text-red-400'}>
                  {stats?.isRunning ? '🟢 Çalışıyor' : '🔴 Durduruldu'}
                </span>
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">İstatistikler</h2>
            <div className="space-y-2">
              <p className="text-lg">
                Toplam Emoji: <span className="text-green-400 font-bold">{stats?.totalEmojis || 0}</span>
              </p>
              <p className="text-lg">
                Aktif Yayıncı: <span className="text-blue-400 font-bold">{stats?.streamers?.length || 0}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Add Streamer */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Yayıncı Ekle</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newStreamer}
              onChange={(e) => setNewStreamer(e.target.value)}
              placeholder="Yayıncı adı..."
              className="input flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addStreamer()}
            />
            <button
              onClick={addStreamer}
              disabled={loading || !newStreamer.trim()}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ➕ Ekle
            </button>
          </div>
        </div>

        {/* Streamers List */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Takip Edilen Yayıncılar</h2>
          {stats?.streamers && stats.streamers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.streamers.map((streamer) => (
                <div key={streamer.name} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{streamer.name}</h3>
                    <button
                      onClick={() => removeStreamer(streamer.name)}
                      className="text-red-400 hover:text-red-300"
                      disabled={loading}
                    >
                      ❌
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">ID: {streamer.channelId}</p>
                  <div className="space-y-1">
                    <p className="text-sm">Emoji: <span className="text-green-400">{streamer.emojisSent}</span></p>
                    <p className="text-sm">Hata: <span className="text-red-400">{streamer.errors}</span></p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Henüz yayıncı eklenmemiş</p>
          )}
        </div>

        {/* Logs */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Loglar</h2>
          <div className="bg-gray-700 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.length > 0 ? (
              logs.slice().reverse().map((log, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString('tr-TR')}</span>
                  {' - '}
                  <span className={getLogColor(log.type)}>{log.message}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">Henüz log yok</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
