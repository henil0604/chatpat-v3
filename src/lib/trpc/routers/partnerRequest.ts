import { ResponseCodes } from '$lib/config';
import { acceptPartnerRequest, addPartnerRequest, declinePartnerRequest, getAllPendingRequestsBySentToUsername, getPartnerRequestByUsernames } from '$lib/server/modules/PartnerRequest';
import { getUserByUsername } from '$lib/server/modules/User';
import { authMiddleware } from '$lib/trpc/middlewares/auth';
import { t } from "$lib/trpc/t";
import { z } from 'zod';

export const partnerRequestRouter = t.router({
    getBySentToUsername: t.procedure
        .use(authMiddleware)
        .input(z.object({
            username: z.string()
        }))
        .query(async ({ input, ctx }) => {
            // get the username of client
            const sentByUsername = ctx.session?.user?.username!;
            // get username from input
            const sentToUsername = input.username;

            // fetch all the partner request that was sent by the client and was sent to the input username
            const partnerRequest = await getPartnerRequestByUsernames(sentByUsername, sentToUsername);

            return {
                error: false,
                code: ResponseCodes.DONE,
                message: null,
                data: partnerRequest
            }
        }),

    add: t.procedure
        .use(authMiddleware)
        .input(z.object({
            username: z.string()
        }))
        .query(async ({ input, ctx }) => {
            // get the username of client
            const sentByUsername = ctx.session?.user?.username!;
            // get username from input
            const sentToUsername = input.username;

            // add the partner request
            const partnerRequest = await addPartnerRequest(sentByUsername, sentToUsername);

            return {
                error: false,
                code: ResponseCodes.DONE,
                message: 'Request sent',
                data: partnerRequest
            }
        }),


    getPendingRequests: t.procedure
        .use(authMiddleware)
        .query(async ({ ctx }) => {

            // get session user
            const user = ctx.session?.user!;
            // get the user name of the client
            const sentToUsername = user.username!;

            // initialize the object that will be sent as response data
            let requests: {
                sentTo: {
                    id: string
                    image: string
                    username: string
                    name: string
                },
                sentBy: {
                    id: string
                    image: string
                    username: string
                    name: string
                },
                status: string,
                createdAt: Date,
                updatedAt: Date,
                id: string
            }[] = []

            // fetch all the pending request that was sent to the client
            let pendingPartnerRequests = await getAllPendingRequestsBySentToUsername(sentToUsername);

            // iterate over them
            for (const req of pendingPartnerRequests) {
                // client user info
                const sentToUserInfo = {
                    id: user.id!,
                    image: user.image!,
                    username: user.username!,
                    name: user.name!
                };
                // so the "req.sentBy" is username of the person
                // so we need to fetch the user by the username
                let sentByUser = (await getUserByUsername(req.sentBy))!;
                // after user is fetched create the object
                let sentByUserInfo = {
                    id: sentByUser.id!,
                    image: sentByUser.image!,
                    username: sentByUser.username!,
                    name: sentByUser.name!,
                }
                // push the request object to requests object
                requests.push({
                    id: req.id,
                    createdAt: req.createdAt,
                    updatedAt: req.updatedAt,
                    status: req.status,
                    sentBy: sentByUserInfo,
                    sentTo: sentToUserInfo
                })
            }

            return {
                error: false,
                code: ResponseCodes.DONE,
                message: null,
                data: requests
            }
        }),

    acceptRequest: t.procedure
        .use(authMiddleware)
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ input, ctx }) => {
            const id = input.id;

            await acceptPartnerRequest(id);

            return {
                error: false,
                code: ResponseCodes.DONE,
                message: 'Request Accepted',
                data: null
            }
        }),

    declineRequest: t.procedure
        .use(authMiddleware)
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ input, ctx }) => {
            const id = input.id;

            await declinePartnerRequest(id);

            return {
                error: false,
                code: ResponseCodes.DONE,
                message: 'Request Declined',
                data: null
            }
        }),
});


