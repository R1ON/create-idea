import { trpc } from '../../lib/trpc';
import { zUpdateIdeaTrpcInput } from './input';

export const updateIdeaTrpcRoute = trpc.procedure.input(
  zUpdateIdeaTrpcInput
).mutation(async ({ input, ctx }) => {
  const { ideaId, ...ideaInput } = input;

  if (!ctx.me) {
    throw new Error('Not authorized');
  }

  const foundIdea = await ctx.prisma.idea.findUnique({
    where: {
      id: ideaId,
    },
  });

  if (!foundIdea) {
    throw new Error('Not found');
  }

  if (ctx.me.id !== foundIdea.authorId) {
    throw new Error('Not your idea');
  }

  if (foundIdea.nick !== input.nick) {
    const foundIdeaByNick = await ctx.prisma.idea.findUnique({
      where: {
        nick: input.nick,
      },
    });

    if (foundIdeaByNick) {
      throw new Error('Idea with this nick already exist');
    }
  }

  await ctx.prisma.idea.update({
    where: {
      id: input.ideaId,
    },
    data: ideaInput,
  });
});
