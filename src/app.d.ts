// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export declare module "@auth/core/types" {
	interface User {
		id?: string
		username?: string
		bio?: string
		gender?: string
		partners?: string[]
	}
	interface Session {
		user: {
			id?: string
			username?: string
			bio?: string
			gender?: string
			partners?: string[]
		} & DefaultSession['user'];
	}
}

export { };
