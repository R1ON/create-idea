import { trpc } from '../../lib/trpc';
import { zSetIdeaLikeTrpcInput } from './input';

export const setIdeaLikeTrpcRoute = trpc.procedure.input(
  zSetIdeaLikeTrpcInput
).mutation(async ({ ctx, input }) => {
  const { ideaId, isLikedByMe } = input;

  if (!ctx.me) {
    throw new Error('Not authorized');
  }

  if (isLikedByMe) {
    await ctx.prisma.ideaLike.upsert({
      where: {
        ideaId_userId: {
          ideaId,
          userId: ctx.me.id,
        },
      },
      create: {
        userId: ctx.me.id,
        ideaId,
      },
      update: {},
    });
  } else {
    try {
      await ctx.prisma.ideaLike.delete({
        where: {
          ideaId_userId: {
            ideaId,
            userId: ctx.me.id,
          },
        },
      });
    } catch {
      throw new Error('Idea not found');
    }
  }

  const likesCount = await ctx.prisma.ideaLike.count({
    where: { ideaId },
  });

  return {
    idea: {
      id: ideaId,
      likesCount,
      isLikedByMe,
    },
  };
});
