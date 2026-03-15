import dotenv from 'dotenv';
dotenv.config();

export const config = {
    telegramToken: process.env.TELEGRAM_BOT_TOKEN || '',
    whitelistId: process.env.YOUR_TELEGRAM_ID || '',
    defaultSpreadsheetId: process.env.DEFAULT_SPREADSHEET_ID || '',
};

if (!config.telegramToken) {
    console.error("❌ ERROR: TELEGRAM_BOT_TOKEN is missing in .env file");
    process.exit(1);
}

if (!config.whitelistId) {
    console.error("❌ ERROR: YOUR_TELEGRAM_ID is missing in .env file");
    process.exit(1);
}
