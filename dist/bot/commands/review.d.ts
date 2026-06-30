import { Context } from 'telegraf';
import { ReviewWord } from '../sessionManager';
export declare function getWordsDue(sheetId: string): Promise<ReviewWord[]>;
export declare function handleReview(ctx: Context): Promise<true | import("@telegraf/types").Message.TextMessage | undefined>;
//# sourceMappingURL=review.d.ts.map