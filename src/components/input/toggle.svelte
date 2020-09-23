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
  let state = value ? true : false;
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
  <div class="input--toggle">
    <button
      {disabled}
      class="fas fa-{state ? 'toggle-on on' : 'toggle-off'}"
      on:click={() => {
        state = !state;
        dispatch('input', state);
      }} />
  </div>
</div>
