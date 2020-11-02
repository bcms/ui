<script lang="ts">
  import InputWrapper from '../_wrapper.svelte';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { MultiAddInputItem } from './';

  export { className as class };
  export let value: string[] = [];
  export let placeholder = '';
  export let label = '';
  export let invalidText = '';
  export let disabled = false;
  export let formater: (value: string) => string = undefined;
  export let validate: (items: string[]) => string = undefined;

  const dispatch = createEventDispatcher();
  let className = '';
  let items: string[] = [...value];
</script>

<InputWrapper class={className} {label} {invalidText}>
  <input
    class="bcmsInput--input"
    {placeholder}
    {disabled}
    on:change={(event) => {
      if (formater) {
        event.target.value = formater(event.target.value);
      }
    }}
    on:keyup={(event) => {
      if (event.key === 'Enter' && event.target.value) {
        if (validate) {
          const error = validate([...items, event.target.value]);
          if (error) {
            invalidText = error;
            return;
          }
        }
        items = [...items, event.target.value];
        event.target.value = '';
        dispatch('update', items);
      } else {
        if (formater) {
          event.target.value = formater(event.target.value);
        }
      }
    }} />
  <div
    slot="enumeration"
    in:fade={{ duration: 300, delay: 300 }}
    class="mt--10">
    <ul class="bcmsInput--enumeration">
      {#each items as item}
        <MultiAddInputItem
          {item}
          on:update={() => {
            items = items.filter((e) => e !== item);
            dispatch('update', items);
          }} />
      {/each}
    </ul>
  </div>
</InputWrapper>
