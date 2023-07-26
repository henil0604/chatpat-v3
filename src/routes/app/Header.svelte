<script>
	import { page } from '$app/stores';
	import { Button } from '$components/ui/button';
	import { Pages } from '$lib/config';
	import Icon from '@iconify/svelte';

	let tabs = [
		{
			icon: 'mdi:chat',
			href: Pages.APP,
			name: 'Chats'
		},
		{
			icon: 'mdi:search',
			href: Pages.APP_SEARCH,
			name: 'Search'
		},
		{
			icon: 'mdi:person',
			href: Pages.APP_PROFILE,
			name: 'Profile'
		}
	];
</script>

<div class="h-full w-fit p-2 py-3 max-md:w-full max-md:h-fit max-md:p-0">
	<!-- floating card -->
	<div
		class="w-full h-full border shadow-lg p-1 py-2 rounded max-md:rounded-none bg-secondary text-secondary-foreground flex flex-col max-md:flex-row justify-between gap-1"
	>
		<!-- head -->
		<div class="flex flex-col max-md:flex-row grow gap-1">
			{#each tabs as tab}
				<Button
					variant="nostyle"
					href={tab.href}
					class="w-full p-2 hover:bg-gray-700 hover:text-white max-md:text-xs {tab.href ==
					$page.url.pathname
						? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
						: ''}"
				>
					<div class="max-md:hidden">
						<Icon class="text-lg" icon={tab.icon} />
					</div>
					<div class="md:hidden">
						{tab.name}
					</div>
				</Button>
			{/each}
		</div>

		<!-- tail -->
		<!-- hidden in mobile -->
		<div class="max-md:hidden">
			<Button class="p-2 w-full" href="/app/settings"
				><Icon class="text-lg" icon="mdi:settings" /></Button
			>
		</div>
	</div>
</div>

<style lang="postcss">
	.tabButton {
		@apply w-full text-2xl;
	}
</style>
