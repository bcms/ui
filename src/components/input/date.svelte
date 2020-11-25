<script lang="ts">
  import InputWrapper from './_wrapper.svelte';
  import { beforeUpdate, createEventDispatcher } from 'svelte';

  export { className as class };
  export let value: string;
  export let label = '';
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

<InputWrapper class="{className} bcmsInput_date" {label} {invalidText}>
  <input
    class="bcmsInput--input"
    {disabled}
    type="date"
    value={dateString}
    on:change={(event) => {
      handlerInput(event);
    }}
    on:keyup={(event) => {
      handlerInput(event);
    }} />
  <input class="bcmsInput--input" {disabled} type="time" />
</InputWrapper>
