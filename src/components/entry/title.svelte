<script lang="ts">
  import { onMount } from 'svelte';

  import { v4 as uuidv4 } from 'uuid';
  import { TooltipService } from '../../services';
  import { AlertTriangleIcon } from '../icons';

  export let id: string = uuidv4();
  export let value: string;
  export let placeholder: string = undefined;
  export let onUpdate: (value: string, event: Event) => void = undefined;
  export let minHeight = 55;
  export let helperText: string = undefined;
  export let invalidText: string = undefined;
  export let disabled = false;

  const label = 'Title';
  let height = minHeight + 0;
  let tooltip = TooltipService.bind(invalidText);

  function handleHeight(event: Event) {
    const element = event.target as HTMLInputElement;
    if (!element) {
      return;
    }
    height = element.scrollHeight;
  }
  function inputHandler(event: Event) {
    const el = event.target as HTMLTextAreaElement;
    const newValue = el.value.replace(/\n/g, '');
    el.value = newValue;
    if (onUpdate) {
      onUpdate(newValue, event);
    }
  }

  onMount(() => {
    handleHeight({ target: document.getElementById(id) } as never);
  });
</script>

<label for={id} class="bcmsEntryTitle" on:click>
  <span class="bcmsEntryTitle--label">{label}</span>
  <span
    class="bcmsEntryTitle--inner {invalidText
      ? '_bcmsInput--inner_invalid'
      : ''}"
  >
    <textarea
      {id}
      class="bcmsEntryTitle--textarea customScrollbar"
      on:change={inputHandler}
      on:keyup={inputHandler}
      on:input={handleHeight}
      {placeholder}
      {value}
      {disabled}
      rows={10}
      style="max-height: 1000px; min-height: {minHeight}px; height: {height}px"
    />
    {#if invalidText}
      <div class="bcmsEntryTitle--errorIcon">
        <span class="bcmsEntryTitle--tooltip" use:tooltip>
          <AlertTriangleIcon />
        </span>
      </div>
    {/if}
  </span>
  {#if helperText}<span class="bcmsEntryTitle--helperText"
      >{@html helperText}</span
    >{/if}
</label>
