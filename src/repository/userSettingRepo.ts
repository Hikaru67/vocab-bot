import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'settings.json');

export interface UserSettings {
    [userId: string]: {
        sheetId?: string;
        updatedAt?: string;
    }
}

function readSettings(): UserSettings {
    try {
        if (!fs.existsSync(SETTINGS_FILE)) {
            return {};
        }
        const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading settings.json:", error);
        return {};
    }
}

function writeSettings(settings: UserSettings): void {
    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    } catch (error) {
        console.error("Error writing settings.json:", error);
    }
}

export function getUserSheet(userId: string): string | null {
    const settings = readSettings();
    return settings[userId]?.sheetId || null;
}

export function saveUserSheet(userId: string, sheetId: string): void {
    const settings = readSettings();
    settings[userId] = {
        sheetId,
        updatedAt: new Date().toISOString()
    };
    writeSettings(settings);
}
