<script lang="ts">
  import { createEventDispatcher, beforeUpdate } from 'svelte';
  import { StoreService } from '../../services';
  import Modal from './modal.svelte';
  import { MarkdownInput, TextInput } from '../input';
  import Button from '../button.svelte';

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

<Modal name={modalName} on:cancel={cancel}>
  <div slot="header">
    <h2 class="bcmsModal--title">{title}</h2>
  </div>
  <div data-simplebar>
    <div class="bcmsModal--row">
      <TextInput
        label="Label"
        placeholder="Entity's label"
        invalidText={data.name.error}
        value={data.name.value}
        on:input={(event) => {
          data.name.value = event.detail;
        }} />
    </div>
    <div class="bcmsModal--row">
      <MarkdownInput
        value={data.desc.value}
        label="Description"
        invalidText={data.desc.error}
        class="bcmsInput_richText"
        on:input={(event) => {
          data.desc.value = event.detail;
        }} />
    </div>
  </div>
  <div class="bcmsModal--row bcmsModal--row_submit">
    <Button on:click={done}><span>Done</span></Button>
    <Button kind="ghost" on:click={close}>Cancel</Button>
  </div>
</Modal>
