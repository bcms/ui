<script lang="ts">
  import { beforeUpdate, createEventDispatcher } from 'svelte';
  import type { Prop } from '@becomes/cms-sdk';
  import SinglePropWrapper from '../single-prop-wrapper.svelte';
  import SinglePropArrayWrapper from '../single-prop-array-wrapper.svelte';
  import SinglePropArrayItem from '../single-prop-array-item.svelte';
  import Button from '../../button.svelte';
  import InnerMedia from './_inner.svelte';
  import { StoreService } from '../../../services';

  export { className as class };
  export let prop: Prop;
  export let propIndex: number;
  export let depth = '';

  const dispatch = createEventDispatcher();
  let className = '';
  let values = prop.value as string[];

  function addItem() {
    (prop.value as string[]).push('');
    dispatch('update', prop);
  }
  function moveItem(position: number, moveBy: number) {
    const buffer = '' + values[position + moveBy];
    values[position + moveBy] = '' + values[position];
    values[position] = buffer;
    prop.value = [...values];
    dispatch('update', prop);
  }
  function removeItem(position: number) {
    (prop.value as string[]).splice(position, 1);
    dispatch('update', prop);
  }

  beforeUpdate(() => {
    values = prop.value as Array<any>;
  });
</script>

<SinglePropWrapper class={className} {prop}>
  <div class="bcmsMedia">
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
            <InnerMedia
              value={prop.value[i]}
              on:clear={() => {
                prop.value[0] = '';
                dispatch('update', prop);
              }}
              on:click={() => {
                StoreService.update('MediaPickerModal', {
                  show: true,
                  prop,
                  propIndex,
                  valueIndex: -1,
                  depth,
                });
              }} />

            <!-- <FileInput
              customOnClick={true}
              uri={prop.value[i]}
              disabled={true}
              on:input={(event) => {
                popup.error('Feature not yet implemented.');
              }}
              on:click={() => {
                StoreService.update('MediaPickerModal', {
                  show: true,
                  prop,
                  propIndex,
                  valueIndex: i,
                  depth,
                });
              }} /> -->
          </SinglePropArrayItem>
        {/each}
      </SinglePropArrayWrapper>
    {:else}
      <InnerMedia
        value={prop.value[0]}
        on:clear={() => {
          prop.value[0] = '';
          dispatch('update', prop);
        }}
        on:click={() => {
          StoreService.update('MediaPickerModal', {
            show: true,
            prop,
            propIndex,
            valueIndex: -1,
            depth,
          });
        }} />

      <!-- <FileInput
        customOnClick={true}
        uri={prop.value[0]}
        disabled={true}
        on:input={(event) => {
          popup.error('Feature not yet implemented.');
        }}
        on:click={() => {
          StoreService.update('MediaPickerModal', {
            show: true,
            prop,
            propIndex,
            valueIndex: -1,
            depth,
          });
        }} /> -->
    {/if}
  </div>
</SinglePropWrapper>
