import { t } from '$lib/trpc/t';
import { TRPCError } from '@trpc/server';

export const authMiddleware = t.middleware(async ({ next, ctx }) => {
    const session = await ctx.session;
    if (!session) throw new TRPCError({ code: 'UNAUTHORIZED' });
    return next();
});