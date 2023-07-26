<script lang="ts">
	import { page } from '$app/stores';
	import LoginCard from '$components/LoginCard.svelte';
	import { Pages } from '$lib/config';

	// if to query is provided, send user their after authentication
	$: toPath = $page.url.searchParams.get('to') ?? Pages.ROOT;
</script>

<div class="w-full h-full p-3 flex-center">
	<LoginCard callbackPath={toPath} />
</div>
