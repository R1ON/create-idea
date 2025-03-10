import { trpc } from '../../lib/trpc';
import { zGetAllIdeasTrpcInput } from './input';
import { omit } from 'lodash';

export const getIdeasTrpcRoute = trpc.procedure.input(
  zGetAllIdeasTrpcInput
).query(async ({ ctx, input }) => {
  const rawIdeas = await ctx.prisma.idea.findMany({
    select: {
      id: true,
      nick: true,
      name: true,
      description: true,
      serialNumber: true,
      _count: {
        select: {
          ideasLikes: true,
        },
      },
    },
    orderBy: [{ createdAt: 'desc' }, { serialNumber: 'desc' }],
    cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
    take: input.limit + 1,
  });

  const nextIdea = rawIdeas.at(input.limit);
  const nextCursor = nextIdea?.serialNumber;

  const rawIdeasExceptNext = rawIdeas.slice(0, input.limit);

  const ideasExceptNext = rawIdeasExceptNext.map((idea) => ({
    ...omit(idea, ['_count']),
    likesCount: idea._count.ideasLikes,
  }));

  return {
    ideas: ideasExceptNext,
    nextCursor,
  };
});
