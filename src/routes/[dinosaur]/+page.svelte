<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let dinosaur = data.dinosaur;
</script>

<div>
  <h1>{dinosaur.name}</h1>
  <p>{dinosaur.description}</p>
  <a href="/">🠠 Back to all dinosaurs</a>
</div>
