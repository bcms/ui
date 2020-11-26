<script lang="ts">
  import { beforeUpdate, createEventDispatcher } from 'svelte';
  import type { Prop, PropEnum } from '@becomes/cms-sdk';
  import { Select, SelectItem } from '../input';
  import SinglePropWrapper from './single-prop-wrapper.svelte';

  export { className as class };
  export let prop: Prop;

  const dispatch = createEventDispatcher();
  let className = '';
  let value = prop.value as PropEnum;

  function selectItem(name: string) {
    (prop.value as PropEnum).selected = name;
    dispatch('update', prop);
  }
  beforeUpdate(() => {
    value = prop.value as PropEnum;
  });
</script>

<SinglePropWrapper class={className} {prop}>
  <div class="prop--enum">
    <Select
      placeholder="Select one"
      selected={value.selected ? '' : value.selected}
      options={value.items.map((e) => {
        return { label: e, value: e };
      })}
      on:change={(event) => {
        selectItem(event.detail);
      }}>
      <!-- <SelectItem
        text="Select one"
        value=""
        selected={value.selected ? false : true} /> -->
      <!-- {#each value.items as v}
        <SelectItem
          text={v}
          value={v}
          selected={value.selected === v ? true : false} />
      {/each} -->
    </Select>
  </div>
</SinglePropWrapper>
