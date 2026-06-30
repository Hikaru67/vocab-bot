import { Context } from 'telegraf';
import { fetchWordInfo } from '../services/dictionaryService';
import { translateText } from '../services/translateService';
import { appendToSheet } from '../services/googleSheetService';
import { getUserSheet } from '../repository/userSettingRepo';
import { config } from '../config/botConfig';

export async function handleTextMessage(ctx: Context) {
    const text = ctx.message && 'text' in ctx.message ? ctx.message.text.trim() : '';

    if (!text || text.startsWith('/')) return; // Ignore commands

    const userId = String(ctx.from?.id);

    // 1. Check Sheet ID
    let sheetId = getUserSheet(userId) || config.defaultSpreadsheetId;
    if (!sheetId || sheetId.trim() === '') {
        return ctx.reply("⚠️ Bạn chưa cấu hình Google Sheet ID. Vui lòng dùng lệnh:\n`/set_sheet <sheet_id>`", { parse_mode: 'Markdown' });
    }

    await ctx.reply(`⏳ Đang xử lý từ vựng: *${text}*...`, { parse_mode: 'Markdown' });

    try {
        // 2. Query Dictionary
        const wordInfo = await fetchWordInfo(text);
        if (!wordInfo) {
            return ctx.reply(`❌ Không tìm thấy thông tin cho từ: *${text}*`, { parse_mode: 'Markdown' });
        }

        // 3. Translate Definition
        let meaningVi = "Không có định nghĩa";
        if (wordInfo.definition) {
            meaningVi = await translateText(wordInfo.definition);
        }

        // Next review mặc định là ngày mai
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + 1);

        // 4. Build Row with Schema: word, phonetic, pos, definition_en, meaning_vi, example, audio_url, created_at, next_review, rep, interval, efac
        const row = [
            wordInfo.word,
            wordInfo.phonetic || '',
            wordInfo.partOfSpeech || '',
            wordInfo.definition || '',
            meaningVi,
            wordInfo.example || '',
            wordInfo.audioUrl || '',
            new Date().toLocaleString('vi-VN'),
            nextReviewDate.toISOString(),
            0,      // repetition
            0,      // interval
            2.5     // efactor
        ];

        // 5. Append to Google Sheet
        const success = await appendToSheet(sheetId, row);
        if (!success) {
            return ctx.reply("❌ Lỗi ghi dữ liệu vào Google Sheet. Hãy kiểm tra service-account.json và quyền Share Editor.");
        }

        // 6. Response summary
        const responseText = `📚 *Từ vựng mới đã được thêm!* \n\n` +
            `🔹 *Từ:* ${wordInfo.word}\n` +
            `🔹 *Phiên âm:* ${wordInfo.phonetic || 'Chưa có'}\n` +
            `🔹 *Loại từ:* ${wordInfo.partOfSpeech || 'Chưa có'}\n\n` +
            `📖 *Nghĩa En-En:* \n_${wordInfo.definition || 'Chưa có'}_\n\n` +
            `🇻🇳 *Nghĩa Viet:* \n_${meaningVi}_\n\n` +
            `💡 *Ví dụ:* ${wordInfo.example || 'Chưa có ví dụ'}`;

        return ctx.reply(responseText, { parse_mode: 'Markdown' });

    } catch (error) {
        console.error("Error in text handler:", error);
        return ctx.reply("❌ Có lỗi xảy ra trong quá trình xử lý.");
    }
}
