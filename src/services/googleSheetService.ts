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
