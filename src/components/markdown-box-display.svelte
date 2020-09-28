<script lang="ts">
  import { MarkdownService } from '../services';

  export let markdown: string = '';
  export let fallbackText: string = '';
</script>

<div class="markdown-box-display">
  {@html markdown ? MarkdownService.toHtml(markdown) : `<p>${fallbackText}</p>`}
</div>
