# 📚 Telegram Vocabulary Bot 

Bot Telegram giúp bạn **tra cứu từ vựng tiếng Anh**, **dịch nghĩa tự động** và **lưu thẳng vào Google Sheets** cá nhân chỉ bằng một tin nhắn cực nhanh! 🚀

---

## ✨ Tính năng chính
*   🔍 **Tra cứu từ vựng:** Lấy Phát âm (Phonetic), Định nghĩa (Definition-En), Loại từ (PoS), Ví dụ (Example).
*   🇻🇳 **Dịch nghĩa tự động:** Chuyển ngữ Anh-Việt nhanh gọn bằng MyMemory API.
*   📊 **Lưu Google Sheets:** Một dòng gồm word, phonetic, pos, definition_en, definition_vi, example, audio_url, time.
*   🛡️ **Whitelist Bảo mật:** Chỉ phản hồi một ID Telegram duy nhất của bạn, tránh bị người lạ spam cấu hình Sheet.

---

## 🛠️ Cài đặt & Setup

### 1. Chuẩn bị tài nguyên
*   **Telegram Bot Token**: Chats với `@BotFather` để tạo bot và lấy Token.
*   **Google Cloud Service Account**: 
    1. Vào [Google Cloud Console](https://console.cloud.google.com/), tạo 1 Service Account.
    2. Download Key dưới dạng file **JSON**, đổi tên thành **`service-account.json`** đặt tại thư mục gốc của dự án.
    3. **Quan trọng:** Gán quyền **Editor (Người chỉnh sửa)** cho email của Service Account này vào Google Sheets của bạn.

---

### 2. Cài đặt code
```bash
# 1. Cài đặt thư viện
npm install

# 2. Tạo file cấu hình .env (Copy từ mẫu)
cp .env.example .env
```

### 3. Cấu hình file `.env`
Mở file `.env` vừa tạo và điền các tham số:
```env
TELEGRAM_BOT_TOKEN=điền_token_bot_đây
YOUR_TELEGRAM_ID=điền_user_id_của_bạn_đây
DEFAULT_SPREADSHEET_ID=điền_sheet_id_ở_đây (hoặc dùng `/set_sheet` qua bot)
```

---

## 🚀 Khởi chạy

### Cách 1: Chạy trực tiếp (Local / Dev Mode)
```bash
npm run dev
```

### Cách 2: Chạy Production (NodeJS)
Build sang cấu trúc `.js` giúp tối ưu RAM trước khi chạy:
```bash
npm run build
npm run start
```

### Cách 3: Chạy bằng PM2 (Cho VPS ổn định 24/7)
```bash
npm run build
pm2 start dist/index.js --name "vocab-bot"
```

---

## 🆘 Telegram Commands
*   `/set_sheet <sheet_id>` : Thay đổi nhanh Google Sheet đích khi đang gọi bot.
*   `/help` : Xem hướng dẫn.
*   **Cách xài chính**: Bạn chỉ cần gửi một từ bất kỳ (VD: `curious`) để tiến hành lưu từ vựng.

---
*Chúc bạn học từ vựng tiếng Anh vui vẻ! 📖🌱*
