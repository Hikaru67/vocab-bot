"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduler = startScheduler;
const node_cron_1 = __importDefault(require("node-cron"));
const botConfig_1 = require("../config/botConfig");
const review_1 = require("./commands/review");
const userSettingRepo_1 = require("../repository/userSettingRepo");
function startScheduler(bot) {
    // Chạy vào 09:00 sáng mỗi ngày
    node_cron_1.default.schedule('0 9 * * *', async () => {
        console.log("⏰ Running daily vocabulary reminder job...");
        const userId = botConfig_1.config.whitelistId;
        if (!userId)
            return;
        const sheetId = (0, userSettingRepo_1.getUserSheet)(userId) || botConfig_1.config.defaultSpreadsheetId;
        if (!sheetId) {
            console.log("⚠️ No sheet ID configured for user, skipping reminder.");
            return;
        }
        try {
            const wordsDue = await (0, review_1.getWordsDue)(sheetId);
            if (wordsDue.length > 0) {
                const text = `🔔 **NHẮC NHỞ ÔN TẬP**\n\nHôm nay bạn có **${wordsDue.length}** từ vựng cần ôn tập.\nHãy gõ lệnh /review để bắt đầu nhé!`;
                await bot.telegram.sendMessage(userId, text, { parse_mode: 'Markdown' });
                console.log(`✅ Sent reminder to ${userId} for ${wordsDue.length} words.`);
            }
            else {
                console.log("ℹ️ No words due today, skipped reminder.");
            }
        }
        catch (error) {
            console.error("❌ Error running reminder job:", error);
        }
    }, {
        timezone: "Asia/Ho_Chi_Minh"
    });
    console.log("⏳ Scheduler initialized. Reminder set for 09:00 AM (Asia/Ho_Chi_Minh).");
}
//# sourceMappingURL=scheduler.js.map