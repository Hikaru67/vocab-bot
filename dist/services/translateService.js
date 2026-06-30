"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateText = translateText;
const axios_1 = __importDefault(require("axios"));
async function translateText(text, from = 'en', to = 'vi') {
    try {
        const response = await axios_1.default.get(`https://api.mymemory.translated.net/get`, {
            params: {
                q: text,
                langpair: `${from}|${to}`
            }
        });
        return response.data?.responseData?.translatedText || text;
    }
    catch (error) {
        console.error("❌ Translation error:", error);
        return text; // fallback
    }
}
//# sourceMappingURL=translateService.js.map