<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as uuid from 'uuid';

  export { className as class };
  export let id = uuid.v4();
  export let value = 0;
  export let placeholder = '';
  export let label = '';
  export let helperText = '';
  export let invalidText = '';
  export let disabled: boolean = false;

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
  <input
    {id}
    {disabled}
    {placeholder}
    type="number"
    value={`${value}`}
    on:change={(event) => {
      if (!isNaN(event.target.valueAsNumber)) {
        dispatch('input', event.target.valueAsNumber);
      } else {
        if (event.target.value !== '') {
          event.target.valueAsNumber = value;
        }
      }
    }}
    on:keyup={(event) => {
      if (!isNaN(event.target.valueAsNumber)) {
        dispatch('input', event.target.valueAsNumber);
      } else {
        if (event.target.value !== '') {
          event.target.valueAsNumber = value;
        }
      }
      if (event.key === 'Enter') {
        dispatch('enter');
      }
    }} />
</div>
