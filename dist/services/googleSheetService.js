"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendToSheet = appendToSheet;
exports.getRows = getRows;
exports.updateRow = updateRow;
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const CREDENTIALS_FILE = path_1.default.join(process.cwd(), 'service-account.json');
async function appendToSheet(sheetId, rowData) {
    if (!fs_1.default.existsSync(CREDENTIALS_FILE)) {
        console.error("❌ ERROR: service-account.json is missing in project root");
        return false;
    }
    try {
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: CREDENTIALS_FILE,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
        // Append to sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'A:Z', // Auto-appends into the first sheet
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [rowData],
            },
        });
        return true;
    }
    catch (error) {
        console.error("❌ Error appending to Google Sheet:", error);
        return false;
    }
}
async function getRows(sheetId) {
    if (!fs_1.default.existsSync(CREDENTIALS_FILE)) {
        console.error("❌ ERROR: service-account.json is missing in project root");
        return [];
    }
    try {
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: CREDENTIALS_FILE,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'A:Z', // Lấy toàn bộ
        });
        return response.data.values || [];
    }
    catch (error) {
        console.error("❌ Error reading from Google Sheet:", error);
        return [];
    }
}
async function updateRow(sheetId, rowIndex, rowData) {
    if (!fs_1.default.existsSync(CREDENTIALS_FILE)) {
        console.error("❌ ERROR: service-account.json is missing in project root");
        return false;
    }
    try {
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: CREDENTIALS_FILE,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
        // Update sheet line. rowIndex trong Google Sheet là 1-based, nhưng nếu tính cả header thì row 0 của mảng = row 1 sheet.
        // Bình thường code gọi sẽ passing the exact sheet row number
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `A${rowIndex}:Z${rowIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [rowData],
            },
        });
        return true;
    }
    catch (error) {
        console.error(`❌ Error updating row ${rowIndex} in Google Sheet:`, error);
        return false;
    }
}
//# sourceMappingURL=googleSheetService.js.map