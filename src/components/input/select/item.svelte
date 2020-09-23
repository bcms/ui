<script lang="ts">
  export { className as class };
  export let value: string;
  export let text: string;
  export let selected: boolean = false;

  let className = '';
</script>

<option class="input--select-option {className}" {value} {selected}>
  {#if text}
    {text}
  {:else}
    <slot />
  {/if}
</option>
