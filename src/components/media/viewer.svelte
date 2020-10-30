<script context="module" lang="ts">
  export const cache: Array<{
    id: string;
    b64: string;
  }> = [];
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Media, MediaType } from '@becomes/cms-sdk';
  import { GeneralService, sdk, StoreService } from '../../services';
  import { Breadcrumb } from '../index';
  import { MediaRemoveFileModal } from '../modals/media';

  export let media: Media[] = [];
  export let inModal: boolean = false;
  export let parentId: string = undefined;

  const dispatch = createEventDispatcher();

  let inModalSelectedMediaId: string = '';
  let sortValue = 0;

  async function remove(id: string) {
    dispatch('remove', id);
  }
  function mediaToBase64Image(media: Media) {
    GeneralService.errorWrapper(
      async () => {
        const cached = cache.find((e) => e.id === media._id);
        if (cached) {
          return { fromCache: true, b64: cached.b64 };
        }
        return {
          fromCache: false,
          b64: await sdk.media.getBinary(media._id, 'small'),
        };
      },
      async (data: { fromCache: boolean; b64: string | Buffer }) => {
        let b64: string;
        if (data.fromCache) {
          b64 = data.b64 as string;
        } else {
          b64 = GeneralService.b64.fromBuffer(data.b64 as Buffer);
          cache.push({
            id: media._id,
            b64,
          });
        }
        const el = document.getElementById(media._id);
        const fullB64 = `data:${media.mimetype};base64,${b64}`;

        el.setAttribute('src', fullB64);
        if (el.parentElement.tagName === 'A') {
          el.parentElement.setAttribute('href', fullB64);
        }
      }
    );
    return media._id;
  }
  function splitMedia(media: Media[]): Media[] {
    return [
      ...media.filter((e) => e.type === MediaType.DIR),
      ...media.filter((e) => e.type !== MediaType.DIR),
    ];
  }
  function sortMedia() {
    if (sortValue === 1) {
      sortValue = 0;
      media = media.sort((a, b) => (a.name > b.name ? -1 : 1));
    } else {
      sortValue = 1;
      media = media.sort((a, b) => (a.name > b.name ? 1 : -1));
    }
    media = splitMedia(media);
  }
  async function handleMediaClick(item: Media) {
    if (item.type === MediaType.DIR) {
      dispatch('open', item._id);
      return;
    }

    const buffer = await sdk.media.getBinary(item._id);

    const link = document.createElement('a');

    const blob = new Blob([buffer], { type: item.mimetype });
    const objectURL = URL.createObjectURL(blob);

    link.href = objectURL;
    link.href = URL.createObjectURL(blob);
    link.setAttribute('target', '_blank');

    if (item.size > 11572000) {
      link.download = item.name;
    }

    link.click();
  }
</script>

<div class="view--content">
  <div class="view--content-details">
    {#if parentId}
      <Breadcrumb {parentId} />
    {:else}
      <h2 class="view--title">Media manager</h2>
    {/if}
    {#if media.length > 0}
      <button
        on:click={sortMedia}
        class="media--sort-toggler {sortValue === 1 ? 'media--sort-toggler_asc' : ''}">
        <span class="mr--5">Name</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path
            fill-rule="evenodd"
            d="M12 4a1 1 0 011 1v14a1 1 0 11-2 0V5a1 1 0 011-1z"
            clip-rule="evenodd" />
          <path
            fill-rule="evenodd"
            d="M11.293 4.293a1 1 0 011.414 0l7 7a1 1 0 01-1.414 1.414L12 6.414l-6.293 6.293a1 1 0 01-1.414-1.414l7-7z"
            clip-rule="evenodd" />
        </svg>
      </button>
    {/if}
  </div>
  {#if media.length > 0}
    <ul class="media--list">
      {#each media as item}
        <li class="media--item media--item_{item.type}">
          <button
            class="media--item-click"
            title={item.name}
            on:click={() => {
              handleMediaClick(item);
            }}>
            {#if item.type !== MediaType.DIR}
              <div class="media--item-visual">
                <div class="media--item-visual-inner">
                  {#if item.type === MediaType.IMG}
                    <img id={mediaToBase64Image(item)} alt={item.name} />
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
                  StoreService.update('MediaRemoveFileModal', true);
                  inModalSelectedMediaId = item._id;
                }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
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
      {/each}
    </ul>
  {:else}
    <div>
      <h3 class="media--list_empty">There is no media to be displayed.</h3>
    </div>
  {/if}
  <MediaRemoveFileModal
    on:cancel={() => {
      inModalSelectedMediaId = '';
    }}
    on:done={() => {
      remove(inModalSelectedMediaId);
    }} />
</div>
