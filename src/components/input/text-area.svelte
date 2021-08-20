<script lang="ts">
  import * as uuid from 'uuid';
  import InputWrapper from './_input.svelte';
  import { createEventDispatcher, onMount } from 'svelte';

  export { className as class };
  export let value = '';
  export let placeholder = '';
  export let label = '';
  export let invalidText = '';
  export let disabled = false;
  export let minHeight = 44;
  export let helperText: string = undefined;

  const inputId = uuid.v4();
  const dispatch = createEventDispatcher();
  let className = '';
  let height = minHeight + 0;

  function inputHandler(event: Event) {
    const element = event.target as HTMLTextAreaElement;
    if (!element) {
      return;
    }
    dispatch('input', element.value);
  }
  function handleHeight(event: Event) {
    const element = event.target as HTMLInputElement;
    if (!element) {
      return;
    }
    height = Math.min(element.scrollHeight);
  }
  onMount(() => {
    let el = document.getElementById(inputId);
    if (!el) {
      el = document.getElementById(label);
    }
    handleHeight({ target: el } as never);
  });
</script>

<InputWrapper id={inputId} class={className} {label} {invalidText} {helperText}>
  <textarea
    id={label ? label : inputId}
    class="_bcmsInput--textarea customScrollbar"
    on:change={inputHandler}
    on:keyup={inputHandler}
    on:input={handleHeight}
    {placeholder}
    value={`${value}`}
    {disabled}
    style="min-height: {minHeight}px; height: {height}px"
  />
</InputWrapper>
