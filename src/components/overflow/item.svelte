<script lang="ts">
  import Button from '../button.svelte';

  export { className as class };
  export let text: string;
  export let danger: boolean = false;

  let className = '';
</script>

<div class="overflow-menu--item {className}">
  <Button kind={danger ? 'danger' : 'ghost'} on:click>{text}</Button>
</div>
