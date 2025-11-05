# 🎮 Kick Point Bot

Kick yayıncılarını otomatik olarak izleyen ve belirli aralıklarla emoji göndererek sadakat puanı kazanan bot sistemi.

## ✨ Özellikler

- 🎯 Birden fazla yayıncıyı aynı anda izleme
- 💬 Otomatik emoji gönderimi
- ⏱️ Özelleştirilebilir zaman aralıkları
- 📊 Web dashboard ile gerçek zamanlı takip
- 🔄 Canlı yayıncı ekleme/çıkarma
- 📈 İstatistik ve analiz

## 🚀 Kurulum

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarla

`.env.example` dosyasını `.env` olarak kopyalayın ve bilgilerinizi girin:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
KICK_USERNAME=your_username
KICK_PASSWORD=your_password
STREAMERS=streamer1,streamer2,streamer3
EMOJIS=❤️,😂,👍,🔥,💯
MIN_INTERVAL=60000
MAX_INTERVAL=300000
```

### 3. Uygulamayı Başlat

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

Dashboard'a tarayıcınızdan `http://localhost:3000` adresinden erişebilirsiniz.

## 📖 Kullanım

### Dashboard

1. Tarayıcınızda `http://localhost:3000` adresine gidin
2. **Start Bot** butonuna tıklayarak botu başlatın
3. Yayıncı eklemek için kullanıcı adını girin ve **Add** butonuna tıklayın
4. İstatistiklerinizi gerçek zamanlı olarak takip edin
5. İhtiyaç halinde **Stop Bot** ile botu durdurun

### Özelleştirme

#### Emoji Listesi
`.env` dosyasında `EMOJIS` değişkenini düzenleyerek gönderilecek emojileri değiştirebilirsiniz:

```env
EMOJIS=❤️,😂,👍,🔥,💯,😍,🎉,👏
```

#### Zaman Aralıkları
Emoji gönderme aralıklarını milisaniye cinsinden ayarlayın:

```env
MIN_INTERVAL=60000   # 1 dakika
MAX_INTERVAL=300000  # 5 dakika
```

## 🏗️ Proje Yapısı

```
kick-point-bot/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── api/          # API endpoints
│   │   │   └── bot/      # Bot control API
│   │   ├── page.js       # Dashboard UI
│   │   └── layout.js     # Layout component
│   ├── lib/              # Core logic
│   │   ├── kickClient.js # Kick API client
│   │   ├── botManager.js # Bot service manager
│   │   └── botInstance.js # Bot singleton
│   └── components/       # React components
├── config.js             # Configuration
├── .env                  # Environment variables
└── package.json
```

## 🔧 API Endpoints

### Bot Kontrolü

- `POST /api/bot/start` - Botu başlat
- `POST /api/bot/stop` - Botu durdur
- `GET /api/bot/status` - Bot durumunu al

### Yayıncı Yönetimi

- `POST /api/bot/streamer/add` - Yayıncı ekle
  ```json
  { "streamer": "username" }
  ```
- `POST /api/bot/streamer/remove` - Yayıncı çıkar
  ```json
  { "streamer": "username" }
  ```

## 🛡️ Güvenlik

- `.env` dosyanızı asla paylaşmayın
- Kick hesap bilgilerinizi güvende tutun
- Bot'u sorumlu bir şekilde kullanın
- Kick'in kullanım şartlarına uyun

## 📝 Notlar

- Bot çalışırken internet bağlantınız aktif olmalıdır
- Emoji gönderme aralıkları rastgele belirlenir (MIN_INTERVAL - MAX_INTERVAL arası)
- Her yayıncı için ayrı bağlantı ve zamanlayıcı kullanılır
- Hata durumlarında bot otomatik olarak yeniden bağlanmayı dener

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull request göndermekten çekinmeyin.

## 📄 Lisans

MIT

## ⚠️ Sorumluluk Reddi

Bu bot eğitim amaçlıdır. Kick.com'un kullanım şartlarına uygun kullanımdan kullanıcı sorumludur.
