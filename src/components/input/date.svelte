<script lang="ts">
  import { beforeUpdate, createEventDispatcher } from 'svelte';
  import * as uuid from 'uuid';

  export { className as class };
  export let id = uuid.v4();
  export let value = 0;
  export let placeholder = '';
  export let label = '';
  export let helperText = '';
  export let invalidText = '';
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();
  let date = new Date(value);
  let dateString = `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
  let className = '';
  let buffer = {
    value,
  };

  function handlerInput(event: Event) {
    const element = event.target as HTMLInputElement;
    dispatch('input', !element.valueAsNumber ? 0 : element.valueAsNumber);
    if ((event as KeyboardEvent).key === 'Enter') {
      dispatch('enter');
    }
  }
  beforeUpdate(() => {
    if (buffer.value === 0 && value > 0) {
      buffer.value = value;
      date = new Date(value);
      dateString = `${date.getFullYear()}-${
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
    }
  });
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
  <input
    {id}
    {disabled}
    {placeholder}
    type="date"
    value={dateString}
    on:change={(event) => {
      handlerInput(event);
    }}
    on:keyup={(event) => {
      handlerInput(event);
    }} />
</div>
