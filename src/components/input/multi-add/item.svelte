<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { CloseIcon } from '../../icons';

  export let item: string;
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();
</script>

<li class="_bcmsInput--multiAdd-item">
  <span class="_bcmsInput--multiAdd-label">{item}</span>
  <button
    class="_bcmsInput--multiAdd-delete"
    {disabled}
    aria-label="Remove {item}"
    on:click={() => {
      dispatch('remove');
    }}
  >
    <CloseIcon />
  </button>
  <div class="_bcmsInput--multiAdd-bg" />
</li>
