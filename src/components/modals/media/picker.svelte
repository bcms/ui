<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { Media, MediaType, Prop } from '@becomes/cms-sdk';
  import { StoreService, popup, GeneralService, sdk } from '../../../services';
  import Modal from '../modal.svelte';
  import { MediaViewer } from '../../media';
  import Button from '../../button.svelte';
  import { MediaAddUpdateFolderModal } from '.';

  type Data = {
    media: {
      value: Media;
      error: string;
    };
    prop: Prop;
    propIndex: number;
    valueIndex: number;
    depth: string;
  };

  export { className as class };
  export let media: Media[] = [];
  export let parentId: string;
  export let edit: boolean = false;

  const dispatch = createEventDispatcher();
  const modalName = 'MediaPickerModal';

  let data: Data = getData();
  let className = '';
  let unsubscribe: () => void;

  const editFolderData = {
    id: '',
    name: '',
  };

  const mediaStoreUnsub = StoreService.subscribe(
    'media',
    async (value: Media[]) => {
      if (value) {
        media = value;
        if (parentId) {
          media = value.filter((e) => e.parentId === parentId);
        } else {
          media = value.filter((e) => e.isInRoot);
        }
        media = splitMedia(media);
      }
    }
  );

  function splitMedia(media: Media[]): Media[] {
    return [
      ...media.filter((e) => e.type === MediaType.DIR),
      ...media.filter((e) => e.type !== MediaType.DIR),
    ];
  }

  function getData(): Data {
    return {
      media: {
        value: undefined,
        error: '',
      },
      prop: undefined,
      propIndex: -1,
      valueIndex: -1,
      depth: '',
    };
  }

  function close() {
    StoreService.update(modalName, false);
    setTimeout(() => {
      data = getData();
    }, 300);
  }
  function cancel() {
    dispatch('cancel');
    close();
  }
  function done() {
    if (!data.media.value) {
      popup.error('Please select a media.');
      return;
    }
    dispatch('done', {
      media: data.media.value,
      prop: data.prop,
      propIndex: data.propIndex,
      valueIndex: data.valueIndex,
      depth: data.depth,
    });
    close();
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
    dispatch('file');
  }

  onMount(() => {
    unsubscribe = StoreService.subscribe(modalName, async (value) => {
      data.prop = value.prop;
      data.propIndex = value.propIndex;
      data.valueIndex = value.valueIndex;
      data.depth = value.depth;
    });
  });
  onDestroy(async () => {
    unsubscribe();
    mediaStoreUnsub();
  });
</script>

<Modal name={modalName} on:cancel={cancel} on:done={done} class={className}>
  <div slot="header">
    <h2 class="bcmsModal--title">Media picker</h2>
  </div>
  <div class="bcmsModal--row">
    <MediaViewer
      {media}
      {parentId}
      inModal={true}
      {edit}
      on:open
      on:selected={(event) => {
        data.media.value = event.detail;
      }}
      on:redirect
      on:file />
  </div>
  <div class="bcmsModal--row bcmsModal--row_submit">
    <Button on:click={done}><span>Done</span></Button>
    <button on:click={close}>Cancel</button>
  </div>
</Modal>
<MediaAddUpdateFolderModal
  id={editFolderData.id}
  name={editFolderData.name}
  on:cancel={() => {
    editFolderData.id = '';
    editFolderData.name = '';
  }}
  on:done={(event) => {
    createFolder(event.detail.name, parentId ? parentId : '');
  }} />
