<script lang="ts">
  import {
    beforeUpdate,
    createEventDispatcher,
    onDestroy,
    onMount,
  } from 'svelte';
  import { Media, MediaType } from '@becomes/cms-sdk';
  import {
    GeneralService,
    MediaService,
    popup,
    sdk,
    StoreService,
  } from '../../services';
  import { Breadcrumb } from '../index';
  import { MediaRemoveFileModal } from '../modals';
  import Select from '../input/select/select.svelte';
  import { SelectItem } from '../input';
  import Button from '../button.svelte';
  import type { MediaViewFilter } from '../../types';
  import { Uppload, en, Local, Preview, Crop, Flip, Rotate } from 'uppload';
  import MediaItem from './item.svelte';

  export let mediaId: string;
  export let filterOptions: {
    isOpen: boolean;
    filters: MediaViewFilter[];
  } = undefined;

  interface MediaInView {
    dirs: Media[];
    files: Media[];
  }
  interface Filters {
    name: string;
  }

  const mediaStoreUnsub = StoreService.subscribe(
    'media',
    async (value: Media[]) => {
      if (value) {
        // media = splitMedia(applyFilters(await getMedia(value)));
      }
    }
  );
  const dispatch = createEventDispatcher();
  const buffer = {
    mediaId: !mediaId ? undefined : '' + mediaId,
  };
  let mediaInView: MediaInView = {
    dirs: [],
    files: [],
  };
  let sortData = {
    name: {
      direction: -1,
    },
  };
  let filters: Filters = {
    name: '',
  };

  function sortMedia(media: MediaInView, toggle?: boolean): MediaInView {
    if (toggle) {
      if (sortData.name.direction === -1) {
        sortData.name.direction = 1;
      } else {
        sortData.name.direction = -1;
      }
    }
    return {
      dirs: media.dirs.sort((a, b) =>
        a.name > b.name ? sortData.name.direction : -sortData.name.direction
      ),
      files: media.files.sort((a, b) =>
        a.name > b.name ? sortData.name.direction : -sortData.name.direction
      ),
    };
  }

  async function createFiles(mediaId: string, name: string, files: File[]) {
    const errors = await MediaService.createFiles(mediaId, name, files);
    if (errors.length > 0) {
      console.error(errors);
      popup.error(
        'Upload completed with errors.' +
          ' See console for more information.' +
          ' This files were not uploaded: ' +
          errors.map((e) => e.filename).join(', ')
      );
    } else {
      popup.success('Files uploaded successfully.');
    }
    StoreService.update('media', await sdk.media.getAll());
    dispatch('file');
  }
  async function handleMediaClick(item: Media) {
    if (item.type === MediaType.DIR) {
      dispatch('open', item._id);
      return;
    }

    // TODO: Add error wrapper
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
  async function applayFilters() {
    const filter = (items: Media[]): Media[] => {
      return items.filter((item) =>
        item.name.toLowerCase().includes(filters.name.trim().toLowerCase())
      );
    };
    const media = await getMedia();
    mediaInView = {
      dirs: filter(media.dirs),
      files: filter(media.files),
    };
  }
  // function applyFilters(_media: Media[]) {
  //   return _media.filter((e) => {
  //     if (!e.name.toLowerCase().includes(searchInput.trim().toLowerCase()))
  //       return false;

  //     // for (let i = 0; i < filterOptions.filters.length; i++) {
  //     //   const current = filterOptions.filters[i];
  //     //   if (current.value.value && current.value.value !== e.type) return false;
  //     // }

  //     return true;
  //   });
  // }
  // async function searchInputHandler(event: KeyboardEvent) {
  //   const element = event.target as HTMLInputElement;
  //   searchInput = element.value;
  //   applyFilters(await getMedia());
  // }

  async function getMedia(_media?: Media[]): Promise<MediaInView> {
    const output: MediaInView = {
      dirs: [],
      files: [],
    };
    if (_media) {
      if (mediaId) {
        _media
          .filter((e) => e.parentId === mediaId)
          .forEach((media) => {
            if (media.type === MediaType.DIR) {
              output.dirs.push(media);
            } else {
              output.files.push(media);
            }
          });
      } else {
        _media
          .filter((e) => e.isInRoot)
          .forEach((media) => {
            if (media.type === MediaType.DIR) {
              output.dirs.push(media);
            } else {
              output.files.push(media);
            }
          });
      }
    } else {
      const m: Media[] = await GeneralService.errorWrapper(
        async () => {
          if (mediaId) {
            return (await sdk.media.getAll()).filter(
              (e) => e.parentId === mediaId
            );
          }
          return (await sdk.media.getAll()).filter((e) => e.isInRoot);
        },
        async (value: Media[]) => {
          return value;
        }
      );
      if (m) {
        m.forEach((media) => {
          if (media.type === MediaType.DIR) {
            output.dirs.push(media);
          } else {
            output.files.push(media);
          }
        });
      }
    }
    return sortMedia(output);
  }

  onMount(async () => {
    mediaInView = await getMedia();

    const uploaderFunction: any = async (data: File[] | File) => {
      const filesArray: File[] = [];
      if (data instanceof Array) {
        for (let i = 0; i < data.length; i++) {
          filesArray.push(data[i]);
        }
      } else {
        filesArray.push(data);
      }

      const fileNameParts = filesArray[0].name.split('.');

      await createFiles(
        mediaId ? mediaId : '',
        GeneralService.string.toUri(
          fileNameParts.splice(0, fileNameParts.length - 1).join('.')
        ),
        filesArray
      );
      return '';
    };
    const uploader = new Uppload({
      lang: en,
      call: '.uploadFileToggler',
      multiple: true,
    });
    uploader.uploader = uploaderFunction;
    // Services
    [Crop, Flip, Rotate, Preview].forEach((service) => {
      uploader.use(new service());
    });

    uploader.use(
      new Local({
        maxFileSize: 100000000,
        mimeTypes: [
          'image/png',
          'image/jpg',
          'image/jpeg',
          'video/mp4',
          'image/svg+xml',
          'application/pdf',
          'application/x-javascript',
        ],
      })
    );
  });
  beforeUpdate(async () => {
    if (buffer.mediaId !== mediaId) {
      buffer.mediaId = !mediaId ? undefined : '' + mediaId;
      mediaInView = await getMedia();
    }
  });
  onDestroy(() => {
    mediaStoreUnsub();
  });
</script>

<header>
  <div class="media--search view--left">
    <i class="fas fa-search" />
    <input
      class="media--search-input"
      type="text"
      placeholder="Search"
      bind:value={filters.name}
      on:keyup={() => {
        applayFilters().catch((error) => {
          console.error(error);
        });
      }} />
    <button
      on:click={() => {
        filterOptions.isOpen = !filterOptions.isOpen;
      }}
      class="media--search-toggler {filterOptions.isOpen ? 'media--search-toggler_active' : ''}">
      <i class="fas fa-chevron-down" />
    </button>
    {#if filterOptions.isOpen}
      <div class="media--filters">
        {#each filterOptions.filters as filter}
          <div class="media--filter">
            <Select
              label={filter.label}
              on:change={(event) => {
                filter.value = { label: event.detail, value: event.detail };
              }}>
              <SelectItem text="No filters" value="" />
              {#each filter.options as option}
                <SelectItem
                  selected={filter.value.value === option.value}
                  text={option.label}
                  value={option.value} />
              {/each}
            </Select>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <div class="view--right">
    <Button class="mr--20 uploadFileToggler">Upload file</Button>
    <Button
      kind="secondary"
      on:click={() => {
        StoreService.update('MediaAddUpdateFolderModal', true);
      }}>
      Create new folder
    </Button>
  </div>
</header>
<div class="view--content">
  <div class="view--content-details">
    {#if mediaId}
      <Breadcrumb {mediaId} on:open />
    {:else}
      <h2 class="view--title">Media manager</h2>
    {/if}
    {#if mediaInView.dirs.length > 0 || mediaInView.files.length > 0}
      <button
        on:click={() => {
          mediaInView = sortMedia(mediaInView, true);
        }}
        class="media--sort-toggler {sortData.name.direction === 1 ? 'media--sort-toggler_asc' : ''}">
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
  {#if mediaInView.dirs.length > 0 || mediaInView.files.length > 0}
    <ul class="media--list">
      {#each mediaInView.dirs as item}
        <MediaItem
          {item}
          on:open={() => {
            dispatch('open', item._id);
          }} />
      {/each}
      {#each mediaInView.files as item}
        <MediaItem
          {item}
          on:open={() => {
            handleMediaClick(item).catch((error) => {
              console.error(error);
            });
          }} />
      {/each}
    </ul>
  {:else}
    <div>
      <h3 class="media--list_empty">There is no media to be displayed.</h3>
    </div>
  {/if}
  <MediaRemoveFileModal
    on:cancel={() => {}}
    on:done={async (event) => {
      if (event.detail) {
        await GeneralService.errorWrapper( async () => {
            await sdk.media.deleteById(event.detail);
          }, async () => {
            StoreService.update('media', await sdk.media.getAll());
            popup.success('Media successfully removed.');
          } );
      }
    }} />
</div>
