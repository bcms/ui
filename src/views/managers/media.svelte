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
  import type { Media } from '@becomes/cms-sdk';

  export let id: string;

  if (id === '-') {
    id = undefined;
  }

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

  beforeUpdate(() => {
    if (id === '-') {
      id = undefined;
    }
  });

  onMount(async () => {
    if (id === '-') {
      id = undefined;
    }
    await GeneralService.errorWrapper(
      async () => {
        return await sdk.media.getAll();
      },
      async (result: Media[]) => {
        StoreService.update('media', result);
      }
    );
  });
</script>

<Layout>
  <div class="view media">
    <MediaViewer
      mediaId={id}
      {filterOptions}
      on:open={(event) => {
        if (event.detail) {
          navigate(`/dashboard/media/editor/${event.detail}`);
        } else {
          navigate('/dashboard/media/editor/-');
        }
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
