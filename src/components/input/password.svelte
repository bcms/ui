<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as uuid from 'uuid';

  export { className as class };
  export let id = uuid.v4();
  export let value = '';
  export let placeholder = '';
  export let label = '';
  export let helperText = '';
  export let invalidText = '';
  export let disabled = false;

  const dispatch = createEventDispatcher();
  let className = '';
  let type: 'password' | 'text' = 'password';
</script>

<div class="input {className}">
  {#if label !== ''}
    <label class="input--label" for="id">{label}</label>
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
  <div class="input--password">
    <input
      {id}
      {disabled}
      {placeholder}
      value={`${value}`}
      {type}
      on:change={(event) => {
        dispatch('input', event.target.value);
      }}
      on:keyup={(event) => {
        dispatch('input', event.target.value);
        if (event.key === 'Enter') {
          dispatch('enter');
        }
      }} />
    <button
      class="fas fa-{type === 'password' ? 'eye-slash' : 'eye'}"
      on:click={() => {
        type = type === 'password' ? 'text' : 'password';
      }} />
  </div>
</div>
