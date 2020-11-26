<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import type { Media, Prop } from '@becomes/cms-sdk';
  import { StoreService, popup } from '../../../services';
  import Modal from '../modal.svelte';
  import { MediaViewer } from '../../media';
  import Button from '../../button.svelte';

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
  });
</script>

<Modal name={modalName} on:cancel={cancel} on:done={done} class={className}>
  <div slot="header">
    <h2 class="bcmsModal--title">Media picker</h2>
  </div>
  <div class="bcmsModal--row">
    <MediaViewer
      isItemSelect={true}
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
