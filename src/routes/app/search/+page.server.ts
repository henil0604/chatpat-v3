import { trpc } from "$lib/trpc/client";
import type { Prisma } from "@prisma/client";
import type { PageServerLoad } from "./$types";
import { ResponseCodes } from "$lib/config";

// export const load: PageServerLoad = async (event) => {
//     const session = await event.locals.getSession()!;
//     const partnerUsernames = session?.user.partners || [];
//     const partners: {
//         id: string,
//         image: string,
//         name: string,
//         username: string,
//         bio: string,
//         gender: string,
//     }[] = [];

//     for (const username of partnerUsernames) {
//         const info = await trpc(event).user.getPartnerInfoByUsername.query({ username });
//         if (info.code !== ResponseCodes.DONE) return null;
//         partners.push(info.data);
//     }

//     return {
//         partners
//     };
// };