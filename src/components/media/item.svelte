<script lang="ts">
  import { Media, MediaType } from '@becomes/cms-sdk';
  import { createEventDispatcher } from 'svelte';
  import { FileIcon, FolderIcon, TrashIcon } from '../icons';
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
            <FileIcon />
          {/if}
        </div>
      </div>
    {/if}
    <div class="media--item-footer">
      {#if item.type === MediaType.DIR}
        <FolderIcon class="media--item-icon" />
      {/if}
      <span class="media--item-name">{item.name}</span>
      <button
        class="media--item-delete"
        on:click|stopPropagation|preventDefault={() => {
          dispatch('remove', item);
        }}>
        <TrashIcon />
      </button>
    </div>
  </button>
</li>
