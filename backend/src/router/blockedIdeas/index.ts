import { trpc } from '../../lib/trpc';
import { zBlockIdeaTrpcInput } from './input';
import { canBlockIdeas } from '../../utils/can';

export const blockIdeaTrpcRouter = trpc.procedure.input(
  zBlockIdeaTrpcInput
).mutation(async ({ ctx, input }) => {
  const { ideaId } = input;

  if (!canBlockIdeas(ctx.me)) {
    throw new Error('PERMISSION_DENIED');
  }

  const updatedIdea = await ctx.prisma.idea.updateMany({
    where: {
      id: ideaId,
      blockedAt: null,
    },
    data: {
      blockedAt: new Date(),
    }
  });

  if (updatedIdea.count === 0) {
    throw new Error('NOT_FOUND');
  }

  return true;
});
