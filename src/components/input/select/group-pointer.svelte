<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import type { Group } from '@becomes/cms-sdk';
  import { StoreService, GeneralService, sdk } from '../../../services';
  import Select from './select.svelte';

  export { className as class };
  export let exclude: string[] = [];
  export let selected: string = undefined;
  export let invalidText = '';

  const groupStoreUnsub = StoreService.subscribe(
    'group',
    async (value: Group[]) => {
      if (value) {
        groups = value;
        if (exclude.length > 0) {
          groups = groups.filter((e) => !exclude.includes(e._id));
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
    if (exclude.length > 0) {
      groups = groups.filter((e) => !exclude.includes(e._id));
    }
  });
  onDestroy(() => {
    groupStoreUnsub();
  });
</script>

<Select
  cyTag="groupPointer"
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
