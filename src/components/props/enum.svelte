<script lang="ts">
  import { beforeUpdate, createEventDispatcher, onDestroy } from 'svelte';
  import type { Prop, PropEnum } from '@becomes/cms-sdk';
  import { Select } from '../input';
  import SinglePropWrapper from './single-prop-wrapper.svelte';
  import { PropsCheckerService } from '../../services';

  export { className as class };
  export let prop: Prop;

  const unregisterFromChecher = PropsCheckerService.register(() => {
    let isOk = true;
    if (prop.required) {
      if (!value.selected) {
        error = 'Option must be selected.';
        isOk = false;
      } else {
        error = '';
      }
    }
    return isOk;
  });
  const dispatch = createEventDispatcher();
  let className = '';
  let value = prop.value as PropEnum;
  let error: string = '';

  function selectItem(name: string) {
    (prop.value as PropEnum).selected = name;
    dispatch('update', prop);
  }
  beforeUpdate(() => {
    value = prop.value as PropEnum;
  });
  onDestroy(() => {
    unregisterFromChecher();
  });
</script>

<SinglePropWrapper class={className} {prop}>
  <div class="prop--enum">
    <Select
      placeholder="Select one"
      selected={value.selected}
      invalidText={error}
      options={value.items.map((e) => {
        return { label: e, value: e };
      })}
      on:change={(event) => {
        value.selected = event.detail.value;
        selectItem(event.detail.value);
      }} />
  </div>
</SinglePropWrapper>
