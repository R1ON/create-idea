import { z } from 'zod';

export const zCreateIdeaTrpcInput = z.object({
  name: z.string().min(1),
  nick: z.string().min(1),
  description: z.string().min(1),
  text: z.string().min(1),
});
