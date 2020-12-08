<script lang="ts">
  import { TooltipService } from '../../services';
  import { AlertTriangleIcon } from '../icons';

  export { className as class };
  export let label: string = undefined;
  export let invalidText: string = undefined;
  export let helperText: string = undefined;

  let className = '';
  let tooltip = TooltipService.bind('');
</script>

<label for={label} class="_bcmsInput {className}">
  {#if label}<span class="_bcmsInput--label">{label}</span>{/if}
  <span
    class="_bcmsInput--inner {invalidText ? '_bcmsInput--inner_isError' : ''}">
    <slot />
    <div class="_bcmsInput--error">
      {#if invalidText}
        <span style="display: block;" class="_bcmsInput--tooltip" use:tooltip>
          <AlertTriangleIcon />
        </span>
      {/if}
    </div>
  </span>
</label>
{#if helperText}<span class="_bcmsInput--helperText">{helperText}</span>{/if}
