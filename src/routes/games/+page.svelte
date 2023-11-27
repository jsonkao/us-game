<script>
	export let data;

	let { games } = data;
</script>

<div>
	{#each games as { id, created_at }}
		<p><a href="/games/{id}">Game {id}</a></p>
	{/each}
</div>

<style>
	div {
		max-width: 360px;
		margin: 100px auto;
	}

	p {
		margin-bottom: 10px;
	}
</style>
