<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { MarkdownService, cy } from '../services';

  export let markdown: string = '';
  export let fallbackText: string = '';
  export let cyTag = 'markdown-box-display';

  const dispatch = createEventDispatcher();
</script>

<div
  class="markdownBoxDisplay"
  use:cy={cyTag}
  on:dblclick={() => {
    dispatch('edit');
  }}
>
  {@html markdown ? MarkdownService.toHtml(markdown) : `<p>${fallbackText}</p>`}
</div>
