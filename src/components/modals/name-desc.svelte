<script lang="ts">
  import { createEventDispatcher, beforeUpdate } from 'svelte';
  import { StoreService } from '../../services';
  import Modal from './modal.svelte';
  import { RichTextInput, TextInput } from '../input';

  export let title: string;
  export let name: string = '';
  export let desc: string = '';

  const dispatch = createEventDispatcher();
  const modalName = 'NameDescModal';
  const buffer = {
    name: '' + name,
    desc: '' + desc,
  };
  let data = {
    name: {
      value: '' + name,
      error: '',
    },
    desc: {
      value: '' + desc,
      error: '',
    },
  };

  function close() {
    StoreService.update(modalName, false);
    setTimeout(() => {
      data = {
        name: {
          value: '',
          error: '',
        },
        desc: {
          value: '',
          error: '',
        },
      };
    }, 300);
  }
  function cancel() {
    dispatch('cancel');
    close();
  }
  function done() {
    if (data.name.value.replace(/ /g, '') === '') {
      data.name.error = 'Label is required.';
      return;
    }
    data.name.error = '';
    dispatch('done', {
      name: data.name.value,
      desc: data.desc.value,
    });
    close();
  }

  beforeUpdate(() => {
    if (buffer.name !== name) {
      buffer.name = name;
      data.name.value = '' + name;
    }
    if (buffer.desc !== desc) {
      buffer.desc = desc;
      data.desc.value = '' + desc;
    }
  });
</script>

<Modal {title} name={modalName} on:cancel={cancel} on:done={done}>
  <div class="name-desc-modal">
    <TextInput
      label="Label"
      placeholder="Entity's label"
      invalidText={data.name.error}
      value={data.name.value}
      on:input={(event) => {
        data.name.value = event.detail;
      }} />
    <RichTextInput
      class="mt--20"
      value={data.desc.value}
      label="Description"
      invalidText={data.desc.error}
      on:input={(event) => {
        data.desc.value = event.detail;
      }} />
  </div>
</Modal>
