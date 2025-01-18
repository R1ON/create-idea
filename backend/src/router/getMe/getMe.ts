import { pick } from 'lodash';
import { trpc } from '../../lib/trpc';

export const getMeTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  return { me: ctx.me && pick(ctx.me, ['id', 'nick']) };
});
