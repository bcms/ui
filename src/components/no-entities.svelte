<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from './button.svelte';

  export let name: string;

  const dispacth = createEventDispatcher();
</script>

<div class="no-entities">
  <div class="no-entities--title">There are no entities available.</div>
  <Button
    on:click={() => {
      dispacth('action');
    }}>
    Add new {name.toLowerCase()}
  </Button>
</div>
