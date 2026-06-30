export interface WordInfo {
    word: string;
    phonetic?: string;
    partOfSpeech?: string;
    definition?: string;
    example?: string;
    audioUrl?: string;
}
export declare function fetchWordInfo(word: string): Promise<WordInfo | null>;
//# sourceMappingURL=dictionaryService.d.ts.map