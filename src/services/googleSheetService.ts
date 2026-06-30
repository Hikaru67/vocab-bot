import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const CREDENTIALS_FILE = path.join(process.cwd(), 'service-account.json');

export async function appendToSheet(sheetId: string, rowData: any[]): Promise<boolean> {
    if (!fs.existsSync(CREDENTIALS_FILE)) {
        console.error("❌ ERROR: service-account.json is missing in project root");
        return false;
    }

    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: CREDENTIALS_FILE,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

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
    } catch (error) {
        console.error("❌ Error appending to Google Sheet:", error);
        return false;
    }
}

export async function getRows(sheetId: string): Promise<any[][]> {
    if (!fs.existsSync(CREDENTIALS_FILE)) {
        console.error("❌ ERROR: service-account.json is missing in project root");
        return [];
    }

    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: CREDENTIALS_FILE,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'A:Z', // Lấy toàn bộ
        });

        return response.data.values || [];
    } catch (error) {
        console.error("❌ Error reading from Google Sheet:", error);
        return [];
    }
}

export async function updateRow(sheetId: string, rowIndex: number, rowData: any[]): Promise<boolean> {
    if (!fs.existsSync(CREDENTIALS_FILE)) {
        console.error("❌ ERROR: service-account.json is missing in project root");
        return false;
    }

    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: CREDENTIALS_FILE,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheets = google.sheets({ version: 'v4', auth });

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
    } catch (error) {
        console.error(`❌ Error updating row ${rowIndex} in Google Sheet:`, error);
        return false;
    }
}
