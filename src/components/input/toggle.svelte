<script lang="ts">
  import { createEventDispatcher, beforeUpdate } from 'svelte';

  export { className as class };
  export let value = false;
  export let disabled = false;

  const dispatch = createEventDispatcher();
  let className = '';
  let state = value ? true : false;

  beforeUpdate(() => {
    state = value;
  });
</script>

<span class="bcmsToggle {disabled ? 'bcmsToggle_disabled' : ''} {className}">
  <input
    type="checkbox"
    class="bcmsToggle--input vh"
    checked={state}
    {disabled}
    on:change={(event) => {
      dispatch('input', event.target.checked);
    }} />
  <span class="bcmsToggle--inner"> <span class="circle" /> </span>
</span>
