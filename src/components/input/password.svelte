<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export { className as class };
  export let value = '';
  export let placeholder = '';
  export let label = '';
  export let invalidText = '';
  export let disabled = false;

  const dispatch = createEventDispatcher();
  let className = '';
  let type: 'password' | 'text' = 'password';
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="bcmsInput bcmsInput_password {className}">
  <span class="bcmsInput--label">{label}</span>
  {#if invalidText}
    <p class="bcmsInput--error mb--5">{invalidText}</p>
  {/if}
  <span />
  <span
    class="bcmsInput--inner {invalidText ? 'bcmsInput--inner_isError' : ''}">
    <input
      class="bcmsInput--input"
      {placeholder}
      {value}
      {type}
      {disabled}
      on:change={(event) => {
        dispatch('input', event.target.value);
      }}
      on:keyup={(event) => {
        dispatch('input', event.target.value);
      }} />
    <span class="bcmsInput--actions">
      <slot name="actions" />
      <button
        class="bcmsInput--actions-btn fas fa-{type === 'password' ? 'eye-slash' : 'eye'}"
        on:click={() => {
          type = type === 'password' ? 'text' : 'password';
        }} />
    </span>
  </span>
</label>
