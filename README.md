# 🎮 Kick Point Bot

Kick yayıncılarını otomatik olarak takip edip belirli aralıklarla emoji göndererek sadakat puanı toplayan web tabanlı bot sistemi.

## ✨ Özellikler

- 🌐 **Web Dashboard**: Modern ve kullanıcı dostu arayüz
- 🤖 **Otomatik Emoji Gönderimi**: Belirlediğiniz aralıklarla otomatik emoji gönderir
- 📊 **Canlı İstatistikler**: Gönderilen emoji sayısı ve hata takibi
- 👥 **Çoklu Yayıncı Desteği**: Birden fazla yayıncıyı aynı anda takip edin
- 📝 **Canlı Log Görüntüleme**: Tüm bot aktivitelerini gerçek zamanlı izleyin
- ⚙️ **Kolay Konfigürasyon**: .env dosyası ile basit ayarlama

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Kick hesabı

### Adım 1: Projeyi İndirin

```bash
git clone <repository-url>
cd kick-point-bot
```

### Adım 2: Bağımlılıkları Yükleyin

```bash
npm install
```

### Adım 3: Yapılandırma

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin ve bilgilerinizi girin:

```env
# Kick Hesap Bilgileri
KICK_USERNAME=kullanici_adiniz
KICK_PASSWORD=sifreniz

# Takip Edilecek Yayıncılar (virgülle ayırın)
STREAMERS=yayinci1,yayinci2,yayinci3

# Gönderilecek Emojiler (virgülle ayırın)
EMOJIS=❤️,😂,👍,🔥,💯

# Gönderim Aralıkları (milisaniye cinsinden)
MIN_INTERVAL=60000    # Minimum 1 dakika
MAX_INTERVAL=300000   # Maximum 5 dakika

# Bağlantı Ayarları
RECONNECT_DELAY=5000
MAX_RETRIES=5
```

### Adım 4: Botu Başlatın

**Geliştirme Modu:**
```bash
npm run dev
```

**Production Modu:**
```bash
npm run build
npm start
```

Bot varsayılan olarak http://localhost:3000 adresinde çalışacaktır.

## 📖 Kullanım

1. Tarayıcınızda http://localhost:3000 adresine gidin
2. **"Başlat"** butonuna tıklayarak botu çalıştırın
3. Yeni yayıncı eklemek için "Yayıncı Ekle" bölümünü kullanın
4. İstatistikler ve logları canlı olarak takip edin
5. Botu durdurmak için **"Durdur"** butonuna tıklayın

## 🎯 Özellikler

### Dashboard Bölümleri

#### Bot Kontrolü
- Botu başlatma/durdurma
- Anlık durum göstergesi

#### İstatistikler
- Toplam gönderilen emoji sayısı
- Aktif yayıncı sayısı

#### Yayıncı Yönetimi
- Yeni yayıncı ekleme
- Mevcut yayıncıları görüntüleme
- Yayıncıları kaldırma
- Yayıncı başına istatistikler

#### Canlı Loglar
- Tüm bot aktivitelerini görüntüleme
- Renkli log seviyeleri (bilgi, uyarı, hata, başarı)
- Zaman damgalı kayıtlar

## ⚙️ Yapılandırma Seçenekleri

| Parametre | Açıklama | Varsayılan |
|-----------|----------|-----------|
| `KICK_USERNAME` | Kick kullanıcı adınız | - |
| `KICK_PASSWORD` | Kick şifreniz | - |
| `STREAMERS` | Takip edilecek yayıncılar (virgülle ayırın) | - |
| `EMOJIS` | Gönderilecek emojiler | ❤️,😂,👍,🔥,💯 |
| `MIN_INTERVAL` | Minimum gönderim aralığı (ms) | 60000 (1 dk) |
| `MAX_INTERVAL` | Maximum gönderim aralığı (ms) | 300000 (5 dk) |
| `RECONNECT_DELAY` | Yeniden bağlanma gecikmesi (ms) | 5000 |
| `MAX_RETRIES` | Maximum deneme sayısı | 5 |

## 🛠️ Teknolojiler

- **Next.js 14**: React framework
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **Pusher.js**: WebSocket desteği
- **Node.js**: Backend runtime

## 📁 Proje Yapısı

```
kick-point-bot/
├── app/
│   ├── api/
│   │   └── bot/          # API routes
│   ├── globals.css       # Global styles
│   ├── layout.js         # Root layout
│   └── page.js           # Dashboard page
├── lib/
│   ├── kickBot.js        # Bot logic
│   └── botInstance.js    # Bot singleton
├── config.js             # Configuration
├── .env.example          # Example environment variables
└── README.md
```

## ⚠️ Önemli Notlar

- Bu bot eğitim amaçlıdır
- Kick'in kullanım şartlarına uygun kullanın
- Hesabınızın güvenliği için şifrenizi kimseyle paylaşmayın
- .env dosyasını asla paylaşmayın veya commit etmeyin

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull request göndermekten çekinmeyin.

## 📝 Lisans

MIT

## 💡 İpuçları

- Emoji gönderim aralıklarını çok düşük tutmayın (spam olarak algılanabilir)
- Birden fazla hesap kullanıyorsanız, her hesap için ayrı instance çalıştırın
- Logları düzenli olarak kontrol ederek hataları takip edin
- İnternet bağlantınızın stabil olduğundan emin olun

## 🐛 Sorun Giderme

### Bot başlamıyor
- Kick kullanıcı adı ve şifrenizin doğru olduğundan emin olun
- .env dosyasının doğru konumda olduğunu kontrol edin

### Emoji gönderilmiyor
- Yayıncı adlarının doğru yazıldığından emin olun
- İnternet bağlantınızı kontrol edin
- Logları kontrol ederek hata mesajlarını inceleyin

### Dashboard açılmıyor
- 3000 portunun kullanılabilir olduğundan emin olun
- `npm install` komutunu tekrar çalıştırın

## 📞 Destek

Sorularınız için issue açabilirsiniz.
