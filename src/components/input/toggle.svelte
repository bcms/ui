<script lang="ts">
  import { createEventDispatcher, beforeUpdate } from 'svelte';

  export { className as class };
  export let value: boolean = false;
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();
  let className = '';
  let state = value ? true : false;

  function handleInput(event: Event) {
    const element = event.target as HTMLInputElement;
    dispatch('input', element.checked);
  }

  beforeUpdate(() => {
    state = value ? true : false;
  });
</script>

<span class="bcmsToggle {disabled ? 'bcmsToggle_disabled' : ''} {className}">
  <input
    type="checkbox"
    class="bcmsToggle--input vh"
    checked={state}
    {disabled}
    on:change={(event) => {
      handleInput(event);
    }} />
  <span class="bcmsToggle--inner"> <span class="circle" /> </span>
</span>
