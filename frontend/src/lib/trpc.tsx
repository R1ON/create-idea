import type { PropsWithChildren } from 'react';
import type { TrpcRouter } from '@your-ideas/backend/src/router';
import { createTRPCReact } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import Cookie from 'js-cookie';

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
            url: 'http://localhost:3000/trpc',
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
