<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import type { Group } from '@becomes/cms-sdk';
  import { StoreService, GeneralService, sdk } from '../../../services';
  import Select from './select.svelte';
  import SelectItem from './item.svelte';

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
    if (exclude !== '') {
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
  {invalidText}
  on:change={(event) => {
    if (event.detail === '') {
      dispatch('select', undefined);
      return;
    }
    dispatch('select', event.detail);
  }}>
  <SelectItem selected={!selected ? false : true} text="Select one" value="" />
  {#each groups as group}
    <SelectItem
      selected={selected === group._id ? true : false}
      text={GeneralService.string.toPretty(group.name)}
      value={group._id} />
  {/each}
</Select>
