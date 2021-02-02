<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { StoreService } from '../../../services';
  import Modal from '../modal.svelte';
  import type { Widget } from '@becomes/cms-sdk';
  import Image from '../../image.svelte';

  interface Data {
    name: {
      value: string;
      error: string;
    };
    desc: {
      value: string;
      error: string;
    };
    previewImage: string;
    previewScript: {
      value: string;
      error: string;
    };
    previewStyle: string;
  }

  const dispatch = createEventDispatcher();
  const modalName = 'PreviewWidgetModal';
  let selfUnsub: () => void = () => {};
  let data: Data = getData();

  function getData(widget?: Widget) {
    const d: Data = {
      name: {
        value: '',
        error: '',
      },
      desc: {
        value: '',
        error: '',
      },
      previewImage: '',
      previewScript: {
        value: '',
        error: '',
      },
      previewStyle: '',
    };
    if (widget) {
      d.name.value = widget.label;
      d.desc.value = widget.desc;
      d.previewImage = widget.previewImage ? widget.previewImage : '';
      d.previewScript.value = widget.previewScript ? widget.previewScript : '';
      d.previewStyle = widget.previewStyle ? widget.previewStyle : '';
    }
    return d;
  }
  function close() {
    StoreService.update(modalName, false);
  }
  function cancel() {
    dispatch('cancel');
    close();
  }
  function done() {
    if (data.name.value.replace(/ /g, '') === '') {
      data.name.error = 'Label is required.';
      return;
    }
    data.name.error = '';
    dispatch('done', {
      name: data.name.value,
      desc: data.desc.value,
      previewImage: data.previewImage,
    });
    close();
  }

  onMount(() => {
    selfUnsub = StoreService.subscribe(
      modalName,
      async (
        value:
          | {
              show: boolean;
              widget: Widget;
            }
          | boolean
      ) => {
        if (typeof value !== 'boolean') {
          data = getData(value.widget);
        }
      }
    );
  });
  onDestroy(() => {
    selfUnsub();
  });
</script>

<Modal

  title={data.name.value}
  name={modalName}
  on:cancel={cancel}
  on:done={done}
  on:animationDone={() => {
    data = getData();
  }}
>
  {#if data.previewImage}
    <div class="bcmsModal--row">
      <label for="previewImage">
        <span class="_bcmsInput--label">Preview image</span>
      </label>
      <Image href={data.previewImage} style="width: 100%" fullQuality />
    </div>
  {/if}
</Modal>
