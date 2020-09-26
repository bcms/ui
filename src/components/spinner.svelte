<script lang="ts">
  export let show: boolean = false;
</script>

{#if show}
  <div class="spinner">
    <div class="fas fa-cog spinner--icon" />
    <div class="spinner--content">
      <slot />
    </div>
  </div>
{/if}
