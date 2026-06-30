"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWordsDue = getWordsDue;
exports.handleReview = handleReview;
const telegraf_1 = require("telegraf");
const googleSheetService_1 = require("../../services/googleSheetService");
const userSettingRepo_1 = require("../../repository/userSettingRepo");
const botConfig_1 = require("../../config/botConfig");
const sessionManager_1 = require("../sessionManager");
async function getWordsDue(sheetId) {
    const rows = await (0, googleSheetService_1.getRows)(sheetId);
    if (rows.length === 0)
        return [];
    const now = new Date();
    const wordsDue = [];
    // Bỏ qua dòng Header (index 0) nên bắt đầu từ i = 1
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i] || [];
        if (!row[0])
            continue; // Skip empty row
        // Nếu row ngắn hơn 9 phần tử (chưa có cột next_review_date)
        // Coi như tới hạn ngay lập tức
        let nextReviewStr = row[8] || (new Date(0)).toISOString();
        let nextReviewDate = new Date(nextReviewStr);
        // Đảm bảo parse hợp lệ, nếu format lỗi thì coi như bằng 0
        if (isNaN(nextReviewDate.getTime())) {
            nextReviewDate = new Date(0);
        }
        if (nextReviewDate <= now) {
            wordsDue.push({
                word: row[0],
                phonetic: row[1] || '',
                pos: row[2] || '',
                definition_en: row[3] || '',
                meaning_vi: row[4] || '',
                example: row[5] || '',
                audio_url: row[6] || '',
                // rowIndex 1-based trong API của Google Sheet = index array + 1
                rowIndex: i + 1,
                next_review_date: row[8] || new Date().toISOString(),
                repetition: parseInt(row[9] || '0', 10),
                interval: parseInt(row[10] || '0', 10),
                efactor: parseFloat(row[11] || '2.5'),
                rawRow: [...row]
            });
        }
    }
    return wordsDue;
}
async function handleReview(ctx) {
    const userId = String(ctx.from?.id);
    const sheetId = (0, userSettingRepo_1.getUserSheet)(userId) || botConfig_1.config.defaultSpreadsheetId;
    if (!sheetId || sheetId.trim() === '') {
        return ctx.reply("⚠️ Bạn chưa cấu hình Google Sheet ID. Vui lòng dùng lệnh:\n`/set_sheet <sheet_id>`", { parse_mode: 'Markdown' });
    }
    const m = await ctx.reply("⏳ Đang lấy dữ liệu từ Google Sheet...");
    const wordsDue = await getWordsDue(sheetId);
    if (wordsDue.length === 0) {
        return ctx.telegram.editMessageText(ctx.chat?.id, m.message_id, undefined, "🎉 Tuyệt vời! Bạn đã hoàn thành việc ôn tập tất cả các từ vựng tới hạn cho hôm nay.");
    }
    // Shuffle hoặc giữ nguyên thứ tự (để đơn giản thì giữ nguyên thứ tự cũ nhất tới mới nhất)
    wordsDue.sort((a, b) => new Date(a.next_review_date).getTime() - new Date(b.next_review_date).getTime());
    // Khởi tạo session
    (0, sessionManager_1.setSession)(userId, {
        sheetId,
        wordsDue,
        currentIndex: 0
    });
    const firstWord = wordsDue[0];
    if (!firstWord)
        return;
    const text = `📚 **ÔN TẬP TỪ VỰNG** (${1}/${wordsDue.length})\n\n` +
        `Gợi ý nghĩa: _${firstWord.meaning_vi}_\n\n` +
        `Hãy cố nhớ từ này bằng tiếng Anh nhé!`;
    // Nút inline
    const keyboard = telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback("👁 Hiển thị đáp án", "show_answer")
    ]);
    await ctx.telegram.editMessageText(ctx.chat?.id, m.message_id, undefined, text, {
        parse_mode: 'Markdown',
        ...keyboard
    });
}
//# sourceMappingURL=review.js.map