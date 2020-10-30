<script lang="ts">
  import { createEventDispatcher, afterUpdate } from 'svelte';
  import { GeneralService, StoreService } from '../../services';
  import Modal from './modal.svelte';
  import { ToggleInput, TextInput, MultiAddInput } from '../input';
  import { Prop, PropEnum, PropType } from '@becomes/cms-sdk';

  interface Data {
    label: {
      value: string;
      error: string;
    };
    required: boolean;
    enumItems: [];
  }

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
  let data = getData();

  function getData(): Data {
    return {
      label: {
        value: '' + prop ? prop.label : '',
        error: '',
      },
      required: prop && prop.required ? true : false,
      enumItems: [],
    };
  }

  function close() {
    StoreService.update('EditPropModal', false);
    setTimeout(() => {
      data = getData();
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
      enumItems: data.enumItems.length > 0 ? data.enumItems : undefined,
    });
    close();
  }
  function getEnumValue(prop: Prop) {
    return prop.value as PropEnum;
  }

  afterUpdate(() => {
    if (buffer.name !== prop.name) {
      buffer.name = '' + prop.name;
      data = getData();
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
  {#if prop.type === PropType.ENUMERATION}
    <MultiAddInput
      class="mt--20 mb--20"
      label="Enumerations"
      helperText="Type some value and press Enter key to add it."
      value={getEnumValue(prop).items}
      formater={(value) => {
        return GeneralService.string.toEnum(value);
      }}
      validate={(items) => {
        if (items
            .splice(0, items.length - 1)
            .includes(items[items.length - 1])) {
          return `Enumeration with name "${items[items.length - 1]}" is already added.`;
        }
      }}
      on:update={(event) => {
        data.enumItems = event.detail;
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
