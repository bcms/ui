<script lang="ts">
  import { createEventDispatcher, beforeUpdate } from 'svelte';
  import type { Prop } from '@becomes/cms-sdk';
  import Button from '../button.svelte';
  import { OverflowMenu, OverflowMenuItem } from '../overflow';

  export { className as class };
  export let prop: Prop;
  export let position: number;

  const dispatch = createEventDispatcher();
  let values = prop.value as Array<any>;
  let className = '';

  beforeUpdate(() => {
    values = prop.value as Array<any>;
  });
</script>

<div class="prop--array-wrapper-items-item {className}">
  <div class="prop--array-wrapper-items-item-top">
    <div class="label">Item {position + 1}</div>
    <div class="ml--auto">
      <OverflowMenu position="right">
        {#if position > 0}
          <OverflowMenuItem
            text="Move up"
            on:click={() => {
              dispatch('move', { move: -1, position, prop });
            }} />
        {/if}
        {#if position < values.length - 1}
          <OverflowMenuItem
            text="Move down"
            on:click={() => {
              dispatch('move', { move: 1, position, prop });
            }} />
        {/if}
        <OverflowMenuItem
          text="Remove"
          danger
          on:click={() => {
            dispatch('remove', { position, prop });
          }} />
      </OverflowMenu>
    </div>
  </div>
  <div class="prop--array-wrapper-items-item--content">
    <slot />
  </div>
</div>
