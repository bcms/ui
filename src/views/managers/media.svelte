<script lang="ts">
  import { beforeUpdate, onMount, onDestroy } from 'svelte';
  import { navigate } from 'svelte-routing';
  import {
    Layout,
    MediaViewer,
    Button,
    MediaAddUpdateFolderModal,
    Select,
    SelectItem,
  } from '../../components';
  import { Uppload, en, Local, Preview, Crop, Flip, Rotate } from 'uppload';
  import {
    GeneralService,
    MediaService,
    popup,
    sdk,
    StoreService,
  } from '../../services';
  import type { MediaViewFilter } from '../../types';
  import { Media, MediaType } from '@becomes/cms-sdk';

  export let id: string;

  const mediaStoreUnsub = StoreService.subscribe(
    'media',
    async (value: Media[]) => {
      if (value) {
        media = value;
        if (id) {
          mediaInView = value.filter((e) => e.parentId === id);
        } else {
          mediaInView = value.filter((e) => e.isInRoot);
        }
        mediaInView = splitMedia(mediaInView);
      }
    }
  );
  let uppload = null;
  let searchInput = '';
  let media: Media[] = [];
  let mediaInView: Media[] = [];

  const filterOptions: {
    isOpen: boolean;
    filters: MediaViewFilter[];
  } = {
    isOpen: false,
    filters: [
      {
        label: 'Type',
        type: 'dropdown',
        options: [
          { label: 'Image', value: 'IMG' },
          { label: 'Video', value: 'VID' },
          { label: 'Directory', value: 'DIR' },
        ],
        value: {
          label: 'No filters',
          value: '',
        },
      },
    ],
  };
  const editFolderData = {
    id: '',
    name: '',
  };

  function splitMedia(media: Media[]): Media[] {
    return [
      ...media.filter((e) => e.type === MediaType.DIR),
      ...media.filter((e) => e.type !== MediaType.DIR),
    ];
  }
  function applyFilters(media: Media[]): Media[] {
    return media.filter((e) => {
      if (!e.name.toLowerCase().includes(searchInput.trim().toLowerCase()))
        return false;

      for (let i = 0; i < filterOptions.filters.length; i++) {
        const current = filterOptions.filters[i];
        if (current.value.value && current.value.value !== e.type) return false;
      }

      return true;
    });
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
        StoreService.update('media', await sdk.media.getAll());
        popup.success('Folder successfully created.');
      }
    );
  }
  async function createFiles(parentId: string, name: string, files: File[]) {
    const errors = await MediaService.createFiles(parentId, name, files);
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
  }
  async function removeMedia(id: string) {
    await GeneralService.errorWrapper(
      async () => {
        await sdk.media.deleteById(id);
      },
      async () => {
        StoreService.update('media', await sdk.media.getAll());
        popup.success('Media successfully removed.');
      }
    );
  }

  beforeUpdate(() => {
    if (id) {
      mediaInView = media.filter((e) => {
        return e.parentId === id;
      });
      mediaInView = applyFilters(mediaInView);
    } else {
      mediaInView = media.filter((e) => {
        return e.isInRoot;
      });
      mediaInView = applyFilters(mediaInView);
    }
    mediaInView = splitMedia(mediaInView);
  });

  onMount(async () => {
    await GeneralService.errorWrapper(
      async () => {
        return await sdk.media.getAll();
      },
      async (result: Media[]) => {
        StoreService.update('media', result);
      }
    );
    const uploaderFunction: any = async (data: File[] | File) => {
      const filesArray: File[] = [];
      if (data instanceof Array) {
        for (let i = 0; i < data.length; i++) {
          filesArray.push(data[i]);
        }
      } else {
        filesArray.push(data);
      }

      await createFiles(id ? id : '', '', filesArray);
      return '';
    };
    const uploader = new Uppload({
      lang: en,
      call: '.uploadFileToggler',
      multiple: true,
    });
    uploader.uploader = uploaderFunction;
    // Services
    [Crop, Flip, Rotate].forEach((service) => {
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

  onDestroy(async () => {
    mediaStoreUnsub();
  });
</script>

<Layout>
  <div class="view media">
    <header>
      <div class="media--search view--left">
        <i class="fas fa-search" />
        <input
          class="media--search-input"
          type="text"
          placeholder="Search"
          bind:value={searchInput} />
        <button
          on:click={() => {
            filterOptions.isOpen = !filterOptions.isOpen;
          }}
          class="media--search-toggler {filterOptions.isOpen ? 'media--search-toggler_active' : ''}">
          <i class="fas fa-chevron-down" />
        </button>
        <!-- TODO: v--clickOutside="closeFilterOptions" -->
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
    <MediaViewer
      media={mediaInView}
      parentId={id}
      on:open={(event) => {
        if (event.detail) {
          navigate(`/dashboard/media/editor/${event.detail}`);
          mediaInView = media.filter((e) => e.parentId === event.detail);
        } else {
          navigate('/dashboard/media/editor');
          mediaInView = media.filter((e) => e.isInRoot);
        }
      }}
      on:remove={(event) => {
        removeMedia(event.detail);
      }} />
  </div>
  <MediaAddUpdateFolderModal
    id={editFolderData.id}
    name={editFolderData.name}
    on:cancel={() => {
      editFolderData.id = '';
      editFolderData.name = '';
    }}
    on:done={(event) => {
      createFolder(event.detail.name, id ? id : '');
    }} />
</Layout>
