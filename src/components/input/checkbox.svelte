<script lang="ts">
  import * as uuid from 'uuid';
  import { createEventDispatcher } from 'svelte';
  import { CheckmarkIcon } from '../icons';

  export { className as class };
  export let id = uuid.v4();
  export let value = false;
  export let disabled = false;
  export let helperText: string = undefined;

  const dispatch = createEventDispatcher();
  let className = '';

  function handlerInput(event: Event) {
    const element = event.target as HTMLInputElement;
    if (!element) {
      return;
    }
    dispatch('input', element.checked);
  }
</script>

<label class="checkboxLabel {className}" for={id}>
  <span class="bcmsCheckbox {disabled ? 'bcmsCheckbox_disabled' : ''}">
    <input
      {id}
      type="checkbox"
      class="bcmsCheckbox--input vh"
      checked={value}
      {disabled}
      on:change={handlerInput} />
    <span class="bcmsCheckbox--inner">
      <CheckmarkIcon />
    </span>
  </span>
  <span class="checkboxLabel--textContent ml--10"><slot /></span>
</label>
{#if helperText}<span class="helperText">{helperText}</span>{/if}
