import { Telegraf } from 'telegraf';
import { config } from './config/botConfig';
import { handleSetSheet } from './bot/commands/setSheet';
import { handleTextMessage } from './bot/messageHandler';
import { handleReview } from './bot/commands/review';
import { handleAction } from './bot/actionHandler';
import { startScheduler } from './bot/scheduler';

const bot = new Telegraf(config.telegramToken);
bot.use(async (ctx, next) => {
    const userId = String(ctx.from?.id);
    if (userId !== config.whitelistId) {
        console.log(`[Security] Phớt lờ người lạ: ${userId} (${ctx.from?.first_name || 'Unknown'})`);
        return; // Ignore
    }
    return next();
});

// Register Commands
bot.command('set_sheet', handleSetSheet);
bot.command('review', handleReview);

bot.command('help', (ctx) => {
    return ctx.reply(
        "🆘 **Hướng dẫn sử dụng Bot cá nhân**\n\n" +
        "Gửi trực tiếp một từ tiếng Anh (ví dụ: `curious`) để tự động tra cứu, dịch nghĩa và lưu vào Google Sheet.\n\n" +
        "📌 **Lệnh hỗ trợ:**\n" +
        "• `/set_sheet <sheet_id>` : Liên kết Google Sheet của bạn\n" +
        "• `/review` : Ôn tập từ vựng tới hạn hôm nay\n" +
        "• `/help` : Xem hướng dẫn này",
        { parse_mode: 'Markdown' }
    );
});

bot.command('start', (ctx) => {
    return ctx.reply("👋 Chào mừng bạn! Gửi một từ tiếng Anh bất kỳ để bắt đầu xài bot.");
});

// Handle text messages (Words)
bot.on('text', handleTextMessage);
// Handle callback queries (Inline buttons)
bot.on('callback_query', handleAction);

console.log("🚀 Telegram Vocabulary Bot is starting...");
bot.launch()
    .then(() => {
        console.log("✅ Bot is online!");
        startScheduler(bot);
    })
    .catch((err) => console.error("❌ Failed to start bot:", err));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
