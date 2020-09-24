<script lang="ts">
  import { afterUpdate, createEventDispatcher } from 'svelte';
  import type { Template } from '@becomes/cms-sdk';
  import { GeneralService, sdk } from '../../../services';
  import Select from './select.svelte';
  import SelectItem from './item.svelte';

  export { className as class };
  export let template: Template;

  const dispatch = createEventDispatcher();
  let displayProps: Array<{
    name: string;
    value: string;
  }> = template.props
    .filter((e) => e.type === 'STRING')
    .map((tempProps) => {
      return {
        name: GeneralService.string.toPretty(tempProps.name),
        value: tempProps.name,
      };
    });
  let className = '';

  afterUpdate(() => {
    displayProps = template.props
      .filter((e) => e.type === 'STRING')
      .map((tempProps) => {
        return {
          name: GeneralService.string.toPretty(tempProps.name),
          value: tempProps.name,
        };
      });
  });
</script>

<Select
  class={className}
  label="Select a display property"
  on:change={(event) => {
    if (event.detail === '') {
      dispatch('select', undefined);
      return;
    }
    dispatch('select', event.detail);
  }}>
  {#each displayProps as prop}
    <SelectItem text={prop.name} value={prop.value} />
  {/each}
</Select>
