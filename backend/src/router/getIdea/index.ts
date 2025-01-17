import { trpc } from '../../lib/trpc';
import { z } from 'zod';

export const getIdeaTrpcRoute = trpc.procedure.input(
  z.object({ nick: z.string() })
).query(async ({ input, ctx }) => {
  const idea = await ctx.prisma.idea.findUnique({
    where: {
      nick: input.nick,
    },
  });

  return { idea };
});
