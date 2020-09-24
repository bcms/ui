<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import * as uuid from 'uuid';

  export { className as class };
  export let id = uuid.v4();
  export let value: string[] = [];
  export let placeholder = '';
  export let label = '';
  export let helperText = '';
  export let invalidText = '';
  export let disabled = false;
  export let formater: (value: string) => string = undefined;
  export let validate: (items: string[]) => string = undefined;

  const dispatch = createEventDispatcher();
  let className = '';
  let items: string[] = [...value];
</script>

<div class="input {className}">
  {#if label !== ''}
    <label class="input--label" for={id}>{label}</label>
    {#if helperText !== ''}
      <div class="input--helper">{helperText}</div>
    {/if}
  {/if}
  {#if invalidText !== ''}
    <div class="input--invalid">
      <span class="fas fa-exclamation icon" />
      {invalidText}
    </div>
  {/if}
  <div class="input--multi-add">
    <input
      {id}
      {placeholder}
      {disabled}
      on:change={(event) => {
        if (formater) {
          event.target.value = formater(event.target.value);
        }
      }}
      on:keyup={(event) => {
        if (event.key === 'Enter') {
          if (validate) {
            const error = validate([...items, event.target.value]);
            if (error) {
              invalidText = error;
              return;
            }
          }
          items = [...items, event.target.value];
          event.target.value = '';
          dispatch('update', items);
        } else {
          if (formater) {
            event.target.value = formater(event.target.value);
          }
        }
      }} />
    <div in:fade={{ duration: 300, delay: 300 }} class="items">
      {#each items as item, i}
        <button
          on:click={() => {
            items = items.filter((e) => e !== item);
            dispatch('update', items);
          }}>
          <div class="number">{i + 1}.</div>
          <div class="value">{item}</div>
          <div class="icon fas fa-times" />
        </button>
      {/each}
    </div>
  </div>
</div>
