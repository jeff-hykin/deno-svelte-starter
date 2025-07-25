<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let dinosaurs = data.dinosaurs;
</script>

<main>
  <h1>🦕 Dinosaur app</h1>
  <p>Click on a dinosaur below to learn more.</p>
  {#each dinosaurs as dinosaur (dinosaur.name)}
    <a href="/{dinosaur.name.toLowerCase()}" class="btn-primary">
      {dinosaur.name}
    </a>
  {/each}
</main>
