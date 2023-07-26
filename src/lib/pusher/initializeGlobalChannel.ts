import { invalidateAll } from "$app/navigation";
import { globalLoading, globalUser } from "$lib/store";
import { get } from "svelte/store";
import pusher from "./client";
import { browser } from "$app/environment";


function handleNewChatPartnerRequest(data: {
    sentBy: string
}) {
    console.log(`@${data.sentBy} has sent you chat partner request`)
    invalidateAll()
}

function handleChatPartnerRequestAccept(data: {
    sentBy: string
}) {
    console.log(`@${data.sentBy} has sent you chat partner request`)
    invalidateAll()
}

export function initializeGlobalChannel() {
    globalLoading.set(true);

    const user = get(globalUser)!;
    if (!user) return null;

    const channel = pusher.subscribe("private-global");

    channel.bind("pusher:subscription_succeeded", () => {
        console.log(`Subscribed to global channel`)
        globalLoading.set(false);
    })

    // listens for new chat partner request
    channel.bind(`client-${user.username}-new-chat-partner-request`, handleNewChatPartnerRequest)
    channel.bind(`client-${user.username}-chat-partner-request-accept`, handleChatPartnerRequestAccept)

    channel.bind("pusher:subscription_error", console.error);

    if (browser) {
        (window as any).gc = channel;
    }

    return channel;
}