import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Pages, ProtectedRoutes } from "$lib/config";
import { get } from "svelte/store";
import { page } from "$app/stores";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isProtectedRoute(url: string, Routes: string[] = ProtectedRoutes) {
  return Routes.some(route => {
    if (route === '*') {
      // Wildcard match - all routes are protected
      return true;
    } else if (route.endsWith('*')) {
      // Prefix wildcard match - match all routes that start with the prefix
      const prefix = route.slice(0, -1);
      return url.startsWith(prefix);
    } else if (route.startsWith('*')) {
      // Suffix wildcard match - match all routes that end with the suffix
      const suffix = route.slice(1);
      return url.endsWith(suffix);
    } else {
      // Exact match
      return url === route;
    }
  });
}

export function getRedirectUrlForLogin() {
  return `${Pages.LOGIN}?to=${get(page).url.pathname}`;
}