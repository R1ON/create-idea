import { trpc } from '../../lib/trpc';
import { zSignInTrpcInput } from './input';
import { getPasswordHash } from '../../utils/getPasswordHash';

export const signInTrpcRoute = trpc.procedure.input(
  zSignInTrpcInput
).mutation(async ({ ctx, input }) => {
  const user = await ctx.prisma.user.findUnique({
    where: {
      nick: input.nick,
      password: getPasswordHash(input.password),
    },
  });

  if (!user) {
    throw new Error('Неправильный логин или пароль');
  }

  return true;
});
