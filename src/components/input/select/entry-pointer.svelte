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

  export { className as class };
  export let exclude: string = undefined;
  export let selected: string = undefined;
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
  let selectedTemplate: Template;

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
  });
  onDestroy(() => {
    templateStoreUnsub();
  });
  beforeUpdate(() => {
    selectedTemplate = templates.find((e) => e._id === selected);
  });
</script>

<Select
  class={className}
  label="Select a template"
  placeholder="Select a template"
  {invalidText}
  options={templates.map((e) => {
    return { label: e.label, value: e._id };
  })}
  disabled={templates.length === 0}
  selected={selectedTemplate ? selectedTemplate._id : ''}
  on:change={(event) => {
    if (event.detail.value === '') {
      dispatch('select', undefined);
      return;
    }
    dispatch('select', event.detail.value);
  }} />
