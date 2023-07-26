import { Pages } from "$lib/config";
import type { Session } from "@auth/core/types";
import { writable } from "svelte/store";

export const globalLoading = writable(false);
export const globalUser = writable<Session["user"] | null>(null);

export const previousPagePath = writable(Pages.APP)