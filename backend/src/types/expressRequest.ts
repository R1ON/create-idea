import { Request } from 'express';
import { User } from '@prisma/client';

export type ExpressRequest = Request & {
  user?: User;
};
