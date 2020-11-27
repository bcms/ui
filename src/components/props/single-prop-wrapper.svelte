<script lang="ts">
  import type { Prop } from '@becomes/cms-sdk';

  export { className as class };
  export let style: string = undefined;
  export let prop: Prop;

  let className = '';
</script>

<div class="entryEditor--prop {className}" {style}>
  <div class="entryEditor--prop-header">
    <div class="entryEditor--prop-label">{prop.label}</div>
    {#if prop.required}
    <svg class="entryEditor--prop-required" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.917 7a.583.583 0 00-.583.584v4.083c0 .322.26.584.583.584h8.167a.583.583 0 00.583-.584V7.584a.583.583 0 00-.583-.583H2.917zm-1.75.584c0-.967.783-1.75 1.75-1.75h8.167c.966 0 1.75.783 1.75 1.75v4.083a1.75 1.75 0 01-1.75 1.75H2.917a1.75 1.75 0 01-1.75-1.75V7.584z" fill="#9798AB"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7 1.75a2.333 2.333 0 00-2.333 2.334v2.333a.583.583 0 01-1.167 0V4.084a3.5 3.5 0 017 0v2.333a.583.583 0 01-1.167 0V4.084A2.333 2.333 0 007 1.751z" fill="#9798AB"/></svg>
    {/if}
  </div>
  <div class="entryEditor--prop-body">
    <slot />
  </div>
</div>
