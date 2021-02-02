<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { TrashIcon } from '../../icons';
  import Image from '../../image.svelte';

  export { className as class };
  export let value = '';
  export let invalidText = '';

  const dispatch = createEventDispatcher();
  let className = '';
</script>

<div
  class="bcmsMedia--inner {invalidText && !value ? 'bcmsMedia--inner_isError' : ''}
    {className}">
  {#if value !== ''}
    <button on:click class="bcmsMedia--details">
      <div class="bcmsMedia--details-visual">
        <Image href={value} data-src={value} alt="" />
      </div>
      <div class="bcmsMedia--details-info">
        <div class="bcmsMedia--path">{value}</div>
        <div class="bcmsMedia--details-cta">Click to select another media</div>
      </div>
    </button>
    <button
      aria-label="clear"
      class="bcmsMedia--actions"
      on:click={() => {
        dispatch('clear');
      }}>
      <TrashIcon />
    </button>
  {:else}
    <button on:click class="bcmsMedia--details">
      <div class="bcmsMedia--details-cta">
        {invalidText ? 'Media file is required. Please select one' : 'Click to select a media'}
      </div>
    </button>
  {/if}
</div>
