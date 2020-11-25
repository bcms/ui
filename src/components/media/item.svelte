<script lang="ts">
  import { Media, MediaType } from '@becomes/cms-sdk';
  import { createEventDispatcher } from 'svelte';
import Image from '../image.svelte';

  export let selected: boolean = false;
  export let item: Media;

  const dispatch = createEventDispatcher();
</script>

<li
  class="media--item media--item_{item.type}
    {selected ? 'media--item_selected' : ''}">
  <button
    class="media--item-click"
    title={item.name}
    on:click={() => {
      dispatch('open');
    }}>
    {#if item.type !== MediaType.DIR}
      <div class="media--item-visual">
        <div class="media--item-visual-inner">
          {#if item.type === MediaType.IMG}
            <Image media={item} alt={item.name} />
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <path
                fill-rule="evenodd"
                d="M3.879 1.879A3 3 0 016 1h8a1 1 0 01.707.293l6 6A1 1 0 0121 8v12a3 3 0 01-3 3H6a3 3 0 01-3-3V4a3 3 0 01.879-2.121zM6 3a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V8.414L13.586 3H6z"
                clip-rule="evenodd" />
              <path
                fill-rule="evenodd"
                d="M14 1a1 1 0 011 1v5h5a1 1 0 110 2h-6a1 1 0 01-1-1V2a1 1 0 011-1z"
                clip-rule="evenodd" />
              <path
                fill-rule="evenodd"
                d="M7 13a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1z"
                clip-rule="evenodd" />
              <path
                fill-rule="evenodd"
                d="M7 17a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1z"
                clip-rule="evenodd" />
              <path
                fill-rule="evenodd"
                d="M7 9a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1z"
                clip-rule="evenodd" />
            </svg>
          {/if}
        </div>
      </div>
    {/if}
    <div class="media--item-footer">
      {#if item.type === MediaType.DIR}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="media--item-icon">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v11z" />
        </svg>
      {/if}
      <span class="media--item-name">{item.name}</span>
      <button
        class="media--item-delete"
        on:click|stopPropagation|preventDefault={() => {
          dispatch('delete');
        }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path
            fill-rule="evenodd"
            d="M2 6a1 1 0 011-1h18a1 1 0 110 2H3a1 1 0 01-1-1z"
            clip-rule="evenodd" />
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1h-4zm7 2V4a3 3 0 00-3-3h-4a3 3 0 00-3 3v1H5a1 1 0 00-1 1v14a3 3 0 003 3h10a3 3 0 003-3V6a1 1 0 00-1-1h-2zM6 7v13a1 1 0 001 1h10a1 1 0 001-1V7H6z"
            clip-rule="evenodd" />
          <path
            fill-rule="evenodd"
            d="M10 10a1 1 0 011 1v6a1 1 0 11-2 0v-6a1 1 0 011-1z"
            clip-rule="evenodd" />
          <path
            fill-rule="evenodd"
            d="M14 10a1 1 0 011 1v6a1 1 0 11-2 0v-6a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </button>
</li>
