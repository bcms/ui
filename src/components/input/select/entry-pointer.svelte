<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import type { Template } from '@becomes/cms-sdk';
  import { GeneralService, sdk } from '../../../services';
  import Select from './select.svelte';
  import SelectItem from './item.svelte';
  import { popup } from '../../popup.svelte';

  export { className as class };
  export let exclude: string = undefined;
  export let selected: string = undefined;

  const dispatch = createEventDispatcher();
  let className = '';
  let templates: Template[] = [];

  onMount(async () => {
    templates = await sdk.template.getAll();
    if (exclude !== '') {
      templates = templates.filter((e) => e._id !== exclude);
    }
  });
</script>

<Select
  class={className}
  label="Select a group"
  on:change={(event) => {
    if (event.detail === '') {
      dispatch('select', undefined);
      return;
    }
    const template = templates.find((e) => e._id === event.detail);
    if (!template) {
      popup.error('Cannot find template. See console for more details');
      console.error(`Template with ID "${event.detail}" does not exist`);
      return;
    }
    dispatch('select', template._id);
  }}>
  <SelectItem selected={!selected ? false : true} text="Select one" value="" />
  {#each templates as template}
    <SelectItem
      selected={selected === template._id ? true : false}
      text={GeneralService.string.toPretty(template.name)}
      value={template._id} />
  {/each}
</Select>
