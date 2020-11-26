<script lang="ts">
  import { beforeUpdate, onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { Layout, MediaViewer } from '../../components';

  export let id: string;

  if (id === '-') {
    id = undefined;
  }

  beforeUpdate(() => {
    if (id === '-') {
      id = undefined;
    }
  });

  onMount(async () => {
    if (id === '-') {
      id = undefined;
    }
  });
</script>

<Layout>
  <div class="view media">
    <MediaViewer mediaId={id} />
  </div>
</Layout>
