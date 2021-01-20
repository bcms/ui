<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { CloseIcon } from '../../icons';

  export let item: string;
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();
</script>

<li>
  <button
    title={item}
    {disabled}
    on:click={() => {
      dispatch('remove');
    }}>
    <span>{item}</span>
    <CloseIcon />
  </button>
</li>
