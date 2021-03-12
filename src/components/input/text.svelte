<script lang="ts">
  import * as uuid from 'uuid';
  import { createEventDispatcher } from 'svelte';
  import InputWrapper from './_input.svelte';
  import { cy } from '../../services';

  export { className as class };
  export let value = '';
  export let placeholder = '';
  export let label = '';
  export let invalidText = '';
  export let disabled = false;
  export let helperText: string = undefined;
  export let cyTag: string = undefined;

  const inputId = uuid.v4();
  const dispatch = createEventDispatcher();
  let className = '';

  function inputHandler(event: Event) {
    const element = event.target as HTMLInputElement;
    if (!element) {
      return;
    }
    dispatch('input', element.value);
  }
</script>

<InputWrapper id={inputId} class={className} {label} {invalidText} {helperText}>
  <input
    use:cy={cyTag}
    id={label ? label : inputId}
    class="_bcmsInput--text"
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
