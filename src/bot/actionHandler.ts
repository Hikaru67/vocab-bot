import { Context, Markup } from 'telegraf';
import { getSession, ReviewSession, clearSession } from './sessionManager';
import { calculateNextReview } from '../services/spacedRepetitionService';
import { updateRow } from '../services/googleSheetService';

export async function handleAction(ctx: Context) {
    if (!('data' in ctx.callbackQuery!)) return;

    const actionData = ctx.callbackQuery.data;
    const userId = String(ctx.from?.id);
    const session = getSession(userId);

    if (!session) {
        return ctx.answerCbQuery("Phiên ôn tập đã kết thúc hoặc không tồn tại.", { show_alert: true });
    }

    if (actionData === 'show_answer') {
        await renderAnswer(ctx, session);
        await ctx.answerCbQuery();
    } else if (actionData.startsWith('grade_')) {
        const grade = parseInt(actionData.split('_')[1], 10);
        await handleGrade(ctx, session, grade);
        await ctx.answerCbQuery();
    }
}

async function renderAnswer(ctx: Context, session: ReviewSession) {
    const wordInfo = session.wordsDue[session.currentIndex];
    
    const text = `📚 **TỪ VỰNG**: *${wordInfo.word}*\n` +
                 `Phiên âm: ${wordInfo.phonetic}\n` +
                 `Loại từ: ${wordInfo.pos}\n\n` +
                 `📖 Định nghĩa: _${wordInfo.definition_en}_\n` +
                 `🇻🇳 Nghĩa: _${wordInfo.meaning_vi}_\n` +
                 `💡 Ví dụ: ${wordInfo.example}\n\n` +
                 `🧠 Bạn nhớ từ này ở mức độ nào?`;
                 
    const keyboard = Markup.inlineKeyboard([
        [
            Markup.button.callback("Trắng án (Lại - 0)", "grade_0"),
            Markup.button.callback("Khó (Sai sơ - 1)", "grade_1")
        ],
        [
            Markup.button.callback("Bình thường (Tốt - 4)", "grade_4"),
            Markup.button.callback("Rất dễ (Dính luôn - 5)", "grade_5")
        ]
    ]);

    await ctx.editMessageText(text, {
        parse_mode: 'Markdown',
        ...keyboard
    });
}

async function handleGrade(ctx: Context, session: ReviewSession, grade: number) {
    const wordInfo = session.wordsDue[session.currentIndex];

    // 1. Calculate SR
    const newSrData = calculateNextReview(grade, wordInfo.repetition, wordInfo.interval, wordInfo.efactor);

    // 2. Build Updated Row
    const extRow = [...wordInfo.rawRow]; // Array copy
    // Đảm bảo mảng đủ độ dài vì row có thể thiếu
    while (extRow.length < 12) extRow.push('');
    
    extRow[8] = newSrData.nextReviewDate;
    extRow[9] = newSrData.repetition;
    extRow[10] = newSrData.interval;
    extRow[11] = newSrData.efactor;

    // Cập nhật Google Sheet background process (có thể fail nhưng vẫn tiếp tục để mượt UI)
    updateRow(session.sheetId, wordInfo.rowIndex, extRow).catch(e => console.error("Update sheet failed:", e));

    // 3. Tiến đến từ tiếp theo
    session.currentIndex++;

    if (session.currentIndex >= session.wordsDue.length) {
        clearSession(String(ctx.from?.id));
        await ctx.editMessageText("🎉 **Xong!**\nBạn đã ôn xong toàn bộ từ vựng tới hạn cho hôm nay. Chúc một ngày tốt lành!", { parse_mode: 'Markdown' });
    } else {
        const nextWord = session.wordsDue[session.currentIndex];
        const nextText = `📚 **ÔN TẬP TỪ VỰNG** (${session.currentIndex + 1}/${session.wordsDue.length})\n\n` +
                         `Gợi ý nghĩa: _${nextWord.meaning_vi}_\n\n` +
                         `Tiếp tục, hãy cố nhớ từ tiếng Anh này nhé!`;

        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback("👁 Hiển thị đáp án", "show_answer")
        ]);

        await ctx.editMessageText(nextText, {
            parse_mode: 'Markdown',
            ...keyboard
        });
    }
}
