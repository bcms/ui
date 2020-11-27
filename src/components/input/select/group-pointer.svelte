<script lang="ts">
  import {
    onMount,
    onDestroy,
    createEventDispatcher,
    beforeUpdate,
  } from 'svelte';
  import type { Group } from '@becomes/cms-sdk';
  import { StoreService, GeneralService, sdk } from '../../../services';
  import Select from './select.svelte';
  import type { SelectOption } from '../../../types';

  export { className as class };
  export let exclude: string = undefined;
  export let selected: string = undefined;
  export let invalidText = '';

  const groupStoreUnsub = StoreService.subscribe(
    'group',
    async (value: Group[]) => {
      if (value) {
        groups = value;
        if (exclude !== '') {
          groups = groups.filter((e) => e._id !== exclude);
        }
      }
    }
  );
  const dispatch = createEventDispatcher();
  let className = '';
  let groups: Group[] = [];

  onMount(async () => {
    groups = await GeneralService.errorWrapper(
      async () => {
        return await sdk.group.getAll();
      },
      async (value: Group[]) => {
        return value;
      }
    );
    if (exclude) {
      groups = groups.filter((e) => e._id !== exclude);
    }
  });
  onDestroy(() => {
    groupStoreUnsub();
  });
</script>

<Select
  class={className}
  label="Select a group"
  placeholder="Select a group"
  {invalidText}
  options={groups.map((e) => {
    return { label: e.label, value: e._id };
  })}
  selected={selected ? selected : ''}
  disabled={groups.length === 0}
  on:change={(event) => {
    dispatch('select', event.detail.value);
  }} />
