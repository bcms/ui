<script lang="ts">
  import type { Prop } from '@becomes/cms-sdk';
  import { LockIcon } from '../icons';

  export { className as class };
  export let style: string = undefined;
  export let prop: Prop;

  let className = '';
</script>

<div
  class="entryEditor--prop entryEditor--prop_{prop.type}
    {prop.array ? 'entryEditor--prop_ARRAY' : ''}
    {className}"
  {style}>
  <div class="entryEditor--prop-header">
    <div class="entryEditor--prop-header-inner">
      <div class="entryEditor--prop-header-details">
        <div class="entryEditor--prop-header-label">{prop.label}</div>
        {#if prop.required}
          <LockIcon class="entryEditor--prop-header-required" />
        {/if}
      </div>
    </div>
  </div>
  <div class="entryEditor--prop-body">
    <slot />
  </div>
</div>
