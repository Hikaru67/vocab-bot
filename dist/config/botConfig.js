"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    telegramToken: process.env.TELEGRAM_BOT_TOKEN || '',
    whitelistId: process.env.YOUR_TELEGRAM_ID || '',
    defaultSpreadsheetId: process.env.DEFAULT_SPREADSHEET_ID || '',
};
if (!exports.config.telegramToken) {
    console.error("❌ ERROR: TELEGRAM_BOT_TOKEN is missing in .env file");
    process.exit(1);
}
if (!exports.config.whitelistId) {
    console.error("❌ ERROR: YOUR_TELEGRAM_ID is missing in .env file");
    process.exit(1);
}
//# sourceMappingURL=botConfig.js.map