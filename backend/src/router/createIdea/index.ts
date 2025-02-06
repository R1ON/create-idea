import { trpc } from '../../lib/trpc';
import { zCreateIdeaTrpcInput } from './input';

export const createIdeaTrpcRouter = trpc.procedure.input(
  zCreateIdeaTrpcInput
).mutation(async ({ input, ctx }) => {
  if (!ctx.me) {
    throw new Error('Not authorized');
  }

  const idea = await ctx.prisma.idea.findUnique({
    where: {
      nick: input.nick,
    },
  });

  if (idea) {
    throw new Error('Уже есть такой ник');
  }

  await ctx.prisma.idea.create({
    data: { ...input, authorId: ctx.me.id },
  });

  return true;
})
