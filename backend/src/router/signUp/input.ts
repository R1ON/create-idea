import { z } from 'zod';

export const zSignUpTrpcInput = z.object({
  nick: z.string().min(1),
  email: z.string().min(1).email(),
  password: z.string().min(1),
});
