<script lang="ts">
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { Input } from '$components/ui/input';
	import { debounce } from 'lodash-es';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { trpc } from '$lib/trpc/client';
	import { Pages, ResponseCodes } from '$lib/config';
	import { previousPagePath } from '$lib/store';
	import { Button } from '$components/ui/button';

	export let data: PageData;

	const MaxBioTextLength = 36;

	let results: { id: string; name: string; username: string; bio: string; image: string }[] = [];

	let search = {
		value: 'e',
		inputHandler: debounce(async () => {
			console.log('searching:', search.value);
			if (search.value.trim() === '') {
				results = [];
				return;
			}

			search.searching = true;

			const resultResponse = await trpc().user.search.query({
				searchString: search.value
			});

			if (resultResponse.code == ResponseCodes.DONE) {
				results = resultResponse.data;
				// remove the client
				results = results.filter((result) => {
					return result.username != data.session?.user.username;
				});
			}

			search.searching = false;
		}, 500),
		searching: false
	};

	if (browser) {
		search.inputHandler();
	}
</script>

<div class="w-full h-full p-3">
	<div class="flex w-fit gap-2">
		<Button href={Pages.APP} variant="secondary" class="p-2 h-full">
			<Icon icon="ph:arrow-left-light" />
		</Button>
		<h4>Search</h4>
	</div>

	<hr class="my-2 mb-2" />
	<div class="w-full flex flex-col">
		<!-- search input -->
		<div class="w-full flex md:justify-end">
			<div class="max-md:w-full h-fit relative">
				<div class="absolute top-0 left-0 h-full flex-center p-3">
					<Icon class="text-lg" icon="mdi:search" />
				</div>
				<Input
					on:blur={() => search.inputHandler.flush()}
					bind:value={search.value}
					on:input={search.inputHandler}
					type="search"
					class="rounded-full min-w-[300px] pl-10 bg-secondary text-secondary-foreground"
					placeholder="photographer"
				/>
			</div>
		</div>
		<div class="my-2" />
		<!-- results -->
		{#if search.searching}
			<div class="w-full text-muted-foreground text-center my-2">searching...</div>
		{/if}
		{#if results.length === 0 && !search.searching}
			<div class="w-full text-muted-foreground text-center">Search something</div>
		{/if}
		<div class="grid searchResults gap-2">
			{#each results as user}
				<a
					class="w-full h-fit px-3 py-3 flex items-center gap-3 border rounded-md cursor-pointer hover:bg-secondary hover:text-secondary-foreground"
					href="{Pages.APP_USER}/{user.username}"
				>
					<!-- image -->
					<img class="w-[30px] rounded-full" src={user.image} alt="" />

					<div class="flex flex-col">
						<h6>@{user.username}</h6>
						<p class="text-xs text-muted-foreground">
							{user.bio.slice(0, MaxBioTextLength)}{user.bio.length > MaxBioTextLength ? '...' : ''}
						</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>

<style lang="postcss" scoped>
	.searchResults {
		grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
	}
</style>
