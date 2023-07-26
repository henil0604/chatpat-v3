import { ResponseCodes, type ListOfResponseCodes } from "$lib/config";
import { REGEX } from "$lib/const";
import { prisma } from "$lib/server/db";
import type { Prisma, User } from "@prisma/client";

export function getUserByUsername(username: string) {
    return prisma.user.findFirst({
        where: {
            username
        }
    })
}

export async function isUsernameValid(username: string): Promise<[boolean, ListOfResponseCodes]> {
    // if username is empty or its trimmed version is empty
    if (!username || !username.trim()) return [false, ResponseCodes.EMPTY_INPUT];
    // if username does not match requirements for its regular expression
    if (REGEX.username.test(username) === false) return [false, ResponseCodes.INVALID_INPUT];
    // get the user with the username
    const user = await getUserByUsername(username);
    // if user is found, that means username is taken
    if (user) return [false, ResponseCodes.CAN_NOT_BE_USED]
    return [true, ResponseCodes.CAN_BE_USED]
}

export async function updateUserPropertiesById(id: NonNullable<Prisma.UserWhereUniqueInput["id"]>, data: Prisma.UserUncheckedUpdateInput) {
    const set = await prisma.user.update({
        where: {
            id
        },
        data
    })
    return set;
}

export async function updateUserPropertiesByUsername(username: NonNullable<Prisma.UserWhereUniqueInput["username"]>, data: Prisma.UserUncheckedUpdateInput) {
    const set = await prisma.user.update({
        where: {
            username
        },
        data
    })
    return set;
}

export async function searchUsers(searchString: string, take?: number, skip?: number) {
    return await prisma.user.findMany({
        where: {
            OR: [
                {
                    username: {
                        contains: searchString
                    }
                },
                {
                    name: {
                        contains: searchString
                    }
                },
                {
                    bio: {
                        contains: searchString
                    }
                }
            ]
        },
        take,
        skip
    })
}

export async function removePartner(userAUsername: string, userBUsername: string) {
    // get userA
    const userA = await getUserByUsername(userAUsername);
    // get userB
    const userB = await getUserByUsername(userBUsername);
    // remove userB's Username from userA's Partners
    await updateUserPropertiesByUsername(userAUsername, {
        partners: {
            set: userA?.partners.filter(e => e !== userBUsername)
        }
    })
    // remove userA's Username from userB's Partners
    await updateUserPropertiesByUsername(userBUsername, {
        partners: {
            set: userB?.partners.filter(e => e !== userAUsername)
        }
    })
    return ResponseCodes.DONE;
}