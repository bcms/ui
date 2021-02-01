<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { StoreService } from '../../services';
  import { TextInput } from '../input';
  import Modal from './modal.svelte';

  interface Data {
    title: string;
    body: string;
    prompt?: {
      invalidText: string;
      input: string;
      verify: string;
    };
    callback: (type: 'done' | 'cancel') => Promise<void> | void;
  }

  const dispatch = createEventDispatcher();
  const modalName = 'ConfirmModal';
  const data: Data = {
    title: '',
    body: '',
    callback: () => {},
  };
  let unsubscribe: () => void = () => {};

  function close() {
    StoreService.update(modalName, false);
  }
  function cancel() {
    dispatch('cancel');
    data.callback('cancel');
    close();
  }
  function done() {
    if (data.prompt && data.prompt.verify !== data.prompt.input) {
      data.prompt.invalidText = `You must type "${data.prompt.input}"`;
      return;
    }
    dispatch('done');
    data.callback('done');
    close();
  }

  onMount(() => {
    unsubscribe = StoreService.subscribe(modalName, async (value: Data) => {
      if (value) {
        data.title = value.title;
        data.body = value.body;
        data.callback = value.callback;
        data.prompt = value.prompt;
      }
    });
  });
  onDestroy(() => {
    unsubscribe();
  });
</script>

<Modal
class="bcmsModal_confirm"
  title={data.title}
  name={modalName}
  actionName="Confirm"
  on:done={done}
  on:cancel={cancel}
  on:animationDone={() => {
    data.title = '';
    data.body = '';
    data.callback = () => {};
  }}>
  {#if data.body}
    <div class="bcmsModal--warningMessage">
      {@html data.body}
    </div>
    {#if data.prompt}
      <TextInput
        class="bcmsModal--prompt"
        label="Confirm"
        helperText="Please write <strong>{data.prompt.input}</strong> "
        value={data.prompt.verify}
        placeholder={data.prompt.input}
        on:enter={() => {
          done();
        }}
        on:input={(event) => {
          data.prompt.verify = event.detail;
        }} />
    {/if}
  {/if}
</Modal>
