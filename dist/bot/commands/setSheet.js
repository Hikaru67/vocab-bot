"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSetSheet = handleSetSheet;
const userSettingRepo_1 = require("../../repository/userSettingRepo");
async function handleSetSheet(ctx) {
    const text = ctx.message && 'text' in ctx.message ? ctx.message.text : '';
    const args = text.split(' ').filter(String);
    if (args.length < 2) {
        return ctx.reply("❌ Vui lòng cung cấp ID! Cú pháp: `/set_sheet <sheet_id>`", { parse_mode: 'Markdown' });
    }
    const sheetId = args[1];
    const userId = String(ctx.from?.id);
    if (sheetId) {
        (0, userSettingRepo_1.saveUserSheet)(userId, sheetId);
        return ctx.reply(`✅ Google Sheet ID đã được cấu hình thành công: \`${sheetId}\`.\n\nĐừng quên share quyền **Editor** cho email Service Account của bạn!`, { parse_mode: 'Markdown' });
    }
    else {
        return ctx.reply("❌ Lỗi cấu hình Sheet ID.");
    }
}
//# sourceMappingURL=setSheet.js.map