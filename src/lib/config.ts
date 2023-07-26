// Protected routes that requires authentication before accessing
export const ProtectedRoutes = [
    "/app*"
]

// Pages with their name and path
export const Pages = {
    ROOT: '/',
    LOGIN: '/auth',
    ON_BOARDING: '/onboarding',
    APP: '/app',
    APP_SEARCH: '/app/search',
    APP_PROFILE: '/app/profile',
    APP_USER: '/app/u',
    APP_INCOMING_PARTNER_REQUESTS: '/app/incoming-requests'
}

export const Email = "chatpat@henil.xyz";
export const Links = {
    Twitter: 'https://twitter.com/realchatpat',
    Email: `mailto:${Email}`
}

export const ResponseCodes = {
    INVALID_INPUT: 'INVALID_INPUT',
    DONE: 'DONE',
    EMPTY_INPUT: 'EMPTY_INPUT',
    ERROR: 'ERROR',
    CAN_NOT_BE_USED: 'CAN_NOT_BE_USED',
    CAN_BE_USED: 'CAN_BE_USED',
    INVALID_REQUEST: 'INVALID_REQUEST',
    NOT_FOUND: 'NOT_FOUND'
} as const

export type ListOfResponseCodes = typeof ResponseCodes[keyof typeof ResponseCodes];