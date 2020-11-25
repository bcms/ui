<script lang="ts">
  import { beforeUpdate, onMount, onDestroy } from 'svelte';
  import { navigate } from 'svelte-routing';
  import {
    Layout,
    MediaViewer,
    MediaAddUpdateFolderModal,
  } from '../../components';
  import { GeneralService, popup, sdk, StoreService } from '../../services';
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
  });

  onDestroy(async () => {
    mediaStoreUnsub();
  });
</script>

<Layout>
  <div class="view media">
    <MediaViewer
      media={mediaInView}
      parentId={id}
      {searchInput}
      {filterOptions}
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
      }}
      on:search={(event) => {
        searchInput = event.detail;
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
