<script lang="ts">
  import * as uuid from 'uuid';
  import { createEventDispatcher, beforeUpdate } from 'svelte';
  import InputWrapper from './_input.svelte';

  export { className as class };
  export let label: string = undefined;
  export let value: boolean = false;
  export let disabled: boolean = false;
  export let states: [string, string] = undefined;
  export let helperText: string = undefined;

  const inputId = uuid.v4();
  const dispatch = createEventDispatcher();
  let className = '';
  let state = value ? true : false;

  function keydownHandler(event: KeyboardEvent) {
    const element = event.target as HTMLDivElement;
    if (!element) {
      return;
    }

    if (event.key === 'Enter') {
      dispatch('input', !state);
    }
  }

  beforeUpdate(() => {
    state = value ? true : false;
  });
</script>

<InputWrapper
  id={inputId}
  class="_bcmsInput--toggle_contentWidth {className}"
  {label}
  {helperText}
  on:click={() => {
    if (!disabled) {
      dispatch('input', !state);
    }
  }}
>
  <div
    id={label ? label : inputId}
    class="_bcmsInput--toggle"
    tabindex="0"
    on:keydown={keydownHandler}
  >
    <span
      class="_bcmsInput--toggle-inner
        {state
        ? '_bcmsInput--toggle-inner_checked'
        : ''}
        {disabled ? '_bcmsInput--toggle-inner_disabled' : ''}"
    >
      <span class="circle" />
    </span>
    {#if states && states.length === 2}
      <span class="_bcmsInput--toggle-state"
        >{state ? states[0] : states[1]}</span
      >
    {/if}
  </div>
</InputWrapper>
