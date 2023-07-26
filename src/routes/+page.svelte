<script lang="ts">
	import { Button } from '$components/ui/button';
	import { Links, Pages } from '$lib/config';
	import { getRedirectUrlForLogin } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>ChatPat</title>
</svelte:head>

<div class="area-full flex flex-col items-center">
	<!-- Header -->

	<div class="p-4 max-md:p-0 w-full flex-center">
		<div
			class="min-w-[400px] max-md:min-w-full flex gap-1 justify-between items-center shadow-md hover:shadow-lg transition-all px-3 py-2 max-md:px-2 max-md:py-1 w-fit h-fit rounded-lg max-md:rounded-none backdrop-blur-sm border"
		>
			<div class="head grow-0">
				<!-- TODO: Use Logo -->
				<!-- <Button variant="ghost" class="text-2xl bg-white hover:text-black hover:bg-gray-200" href="/"> -->
				<img class="px-2 min-w-[40px] h-[40px]" src="/logo.png" alt="C" />
				<!-- </Button> -->
			</div>
			<div class="grow px-2 pr-10 flex gap-1 justify-start p-0" />
			<div class="tail grow-0 flex-center gap-1">
				<Button href={Links.Email} variant="nostyle" class="p-2 bg-red-500 text-white text-lg"
					><Icon icon="mdi:mail" /></Button
				>
				<Button
					href={Links.Twitter}
					target="_blank"
					variant="nostyle"
					class="p-2 bg-blue-500 text-white text-lg"><Icon icon="mdi:twitter" /></Button
				>
			</div>
		</div>
	</div>

	<!-- Body -->
	<div class="grow p-14 area-full">
		<!--  -->
		<div class="flex-center flex-col">
			<h1 class="text-7xl">ChatPat</h1>
			<h4 class="text-center italic">Flavor of Privacy</h4>

			<div class="my-5" />
			<Button href={Pages.APP} variant="default" size="lg">
				{#if data.session}
					Continue as
					{#if data.session.user.username}{data.session.user.username}{:else}<img
							class="ml-3 w-[30px] rounded-full"
							src={data.session.user.image}
							alt=""
						/>
					{/if}
				{:else}Open App{/if}
			</Button>
		</div>
	</div>

	<!-- Footer -->
	<div class="flex">
		<!--  -->
	</div>
</div>
