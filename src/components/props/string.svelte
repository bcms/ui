<script lang="ts">
  import { beforeUpdate, createEventDispatcher, onDestroy } from 'svelte';
  import type { Prop } from '@becomes/cms-sdk';
  import { PropsCheckerService } from '../../services';
  import { TextArea } from '../input';
  import SinglePropWrapper from './single-prop-wrapper.svelte';
  import SinglePropArrayWrapper from './single-prop-array-wrapper.svelte';
  import SinglePropArrayItem from './single-prop-array-item.svelte';

  export { className as class };
  export let prop: Prop;

  const unregisterFromChecher = PropsCheckerService.register(() => {
    let isOk = true;
    if (prop.required) {
      for (let i = 0; i < values.length; i++) {
        if (!values[i]) {
          errors[i] = 'Input must contain some text.';
          isOk = false;
        } else {
          errors[i] = '';
        }
      }
    }
    return isOk;
  });
  const dispatch = createEventDispatcher();
  let className = '';
  let values = prop.value as string[];
  let errors = values.map(() => '');

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
    if (errors.length !== values.length) {
      errors = values.map(() => '');
    }
  });
  onDestroy(() => {
    unregisterFromChecher();
  });
</script>

<SinglePropWrapper class={className} {prop}>
  <div class="prop--string">
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
            <TextArea
              value={prop.value[i]}
              placeholder="Item {i + 1}"
              invalidText={errors[i]}
              on:input={(event) => {
                prop.value[i] = event.detail;
                dispatch('update', prop);
              }} />
          </SinglePropArrayItem>
        {/each}
      </SinglePropArrayWrapper>
    {:else}
      <TextArea
        value={prop.value[0]}
        placeholder={prop.label}
        invalidText={errors[0]}
        on:input={(event) => {
          prop.value[0] = event.detail;
          dispatch('update', prop);
        }} />
    {/if}
  </div>
</SinglePropWrapper>
