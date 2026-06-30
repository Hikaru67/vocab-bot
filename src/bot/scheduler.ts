import cron from 'node-cron';
import { Telegraf } from 'telegraf';
import { config } from '../config/botConfig';
import { getWordsDue } from './commands/review';
import { getUserSheet } from '../repository/userSettingRepo';

export function startScheduler(bot: Telegraf) {
    // Chạy vào 09:00 sáng mỗi ngày
    cron.schedule('0 9 * * *', async () => {
        console.log("⏰ Running daily vocabulary reminder job...");

        const userId = config.whitelistId;
        if (!userId) return;

        const sheetId = getUserSheet(userId) || config.defaultSpreadsheetId;
        if (!sheetId) {
            console.log("⚠️ No sheet ID configured for user, skipping reminder.");
            return;
        }

        try {
            const wordsDue = await getWordsDue(sheetId);
            if (wordsDue.length > 0) {
                const text = `🔔 **NHẮC NHỞ ÔN TẬP**\n\nHôm nay bạn có **${wordsDue.length}** từ vựng cần ôn tập.\nHãy gõ lệnh /review để bắt đầu nhé!`;
                await bot.telegram.sendMessage(userId, text, { parse_mode: 'Markdown' });
                console.log(`✅ Sent reminder to ${userId} for ${wordsDue.length} words.`);
            } else {
                console.log("ℹ️ No words due today, skipped reminder.");
            }
        } catch (error) {
            console.error("❌ Error running reminder job:", error);
        }
    }, {
        timezone: "Asia/Ho_Chi_Minh"
    });
    
    console.log("⏳ Scheduler initialized. Reminder set for 09:00 AM (Asia/Ho_Chi_Minh).");
}
