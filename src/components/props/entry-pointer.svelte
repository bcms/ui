<script lang="ts">
  import {
    beforeUpdate,
    createEventDispatcher,
    onDestroy,
    onMount,
  } from 'svelte';
  import type { EntryLite, Prop, PropEntryPointer } from '@becomes/cms-sdk';
  import { Select, SelectItem } from '../input';
  import SinglePropWrapper from './single-prop-wrapper.svelte';
  import SinglePropArrayWrapper from './single-prop-array-wrapper.svelte';
  import SinglePropArrayItem from './single-prop-array-item.svelte';
  import { GeneralService, sdk, StoreService } from '../../services';

  export { className as class };
  export let prop: Prop;

  const entryStoreUnsub = StoreService.subscribe(
    'entry',
    async (value: EntryLite[]) => {
      if (value) {
        entriesLite = value;
      }
    }
  );
  const dispatch = createEventDispatcher();
  let className = '';
  let entriesLite: EntryLite[] = [];
  let value = prop.value as PropEntryPointer;
  let error = prop.array ? value.entryIds.map((e) => '') : [''];

  function addItem() {
    (prop.value as PropEntryPointer).entryIds.push('');
    dispatch('update', prop);
  }
  function moveItem(position: number, moveBy: number) {
    const buffer = '' + value.entryIds[position + moveBy];
    value.entryIds[position + moveBy] = '' + value.entryIds[position];
    value.entryIds[position] = buffer;
    (prop.value as PropEntryPointer).entryIds = [...value.entryIds];
    dispatch('update', prop);
  }
  function removeItem(position: number) {
    (prop.value as PropEntryPointer).entryIds.splice(position, 1);
    dispatch('update', prop);
  }

  onMount(async () => {
    await GeneralService.errorWrapper(
      async () => {
        return await sdk.entry.getAllLite(value.templateId);
      },
      async (ents: EntryLite[]) => {
        entriesLite = ents;
      }
    );
  });
  beforeUpdate(() => {
    value = JSON.parse(JSON.stringify(prop.value));
    error = prop.array ? value.entryIds.map((e) => '') : [''];
    if (prop.required) {
      for (let i = 0; i < value.entryIds.length; i = i + 1) {
        if (value.entryIds[i] === '') {
          error[i] = 'Please select an Entry since it is required.';
        } else {
          error[i] = '';
        }
      }
    }
  });
  onDestroy(() => {
    entryStoreUnsub();
  });
</script>

<SinglePropWrapper class={className} {prop}>
  <div class="prop--entry-pointer">
    {#if prop.array}
      <SinglePropArrayWrapper
        {prop}
        on:add={() => {
          addItem();
        }}>
        {#each value.entryIds as id, i}
          <SinglePropArrayItem
            position={i}
            elementLength={value.entryIds.length}
            on:move={(event) => {
              moveItem(i, event.detail.move);
            }}
            on:remove={(event) => {
              removeItem(event.detail.position);
            }}>
            <Select
              invalidText={error[i]}
              on:change={(event) => {
                value.entryIds[i] = event.detail;
                prop.value = value;
                dispatch('update', prop);
              }}>
              <SelectItem
                text="Select one"
                value=""
                selected={value.entryIds[0] === '' ? true : false} />
              {#each entriesLite as entryLite}
                <SelectItem
                  text={entryLite.meta[0].props[0].value[0]}
                  value={entryLite._id}
                  selected={entryLite._id === id} />
              {/each}
            </Select>
          </SinglePropArrayItem>
        {/each}
      </SinglePropArrayWrapper>
    {:else}
      <Select
        invalidText={error[0]}
        on:change={(event) => {
          value.entryIds[0] = event.detail;
          prop.value = value;
          dispatch('update', prop);
        }}>
        <SelectItem
          text="Select one"
          value=""
          selected={value.entryIds[0] === '' ? true : false} />
        {#each entriesLite as entryLite}
          <SelectItem
            text={entryLite.meta[0].props[0].value[0]}
            value={entryLite._id}
            selected={entryLite._id === value.entryIds[0]} />
        {/each}
      </Select>
    {/if}
  </div>
</SinglePropWrapper>
