# Plan: Telegram Bot thêm từ vựng tự động vào Google Sheets

## 1. Mục tiêu

Xây dựng **Telegram Bot** cho phép người dùng gửi một từ tiếng Anh và
bot sẽ:

1.  Lấy thông tin từ vựng từ Dictionary API
2.  Dịch nghĩa sang tiếng Việt
3.  Chuẩn hóa dữ liệu
4.  Insert một row vào **Google Sheet đã cấu hình trên bot**

Bot cũng cho phép **set Google Sheet ID qua command Telegram**.

------------------------------------------------------------------------

# 2. Kiến trúc hệ thống

    User (Telegram)
           │
           ▼
    Telegram Bot
           │
           ▼
    Command Handler
           │
           ├── Word Service
           │       │
           │       ├── Dictionary API
           │       ├── Translation API
           │       └── Example extraction
           │
           ├── Google Sheets Service
           │
           └── Settings Store
                  │
                  └── Google Sheet ID

------------------------------------------------------------------------

# 3. Tech Stack đề xuất

  Component          Technology
  ------------------ --------------------------------------
  Runtime            Node.js (TypeScript)
  Telegram Bot       Telegraf
  Dictionary API     dictionaryapi.dev
  Translation        LibreTranslate hoặc Google Translate
  Google Sheets      Google Sheets API
  Settings storage   JSON file
  Deploy             VPS / Railway / Render

------------------------------------------------------------------------

# 4. Google Sheet Schema

Sheet phải có các column sau:

  Column          Description
  --------------- --------------------
  word            từ vựng
  phonetic        phiên âm IPA
  pos             loại từ
  definition_en   định nghĩa Anh-Anh
  meaning_vi      nghĩa tiếng Việt
  example         ví dụ
  image_url       ảnh minh họa
  created_at      thời gian

------------------------------------------------------------------------

# 5. Telegram Bot Commands

## 5.1 Set Google Sheet

    /set_sheet <sheet_id>

Example:

    /set_sheet 1ABCXYZ123

Bot response:

    ✅ Google Sheet đã được cấu hình.

Bot lưu:

    user_id → sheet_id

------------------------------------------------------------------------

## 5.2 Add Word

User chỉ cần gửi:

    curious

Bot sẽ:

1.  Query dictionary
2.  Dịch nghĩa
3.  Insert row
4.  Reply summary

Bot response:

    📚 Word added

    Word: curious
    Phonetic: /ˈkjʊr.i.əs/
    POS: adjective

    Definition:
    eager to know something

    Meaning (VI):
    tò mò

    Example:
    She was curious about the new neighbor.

------------------------------------------------------------------------

## 5.3 Preview trước khi lưu (optional)

Command:

    /preview curious

Bot trả về thông tin nhưng **chưa insert sheet**.

------------------------------------------------------------------------

## 5.4 Help

    /help

Response:

    Commands:

    /set_sheet <sheet_id>
    /preview <word>

    Hoặc chỉ cần gửi từ vựng để thêm vào sheet.

------------------------------------------------------------------------

# 6. API nguồn dữ liệu

## Dictionary API

    GET https://api.dictionaryapi.dev/api/v2/entries/en/<word>

Extract:

    phonetic
    partOfSpeech
    definition
    example

------------------------------------------------------------------------

## Translation API

Option 1: LibreTranslate

    POST /translate
    {
     q: definition,
     source: "en",
     target: "vi"
    }

------------------------------------------------------------------------

## Image API (Optional)

Unsplash:

    GET https://api.unsplash.com/search/photos?query=<word>

Return:

    results[0].urls.small

------------------------------------------------------------------------

# 7. Data Model

## User Settings

    UserSetting

    user_id
    sheet_id
    created_at

------------------------------------------------------------------------

# 8. Flow xử lý Add Word

    User gửi: curious

            │
            ▼
    Telegram Bot nhận message
            │
            ▼
    Check sheet_id đã config chưa
            │
            ├── chưa → yêu cầu /set_sheet
            │
            ▼
    Call Dictionary API
            │
            ▼
    Extract
      phonetic
      pos
      definition
      example
            │
            ▼
    Translate definition → VI
            │
            ▼
    Optional: Fetch image
            │
            ▼
    Build row object
            │
            ▼
    Append row vào Google Sheet
            │
            ▼
    Reply Telegram summary

------------------------------------------------------------------------

# 9. Pseudo Code

``` pseudo
onMessage(text):
    // Bảo mật: Chỉ cho phép User ID của bạn
    if message.from.id !== process.env.YOUR_TELEGRAM_ID:
        return // Phớt lờ người lạ

    if text startsWith "/set_sheet":
        saveSheetId(user_id, sheet_id)
        reply("Sheet configured")

    else if text startsWith "/preview":
        word = parseWord(text)
        data = fetchWordData(word)
        reply(format(data))

    else:
        word = text
        sheet_id = getUserSheet(user_id)

        if sheet_id is null:
            reply("Please set sheet using /set_sheet")
            return

        data = fetchWordData(word)

        row = [
            data.word,
            data.phonetic,
            data.pos,
            data.definition,
            data.meaning_vi,
            data.example,
            data.image_url,
            now()
        ]

        googleSheet.append(sheet_id, row)

        reply("Word added successfully")
```

------------------------------------------------------------------------

# 10. Project Structure

    telegram-vocab-bot

    src
     ├── bot
     │   ├── commands
     │   │   ├── setSheet.ts
     │   │   ├── preview.ts
     │   │   └── help.ts
     │   │
     │   └── messageHandler.ts
     │
     ├── services
     │   ├── dictionaryService.ts
     │   ├── translateService.ts
     │   ├── imageService.ts
     │   └── googleSheetService.ts
     │
     ├── repository
     │   └── userSettingRepo.ts
     │
     ├── config
     │   └── botConfig.ts
     │
     └── index.ts

------------------------------------------------------------------------

# 11. Security

-   **Whitelist Telegram User ID**: Vì dùng cá nhân, **BẮT BUỘC** check `user_id` của người gửi.
    *   Chỉ xử lý lệnh từ `user_id` của bạn (khởi tạo trong file `.env`).
    *   Người lạ gửi tin nhắn sẽ bị bot phớt lờ để bảo mật và tránh tốn tài nguyên / spam.
-   Google Sheets access qua **Service Account**
-   Sheet share quyền:

```{=html}
<!-- -->
```
    Editor → service-account-email

------------------------------------------------------------------------

# 12. Deploy

Option:

  Platform   Pros
  ---------- -----------
  Railway    dễ deploy
  Render     free tier
  VPS        stable

------------------------------------------------------------------------

# 13. Estimated Development Time

  Task                        Time
  --------------------------- ---------
  Telegram bot setup          30 phút
  Dictionary integration      30 phút
  Translate integration       30 phút
  Google Sheets integration   40 phút
  Command system              20 phút

Total:

    ~2.5 - 3 hours

------------------------------------------------------------------------

# 14. Future Improvements

### Learning features

-   spaced repetition
-   review reminders

### AI features

-   auto generate sentence
-   detect difficulty level
-   pronunciation audio

### UX

-   inline button

```{=html}
<!-- -->
```
    [Add] [Skip] [More examples]