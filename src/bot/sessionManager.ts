export interface ReviewWord {
    word: string;
    phonetic: string;
    pos: string;
    definition_en: string;
    meaning_vi: string;
    example: string;
    audio_url: string;
    
    // Thuộc tính dòng trong sheet để tiện update
    rowIndex: number;
    
    // Các thông số SR hiện hành
    next_review_date: string;
    repetition: number;
    interval: number;
    efactor: number;
    
    // Toàn bộ mảng raw để clone ra lúc update
    rawRow: any[];
}

export interface ReviewSession {
    sheetId: string;
    wordsDue: ReviewWord[];
    currentIndex: number;
}

// In-memory store
const sessions: Map<string, ReviewSession> = new Map();

export function setSession(userId: string, session: ReviewSession) {
    sessions.set(userId, session);
}

export function getSession(userId: string): ReviewSession | undefined {
    return sessions.get(userId);
}

export function clearSession(userId: string) {
    sessions.delete(userId);
}
