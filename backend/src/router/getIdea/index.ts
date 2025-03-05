import { trpc } from '../../lib/trpc';
import { z } from 'zod';
import { omit } from 'lodash';

export const getIdeaTrpcRoute = trpc.procedure.input(
  z.object({ nick: z.string() })
).query(async ({ input, ctx }) => {
  const rawIdea = await ctx.prisma.idea.findUnique({
    where: {
      nick: input.nick,
    },
    include: {
      author: {
        select: {
          id: true,
          nick: true,
          name: true,
        },
      },
      ideasLikes: {
        select: {
          id: true,
        },
        where: {
          userId: ctx.me?.id,
        },
      },
      _count: {
        select: {
          ideasLikes: true,
        },
      },
    },
  });

  const isLikedByMe = !!rawIdea?.ideasLikes.length;
  const likesCount = rawIdea?._count.ideasLikes || 0;

  const idea = rawIdea && { ...omit(rawIdea, ['ideasLikes', '_count']), isLikedByMe, likesCount };

  return { idea };
});
