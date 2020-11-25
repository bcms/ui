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

  function inputHandler(event: Event) {
    const element = event.target as HTMLTextAreaElement;

    if (!element) return;

    dispatch('input', element.value);
  }
</script>

<InputWrapper class="{className} bcmsInput_textarea" {label} {invalidText}>
  <textarea
    on:change={inputHandler}
    on:input={(event) => {
      event.target.style.height = '';
      event.target.style.height = `${Math.min(event.target.scrollHeight)}px`;
    }}
    {placeholder}
    value={`${value}`}
    {disabled}
    class="bcmsInput--input"
    style="min-height: {minHeight}px" />
</InputWrapper>
