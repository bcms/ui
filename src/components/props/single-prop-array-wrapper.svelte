<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Prop } from '@becomes/cms-sdk';
  import Button from '../button.svelte';

  export { className as class };
  export let prop: Prop;
  export let showSlot = true;

  const dispatch = createEventDispatcher();
  let className = '';
</script>

<div class="entryEditor--prop_ARRAY-wrapper {className}">
  {#if showSlot}
    <div class="entryEditor--prop_ARRAY-inner">
      <slot />
    </div>
  {/if}
  <Button
    size="m"
    on:click={() => {
      dispatch('add');
    }}>
    Add new item to {prop.label}
  </Button>
</div>
