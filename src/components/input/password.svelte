<script lang="ts">
  import InputWrapper from './_input.svelte';
  import { createEventDispatcher } from 'svelte';
  import { EyeHideIcon, EyeShowIcon } from '../icons';
  import { cy } from '../../services';

  export { className as class };
  export let value = '';
  export let placeholder = '';
  export let label = '';
  export let invalidText = '';
  export let disabled = false;
  export let helperText: string = undefined;
  export let cyTag: string = undefined;

  const dispatch = createEventDispatcher();
  let className = '';
  let show: boolean = false;

  function inputHandler(event: Event) {
    const element = event.target as HTMLInputElement;

    if (!element) return;

    dispatch('input', element.value);
  }
</script>

<InputWrapper class={className} {label} {invalidText} {helperText}>
  <div use:cy={cyTag} class="_bcmsInput--password">
    <input
      id={label}
      class="_bcmsInput--text"
      {placeholder}
      {value}
      type={show ? 'text' : 'password'}
      {disabled}
      on:change={inputHandler}
      on:keyup={(event) => {
        inputHandler(event);
        if (event.key === 'Enter') {
          dispatch('enter');
        }
      }} />
    <button
      class="_bcmsInput--password-toggle"
      type="button"
      {disabled}
      on:click={() => {
        show = !show;
      }}>
      {#if show}
        <EyeShowIcon />
      {:else}
        <EyeHideIcon class="hide" />
      {/if}
    </button>
  </div>
</InputWrapper>
