<script lang="ts">
  import type { Prop } from '@becomes/cms-sdk';

  export { className as class };
  export let style: string = undefined;
  export let prop: Prop;

  let className = '';
</script>

<div class="prop {className}" {style}>
  <div class="prop--top">
    <div
      class="fas fa-{prop.required ? 'lock' : 'unlock'} prop--top-required" />
    <div class="prop--top-label">{prop.label}</div>
    <div class="prop--top-name">{prop.name}</div>
  </div>
  <div class="prop--content">
    <slot />
  </div>
</div>
