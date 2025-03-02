import { trpc } from '../../lib/trpc';
import { zUpdatePasswordTrpcInput } from './input';
import { getPasswordHash } from '../../utils/getPasswordHash';


export const updatePasswordTrpcRoute = trpc.procedure.input(
  zUpdatePasswordTrpcInput
).mutation(async ({ ctx, input }) => {
  if (!ctx.me) {
    throw new Error('Не авторизован');
  }

  if (ctx.me.password !== getPasswordHash(input.oldPassword)) {
    throw new Error('Старый пароль неправильный');
  }

  ctx.me = await ctx.prisma.user.update({
    data: {
      password: getPasswordHash(input.newPassword),
    },
    where: {
      id: ctx.me.id,
    },
  });

  return true;
});
