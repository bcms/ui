<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { StoreService } from '../../../services';
  import Button from '../../button.svelte';
  import Modal from '../modal.svelte';

  const dispatch = createEventDispatcher();
  const modalName = 'MediaRemoveFileModal';
  let selfSubscription: () => void;
  let mediaToDelete = '';

  function close() {
    StoreService.update(modalName, false);
  }

  function cancel() {
    dispatch('cancel');
    close();
  }
  function done() {
    dispatch('done', mediaToDelete);
    close();
  }

  onMount(() => {
    selfSubscription = StoreService.subscribe(
      modalName,
      async (data: { show: boolean; mediaId: string }) => {
        mediaToDelete = data.mediaId;
      }
    );
  });
  onDestroy(() => {
    if (selfSubscription) {
      selfSubscription();
    }
  });
</script>

<Modal name={modalName} on:cancel={cancel}>
  <div slot="header">
    <h2 class="bcmsModal--title">Delete file</h2>
  </div>
  <div class="bcmsModal--row bcmsModal--row_submit">
    <Button on:click={done}><span>Delete</span></Button>
    <Button kind="ghost" on:click={close}>Cancel</Button>
  </div>
</Modal>
