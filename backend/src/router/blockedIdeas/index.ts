import { trpc } from '../../lib/trpc';
import { zBlockIdeaTrpcInput } from './input';
import { canBlockIdeas } from '../../utils/can';
import { sendIdeaBlockedEmail } from '../../lib/emails';

export const blockIdeaTrpcRouter = trpc.procedure.input(
  zBlockIdeaTrpcInput
).mutation(async ({ ctx, input }) => {
  const { ideaId } = input;

  if (!canBlockIdeas(ctx.me)) {
    throw new Error('PERMISSION_DENIED');
  }

  const idea = await ctx.prisma.idea.findUnique({
    where: {
      id: ideaId,
    },
    include: {
      author: true,
    },
  });

  if (!idea) {
    throw new Error('NOT_FOUND');
  }

  await ctx.prisma.idea.update({
    where: {
      id: ideaId,
    },
    data: {
      blockedAt: new Date(),
    }
  });

  void sendIdeaBlockedEmail({ user: idea.author, idea });

  return true;
});
