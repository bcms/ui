<script lang="ts">
  import { beforeUpdate, createEventDispatcher } from 'svelte';
  import type { Prop } from '@becomes/cms-sdk';
  import { NumberInput } from '../input';
  import SinglePropWrapper from './single-prop-wrapper.svelte';
  import SinglePropArrayWrapper from './single-prop-array-wrapper.svelte';
  import SinglePropArrayItem from './single-prop-array-item.svelte';

  export { className as class };
  export let prop: Prop;

  const dispatch = createEventDispatcher();
  let className = '';
  let values = prop.value as number[];

  function addItem() {
    (prop.value as number[]).push(0);
    dispatch('update', prop);
  }
  function moveItem(position: number, moveBy: number) {
    const buffer = 0 + values[position + moveBy];
    values[position + moveBy] = 0 + values[position];
    values[position] = buffer;
    prop.value = [...values];
    dispatch('update', prop);
  }
  function removeItem(position: number) {
    (prop.value as number[]).splice(position, 1);
    dispatch('update', prop);
  }

  beforeUpdate(() => {
    values = prop.value as Array<any>;
  });
</script>

<SinglePropWrapper class={className} {prop}>
  <div class="prop--number">
    {#if prop.array}
      <SinglePropArrayWrapper
        {prop}
        showSlot={values.length > 0}
        on:add={() => {
          addItem();
        }}>
        {#each values as value, i}
          <SinglePropArrayItem
            position={i}
            elementLength={values.length}
            on:move={(event) => {
              moveItem(i, event.detail.move);
            }}
            on:remove={(event) => {
              removeItem(event.detail.position);
            }}>
            <NumberInput
              value={prop.value[i]}
              placeholder="Item {i + 1}"
              on:input={(event) => {
                prop.value[i] = event.detail;
                dispatch('update', prop);
              }} />
          </SinglePropArrayItem>
        {/each}
      </SinglePropArrayWrapper>
    {:else}
      <NumberInput
        value={prop.value[0]}
        placeholder={prop.label}
        on:input={(event) => {
          prop.value[0] = event.detail;
          dispatch('update', prop);
        }} />
    {/if}
  </div>
</SinglePropWrapper>
