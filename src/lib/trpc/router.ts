import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { t } from '$lib/trpc/t';
import { userRouter } from '$lib/trpc/routers/user';
import { partnerRequestRouter } from '$lib/trpc/routers/partnerRequest';

export const router = t.router({
    user: userRouter,
    partnerRequest: partnerRequestRouter
});

export type Router = typeof router;
export type RouterInput = inferRouterInputs<Router>;
export type RouterOutput = inferRouterOutputs<Router>;