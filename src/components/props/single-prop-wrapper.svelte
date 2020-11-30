<script lang="ts">
  import type { Prop } from '@becomes/cms-sdk';
  import { LockIcon } from '../icons';

  export { className as class };
  export let style: string = undefined;
  export let prop: Prop;

  let className = '';
</script>

<div
  class="entryEditor--prop entryEditor--prop_{prop.type} {className}"
  {style}>
  <div class="entryEditor--prop-header">
    <div class="entryEditor--prop-label">{prop.label}</div>
    {#if prop.required}
      <LockIcon class="entryEditor--prop-required" />
    {/if}
  </div>
  <div class="entryEditor--prop-body">
    <slot />
  </div>
</div>
