import type { Channel } from "pusher-js";
import { writable } from "svelte/store";

// global channel for pusher
export const globalChannel = writable<Channel | null>(null)