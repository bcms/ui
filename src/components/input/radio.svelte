<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export { className as class };
  export let value = false;
  export let disabled = false;
  export let name = '';

  const dispatch = createEventDispatcher();
  let className = '';
</script>

<span class="bcmsRadio {disabled ? 'bcmsRadio_disabled' : ''} {className}">
  <input
    on:change={(event) => {
      dispatch('input', event.target.checked);
    }}
    class="bcmsRadio--input"
    type="radio"
    {name}
    checked={value}
    {disabled} />
  <span class="bcmsRadio--outline" />
  <span class="bcmsRadio--circle">
    <slot name="checkmark" />
  </span>
</span>
