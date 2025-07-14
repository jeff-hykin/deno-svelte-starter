<script lang="ts">
	import { onMount } from 'svelte';
	
	interface Dinosaur {
		name: string;
		description: string;
	}
	
	let dinosaurs: Dinosaur[] = [];
	
	onMount(async () => {
		const response = await fetch('/api/dinosaurs/');
		const allDinosaurs = await response.json();
		dinosaurs = allDinosaurs;
	});
</script>

<main>
	<h1>🦕 Dinosaur app</h1>
	<p>Click on a dinosaur below to learn more.</p>
	{#each dinosaurs as dinosaur (dinosaur.name)}
		<a href="/{dinosaur.name.toLowerCase()}" class="dinosaur">
			{dinosaur.name}
		</a>
	{/each}
</main>
