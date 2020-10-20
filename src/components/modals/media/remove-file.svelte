<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { StoreService } from '../../../services';
  import Modal from '../modal.svelte';

  const dispatch = createEventDispatcher();
  const modalName = 'MediaRemoveFileModal';

  function close() {
    StoreService.update(modalName, false);
  }

  function cancel() {
    dispatch('cancel');
    close();
  }
</script>

<Modal
  title="Delete File"
  name={modalName}
  on:cancel={cancel}
  on:done={() => {
    dispatch('done');
  }} />
