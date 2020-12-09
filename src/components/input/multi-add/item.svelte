<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { CloseIcon } from '../../icons';

  export let item: string;

  const dispatch = createEventDispatcher();
</script>

<li>
  <button
    title={item}
    on:click={() => {
      dispatch('remove');
    }}>
    <span>{item}</span>
    <CloseIcon />
  </button>
</li>
