<script lang="ts">
  import * as uuid from 'uuid';
  import QuillContainer from './quill.svelte';

  export let id: string = undefined;
  export let value: string = '';
  export let placeholder: string = '';
  export let name: string = uuid.v4();
</script>

<QuillContainer
  class="title"
  {id}
  {placeholder}
  {name}
  noMenu={true}
  formats={['heading']}
  toolbar={false}
  ops={[{ insert: value }, { insert: '\n' }]}
  on:update
  on:move
  on:add
  on:remove />
