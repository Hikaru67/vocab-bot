export interface SpacedRepetitionData {
    nextReviewDate: string;
    repetition: number;
    interval: number;
    efactor: number;
}
/**
 * Tính toán lần ôn tập tiếp theo theo thuật toán SuperMemo-2 (SM-2)
 * @param grade Điểm đánh giá mức độ ghi nhớ (0-5)
 *     0: Hoàn toàn không nhớ
 *     1: Sai, nhưng nhớ ra khi xem đáp án
 *     2: Sai, nhưng dễ nhớ lại
 *     3: Khó, phải suy nghĩ lâu
 *     4: Tốt, nhớ lại được có chút do dự
 *     5: Rất dễ, nhớ dính luôn
 * @param repetition Số lần ôn tập thành công liên tiếp
 * @param interval Khoảng cách thời gian ôn tập hiện tại (đơn vị: ngày)
 * @param efactor Easiness factor (Hệ số dễ)
 */
export declare function calculateNextReview(grade: number, repetition: number, interval: number, efactor: number): SpacedRepetitionData;
//# sourceMappingURL=spacedRepetitionService.d.ts.map