<script lang="ts">
  import { beforeUpdate, createEventDispatcher } from 'svelte';
  import type { Prop, PropEnum } from '@becomes/cms-sdk';
  import { Select, SelectItem } from '../input';
  import SinglePropWrapper from './single-prop-wrapper.svelte';

  export { className as class };
  export let prop: Prop;

  const dispatch = createEventDispatcher();
  let className = '';
  let values = (prop.value as PropEnum).items;

  function selectItem(name: string) {
    (prop.value as PropEnum).selected = name;
    dispatch('update', prop);
  }
  beforeUpdate(() => {
    values = (prop.value as PropEnum).items;
  });
</script>

<SinglePropWrapper class={className} {prop}>
  <div class="prop--enum">
    <Select
      on:change={(event) => {
        selectItem(event.detail);
      }}>
      <SelectItem text="Select one" value="" selected />
      {#each values as value}
        <SelectItem text={value} {value} />
      {/each}
    </Select>
  </div>
</SinglePropWrapper>
