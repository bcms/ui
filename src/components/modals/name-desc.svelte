<script lang="ts">
  import { StoreService } from '../../services';
  import Modal from './modal.svelte';
  import { TextInput } from '../input';

  export let title: string;

  const name = 'NameDescModal';
  const data = {
    name: '',
    desc: '',
  };

  function close() {
    StoreService.update(name, false);
    setTimeout(() => {}, 500);
  }
  function cancel() {
    close();
  }
  function done() {
    close();
  }
</script>

<Modal {title} {name} on:cancel={cancel} on:done={done}>
  <div class="name-desc-modal">
    <TextInput
      label="Label"
      on:input={(event) => {
        data.name = event.detail;
      }} />
  </div>
</Modal>
