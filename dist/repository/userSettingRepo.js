"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSheet = getUserSheet;
exports.saveUserSheet = saveUserSheet;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const SETTINGS_FILE = path_1.default.join(process.cwd(), 'settings.json');
function readSettings() {
    try {
        if (!fs_1.default.existsSync(SETTINGS_FILE)) {
            return {};
        }
        const data = fs_1.default.readFileSync(SETTINGS_FILE, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error("Error reading settings.json:", error);
        return {};
    }
}
function writeSettings(settings) {
    try {
        fs_1.default.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    }
    catch (error) {
        console.error("Error writing settings.json:", error);
    }
}
function getUserSheet(userId) {
    const settings = readSettings();
    return settings[userId]?.sheetId || null;
}
function saveUserSheet(userId, sheetId) {
    const settings = readSettings();
    settings[userId] = {
        sheetId,
        updatedAt: new Date().toISOString()
    };
    writeSettings(settings);
}
//# sourceMappingURL=userSettingRepo.js.map