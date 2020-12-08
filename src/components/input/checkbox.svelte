<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { CheckmarkIcon } from '../icons';
  import InputWrapper from './_input.svelte';

  export { className as class };
  export let label: string = undefined;
  export let value = false;
  export let disabled = false;
  export let description: string = undefined;
  export let invalidText: string = undefined;
  export let helperText: string = undefined;

  const dispatch = createEventDispatcher();
  let className = '';

  function handlerInput(event: Event) {
    const element = event.target as HTMLInputElement;
    if (!element) {
      return;
    }
    dispatch('input', element.checked);
  }
</script>

<InputWrapper class={className} {label} {invalidText} {helperText}>
  <div
    class="_bcmsInput--checkbox {disabled ? '_bcmsInput--checkbox_disabled' : ''}">
    <input
      id={label}
      type="checkbox"
      class="_bcmsInput--checkbox-input sr-only"
      checked={value}
      {disabled}
      on:change={handlerInput} />
    <span class="_bcmsInput--checkbox-icon">
      <CheckmarkIcon />
    </span>
    {#if description}
      <span class="_bcmsInput--checkbox-description">{description}</span>
    {/if}
  </div>
</InputWrapper>

<!-- <label class="checkboxLabel {className}" for={id}>
  <span class="bcmsCheckbox {disabled ? 'bcmsCheckbox_disabled' : ''}">
    <input
      {id}
      type="checkbox"
      class="bcmsCheckbox--input sr-only"
      checked={value}
      {disabled}
      on:change={handlerInput} />
    <span class="bcmsCheckbox--inner">
      <CheckmarkIcon />
    </span>
  </span>
  <span class="checkboxLabel--textContent ml-10"><slot /></span>
</label>
{#if helperText}<span class="bcmsInput--helperText">{helperText}</span>{/if} -->
