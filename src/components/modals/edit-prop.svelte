<script lang="ts">
  import { createEventDispatcher, afterUpdate } from 'svelte';
  import { StoreService } from '../../services';
  import Modal from './modal.svelte';
  import { ToggleInput, TextInput } from '../input';
  import { Prop, PropType } from '@becomes/cms-sdk';

  export let prop: Prop = {
    array: false,
    label: '',
    name: '',
    required: false,
    type: PropType.STRING,
    value: [''],
  };

  const dispatch = createEventDispatcher();
  const modalName = 'EditPropModal';
  let buffer = {
    name: '' + prop.name,
  };
  let data = {
    label: {
      value: '' + prop.label,
      error: '',
    },
    required: prop.required ? true : false,
  };

  function close() {
    StoreService.update('EditPropModal', false);
    setTimeout(() => {
      data = {
        label: {
          value: '',
          error: '',
        },
        required: false,
      };
      buffer = {
        name: '',
      };
    }, 300);
  }
  function cancel() {
    dispatch('cancel');
    close();
  }
  function done() {
    if (data.label.value.replace(/ /g, '') === '') {
      data.label.error = 'Label cannot be empty.';
      return;
    }
    data.label.error = '';
    dispatch('done', {
      label: data.label.value,
      required: data.required,
    });
    close();
  }

  afterUpdate(() => {
    if (buffer.name !== prop.name) {
      buffer.name = '' + prop.name;
      data = {
        label: {
          value: '' + prop.label,
          error: '',
        },
        required: prop.required ? true : false,
      };
    }
  });
</script>

<Modal title="Edit property" name={modalName} on:cancel={cancel} on:done={done}>
  <TextInput
    label="Label"
    invalidText={data.label.error}
    value={data.label.value}
    on:input={(event) => {
      data.label.value = event.detail;
    }} />
  <ToggleInput
    label="Required"
    value={data.required}
    on:input={(event) => {
      data.required = event.detail;
    }} />
</Modal>
