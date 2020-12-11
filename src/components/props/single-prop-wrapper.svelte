<script lang="ts">
  import type { Prop } from '@becomes/cms-sdk';
  import { LockIcon } from '../icons';
  import { cy } from '../../services';

  export { className as class };
  export let style: string = undefined;
  export let prop: Prop;
  export let cyTag: string = undefined;

  let className = '';
</script>

<div
  use:cy={cyTag}
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
