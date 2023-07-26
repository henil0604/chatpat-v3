<script lang="ts">
	import { Button } from '$components/ui/button';
	import { Pages } from '$lib/config';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import moment from 'moment';
	import { globalLoading, previousPagePath } from '$lib/store';
	import { trpc } from '$lib/trpc/client';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;
	$: console.log(data);

	async function acceptRequest(request: PageData['pendingPartnerRequests'][number]) {
		$globalLoading = true;

		const acceptResponse = await trpc().partnerRequest.acceptRequest.query({
			id: request.id
		});

		console.log('acceptResponse?', acceptResponse);
		await invalidateAll();

		$globalLoading = false;
	}

	async function declineRequest(request: PageData['pendingPartnerRequests'][number]) {
		$globalLoading = true;

		const declineResponse = await trpc().partnerRequest.declineRequest.query({
			id: request.id
		});

		console.log('declineResponse?', declineResponse);
		await invalidateAll();

		$globalLoading = false;
	}
</script>

<div class="w-full h-full p-3">
	<div class="flex w-fit gap-2">
		<Button href={$previousPagePath} variant="secondary" class="p-2 h-full">
			<Icon icon="ph:arrow-left-light" />
		</Button>
		<h4>Pending Requests</h4>
	</div>

	<hr class="my-3" />
	<div class="grid results gap-2">
		{#each data.pendingPartnerRequests as partnerRequest}
			<div
				class="w-full h-fit px-3 py-3 flex justify-between items-center gap-3 border rounded-md cursor-pointer hover:bg-secondary hover:text-secondary-foreground"
			>
				<!-- head -->
				<a href="{Pages.APP_USER}/{partnerRequest.sentBy.username}" class="flex grow gap-3">
					<!-- image -->
					<img class="w-[40px] rounded-full" src={partnerRequest.sentBy.image} alt="" />

					<div class="flex flex-col">
						<h6>@{partnerRequest.sentBy.username}</h6>
						<p class="text-xs text-muted-foreground">
							{moment(partnerRequest.createdAt).fromNow()}
						</p>
					</div>
				</a>
				<!-- tail -->
				<div class="flex-center gap-2 min-h-full">
					<!-- accept -->
					<Button on:click={() => acceptRequest(partnerRequest)} class="h-9">Accept</Button>
					<!-- decline -->
					<Button
						on:click={() => declineRequest(partnerRequest)}
						variant="destructive"
						class="h-9 p-2"
					>
						<Icon icon="mdi:close" />
					</Button>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss" scoped>
	.results {
		grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
	}
</style>
