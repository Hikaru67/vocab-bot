export interface UserSettings {
    [userId: string]: {
        sheetId?: string;
        updatedAt?: string;
    };
}
export declare function getUserSheet(userId: string): string | null;
export declare function saveUserSheet(userId: string, sheetId: string): void;
//# sourceMappingURL=userSettingRepo.d.ts.map