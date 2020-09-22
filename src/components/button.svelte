<script lang="ts">
  export { className as class };
  export let icon: string = '';
  export let onlyIcon = false;
  export let kind: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
  export let size = undefined;
  export let style: string = undefined;
  export let disabled = false;

  let className = '';
</script>

<button
  class="{className} btn btn--{kind} btn--{size}"
  {style}
  {disabled}
  on:click>
  {#if icon}
    <span class="{icon} icon {onlyIcon === false ? 'mr-20' : ''}" />
  {/if}
  <slot />
</button>
