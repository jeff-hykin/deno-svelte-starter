<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	
	interface Dinosaur {
		name: string;
		description: string;
	}
	
	let dinosaur: Dinosaur = { name: '', description: '' };
	let selectedDinosaur: string;
	
	$: selectedDinosaur = $page.params.selectedDinosaur;
	
	onMount(async () => {
		const resp = await fetch(`/api/dinosaurs/${selectedDinosaur}`);
		const dino = await resp.json();
		dinosaur = dino;
	});
	
	$: if (selectedDinosaur) {
		fetch(`/api/dinosaurs/${selectedDinosaur}`)
			.then(resp => resp.json())
			.then(dino => dinosaur = dino);
	}
</script>

<div>
	<h1>{dinosaur.name}</h1>
	<p>{dinosaur.description}</p>
	<a href="/">🠠 Back to all dinosaurs</a>
</div>
