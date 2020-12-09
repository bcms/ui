<script lang="ts">
  import { beforeUpdate, createEventDispatcher } from 'svelte';
  import type { Prop } from '@becomes/cms-sdk';
  import { ToggleInput } from '../input';
  import SinglePropWrapper from './single-prop-wrapper.svelte';
  import SinglePropArrayWrapper from './single-prop-array-wrapper.svelte';
  import SinglePropArrayItem from './single-prop-array-item.svelte';

  export { className as class };
  export let prop: Prop;

  const dispatch = createEventDispatcher();
  let className = '';
  let values = prop.value as boolean[];

  function addItem() {
    (prop.value as boolean[]).push(false);
    dispatch('update', prop);
  }
  function moveItem(position: number, moveBy: number) {
    const buffer = values[position + moveBy] ? true : false;
    values[position + moveBy] = values[position] ? true : false;
    values[position] = buffer;
    prop.value = [...values];
    dispatch('update', prop);
  }
  function removeItem(position: number) {
    (prop.value as boolean[]).splice(position, 1);
    dispatch('update', prop);
  }

  beforeUpdate(() => {
    values = prop.value as Array<any>;
  });
</script>

<SinglePropWrapper class={className} {prop}>
  <div class="prop--boolean">
    {#if prop.array}
      <SinglePropArrayWrapper
        {prop}
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
            <ToggleInput
              {value}
              on:input={(event) => {
                prop.value[i] = event.detail;
                dispatch('update', prop);
              }} />
          </SinglePropArrayItem>
        {/each}
      </SinglePropArrayWrapper>
    {:else}
      <ToggleInput
        value={prop.value[0]}
        on:input={(event) => {
          prop.value[0] = event.detail;
          dispatch('update', prop);
        }} />
    {/if}
  </div>
</SinglePropWrapper>
