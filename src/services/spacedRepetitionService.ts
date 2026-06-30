export interface SpacedRepetitionData {
    nextReviewDate: string; // ISO String
    repetition: number;
    interval: number; // Trong tính bằng ngày
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
export function calculateNextReview(
    grade: number,
    repetition: number,
    interval: number,
    efactor: number
): SpacedRepetitionData {
    let newRepetition = repetition;
    let newInterval = interval;
    let newEfactor = efactor;

    if (grade >= 3) {
        // Nhớ từ (Đúng)
        if (newRepetition === 0) {
            newInterval = 1;
        } else if (newRepetition === 1) {
            newInterval = 6;
        } else {
            newInterval = Math.round(newInterval * newEfactor);
        }
        newRepetition++;
    } else {
        // Quên từ (Sai)
        newRepetition = 0;
        newInterval = 1;
    }

    // Tính efactor mới
    newEfactor = newEfactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    
    // Ràng buộc efactor >= 1.3 theo đúng thuật toán SM-2
    if (newEfactor < 1.3) {
        newEfactor = 1.3;
    }

    // Tính next_review_date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + newInterval);

    return {
        nextReviewDate: nextDate.toISOString(),
        repetition: newRepetition,
        interval: newInterval,
        efactor: parseFloat(newEfactor.toFixed(2)),
    };
}
