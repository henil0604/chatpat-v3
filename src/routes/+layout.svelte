<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { navigating } from '$app/stores';
	import LoadingOverlay from '$components/LoadingOverlay.svelte';
	import { Pages } from '$lib/config';
	import { initializeGlobalChannel } from '$lib/pusher/initializeGlobalChannel';
	import { globalLoading, globalUser, previousPagePath } from '$lib/store';
	import { globalChannel } from '$lib/store/app';
	import { onDestroy } from 'svelte';
	import '../app.postcss';
	import type { PageData } from './$types';

	export let data: PageData;

	$globalUser = data.session?.user || null;

	beforeNavigate(() => {
		$globalLoading = true;
	});

	afterNavigate(({ from }) => {
		$previousPagePath = from?.url.href || Pages.APP;
		$globalLoading = false;
	});
</script>

{#if $globalLoading}
	<LoadingOverlay />
{/if}

<slot />
