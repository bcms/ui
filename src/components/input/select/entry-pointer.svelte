<script lang="ts">
  import {
    onMount,
    createEventDispatcher,
    onDestroy,
    beforeUpdate,
  } from 'svelte';
  import type { Template } from '@becomes/cms-sdk';
  import { GeneralService, sdk, StoreService } from '../../../services';
  import Select from './select.svelte';
  import type { SelectOption } from '../../../types';

  export { className as class };
  export let exclude: string = undefined;
  export let selected: SelectOption = undefined;
  export let invalidText = '';

  const templateStoreUnsub = StoreService.subscribe(
    'template',
    async (value: Template[]) => {
      if (value) {
        templates = value;
        if (exclude !== '') {
          templates = templates.filter((e) => e._id !== exclude);
        }
      }
    }
  );
  const dispatch = createEventDispatcher();
  let className = '';
  let templates: Template[] = [];
  let options: SelectOption[] = [];
  let selectedOption: SelectOption;

  onMount(async () => {
    templates = await GeneralService.errorWrapper(
      async () => {
        return await sdk.template.getAll();
      },
      async (value: Template[]) => {
        return value;
      }
    );
    if (exclude !== '') {
      templates = templates.filter((e) => e._id !== exclude);
    }
    options = templates.map((e) => {
      return {
        label: e.label,
        value: e.name,
        _id: e._id,
      };
    });
  });
  onDestroy(() => {
    templateStoreUnsub();
  });
  beforeUpdate(() => {
    const template = templates.find((e) => e._id === selected._id);

    if (!selected || !template) {
      selectedOption = {
        label: '',
        value: '',
        _id: '',
      };
    } else {
      selectedOption = {
        label: template.label,
        value: template.name,
        _id: template._id,
      };
    }
  });
</script>

<Select
  class={className}
  label="Select a template"
  placeholder="Select a template"
  {invalidText}
  {options}
  disabled={options.length === 0}
  selected={selectedOption}
  on:change={(event) => {
    if (event.detail.value === '') {
      dispatch('select', undefined);
      return;
    }
    dispatch('select', event.detail);
  }} />
