<script lang="ts">
	import { Button } from '$components/ui/button';
	import { Pages } from '$lib/config';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: console.log(data);
</script>

<div class="w-full h-full p-3">
	<div class="flex justify-between">
		<h3>ChatPat</h3>
		<!-- actions -->
		<div class="flex gap-1">
			<!-- Incoming Partner Requests -->
			<div class="relative">
				<Button href={Pages.APP_INCOMING_PARTNER_REQUESTS} variant="secondary" class="p-2 h-full">
					<Icon icon="mdi:people" />
				</Button>
				<!-- badge -->
				{#if data.pendingPartnerRequests.length > 0}
					<div class="absolute -top-1 -right-1 bg-red-600 rounded-full p-1.5" />
				{/if}
			</div>
		</div>
	</div>

	<hr class="my-2" />
</div>
