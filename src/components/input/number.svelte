<script lang="ts">
  import InputWrapper from './_wrapper.svelte';
  import { createEventDispatcher } from 'svelte';

  export { className as class };
  export let value = 0;
  export let placeholder = '';
  export let label = '';
  export let invalidText = '';
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();
  let className = '';
</script>

<InputWrapper class={className} {label} {invalidText}>
  <input
    class="bcmsInput--input"
    type="number"
    {placeholder}
    value={`${value}`}
    {disabled}
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
</InputWrapper>
