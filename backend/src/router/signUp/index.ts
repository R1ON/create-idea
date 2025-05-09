import { trpc } from '../../lib/trpc';
import { zSignUpTrpcInput } from './input';
import { getPasswordHash } from '../../utils/getPasswordHash';
import { signJWT } from '../../utils/signJWT';

export const signUpTrpcRoute = trpc.procedure.input(
  zSignUpTrpcInput
).mutation(async ({ ctx, input }) => {
  const hasUserWithNick = await ctx.prisma.user.findUnique({
    where: {
      nick: input.nick,
    },
  });

  if (hasUserWithNick) {
    throw new Error('Уже есть такой пользователь');
  }

  const hasUserWithEmail = await ctx.prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (hasUserWithEmail) {
    throw new Error('Email уже занят');
  }

  const user = await ctx.prisma.user.create({
    data: {
      nick: input.nick,
      email: input.email,
      password: getPasswordHash(input.password),
    },
  });

  const token = signJWT(user.id);

  return { token };
});
