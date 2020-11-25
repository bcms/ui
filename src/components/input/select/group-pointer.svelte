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
  let options: SelectOption[] = [];
  let selectedOption: SelectOption;

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
    options = groups.map((e) => {
      return {
        label: e.label,
        value: e.name,
        _id: e._id,
      };
    });
  });

  onDestroy(() => {
    groupStoreUnsub();
  });

  beforeUpdate(() => {
    const group = groups.find((e) => e._id === selected);

    if (!selected || !group) {
      selectedOption = {};
    } else {
      selectedOption = {
        label: group.label,
        value: group.name,
        _id: group._id,
      };
    }
  });
</script>

<Select
  class={className}
  label="Select a group"
  placeholder="Select a group"
  {invalidText}
  {options}
  disabled={options.length === 0}
  value={selectedOption}
  on:change={(event) => {
    if (event.detail === '') {
      dispatch('select', undefined);
      return;
    }
    dispatch('select', event.detail);
  }} />
