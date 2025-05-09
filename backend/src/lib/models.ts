import { User } from '@prisma/client';
import { pick } from 'lodash';

export const toClientMe = (user: User | null) => {
  return user && pick(user, ['id', 'nick', 'name', 'permissions']);
}
