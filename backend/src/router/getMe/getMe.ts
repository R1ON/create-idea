import { trpc } from '../../lib/trpc';
import { toClientMe } from '../../lib/models';

export const getMeTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  return { me: toClientMe(ctx.me) };
});
