<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import type { Media, Prop } from '@becomes/cms-sdk';
  import { StoreService, NotificationService } from '../../../services';
  import Modal from '../modal.svelte';
  import { MediaViewer } from '../../media';

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

  const dispatch = createEventDispatcher();
  const modalName = 'MediaPickerModal';
  let className = '';
  let data: Data = getData();
  let fileUploading = false;
  let unsubscribe: () => void;

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
  }
  function cancel() {
    dispatch('cancel');
    close();
  }
  function done() {
    if (!data.media.value) {
      NotificationService.error('Please select a media.');
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

  onMount(() => {
    unsubscribe = StoreService.subscribe(modalName, async (value) => {
      data.prop = value.prop;
      data.propIndex = value.propIndex;
      data.valueIndex = value.valueIndex;
      data.depth = value.depth;
    });
  });
  onDestroy(async () => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
</script>

<Modal
  title="Media picker"
  name={modalName}
  class={className}
  on:cancel={cancel}
  on:done={done}
  on:animationDone={() => {
    data = getData();
  }}
  disablePointerEvents={fileUploading}
>
  <div class="bcmsModal--row">
    <MediaViewer
      isItemSelect={true}
      on:selected={(event) => {
        data.media.value = event.detail;
      }}
      on:redirect
      on:file
      on:uploading={(event) => {
        fileUploading = event.detail;
      }}
    />
  </div>
</Modal>
