export interface ReviewWord {
    word: string;
    phonetic: string;
    pos: string;
    definition_en: string;
    meaning_vi: string;
    example: string;
    audio_url: string;
    rowIndex: number;
    next_review_date: string;
    repetition: number;
    interval: number;
    efactor: number;
    rawRow: any[];
}
export interface ReviewSession {
    sheetId: string;
    wordsDue: ReviewWord[];
    currentIndex: number;
}
export declare function setSession(userId: string, session: ReviewSession): void;
export declare function getSession(userId: string): ReviewSession | undefined;
export declare function clearSession(userId: string): void;
//# sourceMappingURL=sessionManager.d.ts.map