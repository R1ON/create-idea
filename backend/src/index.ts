import express from 'express';
import cors from 'cors';
import { trpcRouter } from './router';
import { applyTrpcToExpressApp } from './lib/trpc';
import { AppContext, createAppContext } from './lib/ctx';
import { applyPassportToExpressApp } from './lib/passport';
import { env } from './lib/env';
import { presetDb } from './scripts/presetDb';

(async () => {
    let ctx: AppContext | null = null;

    try {
        ctx = createAppContext();
        await presetDb(ctx);

        const app = express();

        app.use(cors());

        await applyPassportToExpressApp(app, ctx);
        await applyTrpcToExpressApp(app, ctx, trpcRouter);

        app.listen(env.PORT, () => {
            console.log(`listening... http://localhost:${env.PORT}`);
        });
    }
    catch (error) {
        console.error('error', error);
        await ctx?.stop();
    }
})();
