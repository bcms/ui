<script lang="ts">
  import * as uuid from 'uuid';
  import { createEventDispatcher, beforeUpdate } from 'svelte';
  import InputWrapper from './_wrapper.svelte';

  export let id = uuid.v4();
  export { className as class };
  export let label: string = undefined;
  export let value: boolean = false;
  export let disabled: boolean = false;
  export let states: [string, string] = undefined;
  export let helperText: string = undefined;

  const dispatch = createEventDispatcher();
  let className = '';
  let state = value ? true : false;

  function handleInput(event: Event) {
    const element = event.target as HTMLInputElement;
    dispatch('input', element.checked);
  }

  beforeUpdate(() => {
    state = value ? true : false;
  });
</script>

<!-- <InputWrapper class={className} {label} {helperText}>
  <div class="bcmsInput--toggle">
    <span
      class="bcmsToggle {disabled ? 'bcmsToggle_disabled' : ''} {className}">
      <input
        {id}
        type="checkbox"
        class="bcmsToggle--input sr-only"
        checked={state}
        {disabled}
        on:change={(event) => {
          handleInput(event);
        }} />
      <span class="bcmsToggle--inner"> <span class="circle" /> </span>
    </span>
    {#if states && states.length === 2}
      <span
        class="checkboxLabel--textContent ml-10">{state ? states[0] : states[1]}</span>
    {/if}
  </div>
</InputWrapper> -->
<label for={id}>
  {#if label}
    <p class="bcmsInput--label">{label}</p>
  {/if}
  <span class="bcmsToggle {disabled ? 'bcmsToggle_disabled' : ''} {className}">
    <input
      {id}
      type="checkbox"
      class="bcmsToggle--input sr-only"
      checked={state}
      {disabled}
      on:change={(event) => {
        handleInput(event);
      }} />
    <span class="bcmsToggle--inner"> <span class="circle" /> </span>
  </span>
  {#if states && states.length === 2}
    <span
      class="checkboxLabel--textContent ml-10">{state ? states[0] : states[1]}</span>
  {/if}
</label>
{#if helperText}<span class="bcmsInput--helperText">{helperText}</span>{/if}
