<script lang="ts">
	import { page } from '$app/stores';
	import ProfileEditor from '$components/ProfileEditor.svelte';

	$: user = $page.data.session?.user!;
</script>

<div class="w-full h-full p-3">
	<h3>Profile</h3>
	<hr class="my-2 mb-4" />
	<div class="w-full flex gap-4 max-md:flex-col max-md:items-center p-3 max-md:p-1">
		<!-- image -->
		<img
			src={user?.image}
			class="w-[150px] h-[150px] max-md:w-[100px] max-md:h-[100px] rounded-full"
			alt=""
		/>

		<div class="w-[400px] max-md:w-full flex gap-2 flex-col px-5 max-md:px-0 max-md:py-5">
			<!-- username -->
			<ProfileEditor
				initialUsername={user?.username}
				initialBio={user?.bio}
				initialGender={user?.gender}
				checkOnMount={false}
			/>
		</div>
	</div>
</div>
