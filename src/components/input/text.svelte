<script lang="ts">
  import InputWrapper from './_wrapper.svelte';
  import { createEventDispatcher } from 'svelte';

  export { className as class };
  export let value = '';
  export let placeholder = '';
  export let label = '';
  export let invalidText = '';
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();
  let className = '';

  function inputHandler(event: Event) {
    const element = event.target as HTMLInputElement;

    if (!element) return;

    dispatch('input', element.value);
  }
</script>

<InputWrapper class={className} {label} {invalidText}>
  <input
    class="bcmsInput--input"
    {placeholder}
    {value}
    {disabled}
    on:change={inputHandler}
    on:keyup={(event) => {
      inputHandler(event);
      if (event.key === 'Enter') {
        dispatch('enter');
      }
    }} />
</InputWrapper>
