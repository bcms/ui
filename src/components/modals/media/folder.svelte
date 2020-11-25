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

  const buffer = {
    id: '' + id,
  };
  let data: Data = getData(name);

  const dispatch = createEventDispatcher();
  const modalName = 'MediaAddUpdateFolderModal';

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
    StoreService.update(modalName, false);
    setTimeout(() => {
      buffer.id = '';
      data = getData();
    }, 300);
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

<Modal name={modalName} on:cancel={cancel}>
  <div slot="header">
    <h2 class="bcmsModal--title">Create/Update a folder</h2>
  </div>
  <div class="bcmsModal--row">
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
    <Button on:click={done}><span>Done</span></Button>
    <button on:click={close}>Cancel</button>
  </div>
</Modal>
