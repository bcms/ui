<script lang="ts">
  import { Media, MediaType } from '@becomes/cms-sdk';
  import { beforeUpdate, createEventDispatcher, onMount } from 'svelte';
  import { GeneralService, sdk } from '../../../services';
  import { FileIcon, LinkIcon, TrashIcon } from '../../icons';
  import Image from '../../image.svelte';
  import Link from '../../link.svelte';

  export { className as class };
  export let value = '';
  export let invalidText = '';

  const dispatch = createEventDispatcher();
  let className = '';
  let media: Media | undefined;
  let valueBuffer = '' + value;

  function isFileImage(src: string): boolean {
    return /\.(gif|jpe?g|tiff?|png|webp|bmp|svg)$/i.test(src);
  }
  async function loadMedia() {
    if (value) {
      const mediaFiles: Media[] = await GeneralService.errorWrapper(
        async () => {
          return await sdk.media.getAll();
        },
        async (value: Media[]) => {
          return value;
        }
      );
      if (mediaFiles) {
        const _media = mediaFiles.find(
          (e) => (e.path + '/' + e.name).replace(/\/\//g, '/') === value
        );
        if (_media) {
          media = _media;
        }
      }
    } else {
      media = undefined;
    }
  }
  function onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'A') {
      dispatch('click', event);
    }
  }

  onMount(async () => {
    await loadMedia();
  });
  beforeUpdate(async () => {
    if (valueBuffer !== value) {
      valueBuffer = '' + value;
      loadMedia();
    }
  });
</script>

<div
  class="bcmsMedia--inner {invalidText && !value
    ? 'bcmsMedia--inner_isError'
    : ''}
    {className}"
>
  {#if value !== ''}
    <button on:click={onClick} class="bcmsMedia--details">
      <div class="bcmsMedia--details-visual">
        {#if isFileImage(value)}
          <Image src={value} data-src={value} alt="" />
        {:else}
          <FileIcon />
        {/if}
      </div>
      <div class="bcmsMedia--details-info">
        <div class="bcmsMedia--path">{value}</div>
        <div class="bcmsMedia--details-cta">Click to select another media</div>
      </div>
    </button>
    {#if media}
      <Link
        href="/dashboard/media/editor/{media.isInRoot
          ? '-'
          : media.parentId}?search={encodeURIComponent(media.name)}"
        on:click={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        class="bcmsMedia--actions"><LinkIcon /></Link
      >
    {/if}
    <button
      aria-label="clear"
      class="bcmsMedia--actions"
      on:click={() => {
        dispatch('clear');
      }}
    >
      <TrashIcon />
    </button>
  {:else}
    <button on:click class="bcmsMedia--details">
      <div class="bcmsMedia--details-cta">
        {invalidText
          ? 'Media file is required. Please select one'
          : 'Click to select a media'}
      </div>
    </button>
  {/if}
</div>
