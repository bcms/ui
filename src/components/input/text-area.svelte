<script lang="ts">
  import InputWrapper from './_wrapper.svelte';
  import { createEventDispatcher } from 'svelte';

  export { className as class };
  export let value = '';
  export let placeholder = '';
  export let label = '';
  export let invalidText = '';
  export let disabled = false;
  export let minHeight = 44;

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
</script>

<InputWrapper class="{className} bcmsInput_textarea" {label} {invalidText}>
  <textarea
    on:change={inputHandler}
    on:input={handleHeight}
    {placeholder}
    value={`${value}`}
    {disabled}
    class="bcmsInput--input"
    style="min-height: {minHeight}px; height: {height}px" />
</InputWrapper>
