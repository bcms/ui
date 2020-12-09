<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {
    ArrowDownIcon,
    ArrowUpIcon,
    TrashIcon,
  } from '../icons';

  export { className as class };
  export let elementLength: number = 0;
  export let position: number;

  const dispatch = createEventDispatcher();
  let className = '';
</script>

<div class="entryEditor--prop entryEditor--prop_ARRAY_ITEM {className}">
  <div class="entryEditor--prop-header">
    <div class="entryEditor--prop-header-inner">
      <div class="entryEditor--prop-header-details">
        <div class="entryEditor--prop-header-label">Item {position + 1}</div>
      </div>
      <div class="entryEditor--prop-header-actions">
        {#if position > 0}
          <button
            on:click={() => {
              dispatch('move', { move: -1, position });
            }}>
            <ArrowUpIcon />
          </button>
        {/if}
        {#if position < elementLength - 1}
          <button
            on:click={() => {
              dispatch('move', { move: 1, position });
            }}>
            <ArrowDownIcon />
          </button>
        {/if}
        <button
          on:click={() => {
            dispatch('remove', { position });
          }}>
          <TrashIcon />
        </button>
      </div>
    </div>
  </div>
  <div class="entryEditor--prop_ARRAY_ITEM-content">
    <slot />
  </div>
</div>
