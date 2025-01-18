import { trpc } from '../../lib/trpc';
import { zSignUpTrpcInput } from './input';
import { getPasswordHash } from '../../utils/getPasswordHash';
import { signJWT } from '../../utils/signJWT';

export const signUpTrpcRoute = trpc.procedure.input(
  zSignUpTrpcInput
).mutation(async ({ ctx, input }) => {
  const hasUser = await ctx.prisma.user.findUnique({
    where: {
      nick: input.nick,
    },
  });

  if (hasUser) {
    throw new Error('Уже есть такой пользователь');
  }

  const user = await ctx.prisma.user.create({
    data: {
      nick: input.nick,
      password: getPasswordHash(input.password),
    },
  });

  const token = signJWT(user.id);

  return { token };
});
