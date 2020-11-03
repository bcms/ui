<script lang="ts">
  import {
    createEventDispatcher,
    beforeUpdate,
    onMount,
    onDestroy,
  } from 'svelte';
  import { slide } from 'svelte/transition';
  import type { Entry } from '@becomes/cms-sdk';
  import * as hljs from 'highlight.js';
  import * as uuid from 'uuid';
  import { GeneralService, sdk, StoreService } from '../../../services';
  import Modal from '../modal.svelte';
  import Button from '../../button.svelte';

  export let entryId = '';
  export let templateId = '';

  const blockId = uuid.v4();
  const dispatch = createEventDispatcher();
  const modalName = 'EntryFullModelModal';
  const buffer = {
    id: '',
  };
  let unsubscribe: () => void;
  let entry: Entry;

  async function getEntry(id: string, tid: string): Promise<Entry> {
    return await GeneralService.errorWrapper(
      async () => {
        return await sdk.entry.get({
          id,
          templateId: tid,
        });
      },
      async (value: Entry) => {
        return value;
      }
    );
  }

  function close() {
    StoreService.update(modalName, false);
  }
  function cancel() {
    dispatch('cancel');
    close();
  }
  function done() {
    dispatch('done');
    close();
  }

  onMount(() => {
    unsubscribe = StoreService.subscribe(modalName, async (value: boolean) => {
      if (value === true && buffer.id === entryId) {
        setTimeout(() => {
          const element = document.getElementById(blockId);
          if (element) {
            hljs.highlightBlock(element);
          }
        }, 20);
      }
    });
  });
  beforeUpdate(async () => {
    if (buffer.id !== entryId) {
      buffer.id = entryId;
      if (entryId !== '' && templateId !== '') {
        entry = await getEntry(entryId, templateId);
        setTimeout(() => {
          hljs.highlightBlock(document.getElementById(blockId));
        }, 20);
      } else {
        entry = undefined;
      }
    }
  });
  onDestroy(() => {
    unsubscribe();
  });
</script>

<Modal name={modalName} on:cancel={cancel} class="bcmsModal_fullModel">
  <div slot="header">
    <h2 class="bcmsModal--title">Entry full model</h2>
  </div>
  <div in:slide={{ delay: 200 }} class="entry-full-model-modal">
    {#if entry}
      <pre
        id={blockId}>
        <code>
          {JSON.stringify(entry, null, '  ')}
        </code>
      </pre>
    {/if}
  </div>
  <div class="bcmsModal--row bcmsModal--row_submit">
    <Button on:click={done}><span>Done</span></Button>
    <button on:click={close}>Cancel</button>
  </div>
</Modal>
