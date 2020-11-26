<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { OverflowMenu, OverflowMenuItem } from '../overflow';

  export { className as class };
  export let elementLength: number = 0;
  export let position: number;

  const dispatch = createEventDispatcher();
  let className = '';
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
              dispatch('move', { move: -1, position });
            }} />
        {/if}
        {#if position < elementLength - 1}
          <OverflowMenuItem
            text="Move down"
            on:click={() => {
              dispatch('move', { move: 1, position });
            }} />
        {/if}
        <OverflowMenuItem
          text="Remove"
          danger
          on:click={() => {
            dispatch('remove', { position });
          }} />
      </OverflowMenu>
    </div>
  </div>
  <div class="prop--array-wrapper-items-item--content">
    <slot />
  </div>
</div>
