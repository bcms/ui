<script lang="ts">
  import InputWrapper from './_input.svelte';
  import { createEventDispatcher } from 'svelte';

  export { className as class };
  export let value = 0;
  export let placeholder = '';
  export let label = '';
  export let invalidText = '';
  export let disabled = false;
  export let helperText: string = undefined;

  const dispatch = createEventDispatcher();
  let className = '';

  function handleInput(event: Event) {
    const element = event.target as HTMLInputElement;
    if (!element) {
      return;
    }
    if (!isNaN(element.valueAsNumber)) {
      dispatch('input', element.valueAsNumber);
    } else {
      if (element.value !== '') {
        element.valueAsNumber = value;
      }
    }
    if ((event as KeyboardEvent).key === 'Enter') {
      dispatch('enter');
    }
  }
</script>

<InputWrapper class={className} {label} {invalidText} {helperText}>
  <input
    id={label}
    class="_bcmsInput--text"
    type="number"
    {placeholder}
    step="0.00000001"
    value={`${value}`}
    {disabled}
    on:change={handleInput}
    on:keyup={handleInput} />
</InputWrapper>
