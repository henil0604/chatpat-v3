import { ResponseCodes } from '$lib/config';
import { getUserByUsername, isUsernameValid, removePartner, searchUsers, updateUserPropertiesById } from '$lib/server/modules/User';
import { authMiddleware } from '$lib/trpc/middlewares/auth';
import { t } from "$lib/trpc/t";
import { z } from 'zod';

export const userRouter = t.router({
    isUsernameValid: t.procedure
        .use(authMiddleware)
        .input(z.object({
            username: z.string()
        }))
        .query(async ({ input, ctx }) => {
            // get user
            const user = ctx.session?.user!;

            // calling username validation module
            let [valid, code] = await isUsernameValid(input.username);

            if (code === ResponseCodes.CAN_NOT_BE_USED && user.username === input.username) {
                valid = true;
                code = ResponseCodes.CAN_BE_USED;
            }

            // initializing message
            let message = '';

            switch (code) {
                // if username was empty
                case ResponseCodes.EMPTY_INPUT:
                    message = 'Username is empty'
                    break;
                // if username contained illegal character
                case ResponseCodes.INVALID_INPUT:
                    message = 'Invalid username';
                    break;
                // if username is used by someone else
                case ResponseCodes.CAN_NOT_BE_USED:
                    message = 'Username taken';
                    break;
                // if username is okay to use
                case ResponseCodes.CAN_BE_USED:
                    message = 'Yay! Its Available.';
                    break;
            }

            return {
                code: code,
                error: false,
                message: message,
                data: {
                    valid
                }
            }
        }),

    updateProfile: t.procedure
        .use(authMiddleware)
        .input(z.object({
            username: z.string(),
            bio: z.string(),
            gender: z.string()
        }))
        .query(async ({ input, ctx }) => {
            // getting user
            const user = ctx.session?.user!;

            // update the user
            try {
                await updateUserPropertiesById(user.id!, {
                    username: input.username,
                    bio: input.bio,
                    gender: input.gender,
                })
            } catch (e) {
                return {
                    code: ResponseCodes.ERROR,
                    error: true,
                    message: 'Something went wrong',
                    data: null
                }
            };

            return {
                code: ResponseCodes.DONE,
                error: false,
                message: 'Successfully created profile',
                data: {
                    ...input
                }
            }
        }),

    getPartnerInfoByUsername: t.procedure.
        use(authMiddleware)
        .input(z.object({
            username: z.string()
        }))
        .query(async ({ input, ctx }) => {
            console.log(`@${ctx.session?.user.username} asking partner info for @${input.username}`);

            // get user by username
            const user = await getUserByUsername(input.username);

            return {
                error: false,
                code: ResponseCodes.DONE,
                message: "User found",
                data: {
                    id: user?.id!,
                    username: user?.username!,
                    bio: user?.bio!,
                    gender: user?.gender!,
                    image: user?.image!,
                    name: user?.name!
                }
            }
        }),

    search: t.procedure.
        use(authMiddleware)
        .input(z.object({
            searchString: z.string(),
            take: z.number().optional(),
            skip: z.number().optional()
        }))
        .query(async ({ input, ctx }) => {
            const user = ctx.session?.user!;

            // get users
            const users = await searchUsers(input.searchString);

            return {
                error: false,
                code: ResponseCodes.DONE,
                message: `${users.length} users found`,
                data: users.map(e => ({
                    id: e.id,
                    username: e.username!,
                    image: e.image!,
                    bio: e.bio!,
                    name: e.name!
                }))
            }
        }),

    getInfoByUsername: t.procedure
        .use(authMiddleware)
        .input(z.object({
            username: z.string()
        }))
        .query(async ({ input, ctx }) => {
            console.log(`@${ctx.session?.user.username} asking user info for @${input.username}`);
            const username = input.username;

            const user = await getUserByUsername(username);

            if (!user) {
                return {
                    code: ResponseCodes.NOT_FOUND,
                    error: true,
                    message: 'User not found',
                    data: null
                }
            }

            return {
                code: ResponseCodes.DONE,
                error: false,
                message: 'User found',
                data: {
                    id: user.id!,
                    username: user.username!,
                    name: user.name!,
                    bio: user.bio!,
                    gender: user.gender,
                    image: user.image!,
                    partners: user.partners!,
                }
            }
        }),

    removePartner: t.procedure
        .use(authMiddleware)
        .input(z.object({
            username: z.string()
        }))
        .query(async ({ input, ctx }) => {
            const username = ctx.session?.user.username!;
            const usernameToBeRemove = input.username;

            console.log(`@${username} is removing @${usernameToBeRemove} as partner`)

            await removePartner(username, usernameToBeRemove)

            return {
                error: false,
                code: ResponseCodes.DONE,
                message: 'Partner Removed',
                data: null
            };
        })
});