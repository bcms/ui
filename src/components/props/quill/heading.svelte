<script lang="ts">
  import type { Prop, PropQuill, PropQuillOption } from '@becomes/cms-sdk';
  import { beforeUpdate } from 'svelte';
  import { GeneralService } from '../../../services';
  import QuillContainer from './quill.svelte';

  export let id: string = undefined;
  export let prop: Prop;

  let value = prop.value as PropQuill;

  beforeUpdate(() => {
    value = prop.value as PropQuill;
  });
</script>

<QuillContainer
  {id}
  class="prop-quill--{GeneralService.string.toUri(prop.type)}"
  placeholder={GeneralService.string.toPretty(prop.type)}
  formats={['heading']}
  toolbar={false}
  name={prop.name}
  ops={value.ops}
  on:update
  on:move
  on:add
  on:remove />
