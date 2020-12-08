<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { CloseIcon } from '../../icons';

  export let item: string;

  const dispatch = createEventDispatcher();
</script>

<li>
  <button
    on:click={() => {
      dispatch('remove');
    }}>
    <CloseIcon />
  </button>
  <span>{item}</span>
</li>
