<script lang="ts">
  import { cy } from '../services';

  export { className as class };
  export let kind: 'primary' | 'secondary' | 'alternate' | 'ghost' | 'danger' =
    'primary';
  export let style: string = undefined;
  export let disabled: boolean = false;
  export let size: 'm' | 's' | '' = '';
  export let cyTag: string = undefined;

  let className = '';
</script>

<button
  use:cy={cyTag}
  class="bcmsButton bcmsButton_{kind}
    {size ? `bcmsButton_${size}` : ''}
    {className}"
  {style}
  {disabled}
  on:click>
  {#if $$slots.default}
    <span>
      <slot />
    </span>
  {/if}
</button>
