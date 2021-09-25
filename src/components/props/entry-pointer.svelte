<script lang="ts">
  import { beforeUpdate, createEventDispatcher, onDestroy } from 'svelte';
  import type { Entry, EntryLite, Prop, PropEntryPointer } from '@becomes/cms-sdk';
  import { Select } from '../input';
  import SinglePropWrapper from './single-prop-wrapper.svelte';
  import SinglePropArrayWrapper from './single-prop-array-wrapper.svelte';
  import SinglePropArrayItem from './single-prop-array-item.svelte';
  import {
    GeneralService,
    PropsCheckerService,
    sdk,
    StoreService,
  } from '../../services';
  import Link from '../link.svelte';

  export { className as class };
  export let prop: Prop;

  const unregisterFromChecher = PropsCheckerService.register(() => {
    let isOk = true;
    if (prop.required) {
      for (let i = 0; i < errors.length; i++) {
        if (!value.entryIds[i]) {
          errors[i] = 'Entry must be selected.';
          isOk = false;
        } else {
          errors[i] = '';
        }
      }
    }
    return isOk;
  });
  const entryStoreUnsub = StoreService.subscribe(
    'entry',
    async (value: EntryLite[]) => {
      if (value) {
        entriesLite = value.filter(
          (e) => e.templateId === (prop.value as PropEntryPointer).templateId
        );
      }
    }
  );
  const dispatch = createEventDispatcher();
  const buffer = {
    templateId: '',
  };
  let className = '';
  let entriesLite: EntryLite[] = [];
  let value = prop.value as PropEntryPointer;
  let errors = prop.array ? value.entryIds.map(() => '') : [''];

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

  beforeUpdate(async () => {
    value = JSON.parse(JSON.stringify(prop.value));
    if (buffer.templateId !== value.templateId) {
      buffer.templateId = '' + value.templateId;
      await GeneralService.errorWrapper(
        async () => {
          return await sdk.entry.getAllLite(value.templateId);
        },
        async (ents: EntryLite[]) => {
          StoreService.update('entry', (store: Array<Entry | EntryLite>) => {
            for (let i = 0; i < ents.length; i++) {
              const ent = ents[i];
              if (!store.find(e => e._id === ent._id)) {
                store.push(ent);
              }
            }
            return store;
          })
          // entriesLite = ents;
        }
      );
    }
    if (prop.array && value.entryIds.length !== errors.length) {
      errors = value.entryIds.map(() => '');
    }
  });
  onDestroy(() => {
    entryStoreUnsub();
    unregisterFromChecher();
  });
</script>

<SinglePropWrapper cyTag="prop-entry-pointer" class={className} {prop}>
  <div class="prop--entry-pointer">
    {#if prop.array}
      <SinglePropArrayWrapper
        {prop}
        showSlot={value.entryIds.length > 0}
        on:add={() => {
          addItem();
        }}
      >
        {#each value.entryIds as id, i}
          <SinglePropArrayItem
            position={i}
            elementLength={value.entryIds.length}
            on:move={(event) => {
              moveItem(i, event.detail.move);
            }}
            on:remove={(event) => {
              removeItem(event.detail.position);
            }}
          >
            {#if entriesLite.length > 0}
              <Select
                cyTag="prop-entry-pointer-option-{i}"
                placeholder="Select an entry"
                selected={id}
                invalidText={errors[i]}
                options={entriesLite.map((e) => {
                  return { label: e.meta[0].props[0].value[0], value: e._id };
                })}
                on:change={(event) => {
                  value.entryIds[i] = event.detail.value;
                  prop.value = value;
                  dispatch('update', prop);
                }}
              />
            {/if}
            {#if id}
              <Link
                cyTag="prop-entry-pointer-open-option-{i}"
                newTab
                class="prop--entry-pointer--open bcmsButton bcmsButton_secondary"
                href="/dashboard/template/{value.templateId}/entry/{value
                  .entryIds[i]}"
              >
                Open this entry
              </Link>
            {/if}
          </SinglePropArrayItem>
        {/each}
      </SinglePropArrayWrapper>
    {:else}
      {#if entriesLite.length > 0}
        <Select
          cyTag="prop-entry-pointer-option"
          placeholder="Select an entry"
          selected={value.entryIds[0]}
          invalidText={errors[0]}
          options={entriesLite.map((e) => {
            return { label: e.meta[0].props[0].value[0], value: e._id };
          })}
          on:change={(event) => {
            value.entryIds[0] = event.detail.value;
            prop.value = value;
            dispatch('update', prop);
          }}
        />
      {/if}
      {#if value.entryIds[0]}
        <Link
          cyTag="prop-entry-pointer-open-option"
          newTab
          class="prop--entry-pointer--open bcmsButton bcmsButton_secondary"
          href="/dashboard/template/{value.templateId}/entry/{value
            .entryIds[0]}"
        >
          Open this entry
        </Link>
      {/if}
    {/if}
  </div>
</SinglePropWrapper>
