<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from './button.svelte';

  export let name: string;

  const dispacth = createEventDispatcher();
</script>

<div class="no-entities">
  <div class="no-entities--title">There are no entities available.</div>
  <Button
    class="mt--50"
    icon="fas fa-plus"
    on:click={() => {
      dispacth('action');
    }}>
    Add new {name}
  </Button>
</div>
