<script lang="ts">
	import Board from '$lib/components/Board.svelte';

	import type { PageData } from './$types';
	
	export let data: PageData;
</script>

<Board {data} />
