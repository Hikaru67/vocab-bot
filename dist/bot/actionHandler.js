"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAction = handleAction;
const telegraf_1 = require("telegraf");
const sessionManager_1 = require("./sessionManager");
const spacedRepetitionService_1 = require("../services/spacedRepetitionService");
const googleSheetService_1 = require("../services/googleSheetService");
async function handleAction(ctx) {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery))
        return;
    const actionData = ctx.callbackQuery.data;
    const userId = String(ctx.from?.id);
    const session = (0, sessionManager_1.getSession)(userId);
    if (!session) {
        return ctx.answerCbQuery("Phiên ôn tập đã kết thúc hoặc không tồn tại.", { show_alert: true });
    }
    if (actionData === 'show_answer') {
        await renderAnswer(ctx, session);
        await ctx.answerCbQuery();
    }
    else if (actionData.startsWith('grade_')) {
        const gradeStr = actionData.split('_')[1];
        const grade = parseInt(gradeStr || '0', 10);
        await handleGrade(ctx, session, grade);
        await ctx.answerCbQuery();
    }
}
async function renderAnswer(ctx, session) {
    const wordInfo = session.wordsDue[session.currentIndex];
    if (!wordInfo)
        return;
    const text = `📚 **TỪ VỰNG**: *${wordInfo.word}*\n` +
        `Phiên âm: ${wordInfo.phonetic}\n` +
        `Loại từ: ${wordInfo.pos}\n\n` +
        `📖 Định nghĩa: _${wordInfo.definition_en}_\n` +
        `🇻🇳 Nghĩa: _${wordInfo.meaning_vi}_\n` +
        `💡 Ví dụ: ${wordInfo.example}\n\n` +
        `🧠 Bạn nhớ từ này ở mức độ nào?`;
    const keyboard = telegraf_1.Markup.inlineKeyboard([
        [
            telegraf_1.Markup.button.callback("Trắng án (Lại - 0)", "grade_0"),
            telegraf_1.Markup.button.callback("Khó (Sai sơ - 1)", "grade_1")
        ],
        [
            telegraf_1.Markup.button.callback("Bình thường (Tốt - 4)", "grade_4"),
            telegraf_1.Markup.button.callback("Rất dễ (Dính luôn - 5)", "grade_5")
        ]
    ]);
    await ctx.editMessageText(text, {
        parse_mode: 'Markdown',
        ...keyboard
    });
}
async function handleGrade(ctx, session, grade) {
    const wordInfo = session.wordsDue[session.currentIndex];
    if (!wordInfo)
        return;
    // 1. Calculate SR
    const newSrData = (0, spacedRepetitionService_1.calculateNextReview)(grade, wordInfo.repetition, wordInfo.interval, wordInfo.efactor);
    // 2. Build Updated Row
    const extRow = [...wordInfo.rawRow]; // Array copy
    // Đảm bảo mảng đủ độ dài vì row có thể thiếu
    while (extRow.length < 12)
        extRow.push('');
    extRow[8] = newSrData.nextReviewDate;
    extRow[9] = newSrData.repetition;
    extRow[10] = newSrData.interval;
    extRow[11] = newSrData.efactor;
    // Cập nhật Google Sheet background process (có thể fail nhưng vẫn tiếp tục để mượt UI)
    (0, googleSheetService_1.updateRow)(session.sheetId, wordInfo.rowIndex, extRow).catch(e => console.error("Update sheet failed:", e));
    // 3. Tiến đến từ tiếp theo
    session.currentIndex++;
    if (session.currentIndex >= session.wordsDue.length) {
        (0, sessionManager_1.clearSession)(String(ctx.from?.id));
        await ctx.editMessageText("🎉 **Xong!**\nBạn đã ôn xong toàn bộ từ vựng tới hạn cho hôm nay. Chúc một ngày tốt lành!", { parse_mode: 'Markdown' });
    }
    else {
        const nextWord = session.wordsDue[session.currentIndex];
        if (!nextWord)
            return;
        const nextText = `📚 **ÔN TẬP TỪ VỰNG** (${session.currentIndex + 1}/${session.wordsDue.length})\n\n` +
            `Gợi ý nghĩa: _${nextWord.meaning_vi}_\n\n` +
            `Tiếp tục, hãy cố nhớ từ tiếng Anh này nhé!`;
        const keyboard = telegraf_1.Markup.inlineKeyboard([
            telegraf_1.Markup.button.callback("👁 Hiển thị đáp án", "show_answer")
        ]);
        await ctx.editMessageText(nextText, {
            parse_mode: 'Markdown',
            ...keyboard
        });
    }
}
//# sourceMappingURL=actionHandler.js.map