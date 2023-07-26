<script lang="ts">
	import { Button } from '$components/ui/button';
	import Icon from '@iconify/svelte';
	import { signIn } from '@auth/sveltekit/client';
	import { globalLoading } from '$lib/store';

	// used for redirect after authentication
	export let callbackPath: string | undefined = undefined;

	// handle login for various methods
	function handleLogin(method: string) {
		// setting global loading, so user don't wait for redirect
		$globalLoading = true;
		signIn(method, {
			// after successful authentication, user is sent here, by default on the same page
			callbackUrl: callbackPath ? window.location.origin + callbackPath : undefined
		});
	}
</script>

<div class="border rounded-md shadow p-5">
	<!-- Google Auth -->
	<Button
		on:click={() => handleLogin('google')}
		variant="ghost"
		class="w-full bg-white hover:bg-gray-300 text-black hover:text-black gap-2 border"
	>
		<Icon class="text-xl" icon="devicon:google" />
		Continue With Google
	</Button>
</div>
