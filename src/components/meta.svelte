<script lang="ts">
  import { beforeUpdate } from 'svelte';

  export let title: string;

  beforeUpdate(() => {
    if (title) {
      document.title = `${title} | BCMS`;
    }
  });
</script>
