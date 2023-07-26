<script lang="ts">
	import { upperFirst } from 'lodash-es';
	import type { PageData } from './$types';
	import { Pages } from '$lib/config';
	import { Button } from '$components/ui/button';
	import { page } from '$app/stores';
	import { trpc } from '$lib/trpc/client';
	import { goto, invalidateAll } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import LoadingOverlay from '$components/LoadingOverlay.svelte';
	import { previousPagePath } from '$lib/store';
	import { globalChannel } from '$lib/store/app';

	$: console.log($page.data);

	$: userInfo = $page.data.userInfo as NonNullable<PageData['userInfo']>;
	$: partnerRequest = $page.data.partnerRequest as PageData['partnerRequest'];

	$: isYourPartner = $page.data.userInfo?.partners.includes(
		$page.data.session?.user.username || ''
	);

	let MaxBioTextLength = 30;
	let BioReadMoreEnabled = false;
	let partnerRequestActionLoading = false;

	async function handleRemovePartner() {
		console.log('remove');
		partnerRequestActionLoading = true;

		const requestResponse = await trpc().user.removePartner.query({
			username: userInfo.username
		});

		// invalidate all the data
		await invalidateAll();

		partnerRequestActionLoading = false;
	}

	async function handleAddPartner() {
		console.log('add');
		partnerRequestActionLoading = true;

		const requestResponse = await trpc().partnerRequest.add.query({
			username: userInfo.username
		});

		console.log(requestResponse);

		await invalidateAll();

		console.log(`client-${userInfo.username}-new-chat-partner-request`);
		// send a client pusher event to the requested user
		$globalChannel?.trigger(`client-${userInfo.username}-new-chat-partner-request`, {
			sentBy: $page.data.session?.user.username
		});

		partnerRequestActionLoading = false;
	}
</script>

<div class="w-full h-full p-3 px-4">
	<!-- title -->
	<div class="flex w-fit gap-2">
		<Button href={$previousPagePath} variant="secondary" class="p-2 h-full">
			<Icon icon="ph:arrow-left-light" />
		</Button>
		<h4>{userInfo?.username}</h4>
	</div>

	<hr class="my-2" />

	<div class="w-fit max-md:w-full">
		<div class="mt-5 flex gap-5">
			<img class="w-[120px] h-[120px] rounded-full" src={userInfo.image} alt="" />
			<div class="flex flex-col">
				<h4>{userInfo.name}</h4>

				<p class="text-muted-foreground text-[11px]">
					{upperFirst(userInfo.gender || 'Unknown Gender')}
				</p>
				<div class="my-1" />
				<div class="whitespace-pre-line text-sm">
					{userInfo.bio.slice(0, !BioReadMoreEnabled ? MaxBioTextLength : undefined)}{userInfo.bio
						.length > MaxBioTextLength && !BioReadMoreEnabled
						? '...'
						: ''}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					{#if userInfo.bio.length > MaxBioTextLength}
						<div
							class="cursor-pointer hover:underline text-muted-foreground text-xs w-fit"
							on:click={() => (BioReadMoreEnabled = !BioReadMoreEnabled)}
						>
							{BioReadMoreEnabled ? 'Show Less' : 'Read More'}
						</div>
					{/if}
				</div>
			</div>
		</div>
		<div class="my-5" />
		<div class="w-full flex items-center justify-between gap-3">
			<a class="min-w-fit" href="{Pages.APP_USER}/{userInfo.username}/partners">
				<b>{userInfo.partners.length}</b> Partner{userInfo.partners.length > 1 ? 's' : ''}
			</a>
			<div class="w-fit relative">
				{#if partnerRequestActionLoading}
					<LoadingOverlay />
				{/if}
				{#if partnerRequest && partnerRequest.status === 'pending'}
					<Button disabled class="w-fit gap-1 flex-center" variant="secondary"
						><Icon icon="mdi:clock" />Pending</Button
					>
				{:else}
					<Button
						class="w-fit"
						on:click={isYourPartner ? handleRemovePartner : handleAddPartner}
						variant={isYourPartner ? 'destructive' : 'secondary'}
					>
						{isYourPartner ? 'Remove' : 'Add'}
					</Button>
				{/if}
			</div>
		</div>
	</div>
</div>
