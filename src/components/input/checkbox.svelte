<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { CheckmarkIcon } from '../icons';

  export { className as class };
  export let value = false;
  export let disabled = false;

  const dispatch = createEventDispatcher();
  let className = '';
</script>

<span
  class="bcmsCheckbox {disabled ? 'bcmsCheckbox_disabled' : ''} {className}">
  <input
    type="checkbox"
    class="bcmsCheckbox--input vh"
    checked={value}
    {disabled}
    on:change={(event) => {
      dispatch('input', event.target.checked);
    }} />
  <span class="bcmsCheckbox--inner">
    <CheckmarkIcon />
  </span>
</span>
