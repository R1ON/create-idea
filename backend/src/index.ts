import express from 'express';
import cors from 'cors';
import { trpcRouter } from './router';
import { applyTrpcToExpressApp } from './lib/trpc';
import { AppContext, createAppContext } from './lib/ctx';
import { applyPassportToExpressApp } from './lib/passport';

(async () => {
    let ctx: AppContext | null = null;

    try {
        ctx = createAppContext();
        const app = express();

        app.use(cors());

        await applyPassportToExpressApp(app, ctx);
        await applyTrpcToExpressApp(app, ctx, trpcRouter);

        app.listen(3000, () => {
            console.log('listening... http://localhost:3000');
        });
    }
    catch (error) {
        console.error('error', error);
        await ctx?.stop();
    }
})();
