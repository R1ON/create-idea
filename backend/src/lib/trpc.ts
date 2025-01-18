import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { Express } from 'express';
import superjson from 'superjson';
import { createExpressMiddleware, CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { expressHandler } from 'trpc-playground/handlers/express';
import { TrpcRouter } from '../router';
import { AppContext } from './ctx';
import { ExpressRequest } from '../types/expressRequest';

const createTrpcContext = (appContext: AppContext) => ({ req }: CreateExpressContextOptions) => ({
  ...appContext,
  me: (req as ExpressRequest).user || null,
});

type TrpcContext = inferAsyncReturnType<ReturnType<typeof createTrpcContext>>;

export const trpc = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const applyTrpcToExpressApp = async (
  expressApp: Express,
  appContext: AppContext,
  trpcRouter: TrpcRouter,
) => {
  expressApp.use('/trpc', createExpressMiddleware({
    router: trpcRouter,
    createContext: createTrpcContext(appContext),
  }));

  expressApp.use(
    '/trpc-playground',
    await expressHandler({
      trpcApiEndpoint: '/trpc',
      playgroundEndpoint: '/trpc-playground',
      router: trpcRouter,
      request: {
        superjson: true,
      },
    }),
  );
}
