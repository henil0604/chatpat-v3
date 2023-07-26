import { isProtectedRoute } from "$lib/utils";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { Pages } from "$lib/config";

export const load: LayoutServerLoad = async ({ locals, url }) => {
    // checking if route is protected
    const isProtected = isProtectedRoute(url.pathname);
    // getting session
    const session = await locals.getSession();

    // if the route is protected and user is not logged in
    // throw redirect to login page
    if (
        url.pathname.startsWith(Pages.LOGIN) === false // if the user is going to login and not logged in, just ignore session checking
        && isProtected
        && !session
    ) {
        // "to" is a query param
        // if user is coming of /dashboard, user will be redirected to /login?to=/dashboard
        // so when user is authenticated, user is sent to /dashboard
        const toPath = url.pathname;
        throw redirect(307, `${Pages.LOGIN}?to=${toPath}`);
    }

    // if the route is protected and user is logged in
    // but user does not have username
    // throw redirect to onboarding page
    if (
        url.pathname.startsWith(Pages.ON_BOARDING) === false // if user is going to the onboarding page, just ignore it
        && isProtected
        && session
        && !session?.user.username
    ) {
        const toPath = url.pathname;
        throw redirect(307, `${Pages.ON_BOARDING}?to=${toPath}`);
    }

    // if user is going to onboarding
    // and user has already filled user profile
    // throw redirect to "to" param or send them to App Route
    if (url.pathname.startsWith(Pages.ON_BOARDING) && session?.user.username) {
        throw redirect(307, url.searchParams.get("to") || Pages.APP)
    }

    return {
        // send session to all pages
        session: session
    }
};