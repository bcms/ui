<script lang="ts">
  import { Router } from '../../router';
  import SideNav from './side-nav.svelte';

  let path = '';

  Router.subscribeToPathChange((_path) => {
    path = _path;
  });
</script>

{#if path.startsWith('/dashboard')}
  <div class="layout">
    <div>
      <SideNav />
      <!-- <TopNav /> -->
    </div>
    <div class="layout--content">
      <slot />
    </div>
  </div>
{:else}
  <slot />
{/if}
