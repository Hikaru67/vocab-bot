import axios from 'axios';

export interface WordInfo {
    word: string;
    phonetic?: string;
    partOfSpeech?: string;
    definition?: string;
    example?: string;
    audioUrl?: string;
}

export async function fetchWordInfo(word: string): Promise<WordInfo | null> {
    try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        const data = response.data;

        if (!Array.isArray(data) || data.length === 0) {
            return null;
        }

        const entry = data[0];

        // Extract Phonetic & Audio
        let phonetic = entry.phonetic;
        let audioUrl = "";

        if (entry.phonetics && entry.phonetics.length > 0) {
            // Priority for entry with both text and audio
            const phoneticWithAudio = entry.phonetics.find((p: any) => p.text && p.audio);
            if (phoneticWithAudio) {
                phonetic = phoneticWithAudio.text;
                audioUrl = phoneticWithAudio.audio;
            } else {
                phonetic = phonetic || entry.phonetics[0].text;
                audioUrl = entry.phonetics[0].audio || "";
            }
        }

        // Extract Meaning (First one for simple use case)
        const meaning = entry.meanings && entry.meanings[0];
        if (!meaning) return { word: entry.word, phonetic, audioUrl };

        const partOfSpeech = meaning.partOfSpeech;
        const definitionEntry = meaning.definitions && meaning.definitions[0];
        const definition = definitionEntry ? definitionEntry.definition : undefined;
        const example = definitionEntry ? definitionEntry.example : undefined;

        return {
            word: entry.word,
            phonetic,
            partOfSpeech,
            definition,
            example,
            audioUrl
        };
    } catch (error) {
        console.error(`❌ Error fetching word ${word}:`, error);
        return null;
    }
}
