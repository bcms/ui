<script context="module" lang="ts">
  import { PropType } from '@becomes/cms-sdk';

  export const modalName = 'EntryAddContentSectionModal';
  export const primaryItems = [
    {
      text: 'Heading 1',
      value: PropType.HEADING_1,
    },
    {
      text: 'Heading 2',
      value: PropType.HEADING_2,
    },
    {
      text: 'Heading 3',
      value: PropType.HEADING_3,
    },
    {
      text: 'Heading 4',
      value: PropType.HEADING_4,
    },
    {
      text: 'Heading 5',
      value: PropType.HEADING_5,
    },
    {
      text: 'Paragraph',
      value: PropType.PARAGRAPH,
    },
    {
      text: 'List',
      value: PropType.LIST,
    },
    {
      text: 'Code Block',
      value: PropType.CODE,
    },
  ];
</script>

<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import type { Widget } from '@becomes/cms-sdk';
  import { GeneralService, sdk, StoreService, popup } from '../../../services';
  import Modal from '../modal.svelte';
  import Button from '../../button.svelte';

  type Data = {
    position: number;
    selected?: {
      type: 'primary' | 'widget';
      value: string;
    };
  };

  const widgetStoreUnsub = StoreService.subscribe(
    'widget',
    async (value: Widget[]) => {
      widgets = value;
    }
  );
  const dispatch = createEventDispatcher();
  let data: Data = getData();
  let widgets: Widget[] = [];
  let unsubscribe: () => void;

  function getData(): Data {
    return {
      position: 0,
    };
  }
  function selectItem(type: 'primary' | 'widget', value: string) {
    data.selected = {
      type,
      value,
    };
  }
  function close() {
    StoreService.update(modalName, false);
    setTimeout(() => {
      data = {
        position: 0,
      };
    }, 300);
  }
  function cancel() {
    dispatch('cancel');
    close();
  }
  function done() {
    if (!data.selected) {
      popup.error('Please select an item.');
      return;
    }
    dispatch('done', data);
    close();
  }
  onMount(async () => {
    await GeneralService.errorWrapper(
      async () => {
        return await sdk.widget.getAll();
      },
      async (value: Widget[]) => {
        StoreService.update('widget', value);
        unsubscribe = StoreService.subscribe(modalName, async (value) => {
          data.position = value.position;
        });
      }
    );
  });
  onDestroy(() => {
    widgetStoreUnsub();
    if (unsubscribe) {
      unsubscribe();
    }
  });
</script>

<Modal name={modalName} on:cancel={cancel} class="bcmsModal_addContentSection">
  <div slot="header">
    <h2 class="bcmsModal--title">Add content section</h2>
  </div>
  <h3 class="bcmsModal--subtitle">PRIMARY</h3>
  <div class="bcmsModal_addContentSection">
    <div class="mt--20 group">
      {#each primaryItems as item}
        <button
          class={data.selected && data.selected.type === 'primary' && item.value === data.selected.value ? 'selected' : ''}
          on:click={() => {
            selectItem('primary', item.value);
          }}>{item.text}</button>
      {/each}
    </div>
    <h3 class="mt--50 bcmsModal--subtitle">WIDGETS</h3>
    <div class="mt--20 group">
      {#each widgets as widget}
        <button
          class={data.selected && data.selected.type === 'widget' && widget._id === data.selected.value ? 'selected' : ''}
          on:click={() => {
            selectItem('widget', widget._id);
          }}>{widget.label}</button>
      {/each}
    </div>
  </div>
  <div class="bcmsModal--row bcmsModal--row_submit">
    <Button on:click={done}><span>Done</span></Button>
    <Button kind="ghost" on:click={close}>Cancel</Button>
  </div>
</Modal>
