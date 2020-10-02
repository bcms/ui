<script lang="ts">
  import { beforeUpdate, createEventDispatcher } from 'svelte';
  import type { Prop, PropGroupPointer } from '@becomes/cms-sdk';
  import SinglePropWrapper from './single-prop-wrapper.svelte';
  import SinglePropArrayWrapper from './single-prop-array-wrapper.svelte';
  import SinglePropArrayItem from './single-prop-array-item.svelte';
  import PropsEditor from './props-editor.svelte';

  export { className as class };
  export let prop: Prop;
  export let depth = '';

  const dispatch = createEventDispatcher();
  let className = '';
  let value = prop.value as PropGroupPointer;

  function updateProp(
    itemIndex: number,
    propItemIndex: number,
    propItem: Prop
  ) {
    prop.value = prop.value as PropGroupPointer;
    prop.value.items[itemIndex].props[propItemIndex] = propItem;
    dispatch('update', prop);
  }
  function addItem() {
    (prop.value as string[]).push('');
    dispatch('update', prop);
  }
  function moveItem(position: number, moveBy: number) {
    // const buffer = '' + value.items[position + moveBy];
    // values[position + moveBy] = '' + values[position];
    // values[position] = buffer;
    // prop.value = [...values];
    // dispatch('update', prop);
  }
  function removeItem(position: number) {
    (prop.value as string[]).splice(position, 1);
    dispatch('update', prop);
  }

  beforeUpdate(() => {
    value = prop.value as PropGroupPointer;
  });
</script>

<SinglePropWrapper class={className} {prop}>
  <div class="prop--group-pointer mt--20">
    {#if prop.array}
      <SinglePropArrayWrapper
        {prop}
        on:add={() => {
          addItem();
        }}>
        {#each value.items as item, i}
          <SinglePropArrayItem
            position={i}
            elementLength={value.items.length}
            on:move={(event) => {
              moveItem(i, event.detail.move);
            }}
            on:remove={(event) => {
              removeItem(event.detail.position);
            }}>
            <PropsEditor
              depth="{depth}.value.items.{i}.props"
              props={value.items[0].props}
              on:update={(event) => {
                updateProp(i, event.detail.propIndex, event.detail.prop);
              }} />
          </SinglePropArrayItem>
        {/each}
      </SinglePropArrayWrapper>
    {:else}
      <PropsEditor
        depth="{depth}.value.items.0.props"
        props={value.items[0].props}
        on:update={(event) => {
          updateProp(0, event.detail.propIndex, event.detail.prop);
        }} />
    {/if}
  </div>
</SinglePropWrapper>
