<script lang="ts">
  import QuillContainer from './quill.svelte';

  export let id: string = undefined;
  export let value: string = '';
  export let placeholder: string = '';
</script>

<QuillContainer
  {id}
  {placeholder}
  formats={['heading']}
  toolbar={false}
  ops={[{ insert: value }, { insert: '\n' }]}
  on:update
  on:move
  on:add
  on:remove />
