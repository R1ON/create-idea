import { z } from 'zod';

export const zSetIdeaLikeTrpcInput = z.object({
  ideaId: z.string().min(1),
  isLikedByMe: z.boolean(),
});
