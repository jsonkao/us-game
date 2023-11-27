<script lang="ts">
	export let href: string;
	export let justify = 'space-between';
</script>

<a {href} class="card" style="justify-content: {justify}">
	<slot />
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 15px;
		align-items: center;
		width: var(--home-card-size);
		height: var(--home-card-size);
		background-color: white;
		border-radius: 5px;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
		text-decoration: none;
		color: inherit;
		transition: box-shadow 0.3s ease;
	}

	.card:hover {
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
	}
</style>
