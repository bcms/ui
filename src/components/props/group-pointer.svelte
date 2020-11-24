<script lang="ts">
  import { beforeUpdate, createEventDispatcher } from 'svelte';
  import type { Group, Prop, PropGroupPointer } from '@becomes/cms-sdk';
  import SinglePropWrapper from './single-prop-wrapper.svelte';
  import SinglePropArrayWrapper from './single-prop-array-wrapper.svelte';
  import SinglePropArrayItem from './single-prop-array-item.svelte';
  import PropsEditor from './props-editor.svelte';
  import { GeneralService, sdk } from '../../services';

  export { className as class };
  export let prop: Prop;
  export let depth = '';

  const dispatch = createEventDispatcher();
  let className = '';
  let value = prop.value as PropGroupPointer;

  interface GroupPointerItem {
    props: Prop[];
  }

  function updateProp(
    itemIndex: number,
    propItemIndex: number,
    propItem: Prop
  ) {
    prop.value = prop.value as PropGroupPointer;
    prop.value.items[itemIndex].props[propItemIndex] = propItem;
    dispatch('update', prop);
  }
  async function addItem() {
    const group: Group = await GeneralService.errorWrapper(
      async () => {
        return await sdk.group.get((prop.value as PropGroupPointer)._id);
      },
      async (result: Group) => {
        return result;
      }
    );
    if (group) {
      (prop.value as PropGroupPointer).items.push({
        props: group.props,
      });
      dispatch('update', prop);
    }
  }
  function moveItem(position: number, moveBy: number) {
    const buffer: GroupPointerItem = JSON.parse(
      JSON.stringify(value.items[position + moveBy])
    );
    value.items[position + moveBy] = JSON.parse(
      JSON.stringify(value.items[position])
    );
    value.items[position] = buffer;
    (prop.value as PropGroupPointer).items = [...value.items];
    dispatch('update', prop);
  }
  function removeItem(position: number) {
    (prop.value as PropGroupPointer).items.splice(position, 1);
    dispatch('update', prop);
  }

  beforeUpdate(() => {
    value = prop.value as PropGroupPointer;
  });
</script>

<SinglePropWrapper class={className} {prop} style="border: 1px solid var(--c-gray);">
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
              props={item.props}
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
