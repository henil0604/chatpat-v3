<script lang="ts">
	import { Input } from '$components/ui/input';
	import { Label } from '$components/ui/label';
	import type { PageData } from './$types';
	import { trpc } from '$lib/trpc/client';
	import { debounce } from 'lodash-es';
	import { browser } from '$app/environment';
	import { Textarea } from '$components/ui/textarea';
	import { Button } from '$components/ui/button';
	import LoadingOverlay from '$components/LoadingOverlay.svelte';
	import { Pages, ResponseCodes } from '$lib/config';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import ProfileEditor from '$components/ProfileEditor.svelte';

	export let data: PageData;

	function onSaveSuccess() {
		goto($page.url.searchParams.get('to') || Pages.APP, {
			invalidateAll: true
		});
	}
</script>

<div class="h-full flex-center">
	<div
		class="flex flex-col border rounded-lg shadow-lg p-4 max-md:border-none max-md:w-full max-md:h-full relative"
	>
		<h2>Welcome, <span class="text-accent">{data.session?.user.name}</span>!</h2>
		<hr class="my-2" />
		<p class="text-muted-foreground">Before you continue, you will have to setup your profile</p>
		<div class="my-3" />

		<ProfileEditor
			initialUsername={$page.data.session?.user.email?.split('@')[0] || ''}
			saveButtonText="Let's Go!"
			on:saveSuccess={onSaveSuccess}
		/>
	</div>
</div>
