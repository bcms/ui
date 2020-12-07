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

  function format(event: Event) {
    if (typeof formater === 'function') {
      const element = event.target as HTMLInputElement;
      if (!element) {
        return;
      }
      element.value = formater(element.value);
    }
  }
  function handleInput(event: Event | KeyboardEvent) {
    const element = event.target as HTMLInputElement;
    if (!element) {
      return;
    }
    if ((event as KeyboardEvent).key === 'Enter' && element.value) {
      if (typeof validate === 'function') {
        const error = validate([...items, element.value]);
        if (error) {
          invalidText = error;
          return;
        }
      }
      items = [...items, element.value];
      element.value = '';
      dispatch('update', items);
    } else {
      if (typeof formater === 'function') {
        element.value = formater(element.value);
      }
    }
  }
</script>

<InputWrapper class={className} {label} {invalidText}>
  <input
    class="bcmsInput--input"
    {placeholder}
    {disabled}
    on:change={handleInput}
    on:keyup={handleInput} />
  <div
    slot="enumeration"
    in:fade={{ duration: 300, delay: 300 }}
    class="mt-10">
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
