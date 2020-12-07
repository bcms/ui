<script lang="ts">
  export { className as class };
  export let kind: 'primary' | 'secondary' | 'alternate' | 'ghost' | 'danger' =
    'primary';
  export let style: string = undefined;
  export let disabled: boolean = false;
  export let size: 'm' | 's' | '' = '';

  let className = '';
</script>

<button
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
