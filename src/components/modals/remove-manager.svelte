<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { StoreService } from '../../services';
  import Modal from './modal.svelte';
  import Button from '../button.svelte';
  import { TextInput } from '../input';

  const dispatch = createEventDispatcher();
  const modalName = 'RemoveManagerModal';

  export let title = '';
  export let warningMessage = '';
  export let inputLabel = '';
  export let managerName = '';

  let confirmInputValue = '';

  function close() {
    StoreService.update(modalName, false);
    setTimeout(() => {
      confirmInputValue = '';
    }, 500);
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
    <h2 class="bcmsModal--title">{title}</h2>
  </div>
  <div data-simplebar>
    <p class="warningMessage mb-25">{warningMessage}</p>
    <div class="bcmsModal--row">
      <TextInput
        label={inputLabel}
        placeholder={inputLabel}
        value={confirmInputValue}
        on:input={(event) => {
          confirmInputValue = event.detail;
        }} />
    </div>
  </div>
  <div class="bcmsModal--row bcmsModal--row_submit">
    <Button
      on:click={done}
      disabled={confirmInputValue
        .trim()
        .toLowerCase() !== managerName.trim().toLowerCase()}>
      <span>Confirm</span>
    </Button>
    <Button kind="ghost" on:click={close}>Cancel</Button>
  </div>
</Modal>
