import { trpc } from "$lib/trpc/client";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Pages } from "$lib/config";

export const load: PageServerLoad = async (event) => {
    const { params, locals } = event;

    const username = params.username;
    const session = await locals.getSession();

    // if the user is going to his profile at "{Pages.APP_USER}/{session.user.username}", just redirect them to {Pages.APP_PROFILE}
    if (username === session?.user.username) {
        throw redirect(301, Pages.APP_PROFILE)
    }

    const userInfoResponse = await trpc(event).user.getInfoByUsername.query({
        username
    })

    const partnerRequestResponse = await trpc(event).partnerRequest.getBySentToUsername.query({
        username
    })

    return {
        userInfo: userInfoResponse.data,
        partnerRequest: partnerRequestResponse.data
    };
};