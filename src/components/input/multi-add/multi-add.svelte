<script lang="ts">
  import InputWrapper from '../_input.svelte';
  import { beforeUpdate, createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { MultiAddInputItem } from './';

  export { className as class };
  export let value: string[] = [];
  export let placeholder = '';
  export let label = '';
  export let invalidText = '';
  export let helperText: string = undefined;
  export let disabled = false;
  export let formater: (value: string) => string = undefined;
  export let validate: (items: string[]) => string = undefined;

  const dispatch = createEventDispatcher();
  let className = '';
  let items: string[] = [...value];
  let updating = false;

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
        } else {
          invalidText = '';
        }
      }
      updating = true;
      items = [...items, element.value];
      element.value = '';
      dispatch('update', items);
    } else {
      if (typeof formater === 'function') {
        element.value = formater(element.value);
      }
    }
  }

  beforeUpdate(() => {
    if (
      JSON.stringify(items) !== JSON.stringify(value) &&
      !updating &&
      !invalidText
    ) {
      items = [...value];
    }
    updating = false;
  });
</script>

<InputWrapper class={className} {label} {invalidText} {helperText}>
  <input
    id={label}
    class="_bcmsInput--text"
    {placeholder}
    {disabled}
    on:change={handleInput}
    on:keyup={handleInput}
  />
  <div class="_bcmsInput--multiAdd" in:fade={{ duration: 300, delay: 300 }}>
    <ul>
      {#each items as item}
        <MultiAddInputItem
          {item}
          {disabled}
          on:remove={() => {
            updating = true;
            items = items.filter((e) => e !== item);
            dispatch('update', items);
          }}
        />
      {/each}
    </ul>
  </div>
</InputWrapper>
