<script lang="ts">
  import { fade } from 'svelte/transition';
  import { CogIcon } from './icons';
  export let show: boolean = false;
</script>

{#if show}
  <div class="spinner" in:fade>
    <CogIcon />
    <div class="spinner--wait">Please wait...</div>
    <div class="spinner--content">
      <slot />
    </div>
  </div>
{/if}
