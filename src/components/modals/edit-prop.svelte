<script lang="ts">
  import { createEventDispatcher, beforeUpdate } from 'svelte';
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
  beforeUpdate(() => {
    if (buffer.name !== prop.name) {
      buffer.name = '' + prop.name;
      data = getData();
    }
  });
</script>

<Modal name={modalName} on:done={done} on:cancel={cancel}>
  <div slot="header">
    <h2 class="bcmsModal--title">Edit '{prop.label}'</h2>
  </div>
  <div class="bcmsModal--row">
    <TextInput
      label="Label"
      placeholder="Property's label"
      invalidText={data.label.error}
      value={data.label.value}
      on:input={(event) => {
        data.label.value = event.detail;
      }} />
  </div>
  {#if prop.type === PropType.ENUMERATION}
    <div class="bcmsModal--row">
      <MultiAddInput
        label="Enumerations"
        value={getEnumValue(prop).items}
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
        }}
        on:update={(event) => {
          data.enumItems = event.detail;
        }} />
    </div>
  {/if}
  {#if prop.type !== PropType.GROUP_POINTER}
    <div class="bcmsModal--row">
      <ToggleInput
        label="Required"
        value={data.required}
        states={['Yes', 'No']}
        on:input={(event) => {
          data.required = event.detail;
        }} />
    </div>
  {/if}
</Modal>
