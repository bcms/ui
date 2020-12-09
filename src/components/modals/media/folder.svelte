<script lang="ts">
  import { createEventDispatcher, beforeUpdate } from 'svelte';
  import { GeneralService, StoreService } from '../../../services';
  import Modal from '../modal.svelte';
  import { TextInput } from '../../input';

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
  title="Create new folder"
  name={modalName}
  on:cancel={cancel}
  on:done={done}
  on:animationDone={() => {
    buffer.id = '';
    data = getData();
  }}>
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
</Modal>
