<script lang="ts">
  import * as uuid from 'uuid';
  import InputWrapper from './_input.svelte';
  import { beforeUpdate, createEventDispatcher } from 'svelte';
  import { CloseIcon } from '../icons';
  import { cy } from '../../services';

  export { className as class };
  export let value: string | number;
  export let label = '';
  export let invalidText = '';
  export let disabled: boolean = false;
  export let includeTime: boolean = false;
  export let helperText: string = undefined;
  export let cyTag: string = undefined;

  const inputId = uuid.v4();
  const dispatch = createEventDispatcher();
  let date = new Date(
    typeof value === 'number' && value === 0 ? Date.now() : value
  );
  if (value === 0) {
    value = Date.now();
  }
  let dateString = `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
  let className = '';
  let buffer = {
    value: '' + value,
  };

  function handlerInput(event: Event) {
    const element = event.target as HTMLInputElement;
    dispatch('input', !element.valueAsNumber ? 0 : element.valueAsNumber);
    if ((event as KeyboardEvent).key === 'Enter') {
      dispatch('enter');
    }
  }

  beforeUpdate(() => {
    if (buffer.value !== value) {
      buffer.value = '' + value;
      date = new Date(
        typeof value === 'number' && value === 0 ? Date.now() : value
      );
      dateString = `${date.getFullYear()}-${
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
    }
  });
</script>

<InputWrapper id={inputId} class={className} {label} {invalidText} {helperText}>
  <div
    use:cy={cyTag}
    class="_bcmsInput--date {includeTime ? '_bcmsInput--date_time' : ''}"
  >
    <div class="_bcmsInput--date-wrapper">
      <input
        id={label ? label : inputId}
        class="_bcmsInput--text date"
        type="date"
        value={dateString}
        {disabled}
        on:change={(event) => {
          handlerInput(event);
        }}
        on:keyup={(event) => {
          handlerInput(event);
        }}
      />
      <button
        aria-label="Reset date"
        title="Reset date"
        class="_bcmsInput--date-reset"
        {disabled}
        on:click={() => {
          dispatch('input', 0);
        }}
      >
        <CloseIcon />
      </button>
    </div>
    {#if includeTime}
      <div class="_bcmsInput--date-wrapper">
        <input class="_bcmsInput--text time" {disabled} type="time" />
        <button
          aria-label="Reset date"
          title="Reset date"
          {disabled}
          class="_bcmsInput--date-reset"
        >
          <CloseIcon />
        </button>
      </div>
    {/if}
  </div>
</InputWrapper>
