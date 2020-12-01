<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { StoreService } from '../../services';
  import Modal from './modal.svelte';
  import Button from '../button.svelte';

  const dispatch = createEventDispatcher();
  const modalName = 'ConfirmDeleteModal';

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
    <h2 class="bcmsModal--title">Confirm Delete</h2>
  </div>
  <div class="bcmsModal--row bcmsModal--row_submit">
    <Button on:click={done}><span>Confirm</span></Button>
    <Button kind="ghost" on:click={close}>Cancel</Button>
  </div>
</Modal>
