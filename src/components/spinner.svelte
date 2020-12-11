<script lang="ts">
  import { fade } from 'svelte/transition';
  export let show: boolean = false;
</script>

{#if show}
  <div class="spinner" in:fade>
    <div class="fas fa-cog spinner--icon" />
    <div class="spinner--wait">Please wait...</div>
    <div class="spinner--content">
      <slot />
    </div>
  </div>
{/if}
