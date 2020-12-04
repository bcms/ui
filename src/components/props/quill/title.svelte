<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as uuid from 'uuid';
  import QuillContainer from './quill.svelte';

  export let id: string = undefined;
  export let value: string = '';
  export let placeholder: string = '';
  export let name: string = uuid.v4();

  const dispatch = createEventDispatcher();
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
  on:update={(event) => {
    dispatch('update', {
      ops: event.detail.ops,
      text: event.detail.text
        .replace('<h1>', '')
        .replace('</h1>', '')
        .replace('<br>', ''),
    });
  }}
  on:move
  on:add
  on:remove />
