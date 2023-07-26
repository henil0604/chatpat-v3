<script>
	import { initializeGlobalChannel } from '$lib/pusher/initializeGlobalChannel';
	import { globalChannel } from '$lib/store/app';
	import { onDestroy } from 'svelte';
	import Header from './Header.svelte';
	import { page } from '$app/stores';

	// initialize global channel
	$globalChannel = initializeGlobalChannel();

	onDestroy(() => {
		// if global channel exists
		if ($globalChannel) {
			// disconnect
			$globalChannel.disconnect();
			// unsubscribe
			$globalChannel.unsubscribe();
			// unbind all events
			$globalChannel.unbind_all();
			// set as null
			$globalChannel = null;
			console.log('destroyed global channel');
		}
	});
</script>

<svelte:head>
	<meta name="referrer" content="no-referrer" />
</svelte:head>

<pre>
	{JSON.stringify($page.data, null, 2)}
</pre>
<div class="w-full h-full flex max-md:flex-col-reverse">
	<Header />
	<div class="w-full h-full grow p-2 py-3 max-md:p-0">
		<div class="rounded w-full h-full max-md:border-none">
			<slot />
		</div>
	</div>
</div>
