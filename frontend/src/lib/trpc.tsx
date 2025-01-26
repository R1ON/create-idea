import type { PropsWithChildren } from 'react';
import type { TrpcRouter } from '@your-ideas/backend/src/router';
import { createTRPCReact } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import Cookie from 'js-cookie';
import { env } from './env';

export const trpc = createTRPCReact<TrpcRouter>();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});

const trpcClient = trpc.createClient({
    transformer: superjson,
    links: [
        httpBatchLink({
            url: env.VITE_BACKEND_TRPC_URL,
            headers: () => {
                const token = Cookie.get('token');

                return {
                  ...(token ? { authorization: `Bearer ${token}` } : {}),
                };
            },
        }),
    ],
});

export const TrpcProvider = ({ children }: PropsWithChildren) => {
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    );
}
