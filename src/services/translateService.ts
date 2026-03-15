import axios from 'axios';

export async function translateText(text: string, from: string = 'en', to: string = 'vi'): Promise<string> {
    try {
        const response = await axios.get(`https://api.mymemory.translated.net/get`, {
            params: {
                q: text,
                langpair: `${from}|${to}`
            }
        });
        return response.data?.responseData?.translatedText || text;
    } catch (error) {
        console.error("❌ Translation error:", error);
        return text; // fallback
    }
}
