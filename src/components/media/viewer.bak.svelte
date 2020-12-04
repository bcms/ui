<script context="module" lang="ts">
  export const lastState = {
    mediaId: '',
  };
</script>

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
    NotificationService,
    sdk,
    StoreService,
  } from '../../services';
  import { Breadcrumb } from '../index';
  import { MediaAddUpdateFolderModal, MediaRemoveFileModal } from '../modals';
  import Select from '../input/select/select.svelte';
  import Button from '../button.svelte';
  import { Uppload, en, Local, Preview, Crop, Flip, Rotate } from 'uppload';
  import MediaItem from './item.svelte';
  import { DateInput } from '../input';
  import { navigate } from 'svelte-routing';
  export let mediaId: string;
  export let isItemSelect: boolean = false;
  interface MediaInView {
    dirs: Media[];
    files: Media[];
  }
  interface Filters {
    name: string;
    isOpen: boolean;
    options: Array<{
      label: string;
      dropdown?: {
        items: Array<{
          label: string;
          value: string;
        }>;
        selected: {
          label: string;
          value: string;
        };
      };
      date?: {
        year: number;
        month: number;
        day: number;
      };
    }>;
  }
  const mediaStoreUnsub = StoreService.subscribe(
    'media',
    async (value: Media[]) => {
      if (value) {
        mediaInView = applyFilters(await getMedia(value));
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
  let filters: Filters = getFiltersInitialValue();
  let selectedItem: Media;
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
      NotificationService.error(
        'Upload completed with errors.' +
          ' See console for more information.' +
          ' This files were not uploaded: ' +
          errors.map((e) => e.filename).join(', ')
      );
    } else {
      NotificationService.success('Files uploaded successfully.');
    }
    StoreService.update('media', await sdk.media.getAll());
    dispatch('file');
  }
  async function handleMediaClick(item: Media) {
    if (isItemSelect) {
      if (item.type === MediaType.DIR) {
        mediaId = item._id;
        lastState.mediaId = mediaId;
        mediaInView = await getMedia();
      } else {
        selectedItem = item;
        dispatch('selected', item);
      }
    } else {
      if (item.type === MediaType.DIR) {
        if (item._id) {
          navigate(`/dashboard/media/editor/${item._id}`, {
            replace: true,
          });
        } else {
          navigate('/dashboard/media/editor/-', {
            replace: true,
          });
        }
      } else {
        const buffer: Buffer = await GeneralService.errorWrapper(
          async () => {
            return await sdk.media.getBinary(item._id);
          },
          async (value: Buffer) => {
            return value;
          }
        );
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
    }
  }
  function applyFilters(media: MediaInView): MediaInView {
    const filter = (_items: Media[]): Media[] => {
      let items: Media[] = JSON.parse(JSON.stringify(_items));
      if (filters.name !== '') {
        items = items.filter((item) =>
          item.name.toLowerCase().includes(filters.name.trim().toLowerCase())
        );
      }
      filters.options.forEach((option) => {
        if (option.dropdown && option.dropdown.selected.value !== '') {
          items = items.filter(
            (item) => item.type === option.dropdown.selected.value
          );
        } else if (option.date && option.date.year !== -1) {
          items = items.filter((item) => {
            const date = new Date(item.updatedAt);
            return (
              date.getFullYear() === option.date.year &&
              date.getMonth() + 1 === option.date.month &&
              date.getDate() === option.date.day
            );
          });
        }
      });
      return items;
    };
    return {
      dirs: filter(media.dirs),
      files: filter(media.files),
    };
  }
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
  function getFiltersInitialValue(): Filters {
    return {
      name: '',
      isOpen: false,
      options: [
        {
          label: 'Type',
          dropdown: {
            items: [
              { label: 'Image', value: MediaType.IMG },
              { label: 'Video', value: MediaType.VID },
              { label: 'Directory', value: MediaType.DIR },
            ],
            selected: {
              label: 'No filters',
              value: '',
            },
          },
        },
        {
          label: 'Date Modified',
          date: {
            year: -1,
            month: -1,
            day: -1,
          },
        },
      ],
    };
  }
  async function resetFilters() {
    filters = getFiltersInitialValue();
    return await getMedia();
  }
  async function createFolder(name: string, parentId?: string) {
    if (parentId === '') {
      parentId = undefined;
    }
    await GeneralService.errorWrapper(
      async () => {
        await sdk.media.addDir({
          name,
          parentId,
        });
      },
      async () => {
        mediaInView = applyFilters(await getMedia());
        NotificationService.success('Folder successfully created.');
      }
    );
  }
  onMount(async () => {
    mediaInView = await getMedia();
    if (lastState.mediaId) {
      mediaId = lastState.mediaId;
    }
    if (mediaId) {
      navigate(`/dashboard/media/editor/${mediaId}`, {
        replace: true,
      });
    }
    const uploaderFunction: any = async (data: File[] | File) => {
      mediaInView = await resetFilters();
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
      lastState.mediaId = mediaId;
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
      on:keyup={async () => {
        mediaInView = applyFilters(await getMedia());
      }} />
    <button
      on:click={() => {
        filters.isOpen = !filters.isOpen;
      }}
      class="media--search-toggler {filters.isOpen ? 'media--search-toggler_active' : ''}">
      <i class="fas fa-chevron-down" />
    </button>
    {#if filters.isOpen}
      <div class="media--filters">
        {#each filters.options as option}
          <div class="media--filter">
            {#if option.dropdown}
              <Select
                placeholder="No filters"
                label={option.label}
                options={option.dropdown.items}
                selected={option.dropdown.selected.value}
                on:change={async (event) => {
                  option.dropdown.selected = event.detail;
                  mediaInView = applyFilters(await getMedia());
                }} />
            {:else if option.date}
              <DateInput
                label={option.label}
                value={option.date.year !== -1 ? `${option.date.year}-${option.date.month}-${option.date.day}` : ''}
                on:input={async (event) => {
                  if (event.detail === 0) {
                    option.date = { year: -1, month: -1, day: -1 };
                  } else {
                    const date = new Date(event.detail);
                    option.date.year = date.getFullYear();
                    option.date.month = date.getMonth() + 1;
                    option.date.day = date.getDate();
                  }
                  mediaInView = applyFilters(await getMedia());
                }} />
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <div class="view--right">
    <Button class="mr-20 uploadFileToggler">Upload file</Button>
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
      <Breadcrumb
        {mediaId}
        on:open={(event) => {
          handleMediaClick({
            _id: event.detail ? event.detail : undefined,
            type: MediaType.DIR,
            createdAt: 0,
            updatedAt: 0,
            hasChildren: false,
            isInRoot: false,
            mimetype: '',
            name: '',
            parentId: '',
            path: '',
            size: 0,
            userId: '',
          });
        }} />
    {:else}
      <h2 class="view--title">Media manager</h2>
    {/if}
    {#if mediaInView.dirs.length > 0 || mediaInView.files.length > 0}
      <button
        on:click={() => {
          mediaInView = sortMedia(mediaInView, true);
        }}
        class="media--sort-toggler {sortData.name.direction === 1 ? 'media--sort-toggler_asc' : ''}">
        <span class="mr-5">Name</span>
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
            handleMediaClick(item).catch((error) => {
              console.error(error);
            });
          }} />
      {/each}
      {#each mediaInView.files as item}
        <MediaItem
          {item}
          selected={selectedItem && selectedItem._id === item._id}
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
            NotificationService.success('Media successfully removed.');
          } );
      }
    }} />
</div>
<MediaAddUpdateFolderModal
  on:done={(event) => {
    createFolder(event.detail.name, mediaId ? mediaId : '');
  }} />
