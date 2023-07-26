import { prisma } from "$lib/server/db";
import { updateUserPropertiesByUsername } from "./User";

export function getPartnerRequestByUsernames(sentBy: string, sentTo: string) {
    return prisma.partnerRequest.findFirst({
        where: {
            sentBy,
            sentTo
        },
    })
}

export function addPartnerRequest(sentBy: string, sentTo: string) {
    return prisma.partnerRequest.create({
        data: {
            sentBy,
            sentTo,
            status: 'pending'
        }
    })
}

export function getAllPendingRequestsBySentToUsername(sentTo: string) {
    return prisma.partnerRequest.findMany({
        where: {
            sentTo,
            status: 'pending'
        },
    });
}

export async function acceptPartnerRequest(id: string) {
    // update the request as "accepted"
    const updatedRequest = await prisma.partnerRequest.update({
        where: {
            id,
        },
        data: {
            status: 'accepted'
        }
    })

    // add corresponding partners
    const sentByUsername = updatedRequest.sentBy;
    const sentToUsername = updatedRequest.sentTo;

    // add sentTo user as partner in sentBy user
    const sentByUser = await updateUserPropertiesByUsername(sentByUsername, {
        partners: {
            push: sentToUsername
        }
    })

    // add sentBy user as partner in sentTo user
    const sentToUser = await updateUserPropertiesByUsername(sentToUsername, {
        partners: {
            push: sentByUsername
        }
    })

    return updatedRequest;
}

export async function declinePartnerRequest(id: string) {
    return prisma.partnerRequest.update({
        where: {
            id
        },
        data: {
            status: 'declined'
        }
    })
}