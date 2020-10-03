<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import type { Media, Prop } from '@becomes/cms-sdk';
  import { GeneralService, StoreService } from '../../../services';
  import Modal from '../modal.svelte';
  import { MediaViewer } from '../../media';
  import { popup } from '../../popup.svelte';

  type Data = {
    media: {
      value: Media;
      error: string;
    };
    prop: Prop;
    propIndex: number;
    valueIndex: number;
    depth: string;
  }

  const dispatch = createEventDispatcher();
  const modalName = 'MediaPickerModal';
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
  onDestroy(() => {
    unsubscribe();
  });
</script>

<Modal title="Media picker" name={modalName} on:cancel={cancel} on:done={done}>
  <div class="mm-a-folder">
    <MediaViewer
      inModal={true}
      on:selected={(event) => {
        data.media.value = event.detail;
      }} />
  </div>
</Modal>
