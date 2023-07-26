import { trpc } from "$lib/trpc/client";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
    event.depends("app");
    const pendingPartnerRequests = await trpc(event).partnerRequest.getPendingRequests.query();

    return {
        pendingPartnerRequests: pendingPartnerRequests.data
    };
};