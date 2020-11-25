<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { StoreService } from '../../../services';
  import Button from '../../button.svelte';
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
  function done() {
    dispatch('done');
    close();
  }
</script>

<Modal name={modalName} on:cancel={cancel}>
  <div slot="header">
    <h2 class="bcmsModal--title">Delete file</h2>
  </div>
  <div class="bcmsModal--row bcmsModal--row_submit">
    <Button on:click={done}><span>Delete</span></Button>
    <button on:click={close}>Cancel</button>
  </div>
</Modal>
