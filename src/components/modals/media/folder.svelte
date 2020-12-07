<script lang="ts">
  import { createEventDispatcher, beforeUpdate } from 'svelte';
  import { GeneralService, StoreService } from '../../../services';
  import Modal from '../modal.svelte';
  import { TextInput } from '../../input';
  import Button from '../../button.svelte';

  export let id: string = '';
  export let name: string = '';

  type Data = {
    name: {
      value: string;
      error: string;
    };
  };

  const dispatch = createEventDispatcher();
  const modalName = 'MediaAddUpdateFolderModal';
  const buffer = {
    id: '' + id,
  };
  let data: Data = getData(name);
  let closing = false;

  function getData(name?: string): Data {
    if (name) {
      return {
        name: {
          error: '',
          value: '' + name,
        },
      };
    }
    return {
      name: {
        error: '',
        value: '',
      },
    };
  }
  function close() {
    closing = true;
    StoreService.update(modalName, false);
  }
  function cancel() {
    dispatch('cancel');
    close();
  }
  function done() {
    if (data.name.value === '') {
      data.name.error = 'Folder name cannot be empty.';
      return;
    }
    data.name.error = '';
    dispatch('done', {
      id,
      name: '' + data.name.value,
    });
    close();
  }

  beforeUpdate(() => {
    if (buffer.id !== id) {
      buffer.id = '' + id;
      data = getData(name);
    }
  });
</script>

<Modal
  name={modalName}
  on:cancel={cancel}
  on:animationDone={() => {
    closing = false;
    buffer.id = '';
    data = getData();
  }}>
  <div slot="header">
    <h2 class="bcmsModal--title">Create new folder</h2>
  </div>
  <div class="bcmsModal--row" data-simplebar>
    <TextInput
      label="Folder name"
      placeholder="Folder name"
      value={data.name.value}
      invalidText={data.name.error}
      on:input={(event) => {
        data.name.value = GeneralService.string.toUri(event.detail);
      }} />
  </div>
  <div class="bcmsModal--row bcmsModal--row_submit">
    <Button disabled={closing} on:click={done}><span>Done</span></Button>
    <Button disabled={closing} kind="ghost" on:click={close}>Cancel</Button>
  </div>
</Modal>
