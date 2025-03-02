import { trpc } from '../../lib/trpc';
import { zUpdateProfileTrpcInput } from './input';
import { toClientMe } from '../../lib/models';


export const updateProfileTrpcRoute = trpc.procedure.input(
  zUpdateProfileTrpcInput
).mutation(async ({ ctx, input }) => {
  if (!ctx.me) {
    throw new Error('Не авторизован');
  }

  if (ctx.me.nick !== input.nick) {
    const hasUser = await ctx.prisma.user.findUnique({
      where: { nick: input.nick },
    });

    if (hasUser) {
      throw new Error('Уже есть такой пользователь');
    }
  }

  const updatedMe = await ctx.prisma.user.update({
    data: input,
    where: {
      id: ctx.me.id,
    },
  });

  ctx.me = updatedMe;

  return toClientMe(updatedMe);
});

