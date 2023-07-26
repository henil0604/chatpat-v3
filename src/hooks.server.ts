// src/hooks.server.js

import { SvelteKitAuth } from '@auth/sveltekit';
import GoogleProvider from '@auth/core/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import {
    AUTH_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
} from '$env/static/private';
import { prisma } from '$lib/server/db';
import { sequence } from '@sveltejs/kit/hooks';
import { createContext } from '$lib/trpc/context';
import type { Handle } from '@sveltejs/kit';
import { router } from '$lib/trpc/router';
import { createTRPCHandle } from 'trpc-sveltekit';

export const trpcHandle: Handle = createTRPCHandle({ router, createContext });

export const authHandle = SvelteKitAuth({
    adapter: PrismaAdapter(prisma),
    providers: [GoogleProvider({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })],
    secret: AUTH_SECRET,
    callbacks: {
        session: async ({ session, user }) => {

            if (session.user) {
                // assigning id to user
                session.user.id = user.id;
                // assigning username to user
                session.user.username = user.username;
                // assigning bio to user
                session.user.bio = user.bio;
                // assigning gender to user
                session.user.gender = user.gender;
                // assigning partners
                session.user.partners = user.partners;
            }


            return session;
        }
    },
});

export const handle = sequence(authHandle, trpcHandle)