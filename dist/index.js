"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const botConfig_1 = require("./config/botConfig");
const setSheet_1 = require("./bot/commands/setSheet");
const messageHandler_1 = require("./bot/messageHandler");
const review_1 = require("./bot/commands/review");
const actionHandler_1 = require("./bot/actionHandler");
const scheduler_1 = require("./bot/scheduler");
const bot = new telegraf_1.Telegraf(botConfig_1.config.telegramToken);
bot.use(async (ctx, next) => {
    const userId = String(ctx.from?.id);
    if (userId !== botConfig_1.config.whitelistId) {
        console.log(`[Security] Phớt lờ người lạ: ${userId} (${ctx.from?.first_name || 'Unknown'})`);
        return; // Ignore
    }
    return next();
});
// Register Commands
bot.command('set_sheet', setSheet_1.handleSetSheet);
bot.command('review', review_1.handleReview);
bot.command('help', (ctx) => {
    return ctx.reply("🆘 **Hướng dẫn sử dụng Bot cá nhân**\n\n" +
        "Gửi trực tiếp một từ tiếng Anh (ví dụ: `curious`) để tự động tra cứu, dịch nghĩa và lưu vào Google Sheet.\n\n" +
        "📌 **Lệnh hỗ trợ:**\n" +
        "• `/set_sheet <sheet_id>` : Liên kết Google Sheet của bạn\n" +
        "• `/review` : Ôn tập từ vựng tới hạn hôm nay\n" +
        "• `/help` : Xem hướng dẫn này", { parse_mode: 'Markdown' });
});
bot.command('start', (ctx) => {
    return ctx.reply("👋 Chào mừng bạn! Gửi một từ tiếng Anh bất kỳ để bắt đầu xài bot.");
});
// Handle text messages (Words)
bot.on('text', messageHandler_1.handleTextMessage);
// Handle callback queries (Inline buttons)
bot.on('callback_query', actionHandler_1.handleAction);
console.log("🚀 Telegram Vocabulary Bot is starting...");
bot.launch()
    .then(() => {
    console.log("✅ Bot is online!");
    (0, scheduler_1.startScheduler)(bot);
})
    .catch((err) => console.error("❌ Failed to start bot:", err));
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
//# sourceMappingURL=index.js.map