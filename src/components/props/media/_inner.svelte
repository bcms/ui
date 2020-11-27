<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Image from '../../image.svelte';

  export { className as class };
  export let value: string = '#';

  const dispatch = createEventDispatcher();
  let className = '';
</script>

<div class="bcmsMedia--inner">
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
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M2 6a1 1 0 011-1h18a1 1 0 110 2H3a1 1 0 01-1-1z"
          fill="#000" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10 3a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1h-4zm7 2V4a3 3 0 00-3-3h-4a3 3 0 00-3 3v1H5a1 1 0 00-1 1v14a3 3 0 003 3h10a3 3 0 003-3V6a1 1 0 00-1-1h-2zM6 7v13a1 1 0 001 1h10a1 1 0 001-1V7H6z"
          fill="#000" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10 10a1 1 0 011 1v6a1 1 0 11-2 0v-6a1 1 0 011-1zM14 10a1 1 0 011 1v6a1 1 0 11-2 0v-6a1 1 0 011-1z"
          fill="#000" /></svg>
    </button>
  {:else}
    <button on:click  class="bcmsMedia--details">
      <div class="bcmsMedia--details-cta">Click to select a media</div>
    </button>
  {/if}
</div>
