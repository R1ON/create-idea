import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { trpc } from '../lib/trpc';
import { getIdeasTrpcRoute } from './getAllIdeas';
import { getIdeaTrpcRoute } from './getIdea';
import { createIdeaTrpcRouter } from './createIdea';
import { signUpTrpcRoute } from './signUp';
import { signInTrpcRoute } from './signIn';
import { getMeTrpcRoute } from './getMe/getMe';
import { updateIdeaTrpcRoute } from './updateIdea';
import { updateProfileTrpcRoute } from './updateProfile';

export const trpcRouter = trpc.router({
    getIdeas: getIdeasTrpcRoute,
    getIdea: getIdeaTrpcRoute,
    getMe: getMeTrpcRoute,
    createIdea: createIdeaTrpcRouter,
    updateIdea: updateIdeaTrpcRoute,
    signUp: signUpTrpcRoute,
    signIn: signInTrpcRoute,
    updateProfile: updateProfileTrpcRoute,
});

export type TrpcRouter = typeof trpcRouter;
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>;
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>;
