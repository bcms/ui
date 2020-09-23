<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as uuid from 'uuid';

  export { className as class };
  export let id = uuid.v4();
  export let label = '';
  export let helperText = '';
  export let invalidText = '';
  export let disabled = false;

  const dispatch = createEventDispatcher();
  let className = '';
</script>

<div class="input {className}">
  {#if label !== ''}
    <label class="input--label" for={id}>{label}</label>
    {#if helperText !== ''}
      <div class="input--helper">{helperText}</div>
    {/if}
  {/if}
  {#if invalidText !== ''}
    <div class="input--invalid">
      <span class="fas fa-exclamation icon" />
      {invalidText}
    </div>
  {/if}
  <div class="input--select">
    <select
      {disabled}
      on:change={(event) => {
        dispatch('change', event.target.value);
      }}
      on:blur={(event) => {
        dispatch('change', event.target.value);
      }}>
      <slot />
    </select>
    <div class="fas fa-chevron-down input--select-drop" />
  </div>
</div>
