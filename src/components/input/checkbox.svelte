<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as uuid from 'uuid';

  export { className as class };
  export let id = uuid.v4();
  export let value: boolean = false;
  export let label = '';
  export let helperText = '';
  export let invalidText = '';
  export let disabled = false;

  const dispatch = createEventDispatcher();
  let className = '';
</script>

<div class="input--checkbox {className}">
  <div class="input--checkbox-in-label">
    <input
      {id}
      {disabled}
      type="checkbox"
      checked={value ? true : false}
      on:change={(event) => {
        dispatch('input', event.target.checked);
      }} />
    {#if label}
      <label class="input--checkbox-label" for={id}>{label}</label>
    {/if}
  </div>
  {#if helperText}
    <div class="input--helper">{helperText}</div>
  {/if}
  {#if invalidText}
    <div class="input--invalid">
      <span class="fas fa-exclamation icon" />
      {invalidText}
    </div>
  {/if}
</div>
