<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export { className as class };
  export let value = '';
  export let placeholder = '';
  export let label = '';
  export let invalidText = '';
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();
  let className = '';
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="bcmsInput bcmsInput_text {className}">
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
      {disabled}
      on:change={(event) => {
        dispatch('input', event.target.value);
      }}
      on:keyup={(event) => {
        dispatch('input', event.target.value);
        if (event.key === 'Enter') {
          dispatch('enter');
        }
      }} />
    <span class="bcmsInput--actions">
      <slot name="actions" />
      {#if invalidText}
        <span class="bcmsInput--tooltip">
          <i class="fas fa-exclamation-triangle" />
        </span>
      {/if}
    </span>
  </span>
</label>
