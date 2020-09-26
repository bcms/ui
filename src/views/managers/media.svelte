<script lang="ts">
  import { fade } from 'svelte/transition';
  import { MediaViewer } from '../../components';
</script>

<div class="mm">
  <div in:fade={{ delay: 250 }} class="mm--animation">
    <h3>Media</h3>
    <MediaViewer class="mt--20" />
  </div>
</div>
