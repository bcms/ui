<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Prop } from '@becomes/cms-sdk';
  import Button from '../button.svelte';

  export { className as class };
  export let prop: Prop;

  const dispatch = createEventDispatcher();
  let className = '';
</script>

<div class="prop--array-wrapper {className}">
  <div class="prop--array-wrapper-items">
    <slot />
  </div>
  <Button
    class="ml--auto mr--auto mt--10"
    kind="ghost"
    icon="fas fa-plus"
    on:click={() => {
      dispatch('add');
    }}>
    Add new item to {prop.label}
  </Button>
</div>
