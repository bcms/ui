<script lang="ts">
  import { createEventDispatcher, afterUpdate } from 'svelte';
  import { GeneralService, StoreService } from '../../services';
  import Modal from './modal.svelte';
  import { ToggleInput, TextInput, MultiAddInput } from '../input';
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
    value: prop.value ? prop.value : {},
  };

  function close() {
    StoreService.update('EditPropModal', false);
    setTimeout(() => {
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
        value: prop.value,
      };
    }
  });
</script>

<Modal title="Edit property" name={modalName} on:cancel={cancel} on:done={done}>
  <TextInput
    label="Label"
    placeholder="Property's label"
    invalidText={data.label.error}
    value={data.label.value}
    on:input={(event) => {
      data.label.value = event.detail;
    }} />
  {#if prop.type === PropType.ENUMERATION}
    <MultiAddInput
      class="mt--20 mb--20"
      label="Enumerations"
      value={prop.value.items}
      placeholder="Type something and press Enter key"
      formater={(value) => {
        return GeneralService.string.toEnum(value);
      }}
      validate={(items) => {
        if (items
            .splice(0, items.length - 1)
            .includes(items[items.length - 1])) {
          return `Enumeration with name "${items[items.length - 1]}" is already added.`;
        }
      }} />
  {/if}
  <p class="bcmsInput--label mt--20">Required</p>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label class="checkboxLabel">
    <ToggleInput
      value={data.required}
      on:input={(event) => {
        data.required = event.detail;
      }} />
    <span
      class="checkboxLabel--textContent ml--10">{data.required ? 'Yes' : 'No'}</span>
  </label>
</Modal>
