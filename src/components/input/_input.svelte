<script lang="ts">
  import { beforeUpdate } from 'svelte';

  import { TooltipService } from '../../services';
  import { AlertTriangleIcon } from '../icons';

  export { className as class };
  export let id: string = undefined;
  export let label: string = undefined;
  export let invalidText: string = undefined;
  export let helperText: string = undefined;

  const buffer = {
    invalidText: '' + invalidText,
  };
  let className = '';
  let tooltip = TooltipService.bind(invalidText);

  beforeUpdate(() => {
    if (invalidText !== buffer.invalidText) {
      buffer.invalidText = '' + invalidText;
      tooltip = TooltipService.bind(invalidText);
    }
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<label for={label ? label : id} class="_bcmsInput {className}" on:click>
  {#if label}<span class="_bcmsInput--label">{label}</span>{/if}
  <span
    class="_bcmsInput--inner {invalidText ? '_bcmsInput--inner_invalid' : ''}">
    <slot />
    {#if invalidText}
      <div class="_bcmsInput--errorIcon">
        <span class="_bcmsInput--tooltip" use:tooltip>
          <AlertTriangleIcon />
        </span>
      </div>
    {/if}
  </span>
  {#if helperText}<span class="_bcmsInput--helperText">{@html helperText}</span>{/if}
</label>
