import { initTRPC } from '@trpc/server';
import { Express } from 'express';
import { TrpcRouter } from '../router';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { expressHandler } from 'trpc-playground/handlers/express';
import { AppContext } from './ctx';
import superjson from 'superjson';

export const trpc = initTRPC.context<AppContext>().create({
  transformer: superjson,
});

export const applyTrpcToExpressApp = async (
  expressApp: Express,
  appContext: AppContext,
  trpcRouter: TrpcRouter,
) => {
  expressApp.use('/trpc', createExpressMiddleware({
    router: trpcRouter,
    createContext: () => appContext,
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
