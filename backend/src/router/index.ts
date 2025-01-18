import { trpc } from '../lib/trpc';
import { getIdeasTrpcRoute } from './getAllIdeas';
import { getIdeaTrpcRoute } from './getIdea';
import { createIdeaTrpcRouter } from './createIdea';
import { signUpTrpcRoute } from './signUp';
import { signInTrpcRoute } from './signIn';
import { getMeTrpcRoute } from './getMe/getMe';

export const trpcRouter = trpc.router({
    getIdeas: getIdeasTrpcRoute,
    getIdea: getIdeaTrpcRoute,
    getMe: getMeTrpcRoute,
    createIdea: createIdeaTrpcRouter,
    signUp: signUpTrpcRoute,
    signIn: signInTrpcRoute,
});

export type TrpcRouter = typeof trpcRouter;
