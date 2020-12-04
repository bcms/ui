<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { StoreService } from '../../services';
  import Modal from './modal.svelte';
  import Button from '../button.svelte';

  interface Data {
    title: string;
    body: string;
    callback: (type: 'done' | 'cancel') => Promise<void> | void;
  }

  const dispatch = createEventDispatcher();
  const modalName = 'ConfirmModal';
  const data: Data = {
    title: '',
    body: '',
    callback: () => {},
  };
  let unsubscribe: () => void = () => {};

  function close() {
    StoreService.update(modalName, false);
  }
  function cancel() {
    dispatch('cancel');
    data.callback('cancel');
    close();
  }
  function done() {
    dispatch('done');
    data.callback('done');
    close();
  }

  onMount(() => {
    unsubscribe = StoreService.subscribe(modalName, async (value: Data) => {
      if (value) {
        data.title = value.title;
        data.body = value.body;
        data.callback = value.callback;
      }
    });
  });
  onDestroy(() => {
    unsubscribe();
  });
</script>

<Modal name={modalName} on:cancel={cancel}>
  <div slot="header">
    <h2 class="bcmsModal--title">{data.title}</h2>
  </div>
  {#if data.body}
    <div class="bcmsModal--body">{data.body}</div>
  {/if}
  <div class="bcmsModal--row bcmsModal--row_submit">
    <Button on:click={done}><span>Confirm</span></Button>
    <Button kind="ghost" on:click={close}>Cancel</Button>
  </div>
</Modal>
