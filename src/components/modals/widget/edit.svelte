<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { StoreService } from '../../../services';
  import Modal from '../modal.svelte';
  import { MarkdownInput, TextInput } from '../../input';
  import type { Widget } from '@becomes/cms-sdk';
  import { MediaPickerProp } from '../../props';
  import { MediaPickerModal } from '../media';

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
  const modalName = 'EditWidgetModal';
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
  class="editWidgetModal"
  title="Edit widget"
  name={modalName}
  on:cancel={cancel}
  on:done={done}
  on:animationDone={() => {
    data = getData();
  }}
>
  <div class="bcmsModal--row">
    <TextInput
      label="Label"
      placeholder="Entity's label"
      invalidText={data.name.error}
      value={data.name.value}
      on:input={(event) => {
        data.name.value = event.detail;
      }}
    />
  </div>
  <div class="bcmsModal--row">
    <MarkdownInput
      value={data.desc.value}
      label="Description"
      invalidText={data.desc.error}
      class="bcmsInput_richText"
      on:input={(event) => {
        data.desc.value = event.detail;
      }}
    />
  </div>
  <div class="bcmsModal--row">
    <label for="previewImage">
      <span class="_bcmsInput--label">Preview image</span>
    </label>
    <MediaPickerProp
      value={data.previewImage}
      on:clear={() => {
        data.previewImage = '';
      }}
      on:click={() => {
        StoreService.update('MediaPickerModal', {
          show: true,
        });
      }}
    />
  </div>
  <!-- <div class="bcmsModal--row">
    <TextArea
      class="editWidgetModal--script"
      value={data.previewScript.value}
      label="Script"
      invalidText={data.previewScript.error}
      on:input={(event) => {
        data.previewScript.value = event.detail;
      }}
    />
  </div> -->
</Modal>
<MediaPickerModal
  class="bcmsModal_mediaPicker"
  on:done={(event) => {
    data.previewImage = `${event.detail.media.path}/${event.detail.media.name}`.replace(
      /\/\//g,
      '/'
    );
  }}
/>
