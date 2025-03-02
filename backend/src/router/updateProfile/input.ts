import { z } from 'zod';

export const zUpdateProfileTrpcInput = z.object({
  nick: z.string().min(1),
  name: z.string().min(1).default(''),
});
