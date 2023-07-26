<script lang="ts">
	import Icon from '@iconify/svelte';

	export let size = 28;
</script>

<div class="absolute top-0 right-0 w-full h-full flex-center backdrop-blur-md z-[1] cursor-wait">
	<Icon style="font-size: {size}px;" icon="svg-spinners:eclipse-half" />
</div>
