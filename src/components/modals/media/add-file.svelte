<script lang="ts">
  import { beforeUpdate, createEventDispatcher } from 'svelte';
  import { GeneralService, StoreService } from '../../../services';
  import Modal from '../modal.svelte';
  import { FileInput, TextInput } from '../../input';

  export let parentId: string = '';

  type Data = {
    name: {
      value: string;
      error: string;
    };
    files: {
      value: File[];
      error: string;
    };
  }

  const dispatch = createEventDispatcher();
  const modalName = 'MediaAddFileModal';
  let data: Data = getData();
  let disableName = false;

  function getData(): Data {
    return {
      name: {
        error: '',
        value: '',
      },
      files: {
        value: [],
        error: '',
      },
    };
  }
  function handleFiles(files: File[]) {
    if (files.length > 1) {
      disableName = true;
      data.name.value = '';
      data.files.value = files;
    } else if (files.length === 1) {
      const fileNameParts = files[0].name.split('.');
      if (data.name.value === '') {
        data.name.value = GeneralService.string.toUri(
          fileNameParts.splice(0, fileNameParts.length - 1).join('.')
        );
      }
      data.files.value = files;
    }
  }
  function close() {
    StoreService.update(modalName, false);
    setTimeout(() => {
      data = getData();
    }, 300);
  }
  function cancel() {
    dispatch('cancel');
    close();
  }
  function done() {
    if (data.files.value.length < 2) {
      if (data.name.value === '') {
        data.name.error = 'File name cannot be empty.';
        return;
      }
      data.name.error = '';
    }
    if (data.files.value.length === 0) {
      data.files.error = 'At least 1 file must be selected.';
      return;
    }
    data.files.error = '';
    dispatch('done', {
      parentId,
      name: '' + data.name.value,
      files: data.files.value,
    });
    close();
  }
</script>

<Modal
  title="Create/Update a file"
  name={modalName}
  on:cancel={cancel}
  on:done={done}>
  <div class="mm-a-folder">
    <TextInput
      label="File name"
      placeholder="File name"
      value={data.name.value}
      disabled={disableName}
      invalidText={data.name.error}
      on:input={(event) => {
        data.name.value = GeneralService.string.toUri(event.detail);
      }} />
    <FileInput
      class="mt--20"
      invalidText={data.files.error}
      on:input={(event) => {
        handleFiles(event.detail);
      }} />
  </div>
</Modal>
