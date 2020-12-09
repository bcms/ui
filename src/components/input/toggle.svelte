<script lang="ts">
  import { createEventDispatcher, beforeUpdate } from 'svelte';
  import InputWrapper from './_input.svelte';

  export { className as class };
  export let label: string = undefined;
  export let value: boolean = false;
  export let disabled: boolean = false;
  export let states: [string, string] = undefined;
  export let helperText: string = undefined;

  const dispatch = createEventDispatcher();
  let className = '';
  let state = value ? true : false;

  beforeUpdate(() => {
    state = value ? true : false;
  });
</script>

<InputWrapper class="_bcmsInput--toggle_contentWidth {className}" {label} {helperText} on:click={() => {
    if (!disabled) {
      dispatch('input', !state);
    }
}}>
  <div
    class="_bcmsInput--toggle">
    <span
      class="_bcmsInput--toggle-inner
        {state ? '_bcmsInput--toggle-inner_checked' : ''}
        {disabled ? '_bcmsInput--toggle-inner_disabled' : ''}">
      <span class="circle" />
    </span>
    {#if states && states.length === 2}
      <span
        class="_bcmsInput--toggle-state">{state ? states[0] : states[1]}</span>
    {/if}
  </div>
</InputWrapper>
