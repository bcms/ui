<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { MediaAggregate } from '@becomes/cms-sdk';

  export let mediaFiles: MediaAggregate[] = [];
</script>

<div class="file-explorer">
  {#each mediaFiles as media}
    <div class="file-explorer--item" />
  {/each}
</div>
