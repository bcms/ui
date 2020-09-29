<script lang="ts">
  import { createEventDispatcher, beforeUpdate, onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import type { Entry } from '@becomes/cms-sdk';
  import * as hljs from 'highlight.js';
  import * as uuid from 'uuid';
  import { GeneralService, sdk, StoreService } from '../../../services';
  import Modal from '../modal.svelte';

  export let entryId = '';
  export let templateId = '';

  const blockId = uuid.v4();
  const dispatch = createEventDispatcher();
  const modalName = 'EntryFullModelModal';
  const buffer = {
    id: '',
  };
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

  beforeUpdate(async () => {
    if (buffer.id !== entryId) {
      buffer.id = entryId;
      if (entryId !== '' && templateId !== '') {
        entry = await getEntry(entryId, templateId);
        setTimeout(() => {
          const element = document.getElementById(blockId);
          hljs.highlightBlock(document.getElementById(blockId));
        }, 20);
      } else {
        entry = undefined;
      }
    }
  });
</script>

<Modal
  title="Entry full model"
  name={modalName}
  on:cancel={cancel}
  on:done={done}>
  <div in:slide={{ delay: 200 }} class="entry-full-model-modal">
    <pre id={blockId}>
        <code>
          {entry ? JSON.stringify(entry, null, '  ') : ''}
        </code>
      </pre>
  </div>
</Modal>
