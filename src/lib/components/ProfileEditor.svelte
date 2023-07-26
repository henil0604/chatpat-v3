<script lang="ts">
	import { Input } from '$components/ui/input';
	import { Label } from '$components/ui/label';
	import { trpc } from '$lib/trpc/client';
	import { debounce } from 'lodash-es';
	import { browser } from '$app/environment';
	import { Textarea } from '$components/ui/textarea';
	import { Button } from '$components/ui/button';
	import LoadingOverlay from '$components/LoadingOverlay.svelte';
	import { Pages, ResponseCodes } from '$lib/config';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	export let initialUsername: string = '';
	export let initialBio: string = '';
	export let initialGender: string = '';
	export let saveButtonText: string = 'Save';
	export let checkOnMount: boolean = true;

	const dispatch = createEventDispatcher();

	let loading = false;

	let error: string | null = null;

	let username = {
		value: initialUsername,
		inputHandler: debounce(async () => {
			// setting username input to touched as true
			username.touched = true;
			username.checking = true;

			// if username is empty set as invalid
			if (!username.value?.trim()) {
				username.valid = false;
				username.message = 'this can not be empty';
				username.checking = false;
				return;
			}

			if (username.value === initialUsername) {
				username.valid = true;
				username.message = '';
				username.checking = false;
				return;
			}

			// checking for existence
			let validResponse = await trpc().user.isUsernameValid.query({
				username: username.value
			});

			username.checking = false;
			username.valid = validResponse.data.valid;
			username.message = validResponse.message;
		}, 1000),
		valid: true,
		touched: false,
		checking: false,
		message: ''
	};

	let bio = {
		value: initialBio,
		inputHandler: debounce(async () => {
			// setting bio input to touched as true
			bio.touched = true;
			// initialize checking
			bio.checking = true;

			// if length of bio is greater than max length allowed
			if (bio.value.length > bio.maxLength) {
				bio.valid = false;
				bio.checking = false;
				bio.message = 'This is too much';
				return;
			}

			// everything is valid
			bio.valid = true;
			bio.message = '';
			bio.checking = false;
		}, 500),
		valid: true,
		touched: false,
		checking: false,
		message: '',
		maxLength: 256
	};

	let gender = {
		value: initialGender,
		valid: false
	};
	// if gender is selected, valid is true, else false
	$: gender.valid = gender.value ? true : false;

	if (browser) {
		(async () => {
			if (checkOnMount) {
				await username.inputHandler();
				await bio.inputHandler();
			}
		})();
	}

	// if (username or bio or gender is not valid)
	// or
	// (username or bio) is being checked
	// just disable submit button
	$: disabledSubmit =
		!username.valid || username.checking || !bio.valid || bio.checking || !gender.valid;

	// handle submit
	async function handleSubmit() {
		if (loading) return;

		loading = true;
		window.blur();

		await username.inputHandler();
		await bio.inputHandler();
		// flush remaining calls for input handlers
		await username.inputHandler.flush?.();
		await bio.inputHandler.flush?.();

		// if submit button was disabled, just ignore the submission
		// this means that user modified HTML or called this function manually
		// that would cause unexpected behaviors, so just ignore it
		if (disabledSubmit) {
			loading = false;
			return;
		}

		// send request through trpc client
		const response = await trpc().user.updateProfile.query({
			username: username.value,
			bio: bio.value,
			gender: gender.value
		});
		loading = false;

		if (response.code === ResponseCodes.DONE) {
			await invalidateAll();
			dispatch('saveSuccess', response);
			return;
		}

		error = response.message;
	}
</script>

<div class="flex flex-col">
	{#if error}
		<div class="flex items-center gap-2 border border-red-500 p-2 rounded-md">
			<Icon class="text-red-500" icon="material-symbols:error" />
			{error}
		</div>
	{/if}

	<div class="my-2" />

	<!-- username -->
	<div class="grid w-full items-center gap-1.5">
		<Label>Username</Label>
		<div class="w-full h-fit relative">
			<Input
				on:blur={() => username.inputHandler.flush()}
				bind:value={username.value}
				on:input={username.inputHandler}
				type="text"
				placeholder="eg. cicada3301"
				class="top-0 left-0 {!username.valid && username.touched ? 'border-red-500' : ''}"
				disabled={loading}
			/>
			<div class="absolute top-0 right-0 h-full flex-center p-3">
				{#if username.checking === true}
					<Icon icon="svg-spinners:eclipse-half" />
				{/if}
				{#if !username.checking && !username.valid}
					<Icon class="text-red-500" icon="material-symbols:error" />
				{/if}
				{#if !username.checking && username.valid}
					<Icon class="text-lime-500" icon="mdi:check" />
				{/if}
			</div>
		</div>
	</div>

	<div class="my-2" />

	<!-- bio -->
	<div class="grid w-full items-center gap-1.5">
		<Label>Bio</Label>
		<Textarea
			on:blur={() => bio.inputHandler.flush()}
			bind:value={bio.value}
			on:input={bio.inputHandler}
			type="text"
			maxLength={bio.maxLength}
			placeholder="Describe your self"
			class={!bio.valid && bio.touched ? 'border-red-500' : ''}
			disabled={loading}
		/>
		<div class="flex justify-between w-full text-xs">
			<p>
				{#if bio.checking === true}
					<p class="text-sm text-muted-foreground">Checking...</p>
				{/if}
				{#if !bio.checking && !bio.valid}
					<p class="text-sm text-red-500">{bio.message}</p>
				{/if}
				{#if !bio.checking && bio.valid}
					<p class="text-sm text-lime-500">{bio.message}</p>
				{/if}
			</p>
			<p class="text-muted-foreground">{bio.value.length}/{bio.maxLength}</p>
		</div>
	</div>

	<div class="my-2" />

	<!-- gender -->
	<div class="grid w-full items-center gap-1.5">
		<Label>Gender</Label>
		<div class="flex [&>*]:w-full border rounded-md overflow-hidden">
			<Button
				on:click={() => (gender.value = 'male')}
				class="rounded-none border-r"
				disabled={loading}
				variant={gender.value === 'male' ? 'default' : 'nostyle'}>Male</Button
			>
			<Button
				on:click={() => (gender.value = 'female')}
				class="rounded-none"
				disabled={loading}
				variant={gender.value === 'female' ? 'default' : 'nostyle'}>Female</Button
			>
		</div>
	</div>

	<div class="my-4" />

	<div class="w-full flex items-end justify-end h-full">
		<Button class="relative" on:click={handleSubmit} disabled={disabledSubmit}>
			{#if loading}
				<LoadingOverlay size={16} />
			{/if}
			{saveButtonText}
		</Button>
	</div>
</div>
